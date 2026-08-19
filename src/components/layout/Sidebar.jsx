import React from 'react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import {
  LayoutDashboard,
  Building2,
  Boxes,
  Store,
  Users,
  ClipboardCheck,
  ListTodo,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  LogOut,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    userRole,
    setUserRole,
    marketplace,
    materials,
    leftovers,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsLandingPage
  } = useApp();

  const lowStockCount = materials.filter(m => m.status === 'Low Stock').length;
  const leftoverCount = leftovers.length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sites', label: 'Sites', icon: Building2 },
    { id: 'materials', label: 'Materials', icon: Boxes, badge: lowStockCount ? `${lowStockCount} Low` : null },
    { id: 'marketplace', label: 'Marketplace', icon: Store, badge: 'Resale', highlight: true },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Top Logo */}
        <div className="sidebar-header" onClick={() => handleNavClick('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="sidebar-logo-icon">
            <Layers size={20} />
          </div>
          <div className="sidebar-brand">
            <div className="sidebar-brand-name">Buildwise</div>
            <div className="sidebar-brand-tagline">Build Smarter. Waste Less.</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <div
                key={item.id}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`sidebar-link-badge ${item.highlight ? 'highlight' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}

          {/* Value Recovery Callout Box in Sidebar */}
          {leftoverCount > 0 && (
            <div
              onClick={() => handleNavClick('materials')}
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.08))',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--amber-400)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <Sparkles size={14} />
                <span>Recover Waste Value</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-300)', lineHeight: 1.3 }}>
                {leftoverCount} surplus items available to list on Marketplace.
              </div>
            </div>
          )}
        </nav>

        {/* Bottom Profile & Role Preview */}
        <div className="sidebar-footer">
          <div
            className="user-profile-pill"
            onClick={() => {
              // Cycle through roles on avatar click for ease of testing
              const roles = ['builder', 'engineer', 'worker'];
              const nextRole = roles[(roles.indexOf(userRole) + 1) % roles.length];
              setUserRole(nextRole);
            }}
            title="Click to quickly switch role (Builder / Engineer / Worker)"
          >
            <Avatar src={currentUser.avatar} name={currentUser.name} size="md" status="active" />
            <div className="user-profile-info">
              <div className="user-profile-name">{currentUser.name}</div>
              <div className="user-profile-role">{currentUser.role}</div>
            </div>
            <ArrowUpRight size={14} style={{ color: 'var(--gray-400)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setIsLandingPage(true)}
              style={{ fontSize: '0.75rem', color: 'var(--amber-400)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
            >
              <Sparkles size={12} />
              Landing Page
            </button>

            <button
              onClick={() => setIsLandingPage(true)}
              style={{ fontSize: '0.75rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <LogOut size={12} />
              Exit
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
