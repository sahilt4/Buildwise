import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Send, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export const RequestListingModal = ({ isOpen, onClose, product }) => {
  const { requestMarketplaceItem } = useApp();
  const [requestQty, setRequestQty] = useState('');
  const [phone, setPhone] = useState('+91 98220 12345');
  const [message, setMessage] = useState('Hi, I am interested in purchasing this surplus material for our ongoing site. Please confirm availability for pickup.');

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    requestMarketplaceItem(product.title, product.seller);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Material Purchase"
      subtitle={`Contact ${product.seller} for site surplus pickup`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Send} onClick={handleSubmit}>
            Send Request to Seller
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Product summary card */}
        <div style={{ display: 'flex', gap: '0.85rem', background: 'var(--gray-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
          <img
            src={product.image}
            alt={product.title}
            style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
          />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)' }}>{product.title}</h4>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--amber-600)', margin: '0.2rem 0' }}>
              ₹{product.price} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/{product.unit}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={12} /> {product.location} • <span style={{ color: 'var(--success-dark)', fontWeight: 600 }}>{product.condition}</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Required Quantity *</label>
          <input
            type="text"
            className="form-input"
            placeholder={`Available: ${product.quantity}`}
            required
            defaultValue={product.quantity}
            onChange={(e) => setRequestQty(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Your Contact Phone *</label>
          <input
            type="tel"
            className="form-input"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Message / Pickup Timeline</label>
          <textarea
            className="form-textarea"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--success-light)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--success-border)' }}>
          <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
          <span>Buildwise Verified Seller • Secure Direct Builder-to-Builder Handshake</span>
        </div>
      </form>
    </Modal>
  );
};
