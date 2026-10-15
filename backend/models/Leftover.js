import mongoose from 'mongoose';

const leftoverSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  materialId: { type: String, default: null },
  title: { type: String, required: true },
  quantity: { type: String, required: true },
  estimatedValue: { type: Number, required: true, min: 0 },
  site: { type: String, required: true },
  condition: { type: String, default: 'Unused / Surplus' },
  category: { type: String, default: 'General' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60' },
  description: { type: String, default: '' }
}, {
  timestamps: true
});

export const Leftover = mongoose.model('Leftover', leftoverSchema);
