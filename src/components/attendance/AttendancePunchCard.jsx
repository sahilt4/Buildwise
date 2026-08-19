import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Clock,
  MapPin,
  QrCode,
  CheckCircle2,
  Calendar,
  Sparkles,
  LogOut,
  LogIn
} from 'lucide-react';

export const AttendancePunchCard = ({ onOpenQRScanner }) => {
  const { workers, toggleWorkerAttendance, userRole } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Worker record (Amit Patil)
  const currentWorker = workers.find(w => w.id === 'w-1') || workers[0];
  const isCheckedIn = currentWorker?.isCheckedIn;

  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateString = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="punch-card-wrapper animate-fade-in">
      <div className="punch-card">
        {/* Top greeting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Badge variant={isCheckedIn ? 'success' : 'neutral'}>
            {isCheckedIn ? '🟢 Active On Duty' : '⚪ Off Duty'}
          </Badge>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
            {dateString}
          </span>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '0.35rem' }}>
          Good Morning, {currentWorker?.name.split(' ')[0] || 'Worker'} 👋
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
          <MapPin size={14} style={{ color: 'var(--amber-600)' }} />
          <span>Site: <strong>{currentWorker?.siteName || 'Sunrise Residency'}</strong></span>
        </div>

        {/* Live Digital Clock */}
        <div className="punch-clock">
          {timeString}
        </div>

        {/* Big Circular Action Button */}
        <button
          className={`punch-big-btn ${isCheckedIn ? 'check-out' : 'check-in'}`}
          onClick={() => toggleWorkerAttendance(currentWorker.id)}
        >
          {isCheckedIn ? (
            <>
              <LogOut size={32} />
              <span>CHECK OUT</span>
            </>
          ) : (
            <>
              <LogIn size={32} />
              <span>CHECK IN</span>
            </>
          )}
        </button>

        {/* Status Confirmation text */}
        <div style={{ minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.5rem' }}>
          {isCheckedIn ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success-dark)', background: 'var(--success-light)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700 }}>
              <CheckCircle2 size={16} />
              <span>Checked in today at {currentWorker.checkInTime || '09:04 AM'}</span>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Press button above or scan site QR to record today's shift
            </div>
          )}
        </div>

        {/* QR Scanner Shortcut */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            icon={QrCode}
            onClick={onOpenQRScanner}
          >
            Scan Entrance QR Placard
          </Button>
        </div>
      </div>
    </div>
  );
};
