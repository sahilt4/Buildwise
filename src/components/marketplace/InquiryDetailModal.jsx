import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  User,
  Building,
  ArrowRight
} from 'lucide-react';

export const InquiryDetailModal = ({ isOpen, onClose, inquiry, onOrderCreated }) => {
  const {
    marketplaceMessages,
    sendInquiryMessage,
    respondToMarketplaceInquiry,
    currentUser,
    userRole
  } = useApp();

  const [replyText, setReplyText] = useState('');
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterQty, setCounterQty] = useState('');
  const [counterPrice, setCounterPrice] = useState('');
  const [counterNote, setCounterNote] = useState('');

  if (!inquiry) return null;

  // Filter messages for this inquiry
  const messages = marketplaceMessages.filter(m => m.inquiryId === inquiry.id);

  // Determine role in this transaction
  const isBuilder = userRole === 'builder';
  const isSeller = isBuilder || currentUser?.name === inquiry.sellerProfile?.name;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sendInquiryMessage(inquiry.id, replyText);
    setReplyText('');
  };

  const handleAccept = () => {
    respondToMarketplaceInquiry(inquiry.id, 'accept', {
      message: `Offer accepted! Agreed quantity reserved in site yard.`
    });
    if (onOrderCreated) onOrderCreated();
    onClose();
  };

  const handleCounter = (e) => {
    e.preventDefault();
    if (!counterQty || !counterPrice) return;
    respondToMarketplaceInquiry(inquiry.id, 'counter', {
      counterQuantity: Number(counterQty),
      counterPrice: Number(counterPrice),
      message: counterNote || `Counter-offer: ${counterQty} ${inquiry.unit} at ₹${counterPrice}/${inquiry.unit}`
    });
    setShowCounterForm(false);
  };

  const handleReject = () => {
    respondToMarketplaceInquiry(inquiry.id, 'reject', {
      message: 'Unfortunately, we cannot fulfill this inquiry at this moment.'
    });
    onClose();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return <Badge variant="success">✓ Accepted</Badge>;
      case 'Countered':
        return <Badge variant="warning">⚡ Counter-Offer</Badge>;
      case 'Rejected':
        return <Badge variant="danger">✕ Rejected</Badge>;
      case 'Cancelled':
        return <Badge variant="neutral">Cancelled</Badge>;
      default:
        return <Badge variant="info">⏳ Pending Review</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inquiry & Negotiation Details"
      subtitle={`Inquiry #${inquiry.id} • ${inquiry.listingTitle}`}
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {getStatusBadge(inquiry.status)}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            {isSeller && ['Pending', 'Countered'].includes(inquiry.status) && (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  icon={XCircle}
                  onClick={handleReject}
                >
                  Decline
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={RotateCcw}
                  onClick={() => setShowCounterForm(prev => !prev)}
                >
                  Counter-Offer
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={CheckCircle2}
                  onClick={handleAccept}
                >
                  Accept Offer
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      <div>
        {/* Deal Header Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          background: 'var(--gray-50)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Buyer</div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy-900)' }}>{inquiry.buyerProfile?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{inquiry.buyerProfile?.companyName}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Seller</div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy-900)' }}>{inquiry.sellerProfile?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{inquiry.sellerProfile?.companyName}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Requested Terms</div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--amber-600)' }}>
              {inquiry.requestedQuantity} {inquiry.unit} @ ₹{inquiry.proposedPrice}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Total: ₹{inquiry.totalProposedAmount?.toLocaleString()}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pickup Slot</div>
            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
              {inquiry.preferredPickupDate}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Pref: {inquiry.contactPreference}
            </div>
          </div>
        </div>

        {/* Counter-offer Alert if active */}
        {inquiry.counterOffer && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid var(--amber-400)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-700)', textTransform: 'uppercase' }}>
                ⚡ Current Active Counter-Offer
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '0.15rem' }}>
                {inquiry.counterOffer.quantity} {inquiry.unit} @ ₹{inquiry.counterOffer.price}/{inquiry.unit} (Total: ₹{(inquiry.counterOffer.quantity * inquiry.counterOffer.price).toLocaleString()})
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                "{inquiry.counterOffer.note}"
              </div>
            </div>
            {!isSeller && inquiry.status === 'Countered' && (
              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle2}
                onClick={handleAccept}
              >
                Accept Counter
              </Button>
            )}
          </div>
        )}

        {/* Seller Counter Form Drawer */}
        {showCounterForm && (
          <form onSubmit={handleCounter} style={{
            background: 'var(--white)',
            border: '2px solid var(--amber-400)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem',
            animation: 'fadeIn 0.2s ease-in-out'
          }}>
            <h5 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--navy-900)' }}>
              Propose Counter-Offer to {inquiry.buyerProfile?.name}
            </h5>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Revised Quantity ({inquiry.unit})</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  defaultValue={inquiry.requestedQuantity}
                  onChange={(e) => setCounterQty(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Revised Price per {inquiry.unit} (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  defaultValue={inquiry.proposedPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Short Explanation</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. This is our lowest clearance rate including loading assistance."
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button variant="secondary" size="sm" onClick={() => setShowCounterForm(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Submit Counter-Offer
              </Button>
            </div>
          </form>
        )}

        {/* Conversation Message Timeline */}
        <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Negotiation & Message Thread ({messages.length})
        </h5>

        <div style={{
          maxHeight: '260px',
          overflowY: 'auto',
          padding: '0.75rem',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          marginBottom: '1rem'
        }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              No messages yet in this negotiation thread.
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderName === currentUser?.name || (isSeller && msg.senderRole === 'seller') || (!isSeller && msg.senderRole === 'buyer');
              const isEvent = ['counter_offer', 'offer_accepted', 'offer_rejected'].includes(msg.type);

              if (isEvent) {
                return (
                  <div key={msg.id} style={{ textAlign: 'center', margin: '0.25rem 0' }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      background: msg.type === 'offer_accepted' ? 'var(--success-light)' : (msg.type === 'counter_offer' ? 'rgba(245, 158, 11, 0.15)' : 'var(--danger-light)'),
                      color: msg.type === 'offer_accepted' ? 'var(--success-dark)' : (msg.type === 'counter_offer' ? 'var(--amber-700)' : 'var(--danger-dark)')
                    }}>
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: isMine ? 'var(--navy-900)' : 'var(--white)',
                    color: isMine ? 'var(--white)' : 'var(--text-primary)',
                    padding: '0.6rem 0.85rem',
                    borderRadius: isMine ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    boxShadow: 'var(--shadow-sm)',
                    border: isMine ? 'none' : '1px solid var(--border-color)'
                  }}
                >
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: isMine ? 'var(--amber-400)' : 'var(--text-secondary)',
                    marginBottom: '0.2rem'
                  }}>
                    {msg.senderName} ({msg.senderRole})
                  </div>
                  <div style={{ fontSize: '0.82rem', lineHeight: 1.35 }}>
                    {msg.text}
                  </div>
                  <div style={{
                    fontSize: '0.65rem',
                    color: isMine ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)',
                    textAlign: 'right',
                    marginTop: '0.25rem'
                  }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Type your reply message or pickup question..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button variant="primary" icon={Send} type="submit" disabled={!replyText.trim()}>
            Send
          </Button>
        </form>
      </div>
    </Modal>
  );
};
