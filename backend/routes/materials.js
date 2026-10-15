import express from 'express';
import { Material } from '../models/Material.js';
import { Leftover } from '../models/Leftover.js';
import { Activity } from '../models/Activity.js';
import { AuditLog } from '../models/AuditLog.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET all materials
router.get('/', requireAuth, async (req, res) => {
  try {
    const filter = {};

    // Site Manager sees materials on assigned sites
    if (req.user.role === 'manager') {
      if (req.user.assignedSiteIds?.length > 0) {
        filter.siteId = { $in: req.user.assignedSiteIds };
      }
    }
    // Worker sees task-relevant inventory on their assigned site
    else if (req.user.role === 'worker') {
      if (req.user.assignedSiteIds?.length > 0) {
        filter.siteId = { $in: req.user.assignedSiteIds };
      }
    }

    const materials = await Material.find(filter).sort({ createdAt: -1 });

    // Financial Data Masking: Workers must NOT see costPerUnit
    if (req.user.role === 'worker') {
      const masked = materials.map(m => {
        const obj = m.toObject();
        delete obj.costPerUnit;
        return obj;
      });
      return res.json(masked);
    }

    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch materials', details: err.message });
  }
});

// GET material by id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const material = await Material.findOne({ id: req.params.id });
    if (!material) return res.status(404).json({ error: 'Material not found' });

    if (req.user.role === 'manager' && material.siteId && !req.user.assignedSiteIds.includes(material.siteId)) {
      return res.status(403).json({ error: 'Forbidden', message: 'This material belongs to an unassigned site.' });
    }

    if (req.user.role === 'worker') {
      const obj = material.toObject();
      delete obj.costPerUnit;
      return res.json(obj);
    }

    res.json(material);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch material', details: err.message });
  }
});

// POST new material (Builder & Site Manager only)
router.post('/', requireAuth, requireRole('builder', 'manager'), async (req, res) => {
  try {
    const { name, category, purchased, unit, siteId, siteName, threshold, required, condition, costPerUnit, image } = req.body;
    if (!name || !category || purchased === undefined || !unit) {
      return res.status(400).json({ error: 'Name, category, purchased quantity, and unit are required.' });
    }

    if (req.user.role === 'manager' && siteId && !req.user.assignedSiteIds.includes(siteId)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You cannot add materials to an unassigned site.' });
    }

    const purchasedNum = Number(purchased);
    const usedNum = Number(req.body.used || 0);
    const remainingNum = Math.max(0, purchasedNum - usedNum);
    const thresholdNum = Number(threshold || 50);
    const status = remainingNum <= thresholdNum ? 'Low Stock' : 'In Stock';

    const id = req.body.id || `mat-${Date.now()}`;
    const newMaterial = new Material({
      id,
      name,
      category,
      purchased: purchasedNum,
      used: usedNum,
      remaining: remainingNum,
      unit,
      siteId: siteId || '',
      siteName: siteName || 'General Site',
      threshold: thresholdNum,
      required: Number(required || 0),
      condition: condition || 'Good',
      costPerUnit: Number(costPerUnit || 100),
      lastUpdated: 'Just now',
      status,
      image: image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60'
    });

    const saved = await newMaterial.save();

    await Activity.create({
      id: `act-${Date.now()}`,
      text: `${req.user.name} added ${saved.name} (${saved.purchased} ${saved.unit}) to ${saved.siteName}`,
      type: 'material',
      statusClass: 'success'
    });

    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'MATERIAL_ADDED',
      resourceType: 'Material',
      resourceId: saved.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      siteId: saved.siteId,
      details: { name: saved.name, purchased: saved.purchased, unit: saved.unit }
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add material', details: err.message });
  }
});

// POST record material usage (Site Managers & Builders; Workers DENIED)
router.post('/:id/usage', requireAuth, requireRole('builder', 'manager'), async (req, res) => {
  try {
    const { usedQty } = req.body;
    if (!usedQty || isNaN(usedQty) || Number(usedQty) <= 0) {
      return res.status(400).json({ error: 'A valid used quantity greater than 0 is required.' });
    }

    const material = await Material.findOne({ id: req.params.id });
    if (!material) return res.status(404).json({ error: 'Material not found' });

    if (req.user.role === 'manager' && material.siteId && !req.user.assignedSiteIds.includes(material.siteId)) {
      return res.status(403).json({ error: 'Forbidden', message: 'You cannot record usage for materials on unassigned sites.' });
    }

    const qty = Number(usedQty);
    const newUsed = material.used + qty;
    const newRemaining = Math.max(0, material.purchased - newUsed);
    let newStatus = newRemaining <= material.threshold ? 'Low Stock' : 'In Stock';
    let isSurplus = false;
    let createdLeftover = null;

    // Waste-to-Value Classifier Rule
    if (material.required && newRemaining > material.required && material.condition && material.condition !== 'Scrap') {
      newStatus = 'Surplus Candidate';
      isSurplus = true;
    }

    material.used = newUsed;
    material.remaining = newRemaining;
    material.status = newStatus;
    material.lastUpdated = 'Just now';
    await material.save();

    if (isSurplus) {
      const surplusQty = newRemaining - material.required;
      const conditionFactor = material.condition === 'Brand New' ? 0.8 : 0.6;
      const estValue = surplusQty * (material.costPerUnit || 100) * conditionFactor;

      const existingLeftover = await Leftover.findOne({ materialId: material.id });
      if (!existingLeftover) {
        createdLeftover = await Leftover.create({
          id: `left-${Date.now()}`,
          materialId: material.id,
          title: material.name,
          quantity: `${surplusQty} ${material.unit}`,
          estimatedValue: estValue,
          site: material.siteName,
          condition: material.condition,
          category: material.category,
          image: material.image,
          description: `Automatically flagged surplus from ${material.siteName}.`
        });
      }
    }

    await Activity.create({
      id: `act-${Date.now()}`,
      text: `${req.user.name} recorded usage of ${usedQty} ${material.unit} of ${material.name}`,
      type: 'material',
      statusClass: 'info'
    });

    await AuditLog.create({
      id: `audit-${Date.now()}`,
      action: 'MATERIAL_USAGE_RECORDED',
      resourceType: 'Material',
      resourceId: material.id,
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role,
      siteId: material.siteId,
      details: { usedQty: qty, remaining: material.remaining }
    });

    res.json({
      message: `✓ Recorded ${usedQty} ${material.unit} usage for ${material.name}`,
      material,
      createdLeftover
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record material usage', details: err.message });
  }
});

// DELETE material (Builder ONLY)
router.delete('/:id', requireAuth, requireRole('builder'), async (req, res) => {
  try {
    const deleted = await Material.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Material not found' });
    res.json({ message: 'Material deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete material', details: err.message });
  }
});

export default router;
