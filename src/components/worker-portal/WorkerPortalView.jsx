import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { QRScannerModal } from '../attendance/QRScannerModal';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  ListTodo,
  QrCode,
  Sparkles,
  CheckSquare,
  Square,
  TrendingUp,
  HardHat,
  Phone
} from 'lucide-react';

export const WorkerPortalView = () => {
  const { workers, tasks, updateTaskStatus, toggleWorkerAttendance, scanQRAttendance } = useApp();
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  // Amit Patil's worker profile
  const worker = workers.find(w => w.id === 'w-1') || workers[0];
  const isCheckedIn = worker.isCheckedIn;

  // Amit's tasks
  const myTasks = tasks.filter(t => t.workerId === worker.id || t.workerName === worker.name);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* 1. Welcoming & Role Pill */}
      <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--amber-50)', color: 'var(--amber-800)', border: '1px solid var(--amber-200)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          <HardHat size={14} /> Worker Mobile Mode • {worker.trade}
        </div>

        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-900)' }}>
          Good Morning, {worker.name.split(' ')[0]} 👋
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
          <MapPin size={14} style={{ color: 'var(--amber-600)' }} />
          <span>Site: <strong>{worker.siteName}</strong></span>
        </div>
      </div>

      {/* 2. Central Attendance Status Card */}
      <div
        className="bw-card"
        style={{
          padding: '1.5rem',
          textAlign: 'center',
          background: isCheckedIn ? 'linear-gradient(135deg, #ecfdf5, #ffffff)' : 'var(--white)',
          border: isCheckedIn ? '1.5px solid var(--success)' : '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
          Today's Shift Attendance
        </div>

        <div style={{ margin: '0.75rem 0' }}>
          {isCheckedIn ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-dark)', background: 'var(--success-light)', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', fontSize: '1.15rem', fontWeight: 800 }}>
              <CheckCircle2 size={24} />
              <span>Checked in • {worker.checkInTime || '09:04 AM'}</span>
            </div>
          ) : (
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              Not Checked In Yet
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
          <Button
            variant={isCheckedIn ? 'danger' : 'primary'}
            size="lg"
            style={{ flex: 1, maxWidth: '240px', fontWeight: 800 }}
            onClick={() => toggleWorkerAttendance(worker.id)}
          >
            {isCheckedIn ? 'CHECK OUT' : 'CHECK IN NOW'}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={QrCode}
            onClick={() => setIsQRScannerOpen(true)}
          >
            Scan QR
          </Button>
        </div>
      </div>

      {/* 3. Today's Tasks Checklist */}
      <div className="bw-card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ListTodo size={18} style={{ color: 'var(--amber-600)' }} />
              Today's Assigned Tasks ({myTasks.length})
            </h3>
            <p className="card-subtitle">Tap checkmark to mark tasks completed</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {myTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
              No tasks assigned today. Check with supervisor Suresh.
            </div>
          ) : (
            myTasks.map((task) => {
              const isDone = task.status === 'Completed';
              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.85rem',
                    background: isDone ? 'var(--gray-50)' : 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <button
                    onClick={() => updateTaskStatus(task.id, isDone ? 'In Progress' : 'Completed', isDone ? 50 : 100)}
                    style={{ color: isDone ? 'var(--success)' : 'var(--gray-400)', marginTop: '2px', cursor: 'pointer' }}
                    aria-label="Toggle task completion"
                  >
                    {isDone ? <CheckSquare size={22} /> : <Square size={22} />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '0.92rem', color: isDone ? 'var(--text-muted)' : 'var(--navy-900)', textDecoration: isDone ? 'line-through' : 'none' }}>
                        {task.title}
                      </strong>
                      <Badge variant={task.priority === 'High' ? 'danger' : 'warning'}>
                        {task.priority}
                      </Badge>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {task.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Due: <strong>{task.dueDate}</strong></span>
                      <span>•</span>
                      <span>Progress: {task.progress}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Monthly Attendance Rate */}
      <div className="bw-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Monthly Attendance Record
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success-dark)', marginTop: '0.2rem' }}>
              {worker.attendanceRate}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              24 days present • 1 day leave • ₹{((worker.wagePerDay || 850) * 24).toLocaleString()} earned this month
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Badge variant="success">
              🏆 Top Tier Crew
            </Badge>
          </div>
        </div>
      </div>

      {/* QR Scanner */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />
    </div>
  );
};
