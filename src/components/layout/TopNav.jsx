import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { MinHeap } from '../../utils/priorityQueue';
import {
  Menu,
  Search,
  Bell,
  HardHat,
  Briefcase,
  UserCheck,
  ChevronDown,
  X,
  Sparkles,
  Database,
  CloudCheck
} from 'lucide-react';

export const TopNav = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    userRole,
    setUserRole,
    setIsMobileMenuOpen,
    searchQuery,
    setSearchQuery,
    activities,
    materials,
    isBackendConnected,
    setIsLandingPage,
    setIsLoginModalOpen,
    setLoginTargetRole,
    logout,
    authUser,
    login
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const viewTitles = {
    dashboard: 'Executive Dashboard',
    sites: 'Construction Sites Overview',
    materials: 'Material Stock & Leftover Resale',
    marketplace: 'Leftover Resale Marketplace',
    workers: 'Crew & Workforce Management',
    attendance: 'Site Attendance & QR Punch',
    tasks: 'Site Tasks & Operations',
    reports: 'Efficiency & Cost Reports',
    notifications: 'Notifications & Alerts',
    settings: 'System & Account Settings'
  };

  // Build the Min-Heap for low-stock alerts
  const lowStockHeap = new MinHeap();
  materials.forEach(m => {
    if (m.status === 'Low Stock' && m.threshold > 0) {
      lowStockHeap.add({ ...m, ratio: m.remaining / m.threshold });
    } else if (m.status === 'Low Stock') {
      lowStockHeap.add({ ...m, ratio: 0 });
    }
  });
  const lowStockAlerts = lowStockHeap.toArray();
  const notificationCount = lowStockAlerts.length + 2;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="btn-icon mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          aria-label="Open navigation menu"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Menu size={22} />
        </button>

        <div className="breadcrumbs">
          <span style={{ color: 'var(--header-muted)' }}>Buildwise</span>
          <span>/</span>
          <span className="current">{viewTitles[activeView] || 'Overview'}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Global Search */}
        <div className="search-input-wrapper" style={{ width: '220px', display: window.innerWidth < 640 ? 'none' : 'flex' }}>
          <Search size={15} style={{ color: 'var(--gray-400)' }} />
          <input
            type="text"
            className="form-input"
            style={{
              padding: '0.45rem 0.75rem 0.45rem 2.2rem',
              fontSize: '0.82rem'
            }}
            placeholder="Search materials, sites, crew..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Database Status indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            background: isBackendConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            fontSize: '0.72rem',
            fontWeight: 700,
            color: isBackendConnected ? '#34d399' : '#fbbf24'
          }}
          title={isBackendConnected ? 'Connected to MongoDB Atlas Backend' : 'Running on Local Telemetry Cache'}
        >
          <Database size={12} />
          <span style={{ display: window.innerWidth < 1024 ? 'none' : 'inline' }}>
            {isBackendConnected ? 'Atlas Cloud' : 'Local Cache'}
          </span>
        </div>

        {/* Role Switcher Pill Bar */}
        <div className="role-switcher-container" title="Click any role to switch account & sign in">
          <button
            className={`role-tab-btn ${userRole === 'builder' ? 'active' : ''}`}
            onClick={() => {
              setLoginTargetRole('builder');
              setIsLoginModalOpen(true);
            }}
          >
            <Briefcase size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Builder
          </button>
          <button
            className={`role-tab-btn ${userRole === 'manager' || userRole === 'engineer' ? 'active' : ''}`}
            onClick={() => {
              setLoginTargetRole('manager');
              setIsLoginModalOpen(true);
            }}
          >
            <HardHat size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Site Mgr
          </button>
          <button
            className={`role-tab-btn ${userRole === 'worker' ? 'active' : ''}`}
            onClick={() => {
              setLoginTargetRole('worker');
              setIsLoginModalOpen(true);
            }}
          >
            <UserCheck size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Worker
          </button>
        </div>

        {/* Landing Page Link */}
        <button
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.35rem', fontWeight: 600 }}
          onClick={() => setIsLandingPage(true)}
          title="View Landing Page"
        >
          <Sparkles size={14} style={{ color: 'var(--amber-500)' }} />
          <span style={{ display: window.innerWidth < 800 ? 'none' : 'inline' }}>Landing</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon notification-btn"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setShowNotifications(prev => !prev)}
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="notification-badge-dot" />
          </button>

          {showNotifications && (
            <div
              className="animate-modal-in"
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '320px',
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                zIndex: 200,
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-900)' }}>
                  Notifications ({notificationCount})
                </span>
                <button className="btn-icon" style={{ padding: '0.2rem' }} onClick={() => setShowNotifications(false)}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '0.5rem' }}>
                {lowStockAlerts.map(mat => (
                  <div
                    key={mat.id}
                    onClick={() => { setActiveView('materials'); setShowNotifications(false); }}
                    style={{
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--danger-light)',
                      marginBottom: '0.35rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--danger-dark)' }}>⚠️ Low Stock Alert</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {mat.name} has only {mat.remaining} {mat.unit} left at {mat.siteName}.
                    </div>
                  </div>
                ))}

                {activities.slice(0, 3).map(act => (
                  <div
                    key={act.id}
                    style={{
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '0.35rem',
                      fontSize: '0.8rem',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{act.text}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{act.time}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '0.6rem 1rem', background: 'var(--gray-50)', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => { setActiveView('notifications'); setShowNotifications(false); }}
                  style={{ fontSize: '0.78rem', color: 'var(--amber-700)', fontWeight: 700 }}
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile avatar dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            onClick={() => setShowUserDropdown(prev => !prev)}
          >
            <Avatar src={currentUser.avatar} name={currentUser.name} size="md" status="active" />
            <div style={{ display: window.innerWidth < 900 ? 'none' : 'block', textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {currentUser.role}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>

          {showUserDropdown && (
            <div
              className="animate-modal-in"
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '240px',
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                zIndex: 200,
                padding: '0.75rem'
              }}
            >
              <div style={{ paddingBottom: '0.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--navy-900)' }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.company}</div>
              </div>

              <button
                className="dropdown-item"
                onClick={() => { setActiveView('settings'); setShowUserDropdown(false); }}
              >
                Settings & Preferences
              </button>
              <button
                className="dropdown-item"
                onClick={() => { setIsLoginModalOpen(true); setShowUserDropdown(false); }}
              >
                Switch Account / Login
              </button>
              <button
                className="dropdown-item"
                onClick={() => { setIsLandingPage(true); setShowUserDropdown(false); }}
              >
                Landing Page Preview
              </button>
              <button
                className="dropdown-item"
                style={{ color: 'var(--danger)', fontWeight: 600 }}
                onClick={() => { logout(); setIsLoginModalOpen(true); setShowUserDropdown(false); }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
