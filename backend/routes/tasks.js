import express from 'express';
import { Task } from '../models/Task.js';
import { Worker } from '../models/Worker.js';
import { Site } from '../models/Site.js';
import { Activity } from '../models/Activity.js';
import { AuditLog } from '../models/AuditLog.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET all tasks (Scoped by Role)
router.get('/', requireAuth, async (req, res) => {
  try {
    const filter = {};

    // Worker can only see their own assigned tasks
    if (req.user.role === 'worker') {
      filter.$or = [
        { workerId: req.user.workerId },
        { workerName: req.user.name }
      ];
    }
    // Site Manager sees tasks for assigned sites
    else if (req.user.role === 'manager') {
      if (req.user.assignedSiteIds?.length > 0) {
        filter.siteId = { $in: req.user.assignedSiteIds };
      }
    }
    // Builder sees all project portfolio tasks

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
});

// POST create task (Builder & Site Manager only)
router.post('/', requireAuth, requireRole('builder', 'manager'), async (req, res) => {
  try {
    const { title, workerName, workerId, siteName, siteId, priority, dueDate, prerequisiteId, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    // Site Manager can only create tasks for their assigned sites
    if (req.user.role === 'manager' && siteId && !req.user.assignedSiteIds.includes(siteId)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You cannot create tasks for a site you are not assigned to manage.'
      });
    }

    // Real-world database verification: If workerId is provided, verify worker exists in MongoDB
    let assignedWorker = null;
    if (workerId) {
      assignedWorker = await Worker.findOne({ id: workerId });
      if (!assignedWorker) {
        return res.status(404).json({
          error: 'Worker Not Found',
          message: `Worker with ID "${workerId}" does not exist in the database.`
        });
      }
    }

    // Real-world database verification: If siteId is provided, verify site exists
    let assignedSite = null;
    if (siteId) {
      assignedSite = await Site.findOne({ id: siteId });
      if (!assignedSite) {
        return res.status(404).json({
          error: 'Site Not Found',
          message: `Construction site with ID "${siteId}" does not exist in the database.`
        });
      }
    }

    const id = req.body.id || `task-${Date.now()}`;
    const task = new Task({
      id,
      title,
      description: description || '',
      workerId: assignedWorker ? assignedWorker.id : (workerId || ''),
      workerName: assignedWorker ? assignedWorker.name : (workerName || 'Unassigned'),
      siteId: assignedSite ? assignedSite.id : (siteId || (req.user.assignedSiteIds ? req.user.assignedSiteIds[0] : '')),
      siteName: assignedSite ? assignedSite.name : (siteName || 'Sunrise Residency'),
      priority: priority || 'Medium',
      dueDate: dueDate || 'Today',
      progress: req.body.progress || 0,
      status: req.body.status || 'To Do',
      prerequisiteId: prerequisiteId || null
    });

    const saved = await task.save();

    // In real life: update the worker's current active task in database
    if (assignedWorker) {
      assignedWorker.currentTask = saved.title;
      if (assignedSite) {
        assignedWorker.siteId = assignedSite.id;
        assignedWorker.siteName = assignedSite.name;
      }
      await assignedWorker.save();
    }

    await Activity.create({
      id: `act-${Date.now()}`,
      text: `${req.user.name} assigned task "${saved.title}" to ${saved.workerName}`,
      type: 'task',
      statusClass: 'info'
    });

    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'TASK_CREATED',
      resourceType: 'Task',
      resourceId: saved.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      siteId: saved.siteId,
      details: { title: saved.title, assignee: saved.workerName }
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create task', details: err.message });
  }
});

// PATCH update task status (Workers can update assigned tasks; Managers & Builders can update any permitted task)
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status: newStatus, progress: newProgress } = req.body;
    if (!newStatus) {
      return res.status(400).json({ error: 'New status is required.' });
    }

    const task = await Task.findOne({ id: req.params.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Authorization: Worker cannot update tasks assigned to someone else
    if (req.user.role === 'worker') {
      const isAssigned = (task.workerId && task.workerId === req.user.workerId) || task.workerName === req.user.name;
      if (!isAssigned) {
        return res.status(403).json({
          error: 'Forbidden: IDOR Prevention',
          message: 'You are only authorized to update progress on tasks assigned directly to you.'
        });
      }
    }

    // Authorization: Manager can only update tasks within their assigned sites
    if (req.user.role === 'manager') {
      if (task.siteId && !req.user.assignedSiteIds.includes(task.siteId)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'This task belongs to an unassigned construction site.'
        });
      }
    }

    // Business Logic: Prerequisite validation prevents starting blocked tasks
    if (task.prerequisiteId && newStatus === 'In Progress') {
      const prereqTask = await Task.findOne({ id: task.prerequisiteId });
      if (prereqTask && prereqTask.status !== 'Completed') {
        return res.status(400).json({
          error: `Blocked! Prerequisite "${prereqTask.title}" must be completed first.`,
          isBlocked: true,
          prerequisiteTitle: prereqTask.title
        });
      }
    }

    const previousStatus = task.status;
    task.status = newStatus;
    if (newProgress !== undefined) {
      task.progress = Number(newProgress);
    } else if (newStatus === 'Completed') {
      task.progress = 100;
    }
    await task.save();

    if (newStatus === 'Completed') {
      await Activity.create({
        id: `act-${Date.now()}`,
        text: `Completed task: ${task.title}`,
        type: 'task',
        statusClass: 'success'
      });
    }

    // Log to Audit Log
    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'TASK_STATUS_UPDATED',
      resourceType: 'Task',
      resourceId: task.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      siteId: task.siteId,
      details: { previousStatus, newStatus, progress: task.progress }
    });

    res.json({
      task,
      message: newStatus === 'Completed' ? '🎉 Task marked as completed!' : `✓ Task updated to ${newStatus}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task status', details: err.message });
  }
});

// PUT general update task (Builder & Site Manager only)
router.put('/:id', requireAuth, requireRole('builder', 'manager'), async (req, res) => {
  try {
    const task = await Task.findOne({ id: req.params.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (req.user.role === 'manager' && task.siteId && !req.user.assignedSiteIds.includes(task.siteId)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You cannot edit tasks on an unassigned site.' });
    }

    // Prevent mass-assignment of sensitive internal fields
    delete req.body.id;
    delete req.body._id;

    const updated = await Task.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update task', details: err.message });
  }
});

// DELETE task (Builder only)
router.delete('/:id', requireAuth, requireRole('builder'), async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task', details: err.message });
  }
});

export default router;
