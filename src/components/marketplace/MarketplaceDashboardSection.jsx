import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Sparkles,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';

export const MarketplaceDashboardSection = ({ onSelectTab }) => {
  const {
    marketplace,
    marketplaceInquiries,
    marketplaceOrders,
    userRole,
    currentUser
  } = useApp();

  const isBuilder = userRole === 'builder';
  const isEngineer = userRole === 'engineer';
  const isWorker = userRole === 'worker';

  // Metrics
  const activeListings = marketplace.filter(m => m.status === 'Available');
  const totalListedValue = activeListings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const pendingInquiriesCount = marketplaceInquiries.filter(i => i.status === 'Pending').length;
  const counteredInquiriesCount = marketplaceInquiries.filter(i => i.status === 'Countered').length;
  const reservedListingsCount = marketplace.filter(m => (m.reservedQuantity || 0) > 0).length;
  const awaitingPickupOrders = marketplaceOrders.filter(o => o.orderStatus === 'Ready for Pickup');
  const completedOrders = marketplaceOrders.filter(o => o.orderStatus === 'Completed');
  const totalCompletedValue = completedOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const estimatedSavings = Math.round(totalCompletedValue * 0.38);

  return (
    <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
      {/* Role Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        color: 'var(--white)',
        marginBottom: '1.25rem',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(245, 158, 11, 0.2)',
            padding: '0.2rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            color: 'var(--amber-400)',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            <Sparkles size={12} />
            {isBuilder ? 'Seller Perspective' : (isEngineer ? 'Site Engineer / Buyer Perspective' : 'Site Crew Read-Only Portal')}
          </div>
          <h2 style={{ color: 'var(--white)', fontSize: '1.35rem', fontWeight: 800, marginTop: '0.4rem' }}>
            {isBuilder ? 'Surplus Liquidation & Transaction Telemetry' : (isEngineer ? 'Requisition & Site Materials Procurement' : 'Site Material Inflow & Dispatch Log')}
          </h2>
          <p style={{ color: 'var(--gray-300)', fontSize: '0.85rem', maxWidth: '650px', marginTop: '0.2rem' }}>
            {isBuilder
              ? 'Monitor listed inventory value, manage buyer inquiries, reserve stock, and track scheduled customer site pickups.'
              : (isEngineer
                ? 'Procure verified construction surplus from nearby sites at 30-50% discount, negotiate offers, and coordinate transport.'
                : 'View approved material delivery receipts and scheduled yard pickups assigned to your construction site.')
            }
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>
              {isBuilder ? 'Listed Value' : 'Surplus Savings'}
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--amber-400)' }}>
              ₹{isBuilder ? totalListedValue.toLocaleString() : estimatedSavings.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {isBuilder ? (
          <>
            <div
              className="dash-hero-stat-card"
              style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', cursor: 'pointer' }}
              onClick={() => onSelectTab('my-listings')}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Listings</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.2rem 0' }}>{activeListings.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Valuation: ₹{totalListedValue.toLocaleString()}</div>
            </div>

            <div
              className="dash-hero-stat-card"
              style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', cursor: 'pointer' }}
              onClick={() => onSelectTab('inquiries')}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pending Inquiries</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber-600)', margin: '0.2rem 0' }}>{pendingInquiriesCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Awaiting your price response</div>
            </div>

            <div
              className="dash-hero-stat-card"
              style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', cursor: 'pointer' }}
              onClick={() => onSelectTab('orders')}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Awaiting Pickup</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--info-dark)', margin: '0.2rem 0' }}>{awaitingPickupOrders.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ready at site gate / yard</div>
            </div>

            <div
              className="dash-hero-stat-card"
              style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', cursor: 'pointer' }}
              onClick={() => onSelectTab('orders')}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Completed Sales</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-dark)', margin: '0.2rem 0' }}>{completedOrders.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Recovered: ₹{totalCompletedValue.toLocaleString()}</div>
            </div>
          </>
        ) : (
          <>
            <div
              className="dash-hero-stat-card"
              style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', cursor: 'pointer' }}
              onClick={() => onSelectTab('inquiries')}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Inquiries</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.2rem 0' }}>
                {marketplaceInquiries.filter(i => ['Pending', 'Countered'].includes(i.status)).length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{counteredInquiriesCount} counter-offers received</div>
            </div>

            <div
              className="dash-hero-stat-card"
              style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', cursor: 'pointer' }}
              onClick={() => onSelectTab('orders')}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Confirmed Orders</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-dark)', margin: '0.2rem 0' }}>
                {marketplaceOrders.filter(o => ['Confirmed', 'Ready for Pickup'].includes(o.orderStatus)).length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Stock reserved & scheduled</div>
            </div>

            <div
              className="dash-hero-stat-card"
              style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', cursor: 'pointer' }}
              onClick={() => onSelectTab('orders')}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pickup Schedule</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber-600)', margin: '0.2rem 0' }}>
                {awaitingPickupOrders.length} Ready
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dispatches awaiting vehicle</div>
            </div>

            <div
              className="dash-hero-stat-card"
              style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Surplus Discount</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-dark)', margin: '0.2rem 0' }}>38% Avg</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Saved vs retail market</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
