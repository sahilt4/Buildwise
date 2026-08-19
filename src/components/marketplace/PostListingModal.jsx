import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus, UploadCloud } from 'lucide-react';

export const PostListingModal = ({ isOpen, onClose }) => {
  const { addMarketplaceListing } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tiles',
    quantity: '',
    price: '',
    unit: 'piece',
    location: 'Nashik Road, Nashik',
    city: 'Nashik',
    condition: 'Unused / Mint',
    seller: 'Rajesh Infra Projects',
    description: '',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60'
  });

  const categories = ['Tiles', 'Steel', 'Carpentry', 'Wood & Formwork', 'Electrical', 'Plumbing', 'Aggregates', 'Hardware'];
  const units = ['piece', 'kg', 'ton', 'box', 'sheet', 'coil', 'length'];
  const conditions = ['Unused / Mint', 'Brand New In Box', 'Clean Surplus', '1-time Used (Good)', 'Offcuts'];

  const sampleImages = {
    Tiles: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60',
    Steel: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60',
    Carpentry: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60',
    'Wood & Formwork': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=500&auto=format&fit=crop&q=60',
    Electrical: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
    Plumbing: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
    Aggregates: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60',
    Hardware: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.quantity) return;

    addMarketplaceListing({
      ...formData,
      price: Number(formData.price),
      totalPrice: Number(formData.price) * (parseInt(formData.quantity) || 1),
      image: sampleImages[formData.category] || formData.image
    });

    setFormData({
      title: '',
      category: 'Tiles',
      quantity: '',
      price: '',
      unit: 'piece',
      location: 'Nashik Road, Nashik',
      city: 'Nashik',
      condition: 'Unused / Mint',
      seller: 'Rajesh Infra Projects',
      description: '',
      image: sampleImages['Tiles']
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="List Surplus Construction Material"
      subtitle="Publish your leftover materials for other builders & contractors to buy"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleSubmit}>
            Publish Listing
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Material Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Ceramic Floor Tiles 600x600"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => {
                const cat = e.target.value;
                setFormData({ ...formData, category: cat, image: sampleImages[cat] || formData.image });
              }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Condition *</label>
            <select
              className="form-select"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            >
              {conditions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Available Quantity *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 250 pieces or 1.5 tons"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price per Unit (₹) *</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="number"
                className="form-input"
                placeholder="18"
                required
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <select
                className="form-select"
                style={{ width: '110px' }}
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                {units.map(u => <option key={u} value={u}>/{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Site / Pickup Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sunrise Residency, Nashik"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nashik / Mumbai / Pune"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
