import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClipboardCheck, ArrowUpRight } from 'lucide-react';

export const AttendanceDonut = () => {
  const { workers, setActiveView } = useApp();
  const presentCount = workers.filter(w => w.isCheckedIn).length;
  const totalCount = workers.length;
  const presentPct = Math.round((presentCount / (totalCount || 1)) * 100);

  // SVG Donut circumference calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const presentStroke = (presentPct / 100) * circumference;
  const absentStroke = circumference - presentStroke;

  return (
    <div className="bw-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <ClipboardCheck size={18} style={{ color: 'var(--amber-600)' }} />
            Today's Workforce Attendance
          </h3>
          <p className="card-subtitle">Daily verification across all active job sites</p>
        </div>

        <button
          onClick={() => setActiveView('attendance')}
          style={{ fontSize: '0.78rem', color: 'var(--amber-700)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
        >
          Muster <ArrowUpRight size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '1.5rem', padding: '0.5rem 0' }}>
        {/* SVG Donut Chart */}
        <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
          <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Track */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="var(--gray-100)"
              strokeWidth="14"
            />
            {/* Present Arc */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="transparent"
              stroke="var(--success)"
              strokeWidth="14"
              strokeDasharray={`${presentStroke} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          </svg>

          {/* Centered Percentage */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy-900)', lineHeight: 1 }}>
              {presentPct}%
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              On-Site
            </span>
          </div>
        </div>

        {/* Legend pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Present & Verified</span>
            </div>
            <strong style={{ color: 'var(--navy-900)' }}>{presentCount}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--gray-300)' }} />
              <span style={{ color: 'var(--text-muted)' }}>Off-Duty / Leave</span>
            </div>
            <strong style={{ color: 'var(--text-muted)' }}>{totalCount - presentCount}</strong>
          </div>

          <div style={{ marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ✓ Verified with GPS site perimeter checking
          </div>
        </div>
      </div>
    </div>
  );
};
