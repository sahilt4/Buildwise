import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import {
  Settings,
  User,
  Building,
  Bell,
  Globe,
  RotateCcw,
  ShieldCheck,
  Check,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const SettingsView = () => {
  const { currentUser, userRole, setUserRole, addToast, isBackendConnected, refreshData, seedDatabase, apiError } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

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

        {/* Database & Cloud Sync Card */}
        <div className="bw-card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} style={{ color: 'var(--amber-600)' }} />
              Database & MongoDB Atlas Cloud
            </h3>
            <Badge variant={isBackendConnected ? 'success' : 'warning'}>
              {isBackendConnected ? '🟢 Atlas Connected' : '🟡 Offline Fallback Mode'}
            </Badge>
          </div>

          <div style={{ background: isBackendConnected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)', border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`, borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: isBackendConnected ? 'var(--success-dark)' : 'var(--amber-800)' }}>
              {isBackendConnected ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{isBackendConnected ? 'Connected to MongoDB Atlas backend (Port 5000)' : 'Backend offline or waiting for valid MONGODB_URI'}</span>
            </div>
            <p style={{ marginTop: '0.35rem', color: isBackendConnected ? 'var(--navy-800)' : 'var(--amber-900)', fontSize: '0.8rem', lineHeight: 1.4 }}>
              {isBackendConnected
                ? 'All additions, usage logs, site progress edits, and deletions are synchronized directly with your MongoDB Atlas database.'
                : 'The application is running in local memory fallback mode. Configure MONGODB_URI in backend/.env to persist data across sessions.'}
            </p>
          </div>

          {apiError && (
            <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--danger-dark)' }}>
              <strong>API Notice:</strong> {apiError}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <Button
              type="button"
              variant="secondary"
              icon={RefreshCw}
              onClick={async () => {
                setIsSyncing(true);
                await refreshData(false);
                setIsSyncing(false);
                addToast('Synced latest data from MongoDB backend', 'info');
              }}
              disabled={isSyncing}
            >
              {isSyncing ? 'Syncing...' : 'Sync with Database'}
            </Button>

            <Button
              type="button"
              variant="primary"
              icon={Database}
              onClick={async () => {
                if (window.confirm('Seed database with complete construction demo records? This will populate Sites, Materials, Workers, and Tasks to MongoDB Atlas.')) {
                  setIsSeeding(true);
                  try {
                    await seedDatabase({ additive: false });
                  } finally {
                    setIsSeeding(false);
                  }
                }
              }}
              disabled={isSeeding || !isBackendConnected}
            >
              {isSeeding ? 'Seeding Atlas...' : 'Seed Demo Data to Atlas'}
            </Button>
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
