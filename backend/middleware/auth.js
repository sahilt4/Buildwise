import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'buildwise-secure-construction-jwt-secret-key-2026';

// Role-to-Permissions Matrix
export const ROLE_PERMISSIONS = {
  builder: [
    'attendance.read.all',
    'attendance.read.site',
    'tasks.read.all',
    'tasks.manage.all',
    'workforce.read.all',
    'workforce.manage.all',
    'materials.read.all',
    'materials.manage.all',
    'budget.read.project',
    'budget.manage.project',
    'expenses.read.all',
    'expenses.approve.all',
    'sites.read.all',
    'sites.manage.all',
    'reports.read.all',
    'reports.financial.read',
    'marketplace.manage.all',
    'users.manage.all',
    'audit.read.all'
  ],
  manager: [
    'attendance.read.site',
    'attendance.manage.site',
    'tasks.read.site',
    'tasks.manage.site',
    'workforce.read.site',
    'materials.read.site',
    'materials.recordUsage.site',
    'materials.requestPurchase.site',
    'sites.read.assigned',
    'sites.update.assigned',
    'reports.read.site',
    'marketplace.read.all',
    'marketplace.request.surplus',
    'audit.read.site'
  ],
  worker: [
    'attendance.read.self',
    'attendance.checkin.self',
    'tasks.read.assigned',
    'tasks.update.assigned',
    'workforce.read.self',
    'materials.read.site',
    'reports.read.self',
    'marketplace.read.browse'
  ]
};

// Authenticate JWT Token
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication Required',
        message: 'No valid Bearer token provided in Authorization header.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: 'Invalid or Expired Token',
        message: err.message
      });
    }

    // Verify user still exists and is Active
    const user = await User.findOne({ id: decoded.id });
    if (!user) {
      return res.status(401).json({
        error: 'User Not Found',
        message: 'The account associated with this token no longer exists.'
      });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({
        error: 'Account Suspended',
        message: 'Your account has been deactivated. Please contact your Builder administrator.'
      });
    }

    // Attach authenticated user identity to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      assignedSiteIds: user.assignedSiteIds || [],
      assignedProjectIds: user.assignedProjectIds || [],
      workerId: user.workerId || '',
      company: user.company || ''
    };

    next();
  } catch (err) {
    return res.status(500).json({ error: 'Auth Verification Error', details: err.message });
  }
};

// Authorize by Role
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden: Insufficient Permissions',
        message: `Your role (${req.user.role}) is not authorized to perform this action. Required: ${allowedRoles.join(', ')}.`
      });
    }

    next();
  };
};

// Authorize by Permission
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated.' });
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        error: 'Forbidden: Permission Denied',
        message: `Access denied. Missing permission '${permission}'.`
      });
    }

    next();
  };
};

// Check Site Scoping for Manager & Worker
export const verifySiteScope = (siteIdParamName = 'siteId') => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Builder has access across authorized portfolio
    if (req.user.role === 'builder') {
      return next();
    }

    const requestedSiteId = req.params[siteIdParamName] || req.query[siteIdParamName] || req.body[siteIdParamName];
    if (!requestedSiteId) {
      return next();
    }

    // Site Manager scope check
    if (req.user.role === 'manager') {
      if (!req.user.assignedSiteIds.includes(requestedSiteId)) {
        return res.status(403).json({
          error: 'Forbidden: Out of Scope',
          message: `You are not assigned as Site Manager for site '${requestedSiteId}'. Access blocked.`
        });
      }
    }

    // Worker scope check
    if (req.user.role === 'worker') {
      if (req.user.assignedSiteIds.length > 0 && !req.user.assignedSiteIds.includes(requestedSiteId)) {
        return res.status(403).json({
          error: 'Forbidden: Out of Scope',
          message: `This site resource (${requestedSiteId}) is not assigned to your worker profile.`
        });
      }
    }

    next();
  };
};

// Issue JWT Token
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      workerId: user.workerId || '',
      assignedSiteIds: user.assignedSiteIds || []
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
