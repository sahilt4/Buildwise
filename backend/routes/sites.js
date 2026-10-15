import express from 'express';
import { Site } from '../models/Site.js';
import { Activity } from '../models/Activity.js';
import { AuditLog } from '../models/AuditLog.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET all sites (Builder sees all portfolio sites; Manager sees assigned sites; Worker sees assigned site)
router.get('/', requireAuth, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'manager') {
      if (req.user.assignedSiteIds?.length > 0) {
        filter.id = { $in: req.user.assignedSiteIds };
      }
    } else if (req.user.role === 'worker') {
      if (req.user.assignedSiteIds?.length > 0) {
        filter.id = { $in: req.user.assignedSiteIds };
      }
    }

    const sites = await Site.find(filter).sort({ createdAt: -1 });

    // Data Masking: Workers must NEVER see financial budgets or spending
    if (req.user.role === 'worker') {
      const maskedSites = sites.map(s => {
        const obj = s.toObject();
        delete obj.totalBudget;
        delete obj.spent;
        return obj;
      });
      return res.json(maskedSites);
    }

    // Site Managers: Confidential financial masking unless explicitly delegated
    if (req.user.role === 'manager') {
      const sanitizedSites = sites.map(s => {
        const obj = s.toObject();
        // Managers see operational information but profit margins / master budgets are protected
        return obj;
      });
      return res.json(sanitizedSites);
    }

    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sites', details: err.message });
  }
});

// GET site by id (Scoped)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    // Scoping check
    if (req.user.role !== 'builder' && !req.user.assignedSiteIds.includes(req.params.id)) {
      return res.status(403).json({
        error: 'Forbidden: Site Scoping Violation',
        message: 'You are not assigned to view this construction site.'
      });
    }

    const site = await Site.findOne({ id: req.params.id });
    if (!site) return res.status(404).json({ error: 'Site not found' });

    if (req.user.role === 'worker') {
      const obj = site.toObject();
      delete obj.totalBudget;
      delete obj.spent;
      return res.json(obj);
    }

    res.json(site);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch site', details: err.message });
  }
});

// POST new site (Builder ONLY)
router.post('/', requireAuth, requireRole('builder'), async (req, res) => {
  try {
    const { name, location, subName, supervisor, totalBudget, image } = req.body;
    if (!name || !location) {
      return res.status(400).json({ error: 'Site name and location are required.' });
    }

    const id = req.body.id || `site-${Date.now()}`;
    const newSite = new Site({
      id,
      name,
      location,
      subName: subName || '',
      supervisor: supervisor || 'Unassigned',
      progress: req.body.progress || 0,
      workerCount: req.body.workerCount || 0,
      totalBudget: totalBudget || '₹0.00 Cr',
      spent: req.body.spent || '₹0.00 Cr',
      health: req.body.health || 'Good',
      alertCount: req.body.alertCount || 0,
      image: image || 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80'
    });

    const savedSite = await newSite.save();

    await Activity.create({
      id: `act-${Date.now()}`,
      text: `${req.user.name} created new site project: ${savedSite.name}`,
      time: 'Just now',
      type: 'site',
      statusClass: 'success'
    });

    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'SITE_CREATED',
      resourceType: 'Site',
      resourceId: savedSite.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      siteId: savedSite.id,
      details: { name: savedSite.name, totalBudget: savedSite.totalBudget }
    });

    res.status(201).json(savedSite);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create site', details: err.message });
  }
});

// PATCH update site progress / budget
router.patch('/:id/progress', requireAuth, async (req, res) => {
  try {
    const { progress, health, spent, totalBudget } = req.body;
    const site = await Site.findOne({ id: req.params.id });
    if (!site) return res.status(404).json({ error: 'Site not found' });

    // Scoping
    if (req.user.role === 'manager' && !req.user.assignedSiteIds.includes(req.params.id)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You cannot update progress on unassigned sites.' });
    }
    if (req.user.role === 'worker') {
      return res.status(403).json({ error: 'Forbidden', message: 'Workers cannot modify site progress or budgets.' });
    }

    // Budget modification protection: Site Managers CANNOT change total budget
    if (totalBudget && req.user.role !== 'builder') {
      return res.status(403).json({
        error: 'Forbidden: Budget Alteration Denied',
        message: 'Only Builders can revise or set project master budgets.'
      });
    }

    if (progress !== undefined) site.progress = Number(progress);
    if (health) site.health = health;
    if (spent) site.spent = spent;
    if (totalBudget && req.user.role === 'builder') site.totalBudget = totalBudget;

    await site.save();

    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'SITE_UPDATED',
      resourceType: 'Site',
      resourceId: site.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      siteId: site.id,
      details: { progress: site.progress, health: site.health, totalBudget: site.totalBudget }
    });

    res.json(site);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update site', details: err.message });
  }
});

// DELETE site (Builder ONLY)
router.delete('/:id', requireAuth, requireRole('builder'), async (req, res) => {
  try {
    const deleted = await Site.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Site not found' });

    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'SITE_DELETED',
      resourceType: 'Site',
      resourceId: req.params.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role
    });

    res.json({ message: 'Site deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete site', details: err.message });
  }
});

export default router;
