import mongoose from 'mongoose';

const marketplaceListingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  materialName: { type: String },
  category: { type: String, required: true },
  totalQuantity: { type: Number, required: true },
  availableQuantity: { type: Number, required: true },
  reservedQuantity: { type: Number, default: 0 },
  unit: { type: String, default: 'unit' },
  quantity: { type: String }, // formatted string like "250 pieces (42 boxes)"
  price: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
  city: { type: String, required: true },
  condition: { type: String, default: 'Surplus' },
  status: { type: String, enum: ['Available', 'Reserved', 'Sold', 'Expired'], default: 'Available' },
  availableUntil: { type: String, default: '30 Days' },
  description: { type: String, default: '' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60' },
  seller: { type: String, required: true },
  sellerProfileId: { type: String, default: 'prof-1' },
  sellerProfile: {
    name: { type: String },
    companyName: { type: String },
    phone: { type: String },
    email: { type: String },
    city: { type: String },
    rating: { type: Number, default: 5.0 },
    completedTransactions: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true }
  },
  sellerRating: { type: Number, default: 5.0 },
  postedTime: { type: String, default: 'Just now' },
  verifiedSeller: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const MarketplaceListing = mongoose.model('MarketplaceListing', marketplaceListingSchema);
