import React from 'react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { MapPin, Phone, User, CheckCircle, Clock } from 'lucide-react';

export const WorkerCard = ({ worker, onViewProfile, onToggleAttendance }) => {
  return (
    <div className="worker-card bw-card--interactive">
      <div className="worker-card-header">
        <Avatar
          src={worker.avatar}
          name={worker.name}
          size="lg"
          status={worker.isCheckedIn ? 'active' : 'offline'}
        />

        <div className="worker-info">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 className="worker-name">{worker.name}</h4>
            <Badge variant={worker.status === 'Active' ? 'success' : 'neutral'}>
              {worker.status}
            </Badge>
          </div>
          <div className="worker-trade">{worker.trade}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.15rem' }}>
            <MapPin size={12} />
            <span>{worker.siteName}</span>
          </div>
        </div>
      </div>

      {/* Stats summary row */}
      <div className="worker-stats-row">
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Attendance:</span>{' '}
          <strong style={{ color: worker.attendanceRate >= 90 ? 'var(--success-dark)' : 'var(--warning-dark)' }}>
            {worker.attendanceRate}%
          </strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Today:</span>{' '}
          <strong>{worker.isCheckedIn ? `✓ In (${worker.checkInTime})` : 'Not In'}</strong>
        </div>
      </div>

      {/* Current Task */}
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.15rem' }}>
          Current Task:
        </span>
        <strong style={{ color: 'var(--navy-900)' }}>{worker.currentTask || 'Site preparation & staging'}</strong>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', marginTop: 'auto' }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewProfile(worker)}
        >
          View Profile
        </Button>
        <a
          href={`tel:${worker.phone}`}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.35rem 0.6rem', color: 'var(--navy-800)', textDecoration: 'none' }}
          title={`Call ${worker.phone}`}
        >
          <Phone size={14} />
        </a>
      </div>
    </div>
  );
};
