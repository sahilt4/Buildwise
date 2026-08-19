import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import {
  Settings,
  User,
  Building,
  Bell,
  Globe,
  RotateCcw,
  ShieldCheck,
  Check
} from 'lucide-react';

export const SettingsView = () => {
  const { currentUser, userRole, setUserRole, addToast } = useApp();

  const handleSavePreferences = (e) => {
    e.preventDefault();
    addToast('✓ Settings and preferences saved successfully', 'success');
  };

  const handleResetDemoData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div className="page-header-text">
          <h1>System & Account Settings</h1>
          <p>Manage company profile, notification channels, measurement units, and access permissions.</p>
        </div>
      </div>

      <form onSubmit={handleSavePreferences}>
        {/* Profile Card */}
        <div className="bw-card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title">
              <User size={18} style={{ color: 'var(--amber-600)' }} />
              Active Account Profile
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" status="active" />
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>{currentUser.name}</h4>
              <div style={{ color: 'var(--amber-700)', fontWeight: 600, fontSize: '0.85rem' }}>{currentUser.role}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{currentUser.company}</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" defaultValue={currentUser.name} />
            </div>

            <div className="form-group">
              <label className="form-label">Company / Developer Name</label>
              <input type="text" className="form-input" defaultValue={currentUser.company} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role Perspective Switcher</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                className={`btn ${userRole === 'builder' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setUserRole('builder')}
              >
                Builder View
              </button>
              <button
                type="button"
                className={`btn ${userRole === 'engineer' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setUserRole('engineer')}
              >
                Site Engineer View
              </button>
              <button
                type="button"
                className={`btn ${userRole === 'worker' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setUserRole('worker')}
              >
                Worker Mode
              </button>
            </div>
          </div>
        </div>

        {/* Regional & System Preferences */}
        <div className="bw-card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title">
              <Globe size={18} style={{ color: 'var(--amber-600)' }} />
              Regional & Construction Units
            </h3>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Currency Symbol</label>
              <select className="form-select" defaultValue="INR">
                <option value="INR">₹ (INR — Indian Rupee)</option>
                <option value="USD">$ (USD — US Dollar)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sand & Aggregate Measure</label>
              <select className="form-select" defaultValue="Brass">
                <option value="Brass">Brass (100 cu.ft)</option>
                <option value="Metric Tons">Metric Tons</option>
                <option value="Cubic Meters">Cubic Meters (m³)</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem' }}>
          <Button
            type="button"
            variant="danger"
            icon={RotateCcw}
            onClick={handleResetDemoData}
          >
            Reset Demo Data
          </Button>

          <Button type="submit" variant="primary" icon={Check}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
