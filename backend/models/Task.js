import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  workerId: { type: String, default: '' },
  workerName: { type: String, default: '' },
  siteId: { type: String, default: '' },
  siteName: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  dueDate: { type: String, default: 'Today' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ['To Do', 'In Progress', 'Review', 'Completed'], default: 'To Do' },
  prerequisiteId: { type: String, default: null }
}, {
  timestamps: true
});

export const Task = mongoose.model('Task', taskSchema);
