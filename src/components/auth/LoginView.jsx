import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  HardHat,
  Briefcase,
  UserCheck,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

// Quick preset accounts for demonstration & real role testing
const presets = {
  builder: {
    name: 'Rajesh Sharma',
    email: 'builder@buildwise.in',
    role: 'builder',
    title: 'Builder / Director',
    desc: 'Portfolio oversight, budgets, finance & crew governance'
  },
  manager: {
    name: 'Suresh Deshmukh',
    email: 'manager@buildwise.in',
    role: 'manager',
    title: 'Site Manager (Site Eng.)',
    desc: 'Assigned site operations, material usage & daily task dispatch'
  },
  worker: {
    name: 'Amit Patil',
    email: 'worker@buildwise.in',
    role: 'worker',
    title: 'Field Worker / Mason',
    desc: 'Mobile-first personal attendance, punch clock & assigned tasks'
  }
};

export const LoginView = ({ onClose, initialRole }) => {
  const { login, isBackendConnected, setIsLandingPage, userRole } = useApp();

  const initialRoleKey = initialRole || userRole || 'builder';
  const [selectedRole, setSelectedRole] = useState(initialRoleKey);
  const [workerName, setWorkerName] = useState('');
  const [trade, setTrade] = useState('Masonry');
  const [email, setEmail] = useState(presets[initialRoleKey]?.email || 'builder@buildwise.in');
  const [password, setPassword] = useState('Buildwise@2026');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialRole && presets[initialRole]) {
      setSelectedRole(initialRole);
      setEmail(presets[initialRole].email);
      setPassword('Buildwise@2026');
    }
  }, [initialRole]);

  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    setEmail(presets[roleKey].email);
    setPassword('Buildwise@2026');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedRole === 'worker' && !workerName.trim()) {
      setErrorMsg('Please enter your full name to sign in and register on the site roster.');
      return;
    }

    setLoading(true);

    try {
      const extraPayload = selectedRole === 'worker' ? { workerName: workerName.trim(), trade } : {};
      await login(email, password, selectedRole, extraPayload);
      if (onClose) onClose();
      setIsLandingPage(false);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #090e17 0%, #0f172a 100%)',
        position: 'relative'
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Brand Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '2rem 2rem 1.5rem',
            textAlign: 'center',
            color: '#ffffff',
            position: 'relative'
          }}
        >
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
              title="Close and return"
            >
              <X size={18} />
            </button>
          )}

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--amber-500)',
              color: '#000',
              marginBottom: '0.85rem'
            }}
          >
            <Layers size={24} />
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Buildwise Access Control
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.35rem', marginBottom: 0 }}>
            Secure Role-Based Authentication with MongoDB Atlas
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '0.85rem',
              padding: '0.2rem 0.65rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: isBackendConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isBackendConnected ? '#34d399' : '#fbbf24',
              border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isBackendConnected ? '#34d399' : '#fbbf24'
              }}
            />
            {isBackendConnected ? 'Connected to MongoDB Atlas' : 'Local Verification Mode'}
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: '2rem' }}>
          {/* Role Selection Tabs */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.5rem'
              }}
            >
              Select Portal / Role Experience
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                background: 'var(--gray-100)',
                padding: '4px',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <button
                type="button"
                onClick={() => handleSelectRole('builder')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '0.65rem 0.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: selectedRole === 'builder' ? '#ffffff' : 'transparent',
                  color: selectedRole === 'builder' ? 'var(--navy-900)' : 'var(--text-muted)',
                  fontWeight: selectedRole === 'builder' ? 700 : 500,
                  fontSize: '0.75rem',
                  boxShadow: selectedRole === 'builder' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Briefcase size={16} color={selectedRole === 'builder' ? 'var(--amber-600)' : 'currentColor'} />
                Builder
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('manager')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '0.65rem 0.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: selectedRole === 'manager' ? '#ffffff' : 'transparent',
                  color: selectedRole === 'manager' ? 'var(--navy-900)' : 'var(--text-muted)',
                  fontWeight: selectedRole === 'manager' ? 700 : 500,
                  fontSize: '0.75rem',
                  boxShadow: selectedRole === 'manager' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <HardHat size={16} color={selectedRole === 'manager' ? 'var(--amber-600)' : 'currentColor'} />
                Site Mgr
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('worker')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '0.65rem 0.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: selectedRole === 'worker' ? '#ffffff' : 'transparent',
                  color: selectedRole === 'worker' ? 'var(--navy-900)' : 'var(--text-muted)',
                  fontWeight: selectedRole === 'worker' ? 700 : 500,
                  fontSize: '0.75rem',
                  boxShadow: selectedRole === 'worker' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <UserCheck size={16} color={selectedRole === 'worker' ? 'var(--amber-600)' : 'currentColor'} />
                Worker
              </button>
            </div>

            {/* Role Context Box */}
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--amber-50)',
                border: '1px solid var(--amber-200)',
                fontSize: '0.76rem',
                color: 'var(--amber-900)',
                lineHeight: 1.35
              }}
            >
              <strong>{presets[selectedRole].title}</strong>: {presets[selectedRole].desc}
            </div>
          </div>

          {errorMsg && (
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--danger-light)',
                border: '1px solid var(--danger)',
                color: 'var(--danger-dark)',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* If Worker selected, require worker's actual name and trade so it reflects in Manager & Builder portals */}
            {selectedRole === 'worker' && (
              <div
                style={{
                  background: 'var(--amber-50)',
                  border: '1px solid var(--amber-300)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--amber-950)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={16} />
                  <span>Worker Identity & Site Roster Details</span>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', color: 'var(--navy-900)' }}>
                    Your Full Name * (Appears on Site Engineer & Builder Rosters)
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Ramesh Kumar, Sunita Rao..."
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    style={{ background: '#ffffff' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', color: 'var(--navy-900)' }}>
                    Trade Skill / Specialization
                  </label>
                  <select
                    className="form-select"
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    style={{ background: '#ffffff', fontSize: '0.85rem' }}
                  >
                    <option value="Masonry">Master Mason / Bricklayer</option>
                    <option value="Carpentry">Shuttering Carpenter</option>
                    <option value="Bar Bending">Rebar & Bar Bender</option>
                    <option value="Electrical">Electrician & Conduit Specialist</option>
                    <option value="Plumbing">Plumber & Drainage Fitter</option>
                    <option value="General Construction">General Construction Crew</option>
                  </select>
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>
                Account Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@buildwise.in"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>
                  Password
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--amber-700)', fontWeight: 600 }}>
                  Demo: Buildwise@2026
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <span>Authenticating with Atlas...</span>
              ) : (
                <>
                  <span>Sign In as {presets[selectedRole].role.toUpperCase()}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Footer */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}
          >
            <div>Secured by JWT Token & Server-Side Permission Scoping</div>
            <div style={{ marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
              Click any role above to auto-fill verified test accounts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
