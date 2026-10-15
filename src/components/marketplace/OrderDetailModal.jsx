import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  User,
  ShieldCheck,
  Building2,
  Phone
} from 'lucide-react';

export const OrderDetailModal = ({ isOpen, onClose, order }) => {
  const { updateMarketplaceOrderStatus, currentUser, userRole } = useApp();
  const [actionNote, setActionNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  if (!order) return null;

  const isBuilder = userRole === 'builder';
  const isWorker = userRole === 'worker';

  // Status Check helpers
  const isReady = order.orderStatus === 'Ready for Pickup';
  const isPickedUp = order.orderStatus === 'Picked Up';
  const isCompleted = order.orderStatus === 'Completed';

  const handleTriggerAction = (targetStatus) => {
    setPendingAction(targetStatus);
    setShowNoteInput(true);
  };

  const handleConfirmAction = () => {
    if (!pendingAction) return;
    updateMarketplaceOrderStatus(order.id, pendingAction, actionNote);
    setShowNoteInput(false);
    setActionNote('');
    setPendingAction(null);
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">✓ Completed</Badge>;
      case 'Picked Up':
        return <Badge variant="info">🚚 Picked Up</Badge>;
      case 'Ready for Pickup':
        return <Badge variant="warning">📦 Ready for Pickup</Badge>;
      case 'Confirmed':
        return <Badge variant="neutral">✓ Confirmed</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Marketplace Order & Pickup Tracking"
      subtitle={`Order #${order.orderNumber} • ${order.materialName}`}
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {getOrderStatusBadge(order.orderStatus)}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>

            {!isWorker && !isCompleted && (
              <>
                {/* Seller marks Ready for Pickup */}
                {order.orderStatus === 'Confirmed' && (
                  <Button
                    variant="primary"
                    icon={PackageCheck}
                    onClick={() => handleTriggerAction('Ready for Pickup')}
                  >
                    Mark Ready for Pickup
                  </Button>
                )}

                {/* Buyer or Seller confirms Picked Up */}
                {isReady && (
                  <Button
                    variant="primary"
                    icon={Truck}
                    onClick={() => handleTriggerAction('Picked Up')}
                  >
                    Confirm Picked Up
                  </Button>
                )}

                {/* Mark Completed */}
                {isPickedUp && (
                  <Button
                    variant="primary"
                    icon={CheckCircle2}
                    onClick={() => handleTriggerAction('Completed')}
                  >
                    Mark Order Completed
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      }
    >
      <div>
        {/* Note confirmation drawer */}
        {showNoteInput && (
          <div style={{
            background: 'var(--amber-50)',
            border: '1px solid var(--amber-400)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
              Confirm Status: {pendingAction}
            </h5>
            <input
              type="text"
              className="form-input"
              placeholder="Add optional inspection / vehicle / driver note..."
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              style={{ marginBottom: '0.75rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button variant="secondary" size="sm" onClick={() => setShowNoteInput(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmAction}>
                Confirm & Update
              </Button>
            </div>
          </div>
        )}

        {/* Order Valuation & Payment Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          color: 'var(--white)',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Agreed Order Amount
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--amber-400)', marginTop: '0.15rem' }}>
              ₹{order.totalAmount?.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              {order.quantity} {order.unit} @ ₹{order.unitPrice?.toLocaleString()}/{order.unit}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Payment Status</div>
              <div style={{
                display: 'inline-block',
                marginTop: '0.2rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399'
              }}>
                ✓ {order.paymentStatus}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Stock Reservation</div>
              <div style={{ color: 'var(--white)', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.2rem' }}>
                Active in Warehouse
              </div>
            </div>
          </div>
        </div>

        {/* Parties Card (Buyer & Seller) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          {/* Seller details */}
          <div style={{
            background: 'var(--gray-50)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              <Building2 size={13} /> Seller Profile
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--navy-900)', marginTop: '0.35rem' }}>
              {order.sellerProfile?.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {order.sellerProfile?.companyName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={12} /> {order.sellerProfile?.phone || '+91 98220 12345'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={12} /> {order.pickupLocation}
            </div>
          </div>

          {/* Buyer details */}
          <div style={{
            background: 'var(--gray-50)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              <User size={13} /> Buyer Profile
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--navy-900)', marginTop: '0.35rem' }}>
              {order.buyerProfile?.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {order.buyerProfile?.companyName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={12} /> {order.buyerProfile?.phone || '+91 98450 44321'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={12} /> Target: {order.scheduledPickupDate}
            </div>
          </div>
        </div>

        {/* Transaction & Pickup Stepper Timeline */}
        <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Pickup & Fulfillment Stepper Timeline
        </h5>

        <div style={{
          background: 'var(--white)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            {order.timeline?.map((event, idx) => {
              const isPastOrDone = event.status === 'completed';
              const isCurrent = event.status === 'current';

              return (
                <div key={idx} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                  {/* Left dot & connector line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: isPastOrDone ? 'var(--success)' : (isCurrent ? 'var(--amber-500)' : 'var(--gray-300)'),
                      border: isCurrent ? '3px solid var(--amber-200)' : 'none',
                      marginTop: '2px',
                      zIndex: 2
                    }} />
                    {idx < (order.timeline.length - 1) && (
                      <div style={{
                        width: '2px',
                        flex: 1,
                        background: isPastOrDone ? 'var(--success)' : 'var(--border-color)',
                        margin: '4px 0'
                      }} />
                    )}
                  </div>

                  {/* Right Event text */}
                  <div style={{ flex: 1, paddingBottom: idx < (order.timeline.length - 1) ? '0.5rem' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        color: isPastOrDone ? 'var(--navy-900)' : (isCurrent ? 'var(--amber-700)' : 'var(--text-muted)')
                      }}>
                        {event.title}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {event.timestamp ? new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    {event.note && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {event.note}
                      </div>
                    )}

                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Updated by: <strong>{event.updatedBy || 'System'}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
