import mongoose from 'mongoose';

const counterOfferSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  note: { type: String, default: '' },
  counteredAt: { type: Date, default: Date.now },
  counteredBy: { type: String, default: 'seller' }
}, { _id: false });

const marketplaceInquirySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  listingId: { type: String, required: true },
  listingTitle: { type: String, required: true },
  unit: { type: String, default: 'unit' },
  requestedQuantity: { type: Number, required: true, min: 1 },
  proposedPrice: { type: Number, required: true, min: 0 },
  totalProposedAmount: { type: Number, required: true },
  message: { type: String, default: '' },
  preferredPickupDate: { type: String, default: 'Next 3 Days' },
  contactPreference: { type: String, enum: ['Phone', 'WhatsApp', 'Email', 'In-App'], default: 'Phone' },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Countered', 'Cancelled'],
    default: 'Pending'
  },
  counterOffer: counterOfferSchema,
  buyerProfileId: { type: String, required: true },
  buyerProfile: {
    name: { type: String, required: true },
    companyName: { type: String, default: 'Buyer Co.' },
    phone: { type: String },
    email: { type: String },
    city: { type: String },
    rating: { type: Number, default: 4.8 },
    isVerified: { type: Boolean, default: true }
  },
  sellerProfileId: { type: String, required: true },
  sellerProfile: {
    name: { type: String, required: true },
    companyName: { type: String, default: 'Seller Co.' },
    phone: { type: String },
    email: { type: String },
    city: { type: String },
    rating: { type: Number, default: 4.9 },
    isVerified: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

export const MarketplaceInquiry = mongoose.model('MarketplaceInquiry', marketplaceInquirySchema);
