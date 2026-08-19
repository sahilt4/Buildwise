import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const AddSiteModal = ({ isOpen, onClose }) => {
  const { addSite } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    subName: '',
    location: '',
    supervisor: 'Suresh Deshmukh (Site Eng.)',
    totalBudget: '₹4.50 Cr',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;

    addSite(formData);
    setFormData({
      name: '',
      subName: '',
      location: '',
      supervisor: 'Suresh Deshmukh (Site Eng.)',
      totalBudget: '₹4.50 Cr',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=80'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Construction Site Project"
      subtitle="Register new residential, commercial, or infrastructure project site"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleSubmit}>
            Register Site
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Project / Site Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Royal Palms Township"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Sub-title / Scope</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 14 Floors Residential Towers A & B"
            value={formData.subName}
            onChange={(e) => setFormData({ ...formData, subName: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Location / City *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Gangapur Road, Nashik"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Approved Budget</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. ₹5.00 Cr"
              value={formData.totalBudget}
              onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Lead Site Engineer</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Suresh Deshmukh (Site Eng.)"
            value={formData.supervisor}
            onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
