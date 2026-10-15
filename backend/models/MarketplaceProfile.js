import mongoose from 'mongoose';

const marketplaceProfileSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  role: { type: String, enum: ['builder', 'contractor', 'supplier', 'engineer', 'worker'], default: 'builder' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  completedTransactions: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: true },
  organizationId: { type: String, default: 'org-1' },
  siteId: { type: String, default: 'site-1' }
}, {
  timestamps: true
});

export const MarketplaceProfile = mongoose.model('MarketplaceProfile', marketplaceProfileSchema);
