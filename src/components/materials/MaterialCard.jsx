import React from 'react';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { Clock, MapPin, ClipboardList, AlertTriangle } from 'lucide-react';

export const MaterialCard = ({ material, onRecordUsage }) => {
  const percentUsed = Math.min(100, Math.round((material.used / material.purchased) * 100));
  const isLow = material.remaining <= material.threshold;

  return (
    <div className="bw-card bw-card--interactive" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div>
          <Badge variant={material.category === 'Cement' ? 'warning' : material.category === 'Steel' ? 'info' : 'purple'}>
            {material.category}
          </Badge>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.4rem', color: 'var(--navy-900)' }}>
            {material.name}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.15rem' }}>
            <MapPin size={12} />
            <span>{material.siteName}</span>
          </div>
        </div>

        <Badge variant={isLow ? 'danger' : 'success'}>
          {isLow ? 'Low Stock' : 'In Stock'}
        </Badge>
      </div>

      {/* Numerical breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: 'var(--gray-50)', padding: '0.65rem 0.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Purchased</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-900)' }}>
            {material.purchased} <small style={{ fontWeight: 500, fontSize: '0.72rem' }}>{material.unit}</small>
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Used</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-700)' }}>
            {material.used} <small style={{ fontWeight: 500, fontSize: '0.72rem' }}>{material.unit}</small>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Remaining</div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isLow ? 'var(--danger)' : 'var(--navy-900)' }}>
            {material.remaining} <small style={{ fontWeight: 500, fontSize: '0.72rem' }}>{material.unit}</small>
          </div>
        </div>
      </div>

      {/* Progress Usage */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--text-muted)' }}>Consumption</span>
          <span style={{ color: percentUsed >= 80 ? 'var(--danger)' : 'var(--navy-900)' }}>{percentUsed}% used</span>
        </div>
        <ProgressBar
          progress={percentUsed}
          variant={percentUsed >= 85 ? 'danger' : percentUsed >= 60 ? 'warning' : 'success'}
          thickness="thick"
        />
      </div>

      {isLow && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--danger-dark)', background: 'var(--danger-light)', padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
          <AlertTriangle size={13} />
          <span>Stock below safety threshold ({material.threshold} {material.unit})</span>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        <Button
          variant="secondary"
          size="sm"
          icon={ClipboardList}
          style={{ width: '100%' }}
          onClick={() => onRecordUsage(material)}
        >
          Record Usage
        </Button>
      </div>
    </div>
  );
};
