import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const CreateTaskModal = ({ isOpen, onClose }) => {
  const { sites, workers, createTask } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workerId: workers[0]?.id || 'w-1',
    siteId: sites[0]?.id || 'site-1',
    priority: 'High',
    dueDate: 'Today'
  });

  const priorities = ['High', 'Medium', 'Low'];
  const dueDates = ['Today', 'Tomorrow', 'This Week', 'Next Week'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const worker = workers.find(w => w.id === formData.workerId);
    const site = sites.find(s => s.id === formData.siteId);

    createTask({
      ...formData,
      workerName: worker ? worker.name : 'Amit Patil',
      siteName: site ? site.name : 'Sunrise Residency'
    });

    setFormData({
      title: '',
      description: '',
      workerId: workers[0]?.id || 'w-1',
      siteId: sites[0]?.id || 'site-1',
      priority: 'High',
      dueDate: 'Today'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Construction Task"
      subtitle="Assign milestones and operations to trade specialists"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleSubmit}>
            Create Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Task Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Brick Wall — Ground Floor Outer Wing"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description & Instructions</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Provide specifications, drawings ref, or mortar mix ratios..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Assign Worker / Tradesman *</label>
            <select
              className="form-select"
              value={formData.workerId}
              onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
            >
              {workers.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.trade})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Site Location *</label>
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
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <select
              className="form-select"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            >
              {dueDates.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};
