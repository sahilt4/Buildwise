import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const AddWorkerModal = ({ isOpen, onClose }) => {
  const { sites, addWorker } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    trade: 'Mason',
    category: 'Masonry',
    siteId: sites[0]?.id || 'site-1',
    phone: '',
    wagePerDay: '850',
    currentTask: 'General Site Masonry'
  });

  const trades = [
    { label: 'Master Mason', cat: 'Masonry' },
    { label: 'Bar Bender (Steel Fixer)', cat: 'Steel' },
    { label: 'Formwork Carpenter', cat: 'Carpentry' },
    { label: 'Licensed Electrician', cat: 'Electrical' },
    { label: 'Plumber & Pipefitter', cat: 'Plumbing' },
    { label: 'General Site Crew / Helper', cat: 'Labor' },
    { label: 'Painter & Finisher', cat: 'Finishing' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const selectedSite = sites.find(s => s.id === formData.siteId);
    addWorker({
      ...formData,
      siteName: selectedSite ? selectedSite.name : 'Sunrise Residency',
      wagePerDay: Number(formData.wagePerDay)
    });

    setFormData({
      name: '',
      trade: 'Master Mason',
      category: 'Masonry',
      siteId: sites[0]?.id || 'site-1',
      phone: '',
      wagePerDay: '850',
      currentTask: 'General Site Work'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll New Site Worker"
      subtitle="Add crew members, assign trade skills, and link to construction sites"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleSubmit}>
            Add Crew Member
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Amit Patil"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Skill / Trade *</label>
            <select
              className="form-select"
              value={formData.trade}
              onChange={(e) => {
                const selected = trades.find(t => t.label === e.target.value);
                setFormData({
                  ...formData,
                  trade: e.target.value,
                  category: selected?.cat || 'Labor'
                });
              }}
            >
              {trades.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Site *</label>
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
            <label className="form-label">Mobile Number *</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+91 98234 XXXXX"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Daily Wage (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="850"
              value={formData.wagePerDay}
              onChange={(e) => setFormData({ ...formData, wagePerDay: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Initial Task Description</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Ground Floor Column Reinforcement"
            value={formData.currentTask}
            onChange={(e) => setFormData({ ...formData, currentTask: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
