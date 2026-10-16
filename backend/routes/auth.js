import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Worker } from '../models/Worker.js';
import { AuditLog } from '../models/AuditLog.js';
import { requireAuth, requireRole, generateToken, ROLE_PERMISSIONS } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role: intendedRole } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid Credentials', message: 'No account found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid Credentials', message: 'Incorrect password provided.' });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({ error: 'Account Inactive', message: 'Your account is currently disabled.' });
    }

    // Role safety: if user selected a role tab, verify that their database role permits it
    if (intendedRole && intendedRole !== user.role) {
      return res.status(403).json({
        error: 'Role Mismatch',
        message: `This account is authorized as '${user.role.toUpperCase()}', not '${intendedRole.toUpperCase()}'. Please log in under your assigned role.`
      });
    }

    // If worker logging in with their actual name, find their unique worker profile or create one
    const { workerName, trade } = req.body;
    let effectiveName = user.name;
    let effectiveWorkerId = user.workerId;
    let effectiveSiteIds = user.assignedSiteIds || ['site-1'];

    if (user.role === 'worker' && workerName && workerName.trim()) {
      const cleanName = workerName.trim();
      effectiveName = cleanName;

      // Look up if a worker record already exists with this name
      let workerRecord = await Worker.findOne({ name: { $regex: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });

      if (workerRecord) {
        effectiveWorkerId = workerRecord.id;
        if (workerRecord.siteId) {
          effectiveSiteIds = [workerRecord.siteId];
        }
        if (trade && workerRecord.trade !== trade) {
          workerRecord.trade = trade;
          await workerRecord.save();
        }
      } else {
        // Create a unique new worker record in MongoDB so the manager/builder see them in the roster and can assign tasks
        const newWorkerId = `w-${Date.now()}`;
        effectiveWorkerId = newWorkerId;
        await Worker.create({
          id: newWorkerId,
          name: cleanName,
          trade: trade || 'Masonry / General Construction',
          category: 'Skilled Trades',
          siteId: 'site-1',
          siteName: 'Sunrise Residency',
          attendanceRate: 100,
          currentTask: 'Available for Assignment',
          status: 'Active',
          isCheckedIn: true,
          checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          wagePerDay: 750
        });
      }
    }

    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token carrying the specific worker identity session
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: effectiveName,
      workerId: effectiveWorkerId,
      assignedSiteIds: effectiveSiteIds
    });

    // Audit log
    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'USER_LOGIN',
      resourceType: 'User',
      resourceId: user.id,
      actorId: user.id,
      actorName: effectiveName,
      actorRole: user.role,
      details: { email: user.email, role: user.role, workerId: effectiveWorkerId },
      ip: req.ip || '127.0.0.1'
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: effectiveName,
        role: user.role,
        company: user.company,
        avatar: user.avatar,
        phone: user.phone,
        assignedSiteIds: effectiveSiteIds,
        assignedProjectIds: user.assignedProjectIds,
        workerId: effectiveWorkerId,
        permissions: ROLE_PERMISSIONS[user.role] || []
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login Failed', details: err.message });
  }
});

// GET /api/auth/me (Validate active session)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: req.user.name || user.name,
        role: user.role,
        company: user.company,
        avatar: user.avatar,
        phone: user.phone,
        assignedSiteIds: req.user.assignedSiteIds || user.assignedSiteIds,
        assignedProjectIds: user.assignedProjectIds,
        workerId: req.user.workerId !== undefined ? req.user.workerId : user.workerId,
        permissions: ROLE_PERMISSIONS[user.role] || []
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Session verification error', details: err.message });
  }
});

// POST /api/auth/invite (Builder invites Site Manager or Worker)
router.post('/invite', requireAuth, requireRole('builder'), async (req, res) => {
  try {
    const { email, name, role, assignedSiteIds, temporaryPassword, phone, company } = req.body;

    if (!email || !name || !role) {
      return res.status(400).json({ error: 'Email, name, and role are required for invitation.' });
    }

    if (!['manager', 'worker'].includes(role)) {
      return res.status(400).json({ error: 'Builders may only invite Site Managers or Workers.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'Account Exists', message: 'A user with this email address already exists.' });
    }

    const defaultPass = temporaryPassword || 'Buildwise@2026';
    const hashedPassword = await bcrypt.hash(defaultPass, 10);
    const userId = `usr-${Date.now()}`;

    let workerId = '';
    // If inviting a worker, link or create their crew record
    if (role === 'worker') {
      workerId = `w-${Date.now()}`;
      await Worker.create({
        id: workerId,
        name,
        trade: req.body.trade || 'General Construction',
        category: req.body.category || 'General',
        siteId: (assignedSiteIds && assignedSiteIds[0]) || 'site-1',
        siteName: req.body.siteName || 'Sunrise Residency',
        status: 'Active',
        phone: phone || '+91 98000 00000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
    }

    const newUser = new User({
      id: userId,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name,
      role,
      company: company || req.user.company || 'Buildwise Construction',
      assignedSiteIds: assignedSiteIds || ['site-1'],
      assignedProjectIds: ['site-1', 'site-2', 'site-3'],
      workerId,
      phone: phone || '',
      invitedBy: req.user.name,
      status: 'Active'
    });

    const saved = await newUser.save();

    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'INVITE_USER',
      resourceType: 'User',
      resourceId: saved.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      details: { email: saved.email, role: saved.role, assignedSiteIds: saved.assignedSiteIds }
    });

    res.status(201).json({
      message: `User '${saved.name}' invited successfully as '${saved.role}'.`,
      user: {
        id: saved.id,
        email: saved.email,
        name: saved.name,
        role: saved.role,
        assignedSiteIds: saved.assignedSiteIds
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to invite user', details: err.message });
  }
});

// GET /api/auth/users (Builder manages team)
router.get('/users', requireAuth, requireRole('builder'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// GET /api/auth/audit-logs (Builder and Manager view audit logs)
router.get('/audit-logs', requireAuth, requireRole('builder', 'manager'), async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'manager') {
      filter.siteId = { $in: req.user.assignedSiteIds };
    }
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs', details: err.message });
  }
});

export default router;
