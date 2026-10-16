import mongoose from 'mongoose';

const attendanceLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  workerId: { type: String, default: '' },
  workerName: { type: String, required: true },
  trade: { type: String, default: '' },
  siteId: { type: String, default: '' },
  siteName: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, default: 'Today' },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day'], default: 'Present' },
  method: { type: String, default: 'One-Click Punch' }
}, {
  timestamps: true
});

export const AttendanceLog = mongoose.model('AttendanceLog', attendanceLogSchema);
