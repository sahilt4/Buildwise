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
  ExternalLink,
  Sparkles
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
    setIsLandingPage
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
      lowStockHeap.add({ ...m, ratio: 0 }); // Fallback
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
        >
          <Menu size={22} />
        </button>

        <div className="breadcrumbs">
          <span style={{ color: 'var(--text-muted)' }}>Buildwise</span>
          <span>/</span>
          <span className="current">{viewTitles[activeView] || 'Overview'}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Global Search */}
        <div className="search-input-wrapper" style={{ width: '220px', display: window.innerWidth < 640 ? 'none' : 'flex' }}>
          <Search size={15} />
          <input
            type="text"
            className="form-input"
            style={{ padding: '0.45rem 0.75rem 0.45rem 2.2rem', fontSize: '0.82rem' }}
            placeholder="Search materials, sites, crew..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Role Switcher Pill Bar */}
        <div className="role-switcher-container" title="Switch user perspective to preview role experiences">
          <button
            className={`role-tab-btn ${userRole === 'builder' ? 'active' : ''}`}
            onClick={() => setUserRole('builder')}
          >
            <Briefcase size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Builder
          </button>
          <button
            className={`role-tab-btn ${userRole === 'engineer' ? 'active' : ''}`}
            onClick={() => setUserRole('engineer')}
          >
            <HardHat size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Engineer
          </button>
          <button
            className={`role-tab-btn ${userRole === 'worker' ? 'active' : ''}`}
            onClick={() => setUserRole('worker')}
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
          <Sparkles size={14} style={{ color: 'var(--amber-600)' }} />
          <span style={{ display: window.innerWidth < 800 ? 'none' : 'inline' }}>Landing Page</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon notification-btn"
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
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-900)', lineHeight: 1.1 }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {currentUser.role}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--gray-400)' }} />
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
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-900)' }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentUser.company}</div>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Switch Perspective:
              </div>

              <button
                className={`sidebar-link ${userRole === 'builder' ? 'active' : ''}`}
                style={{ color: 'var(--text-primary)', padding: '0.45rem 0.5rem', width: '100%' }}
                onClick={() => { setUserRole('builder'); setShowUserDropdown(false); }}
              >
                <Briefcase size={16} />
                <span>Rajesh (Builder)</span>
              </button>

              <button
                className={`sidebar-link ${userRole === 'engineer' ? 'active' : ''}`}
                style={{ color: 'var(--text-primary)', padding: '0.45rem 0.5rem', width: '100%' }}
                onClick={() => { setUserRole('engineer'); setShowUserDropdown(false); }}
              >
                <HardHat size={16} />
                <span>Suresh (Site Eng.)</span>
              </button>

              <button
                className={`sidebar-link ${userRole === 'worker' ? 'active' : ''}`}
                style={{ color: 'var(--text-primary)', padding: '0.45rem 0.5rem', width: '100%' }}
                onClick={() => { setUserRole('worker'); setShowUserDropdown(false); }}
              >
                <UserCheck size={16} />
                <span>Amit (Mason Worker)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
