import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Users,
  Store,
  Trash2
} from 'lucide-react';

export const NotificationsView = () => {
  const { activities, materials, setActiveView, addToast } = useApp();

  const lowStockMats = materials.filter(m => m.status === 'Low Stock');

  const handleClearAll = () => {
    addToast('✓ Notifications cleared', 'info');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Notifications & Site Alerts</h1>
          <p>Real-time updates on critical material thresholds, crew check-ins, and marketplace orders.</p>
        </div>

        <div className="page-actions">
          <Button variant="secondary" icon={Trash2} onClick={handleClearAll}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Critical Stock Alerts */}
      {lowStockMats.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--danger-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={18} /> High Priority Stock Alerts ({lowStockMats.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lowStockMats.map((mat) => (
              <div
                key={mat.id}
                style={{
                  background: 'var(--danger-light)',
                  border: '1px solid var(--danger-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--danger-dark)', fontSize: '0.95rem' }}>
                    Low Stock: {mat.name}
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Only {mat.remaining} {mat.unit} remaining at {mat.siteName} (Threshold: {mat.threshold} {mat.unit}).
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveView('materials')}
                >
                  Order Stock
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Notifications Feed */}
      <div className="bw-card">
        <div className="card-header">
          <h3 className="card-title">
            <Bell size={18} style={{ color: 'var(--amber-600)' }} />
            Activity Log Stream
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {activities.map((act) => (
            <div
              key={act.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--gray-50)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: act.statusClass === 'success' ? 'var(--success-light)' : 'var(--amber-50)',
                  color: act.statusClass === 'success' ? 'var(--success)' : 'var(--amber-600)',
                  flexShrink: 0
                }}
              >
                <CheckCircle2 size={16} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                  {act.text}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {act.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
