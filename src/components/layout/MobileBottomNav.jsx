import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ListTodo,
  ClipboardCheck,
  Boxes,
  Store
} from 'lucide-react';

export const MobileBottomNav = () => {
  const { activeView, setActiveView } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
    { id: 'materials', label: 'Materials', icon: Boxes },
    { id: 'marketplace', label: 'Market', icon: Store }
  ];

  return (
    <div className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <div
            key={item.id}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};
