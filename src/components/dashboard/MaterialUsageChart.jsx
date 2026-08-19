import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../common/ProgressBar';
import { Boxes, ArrowUpRight } from 'lucide-react';

export const MaterialUsageChart = () => {
  const { materials, setActiveView } = useApp();

  return (
    <div className="bw-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Boxes size={18} style={{ color: 'var(--amber-600)' }} />
            Material Consumption & Stock Health
          </h3>
          <p className="card-subtitle">Real-time usage vs remaining buffer thresholds</p>
        </div>

        <button
          onClick={() => setActiveView('materials')}
          style={{ fontSize: '0.78rem', color: 'var(--amber-700)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
        >
          View All <ArrowUpRight size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {materials.slice(0, 4).map((mat) => {
          const percentUsed = Math.min(100, Math.round((mat.used / mat.purchased) * 100));
          const isLow = mat.remaining <= mat.threshold;

          return (
            <div key={mat.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--navy-900)' }}>{mat.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                    ({mat.siteName.split(' ')[0]})
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, color: isLow ? 'var(--danger)' : 'var(--navy-900)' }}>
                    {mat.remaining} {mat.unit} left
                  </span>{' '}
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    / {mat.purchased} {mat.unit}
                  </span>
                </div>
              </div>

              <ProgressBar
                progress={percentUsed}
                variant={percentUsed >= 85 ? 'danger' : percentUsed >= 60 ? 'warning' : 'success'}
                thickness="thick"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
