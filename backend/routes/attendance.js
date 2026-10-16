import express from 'express';
import { AttendanceLog } from '../models/AttendanceLog.js';
import { Worker } from '../models/Worker.js';
import { Activity } from '../models/Activity.js';
import { AuditLog } from '../models/AuditLog.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

import { Site } from '../models/Site.js';

const router = express.Router();

// GET attendance records (Worker sees own attendance; Manager sees assigned site attendance; Builder sees all)
router.get('/', requireAuth, async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'worker') {
      filter.$or = [
        { workerId: req.user.workerId },
        { workerName: req.user.name }
      ];
    } else if (req.user.role === 'manager') {
      if (req.user.assignedSiteIds?.length > 0) {
        // Resolve sites and workers belonging to assigned sites
        const assignedSites = await Site.find({ id: { $in: req.user.assignedSiteIds } }).select('name id');
        const assignedSiteNames = assignedSites.map(s => s.name);
        const siteWorkers = await Worker.find({ siteId: { $in: req.user.assignedSiteIds } }).select('id name');
        const workerIds = siteWorkers.map(w => w.id);
        const workerNames = siteWorkers.map(w => w.name);

        filter.$or = [
          { siteId: { $in: req.user.assignedSiteIds } },
          { siteName: { $in: assignedSiteNames } },
          { workerId: { $in: workerIds } },
          { workerName: { $in: workerNames } }
        ];
      }
    }

    const logs = await AttendanceLog.find(filter).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance logs', details: err.message });
  }
});

// POST simulated QR scan attendance record
router.post('/scan-qr', requireAuth, async (req, res) => {
  try {
    const { siteName, workerId } = req.body;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    // Enforce worker identity: Worker CANNOT punch on behalf of another worker ID
    let targetWorkerId = workerId;
    if (req.user.role === 'worker') {
      targetWorkerId = req.user.workerId || 'w-1';
    } else {
      targetWorkerId = workerId || 'w-1';
    }

    let worker = await Worker.findOne({ id: targetWorkerId });
    if (!worker && req.user.name) {
      worker = await Worker.findOne({ name: req.user.name });
    }
    if (!worker) {
      worker = await Worker.findOne();
    }

    if (worker) {
      worker.isCheckedIn = true;
      worker.checkInTime = timeStr;
      if (siteName) worker.siteName = siteName;
      await worker.save();
    }

    const workerName = worker ? worker.name : req.user.name;
    const trade = worker ? worker.trade : 'Master Mason';
    const site = siteName || (worker ? worker.siteName : 'Sunrise Residency');
    const resolvedSiteId = worker?.siteId || (req.user.assignedSiteIds && req.user.assignedSiteIds[0]) || 'site-1';

    const newLog = await AttendanceLog.create({
      id: `att-${Date.now()}`,
      workerId: worker ? worker.id : targetWorkerId,
      workerName,
      trade,
      siteId: resolvedSiteId,
      siteName: site,
      time: timeStr,
      date: 'Today',
      status: 'Present',
      method: 'QR Code Scan'
    });

    await Activity.create({
      id: `act-${Date.now()}`,
      text: `${workerName} verified QR code at ${site}`,
      type: 'attendance',
      statusClass: 'success'
    });

    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'ATTENDANCE_CHECKIN_QR',
      resourceType: 'AttendanceLog',
      resourceId: newLog.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      siteId: worker?.siteId || '',
      details: { workerId: newLog.workerId, site: newLog.siteName, time: timeStr }
    });

    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ error: 'Failed to record QR attendance', details: err.message });
  }
});

// POST attendance correction (Site Manager & Builder only; Workers DENIED)
router.post('/correction', requireAuth, requireRole('builder', 'manager'), async (req, res) => {
  try {
    const { logId, status, note } = req.body;
    if (!logId || !status) {
      return res.status(400).json({ error: 'logId and corrected status are required.' });
    }

    const log = await AttendanceLog.findOne({ id: logId });
    if (!log) return res.status(404).json({ error: 'Attendance record not found' });

    const previousStatus = log.status;
    log.status = status;
    await log.save();

    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'ATTENDANCE_CORRECTION',
      resourceType: 'AttendanceLog',
      resourceId: log.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      details: { workerName: log.workerName, previousStatus, correctedStatus: status, note: note || 'Supervisor audit correction' }
    });

    res.json({ message: 'Attendance record corrected successfully with audit trail.', log });
  } catch (err) {
    res.status(500).json({ error: 'Failed to correct attendance', details: err.message });
  }
});

export default router;
