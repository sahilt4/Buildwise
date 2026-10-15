import mongoose from 'mongoose';

const orderTimelineEventSchema = new mongoose.Schema({
  step: { type: String, required: true },
  title: { type: String, required: true },
  note: { type: String, default: '' },
  status: { type: String, enum: ['completed', 'current', 'pending'], default: 'completed' },
  updatedBy: { type: String, default: 'System' },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const marketplaceOrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true, unique: true },
  listingId: { type: String, required: true },
  inquiryId: { type: String },
  materialName: { type: String, required: true },
  category: { type: String, default: 'General' },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'unit' },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  pickupLocation: { type: String, required: true },
  city: { type: String, required: true },
  scheduledPickupDate: { type: String, default: 'Scheduled within 48h' },
  orderStatus: {
    type: String,
    enum: ['Pending Confirmation', 'Confirmed', 'Ready for Pickup', 'Picked Up', 'Completed', 'Cancelled'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial Advance Paid', 'Paid', 'Refunded'],
    default: 'Paid'
  },
  buyerProfile: {
    id: { type: String },
    name: { type: String, required: true },
    companyName: { type: String },
    phone: { type: String },
    email: { type: String },
    city: { type: String },
    isVerified: { type: Boolean, default: true }
  },
  sellerProfile: {
    id: { type: String },
    name: { type: String, required: true },
    companyName: { type: String },
    phone: { type: String },
    email: { type: String },
    city: { type: String },
    isVerified: { type: Boolean, default: true }
  },
  reservationExpiry: { type: String, default: '7 days from order date' },
  timeline: [orderTimelineEventSchema]
}, {
  timestamps: true
});

export const MarketplaceOrder = mongoose.model('MarketplaceOrder', marketplaceOrderSchema);
