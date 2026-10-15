import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  time: { type: String, default: 'Just now' },
  type: { type: String, default: 'general' },
  statusClass: { type: String, enum: ['info', 'success', 'warning', 'danger'], default: 'info' }
}, {
  timestamps: true
});

export const Activity = mongoose.model('Activity', activitySchema);
