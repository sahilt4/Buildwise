import express from 'express';
import { Worker } from '../models/Worker.js';
import { AttendanceLog } from '../models/AttendanceLog.js';
import { Activity } from '../models/Activity.js';
import { AuditLog } from '../models/AuditLog.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET all workers (Scoped & Masked)
router.get('/', requireAuth, async (req, res) => {
  try {
    const filter = {};

    // Worker can only see their own profile
    if (req.user.role === 'worker') {
      filter.$or = [
        { id: req.user.workerId },
        { name: req.user.name }
      ];
    }
    // Site Manager sees workers on assigned sites
    else if (req.user.role === 'manager') {
      if (req.user.assignedSiteIds?.length > 0) {
        filter.siteId = { $in: req.user.assignedSiteIds };
      }
    }
    // Builder sees all workers

    const workers = await Worker.find(filter).sort({ createdAt: -1 });

    // Financial Masking: If Worker, mask confidential compensation of others
    if (req.user.role === 'worker') {
      const sanitized = workers.map(w => {
        const obj = w.toObject();
        if (obj.id !== req.user.workerId && obj.name !== req.user.name) {
          delete obj.wagePerDay;
          delete obj.phone;
        }
        return obj;
      });
      return res.json(sanitized);
    }

    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workers', details: err.message });
  }
});

// GET single worker by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const worker = await Worker.findOne({ id: req.params.id });
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch worker', details: err.message });
  }
});

// POST new worker (Builder & Site Manager only)
router.post('/', requireAuth, requireRole('builder', 'manager'), async (req, res) => {
  try {
    const { name, trade, siteId, siteName, wagePerDay, phone, category, avatar } = req.body;
    if (!name || !trade) {
      return res.status(400).json({ error: 'Worker name and trade are required.' });
    }

    if (req.user.role === 'manager' && siteId && !req.user.assignedSiteIds.includes(siteId)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You cannot add workers to unassigned sites.' });
    }

    const id = req.body.id || `w-${Date.now()}`;
    const worker = new Worker({
      id,
      name,
      trade,
      category: category || 'General',
      siteId: siteId || (req.user.assignedSiteIds ? req.user.assignedSiteIds[0] : ''),
      siteName: siteName || 'Sunrise Residency',
      attendanceRate: 100,
      currentTask: req.body.currentTask || 'Assigned to site',
      status: 'Active',
      isCheckedIn: false,
      checkInTime: null,
      phone: phone || '+91 98000 00000',
      wagePerDay: Number(wagePerDay || 800),
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    const saved = await worker.save();

    await Activity.create({
      id: `act-${Date.now()}`,
      text: `${req.user.name} added crew member ${saved.name} (${saved.trade}) to ${saved.siteName}`,
      type: 'worker',
      statusClass: 'success'
    });

    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'WORKER_ADDED',
      resourceType: 'Worker',
      resourceId: saved.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      siteId: saved.siteId,
      details: { name: saved.name, trade: saved.trade, wage: saved.wagePerDay }
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add worker', details: err.message });
  }
});

// POST Toggle worker attendance check-in / check-out
router.post('/:id/toggle-attendance', requireAuth, async (req, res) => {
  try {
    const worker = await Worker.findOne({ id: req.params.id });
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    // Workers can ONLY punch for themselves
    if (req.user.role === 'worker') {
      const isSelf = (req.user.workerId && req.user.workerId === worker.id) || req.user.name === worker.name;
      if (!isSelf) {
        return res.status(403).json({
          error: 'Forbidden: IDOR Prevention',
          message: 'Workers cannot check in or check out on behalf of other crew members.'
        });
      }
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    worker.isCheckedIn = !worker.isCheckedIn;
    worker.checkInTime = worker.isCheckedIn ? timeStr : null;
    await worker.save();

    let createdLog = null;
    if (worker.isCheckedIn) {
      createdLog = await AttendanceLog.create({
        id: `att-${Date.now()}`,
        workerId: worker.id,
        workerName: worker.name,
        trade: worker.trade,
        siteName: worker.siteName,
        time: timeStr,
        date: 'Today',
        status: 'Present',
        method: req.body.method || '1-Click Mobile Punch'
      });

      await Activity.create({
        id: `act-${Date.now()}`,
        text: `${worker.name} checked in at ${worker.siteName}`,
        type: 'attendance',
        statusClass: 'success'
      });
    } else {
      await Activity.create({
        id: `act-${Date.now()}`,
        text: `${worker.name} checked out from ${worker.siteName}`,
        type: 'attendance',
        statusClass: 'info'
      });
    }

    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: worker.isCheckedIn ? 'ATTENDANCE_CHECKIN' : 'ATTENDANCE_CHECKOUT',
      resourceType: 'Worker',
      resourceId: worker.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      siteId: worker.siteId,
      details: { isCheckedIn: worker.isCheckedIn, time: timeStr }
    });

    res.json({
      worker,
      attendanceLog: createdLog,
      message: worker.isCheckedIn ? `✓ Checked in successfully at ${timeStr}` : `✓ Checked out at ${timeStr}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update attendance', details: err.message });
  }
});

// PUT update worker (Builder & Site Manager only)
router.put('/:id', requireAuth, requireRole('builder', 'manager'), async (req, res) => {
  try {
    delete req.body.id;
    delete req.body._id;

    const updated = await Worker.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Worker not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update worker', details: err.message });
  }
});

// DELETE worker (Builder only)
router.delete('/:id', requireAuth, requireRole('builder'), async (req, res) => {
  try {
    const deleted = await Worker.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Worker not found' });
    res.json({ message: 'Worker removed', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete worker', details: err.message });
  }
});

export default router;
