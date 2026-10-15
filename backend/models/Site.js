import mongoose from 'mongoose';

const siteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subName: { type: String, default: '' },
  location: { type: String, required: true },
  supervisor: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'On Hold', 'Completed'], default: 'Active' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  workerCount: { type: Number, default: 0, min: 0 },
  totalBudget: { type: String, default: '₹0.00 Cr' },
  spent: { type: String, default: '₹0.00 Cr' },
  health: { type: String, enum: ['Good', 'Watch', 'Critical'], default: 'Good' },
  alertCount: { type: Number, default: 0, min: 0 },
  image: { type: String, default: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80' }
}, {
  timestamps: true
});

export const Site = mongoose.model('Site', siteSchema);
