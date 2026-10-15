import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Send, MapPin, ShieldCheck, Calendar, Phone, AlertCircle } from 'lucide-react';

export const InquiryModal = ({ isOpen, onClose, listing }) => {
  const { submitMarketplaceInquiry, currentUser, marketplaceProfiles } = useApp();

  const [requestedQty, setRequestedQty] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [pickupDate, setPickupDate] = useState('Within 48 Hours');
  const [contactPref, setContactPref] = useState('Phone');
  const [errorMsg, setErrorMsg] = useState('');

  if (!listing) return null;

  const maxQty = listing.availableQuantity !== undefined ? listing.availableQuantity : (listing.totalQuantity || 100);
  const basePrice = listing.price || 0;
  const currentProposedPrice = proposedPrice !== '' ? Number(proposedPrice) : basePrice;
  const currentReqQty = requestedQty !== '' ? Number(requestedQty) : maxQty;
  const totalOffer = Math.max(0, currentReqQty * currentProposedPrice);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const reqNum = Number(requestedQty || maxQty);
    const priceNum = Number(proposedPrice || basePrice);

    if (reqNum <= 0) {
      setErrorMsg('Please specify a valid quantity greater than 0.');
      return;
    }

    if (reqNum > maxQty) {
      setErrorMsg(`Requested quantity cannot exceed available stock (${maxQty} ${listing.unit}).`);
      return;
    }

    if (priceNum <= 0) {
      setErrorMsg('Please enter a valid offer price per unit.');
      return;
    }

    // Match or fallback profile
    const buyerProfile = marketplaceProfiles?.find(p => p.name === currentUser?.name) || {
      name: currentUser?.name || 'Suresh Deshmukh',
      companyName: currentUser?.company || 'Sunrise Residency Site',
      phone: '+91 98450 44321',
      email: 'suresh@sunriseinfra.in',
      city: listing.city || 'Nashik',
      rating: 4.8,
      isVerified: true
    };

    submitMarketplaceInquiry({
      listingId: listing.id,
      requestedQuantity: reqNum,
      proposedPrice: priceNum,
      message: message || `We would like to procure ${reqNum} ${listing.unit} for our site. Please confirm pickup for ${pickupDate}.`,
      preferredPickupDate: pickupDate,
      contactPreference: contactPref,
      buyerProfile
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Purchase Inquiry"
      subtitle={`Make an offer & schedule pickup with ${listing.seller}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Send} onClick={handleSubmit}>
            Send Inquiry to Seller
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Listing Summary Preview */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          background: 'var(--gray-50)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-color)'
        }}>
          <img
            src={listing.image}
            alt={listing.title}
            style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)' }}>{listing.title}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 800, color: 'var(--amber-600)' }}>
                Listed: ₹{listing.price?.toLocaleString()} <small style={{ fontWeight: 500, color: 'var(--text-muted)' }}>/{listing.unit}</small>
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: 'var(--success-dark)', fontWeight: 600 }}>
                {maxQty} {listing.unit} Available
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={12} /> {listing.location}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0.85rem',
            background: 'var(--danger-light)',
            color: 'var(--danger-dark)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Requested Quantity ({listing.unit}) *
            </label>
            <input
              type="number"
              className="form-input"
              placeholder={`Max: ${maxQty}`}
              defaultValue={maxQty}
              min="1"
              max={maxQty}
              required
              onChange={(e) => setRequestedQty(e.target.value)}
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Available in yard: <strong>{maxQty} {listing.unit}</strong>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Your Offer Price per {listing.unit} (₹) *
            </label>
            <input
              type="number"
              className="form-input"
              placeholder={`Listed: ₹${listing.price}`}
              defaultValue={listing.price}
              min="1"
              required
              onChange={(e) => setProposedPrice(e.target.value)}
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Current listing price: ₹{listing.price}
            </div>
          </div>
        </div>

        {/* Live Total Calculation Banner */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px dashed var(--amber-400)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Offer Valuation</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--amber-600)' }}>
              ₹{totalOffer.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div>{currentReqQty} {listing.unit} @ ₹{currentProposedPrice}/{listing.unit}</div>
            <div style={{ color: 'var(--success-dark)', fontWeight: 600 }}>No Brokerage • Direct Trade</div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Preferred Pickup Date / Slot</label>
            <select
              className="form-select"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            >
              <option value="Today Afternoon">Today Afternoon (Immediate)</option>
              <option value="Tomorrow 10:00 AM">Tomorrow 10:00 AM</option>
              <option value="Within 48 Hours">Within 48 Hours</option>
              <option value="This Weekend">This Weekend</option>
              <option value="Next Week">Next Week</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Preference</label>
            <select
              className="form-select"
              value={contactPref}
              onChange={(e) => setContactPref(e.target.value)}
            >
              <option value="Phone">Phone Call</option>
              <option value="WhatsApp">WhatsApp Message</option>
              <option value="In-App">In-App Chat Only</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Message / Site Vehicle Details</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="e.g. Can pick up with our Tata Ace tipper vehicle. Please confirm yard gate number."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          background: 'var(--success-light)',
          padding: '0.6rem 0.85rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--success-border)'
        }}>
          <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
          <span>Buildwise Verified Seller Handshake • Once accepted, agreed quantity is reserved in warehouse</span>
        </div>
      </form>
    </Modal>
  );
};
