import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { SitesView } from './components/sites/SitesView';
import { MaterialsView } from './components/materials/MaterialsView';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { WorkersView } from './components/workers/WorkersView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { TasksView } from './components/tasks/TasksView';
import { ReportsView } from './components/reports/ReportsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';
import { WorkerPortalView } from './components/worker-portal/WorkerPortalView';
import { LandingPageView } from './components/landing/LandingPageView';

const AppContent = () => {
  const { activeView, userRole, isLandingPage } = useApp();

  if (isLandingPage) {
    return (
      <>
        <LandingPageView />
        <ToastContainer />
      </>
    );
  }

  // Render view router
  const renderCurrentView = () => {
    // If worker role is selected and viewing Dashboard, give the streamlined Worker Mobile Portal
    if (userRole === 'worker' && activeView === 'dashboard') {
      return <WorkerPortalView />;
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'sites':
        return <SitesView />;
      case 'materials':
        return <MaterialsView />;
      case 'marketplace':
        return <MarketplaceView />;
      case 'workers':
        return <WorkersView />;
      case 'attendance':
        return userRole === 'worker' ? <WorkerPortalView /> : <AttendanceView />;
      case 'tasks':
        return <TasksView />;
      case 'reports':
        return <ReportsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <TopNav />
        <main className="page-content">
          {renderCurrentView()}
        </main>
      </div>
      <MobileBottomNav />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
