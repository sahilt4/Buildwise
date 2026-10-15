import mongoose from 'mongoose';

const marketplaceMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  inquiryId: { type: String, required: true, index: true },
  senderProfileId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['buyer', 'seller', 'system'], default: 'buyer' },
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ['message', 'counter_offer', 'offer_accepted', 'offer_rejected', 'status_change'],
    default: 'message'
  },
  payload: { type: mongoose.Schema.Types.Mixed, default: null }
}, {
  timestamps: true
});

export const MarketplaceMessage = mongoose.model('MarketplaceMessage', marketplaceMessageSchema);
