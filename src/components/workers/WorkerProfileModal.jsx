import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Phone, MapPin, CheckCircle2, Calendar, Award, Briefcase } from 'lucide-react';

export const WorkerProfileModal = ({ isOpen, onClose, worker }) => {
  if (!worker) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Worker Profile & History"
      subtitle="Trade credentials, site logs, and safety records"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div>
        {/* Profile Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <Avatar src={worker.avatar} name={worker.name} size="lg" status={worker.isCheckedIn ? 'active' : 'offline'} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-900)' }}>{worker.name}</h3>
              <Badge variant={worker.isCheckedIn ? 'success' : 'neutral'}>
                {worker.isCheckedIn ? 'Checked In Today' : 'Not Checked In'}
              </Badge>
            </div>
            <div style={{ color: 'var(--amber-700)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.15rem' }}>
              {worker.trade}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
              <span><MapPin size={12} style={{ display: 'inline' }} /> {worker.siteName}</span>
              <span>•</span>
              <span><Phone size={12} style={{ display: 'inline' }} /> {worker.phone}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--white)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Attendance Rate</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-dark)' }}>{worker.attendanceRate}%</div>
          </div>

          <div style={{ background: 'var(--white)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Daily Wage</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>₹{worker.wagePerDay || 850}</div>
          </div>

          <div style={{ background: 'var(--white)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Safety Score</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--info-dark)' }}>100%</div>
          </div>
        </div>

        {/* Current Active Task */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Current Assignment
          </h4>
          <div style={{ padding: '0.85rem', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{worker.currentTask}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Assigned by Site Supervisor • Priority: High
            </div>
          </div>
        </div>

        {/* Direct Action */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href={`tel:${worker.phone}`}
            className="btn btn-primary"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            <Phone size={15} /> Call {worker.name}
          </a>
        </div>
      </div>
    </Modal>
  );
};
