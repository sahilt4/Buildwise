import express from 'express';
import { Leftover } from '../models/Leftover.js';
import { MarketplaceListing } from '../models/MarketplaceListing.js';
import { Activity } from '../models/Activity.js';

const router = express.Router();

// GET all leftovers
router.get('/', async (req, res) => {
  try {
    const leftovers = await Leftover.find().sort({ createdAt: -1 });
    res.json(leftovers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leftovers', details: err.message });
  }
});

// POST create leftover
router.post('/', async (req, res) => {
  try {
    const { title, quantity, estimatedValue, site } = req.body;
    if (!title || !quantity || estimatedValue === undefined || !site) {
      return res.status(400).json({ error: 'Title, quantity, estimated value, and site are required.' });
    }

    const id = req.body.id || `left-${Date.now()}`;
    const leftover = new Leftover({
      id,
      materialId: req.body.materialId || null,
      title,
      quantity,
      estimatedValue: Number(estimatedValue),
      site,
      condition: req.body.condition || 'Unused / Surplus',
      category: req.body.category || 'General',
      image: req.body.image || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60',
      description: req.body.description || ''
    });

    const saved = await leftover.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create leftover', details: err.message });
  }
});

// POST 1-Click Convert leftover to Marketplace Listing
router.post('/:id/list-to-marketplace', async (req, res) => {
  try {
    const leftover = await Leftover.findOne({ id: req.params.id });
    if (!leftover) {
      return res.status(404).json({ error: 'Leftover item not found' });
    }

    const parsedQty = parseInt(leftover.quantity) || 1;
    const pricePerUnit = Math.max(1, Math.round(leftover.estimatedValue / parsedQty));
    let unit = 'unit';
    if (leftover.quantity.toLowerCase().includes('piece')) unit = 'piece';
    else if (leftover.quantity.toLowerCase().includes('ton')) unit = 'ton';
    else if (leftover.quantity.toLowerCase().includes('box')) unit = 'box';

    const newMarketListing = new MarketplaceListing({
      id: `mkt-${Date.now()}`,
      title: leftover.title,
      quantity: leftover.quantity,
      price: pricePerUnit,
      unit,
      totalPrice: leftover.estimatedValue,
      location: `${leftover.site}, Nashik`,
      city: 'Nashik',
      condition: leftover.condition,
      seller: 'Buildwise Verified Direct',
      sellerRating: 5.0,
      category: leftover.category,
      image: leftover.image,
      postedTime: 'Just now',
      verifiedSeller: true
    });

    const savedListing = await newMarketListing.save();
    // Remove from leftovers once listed
    await Leftover.findOneAndDelete({ id: leftover.id });

    await Activity.create({
      id: `act-${Date.now()}`,
      text: `Listed leftover ${leftover.title} (${leftover.quantity}) on Marketplace for ₹${leftover.estimatedValue.toLocaleString()}`,
      type: 'marketplace',
      statusClass: 'success'
    });

    res.status(201).json({
      listing: savedListing,
      removedLeftoverId: leftover.id,
      message: `🎉 Listed ${leftover.title} on Marketplace for ₹${leftover.estimatedValue.toLocaleString()}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list leftover to marketplace', details: err.message });
  }
});

// DELETE leftover
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Leftover.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Leftover not found' });
    res.json({ message: 'Leftover removed', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete leftover', details: err.message });
  }
});

export default router;
