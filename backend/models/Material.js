import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  purchased: { type: Number, required: true, min: 0 },
  used: { type: Number, default: 0, min: 0 },
  remaining: { type: Number, default: 0, min: 0 },
  unit: { type: String, required: true },
  siteId: { type: String, default: '' },
  siteName: { type: String, default: '' },
  status: { type: String, enum: ['In Stock', 'Low Stock', 'Surplus Candidate', 'Out of Stock'], default: 'In Stock' },
  threshold: { type: Number, default: 50 },
  required: { type: Number, default: 0 },
  condition: { type: String, default: 'Good' },
  costPerUnit: { type: Number, default: 0 },
  lastUpdated: { type: String, default: 'Just now' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60' }
}, {
  timestamps: true
});

export const Material = mongoose.model('Material', materialSchema);
