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
    setIsLandingPage,
    logout,
    setIsLoginModalOpen
  } = useApp();

  const lowStockCount = materials.filter(m => m.status === 'Low Stock').length;
  const leftoverCount = leftovers.length;

  // Role-scoped navigation menus
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['builder', 'manager', 'engineer', 'worker'] },
    { id: 'sites', label: 'Sites', icon: Building2, roles: ['builder', 'manager', 'engineer'] },
    { id: 'materials', label: 'Materials', icon: Boxes, badge: lowStockCount ? `${lowStockCount} Low` : null, roles: ['builder', 'manager', 'engineer'] },
    { id: 'marketplace', label: 'Marketplace', icon: Store, badge: 'Resale', highlight: true, roles: ['builder', 'manager', 'engineer'] },
    { id: 'workers', label: 'Crew & Workers', icon: Users, roles: ['builder', 'manager', 'engineer'] },
    { id: 'attendance', label: userRole === 'worker' ? 'My Attendance' : 'Attendance', icon: ClipboardCheck, roles: ['builder', 'manager', 'engineer', 'worker'] },
    { id: 'tasks', label: userRole === 'worker' ? 'My Assigned Tasks' : 'Tasks & Operations', icon: ListTodo, roles: ['builder', 'manager', 'engineer', 'worker'] },
    { id: 'reports', label: 'Reports & Audits', icon: BarChart3, roles: ['builder', 'manager', 'engineer'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['builder', 'manager', 'engineer', 'worker'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['builder', 'manager', 'engineer'] },
  ];

  const currentNormalizedRole = userRole === 'engineer' ? 'manager' : userRole;
  const navItems = allNavItems.filter(item => item.roles.includes(currentNormalizedRole));

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
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(234, 88, 12, 0.05))',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--amber-600)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <Sparkles size={14} />
                <span>Recover Waste Value</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                {leftoverCount} surplus items available to list on Marketplace.
              </div>
            </div>
          )}
        </nav>

        {/* Bottom Profile & Role Preview */}
        <div className="sidebar-footer">
          <div
            className="user-profile-pill"
            onClick={() => setIsLoginModalOpen(true)}
            title="Click to Switch User / Sign In with another account"
          >
            <Avatar src={currentUser.avatar} name={currentUser.name} size="md" status="active" />
            <div className="user-profile-info">
              <div className="user-profile-name">{currentUser.name}</div>
              <div className="user-profile-role">{currentUser.role}</div>
            </div>
            <ArrowUpRight size={14} style={{ color: 'var(--gray-400)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              style={{ fontSize: '0.75rem', color: 'var(--amber-600)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
            >
              <Sparkles size={12} />
              Switch Role
            </button>

            <button
              onClick={() => {
                logout();
                setIsLoginModalOpen(true);
              }}
              style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              title="Logout current session"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
