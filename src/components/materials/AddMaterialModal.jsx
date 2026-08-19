import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const AddMaterialModal = ({ isOpen, onClose }) => {
  const { sites, addMaterial } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cement',
    purchased: '',
    unit: 'Bags',
    siteId: sites[0]?.id || 'site-1',
    threshold: '50',
    costPerUnit: ''
  });

  const categories = ['Cement', 'Steel', 'Tiles', 'Plumbing', 'Electrical', 'Aggregates', 'Wood & Formwork'];
  const units = ['Bags', 'Tons', 'Boxes', 'Lengths', 'Meters', 'Brass', 'Sheets', 'Pieces'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.purchased) return;

    const selectedSite = sites.find(s => s.id === formData.siteId);
    addMaterial({
      ...formData,
      siteName: selectedSite ? selectedSite.name : 'Sunrise Residency',
      image: formData.category === 'Cement'
        ? 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60'
        : formData.category === 'Steel'
        ? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60'
        : formData.category === 'Tiles'
        ? 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60'
    });

    setFormData({
      name: '',
      category: 'Cement',
      purchased: '',
      unit: 'Bags',
      siteId: sites[0]?.id || 'site-1',
      threshold: '50',
      costPerUnit: ''
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Construction Material"
      subtitle="Register inventory delivery for active construction sites"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleSubmit}>
            Add Material
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Material Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Ultratech Cement PPC"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Construction Site *</label>
            <select
              className="form-select"
              value={formData.siteId}
              onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
            >
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Quantity Purchased *</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 500"
              required
              min="1"
              value={formData.purchased}
              onChange={(e) => setFormData({ ...formData, purchased: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Unit of Measure</label>
            <select
              className="form-select"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            >
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Low Stock Alert Threshold</label>
            <input
              type="number"
              className="form-input"
              placeholder="50"
              value={formData.threshold}
              onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
            />
            <span className="form-helper">Triggers warning badge when remaining hits this level.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Cost per Unit (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 390"
              value={formData.costPerUnit}
              onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
