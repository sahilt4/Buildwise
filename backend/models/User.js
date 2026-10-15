import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['builder', 'manager', 'worker'], 
    default: 'worker',
    required: true 
  },
  company: { type: String, default: 'Buildwise Construction' },
  avatar: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' 
  },
  phone: { type: String, default: '' },
  assignedSiteIds: [{ type: String }],
  assignedProjectIds: [{ type: String }],
  workerId: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Suspended', 'Pending'], default: 'Active' },
  invitedBy: { type: String, default: '' },
  lastLogin: { type: Date, default: null }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
