import express from 'express';
import { Activity } from '../models/Activity.js';

const router = express.Router();

// GET all activities / notifications
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(limit);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities', details: err.message });
  }
});

// POST new activity / notification
router.post('/', async (req, res) => {
  try {
    const { text, type, statusClass } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Activity text is required.' });
    }

    const activity = new Activity({
      id: req.body.id || `act-${Date.now()}`,
      text,
      time: req.body.time || 'Just now',
      type: type || 'general',
      statusClass: statusClass || 'info'
    });

    const saved = await activity.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create activity', details: err.message });
  }
});

export default router;
