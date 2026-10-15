import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  trade: { type: String, required: true },
  category: { type: String, default: 'General' },
  siteId: { type: String, default: '' },
  siteName: { type: String, default: '' },
  attendanceRate: { type: Number, default: 100, min: 0, max: 100 },
  currentTask: { type: String, default: 'Unassigned' },
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
  isCheckedIn: { type: Boolean, default: false },
  checkInTime: { type: String, default: null },
  phone: { type: String, default: '' },
  wagePerDay: { type: Number, default: 700 },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
}, {
  timestamps: true
});

export const Worker = mongoose.model('Worker', workerSchema);
