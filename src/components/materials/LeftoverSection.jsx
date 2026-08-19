import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Sparkles, ArrowRight, DollarSign, Store, Tag } from 'lucide-react';

export const LeftoverSection = ({ onNavigateToMarketplace }) => {
  const { leftovers, listLeftoverOnMarketplace } = useApp();

  if (!leftovers.length) {
    return (
      <div className="leftover-banner" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div className="leftover-badge-pill" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={13} />
            Value Recovery Hub
          </div>
          <h3 style={{ color: 'var(--white)', fontSize: '1.2rem', marginBottom: '0.35rem' }}>
            All Surplus Materials Listed or Sold!
          </h3>
          <p style={{ color: 'var(--gray-300)', fontSize: '0.85rem', maxWidth: '500px', margin: '0 auto 1rem' }}>
            Great job! You have monetized your construction leftovers and prevented site wastage.
          </p>
          <Button variant="primary" icon={Store} onClick={onNavigateToMarketplace}>
            Browse Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const totalRecoverableValue = leftovers.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  return (
    <div className="leftover-banner animate-fade-in">
      <div className="leftover-banner-header">
        <div>
          <div className="leftover-badge-pill">
            <Sparkles size={13} />
            Buildwise Differentiator • Waste → Value
          </div>
          <h3 style={{ color: 'var(--white)', fontSize: '1.3rem', marginTop: '0.4rem', fontWeight: 800 }}>
            Materials You Can Recover Value From
          </h3>
          <p style={{ color: 'var(--gray-300)', fontSize: '0.85rem' }}>
            Turn leftover site surplus into immediate cash flow on the Buildwise B2B Resale Network.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--amber-400)', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Recoverable Value
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--white)' }}>
            ₹{totalRecoverableValue.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="leftover-grid">
        {leftovers.map((item) => (
          <div key={item.id} className="leftover-card">
            <div className="leftover-img-wrap">
              <img src={item.image} alt={item.title} />
              <div className="leftover-price-tag">
                ₹{item.estimatedValue.toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ color: 'var(--white)', fontSize: '0.95rem' }}>{item.title}</strong>
              </div>
              <div style={{ color: 'var(--amber-400)', fontSize: '0.82rem', fontWeight: 600 }}>
                {item.quantity}
              </div>
              <div style={{ color: 'var(--gray-400)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>📍 {item.site}</span> • <span>{item.condition}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Store}
              style={{ width: '100%', marginTop: '0.5rem' }}
              onClick={() => listLeftoverOnMarketplace(item.id)}
            >
              Sell on Marketplace
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
