import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Check } from 'lucide-react';

export const RecordUsageModal = ({ isOpen, onClose, selectedMaterial }) => {
  const { materials, recordUsage } = useApp();
  const [materialId, setMaterialId] = useState(selectedMaterial?.id || materials[0]?.id);
  const [usedAmount, setUsedAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Update if selectedMaterial changes
  React.useEffect(() => {
    if (selectedMaterial) {
      setMaterialId(selectedMaterial.id);
    }
  }, [selectedMaterial]);

  const activeMat = materials.find(m => m.id === materialId) || materials[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!materialId || !usedAmount || Number(usedAmount) <= 0) return;

    recordUsage(materialId, usedAmount);
    setUsedAmount('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Material Consumption"
      subtitle="Log on-site material usage for daily construction tracking"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Check} onClick={handleSubmit}>
            Confirm Usage
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select Material</label>
          <select
            className="form-select"
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
          >
            {materials.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.remaining} {m.unit} available — {m.siteName})
              </option>
            ))}
          </select>
        </div>

        {activeMat && (
          <div style={{ background: 'var(--gray-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Site Location:</span>
              <strong style={{ color: 'var(--navy-900)' }}>{activeMat.siteName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Currently In Stock:</span>
              <strong style={{ color: activeMat.remaining <= activeMat.threshold ? 'var(--danger)' : 'var(--success-dark)' }}>
                {activeMat.remaining} {activeMat.unit}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Purchased:</span>
              <span>{activeMat.purchased} {activeMat.unit}</span>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">
            Quantity Used ({activeMat?.unit || 'units'}) *
          </label>
          <input
            type="number"
            className="form-input"
            placeholder={`e.g. ${activeMat?.category === 'Cement' ? '40' : '5'}`}
            required
            min="0.1"
            max={activeMat?.remaining}
            step="any"
            value={usedAmount}
            onChange={(e) => setUsedAmount(e.target.value)}
          />
          {activeMat && Number(usedAmount) > activeMat.remaining && (
            <span className="form-error">Cannot record more than available remaining stock!</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Activity / Task Notes (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Used for Ground floor column casting"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
