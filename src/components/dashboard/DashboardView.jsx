import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { LeftoverSection } from '../materials/LeftoverSection';
import { MaterialUsageChart } from './MaterialUsageChart';
import { AttendanceDonut } from './AttendanceDonut';
import { AddMaterialModal } from '../materials/AddMaterialModal';
import { AddWorkerModal } from '../workers/AddWorkerModal';
import { CreateTaskModal } from '../tasks/CreateTaskModal';
import {
  Building2,
  Users,
  Boxes,
  ListTodo,
  ArrowUpRight,
  Clock,
  Sparkles,
  Activity,
  HardHat,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export const DashboardView = () => {
  const {
    sites,
    workers,
    materials,
    tasks,
    activities,
    leftovers,
    currentUser,
    userRole,
    setActiveView,
    isLoading,
    isBackendConnected,
    refreshData
  } = useApp();

  const isManager = userRole === 'manager' || userRole === 'engineer';
  const roleTitle = isManager ? 'Site Manager Operations Portal' : 'Builder Executive Portfolio';

  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const presentCount = workers.filter(w => w.isCheckedIn).length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  const lowStockCount = materials.filter(m => m.status === 'Low Stock').length;
  const totalRecoverableValue = leftovers.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  return (
    <div className="animate-fade-in">
      {/* 1. Welcoming Hero & Quick Actions */}
      <div className="page-header">
        <div className="page-header-text">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--amber-700)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
            {isManager ? <HardHat size={15} /> : <Briefcase size={15} />}
            <span>{roleTitle}</span>
          </div>
          <h1>Good morning, {(currentUser?.name || 'User').split(' ')[0]} 👋</h1>
          <p>
            {isManager 
              ? 'Site supervisor dispatch, worker check-ins, and active materials telemetry.'
              : 'Portfolio-level oversight, capital budgets, workforce telemetry, and surplus recovery.'
            }
            {isBackendConnected ? (
              <span style={{ marginLeft: '8px', color: 'var(--success-dark)', fontWeight: 600, fontSize: '0.8rem' }}>
                • Connected to MongoDB Atlas Cloud
              </span>
            ) : (
              <span style={{ marginLeft: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                • Local Telemetry Store Active
              </span>
            )}
          </p>
        </div>

        {/* 3 Prominent Quick Action Buttons */}
        <div className="page-actions">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={() => refreshData()}
            title="Sync latest cloud database state"
          >
            Sync
          </Button>

          <Button
            variant="secondary"
            icon={Boxes}
            onClick={() => setIsAddMaterialOpen(true)}
          >
            + Add Material
          </Button>

          <Button
            variant="secondary"
            icon={Users}
            onClick={() => setIsAddWorkerOpen(true)}
          >
            + Add Worker
          </Button>

          <Button
            variant="primary"
            icon={ListTodo}
            onClick={() => setIsCreateTaskOpen(true)}
          >
            + Create Task
          </Button>
        </div>
      </div>

      {/* 2. Modern Dark Executive Summary Panel (Inspired by attached reference images) */}
      <div className="dash-hero-panel animate-fade-in">
        <div className="dash-hero-top">
          <div className="dash-hero-title">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.15)', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', color: 'var(--amber-400)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              <Sparkles size={12} />
              Buildwise Executive Telemetry
            </div>
            <h2>Portfolio Operations Overview</h2>
            <p>
              {sites.length} active construction sites • {workers.length} crew deployed • {presentCount} verified on site today
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Surplus Recovery Value
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--amber-400)' }}>
                ₹{totalRecoverableValue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Dark Hero Operational KPI Cards */}
        <div className="dash-hero-stats">
          <div className="dash-hero-stat-card" onClick={() => setActiveView('sites')} style={{ cursor: 'pointer' }}>
            <div className="dash-hero-stat-label">Active Projects</div>
            <div className="dash-hero-stat-value">{sites.length} Sites</div>
            <div className="dash-hero-stat-sub">
              <span style={{ color: 'var(--success)' }}>100% Operational</span> • Nashik, Pune & Mumbai
            </div>
          </div>

          <div className="dash-hero-stat-card" onClick={() => setActiveView('attendance')} style={{ cursor: 'pointer' }}>
            <div className="dash-hero-stat-label">Daily Muster Rate</div>
            <div className="dash-hero-stat-value">
              {Math.round((presentCount / (workers.length || 1)) * 100)}%
            </div>
            <div className="dash-hero-stat-sub">
              <span style={{ color: 'var(--success)' }}>{presentCount} Present</span> / {workers.length} Total crew
            </div>
          </div>

          <div className="dash-hero-stat-card" onClick={() => setActiveView('materials')} style={{ cursor: 'pointer' }}>
            <div className="dash-hero-stat-label">Inventory Health</div>
            <div className="dash-hero-stat-value">
              {lowStockCount > 0 ? `${lowStockCount} Low` : 'Optimal'}
            </div>
            <div className="dash-hero-stat-sub">
              {lowStockCount > 0 ? (
                <span style={{ color: 'var(--danger)' }}>Requires reorder buffer</span>
              ) : (
                <span style={{ color: 'var(--success)' }}>All materials buffer safe</span>
              )}
            </div>
          </div>

          <div className="dash-hero-stat-card" onClick={() => setActiveView('tasks')} style={{ cursor: 'pointer' }}>
            <div className="dash-hero-stat-label">Milestone Progress</div>
            <div className="dash-hero-stat-value">{pendingTasksCount} Tasks</div>
            <div className="dash-hero-stat-sub">
              <span style={{ color: 'var(--info)' }}>DAG prerequisite locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Refined Stat Cards Grid */}
      <div className="stat-grid">
        <StatCard
          label="Active Construction Sites"
          value={`${sites.length} Sites`}
          trend="100% Operational"
          trendDirection="neutral"
          icon={Building2}
          iconTheme="blue"
          onClick={() => setActiveView('sites')}
        />

        <StatCard
          label="Workers Verified On Site"
          value={`${presentCount} / ${workers.length}`}
          trend={`${Math.round((presentCount / (workers.length || 1)) * 100)}% Attendance`}
          trendDirection="up"
          trendPositive={true}
          icon={Users}
          iconTheme="green"
          onClick={() => setActiveView('attendance')}
        />

        <StatCard
          label="Materials Monitored"
          value={`${materials.length} SKUs`}
          trend={lowStockCount ? `⚠️ ${lowStockCount} items low stock` : 'Buffers Healthy'}
          trendDirection={lowStockCount ? 'down' : 'up'}
          trendPositive={!lowStockCount}
          icon={Boxes}
          iconTheme="amber"
          subtitle={lowStockCount ? `${lowStockCount} items need reorder` : undefined}
          onClick={() => setActiveView('materials')}
        />

        <StatCard
          label="Active Operations Tasks"
          value={`${pendingTasksCount} Tasks`}
          trend="Milestones on track"
          trendDirection="neutral"
          icon={ListTodo}
          iconTheme="purple"
          onClick={() => setActiveView('tasks')}
        />
      </div>

      {/* 4. Waste -> Value Differentiator Section */}
      <LeftoverSection onNavigateToMarketplace={() => setActiveView('marketplace')} />

      {/* 5. Charts Section (Material Usage & Attendance Donut) */}
      <div className="dashboard-grid-2">
        <MaterialUsageChart />
        <AttendanceDonut />
      </div>

      {/* 6. Sites Overview & Recent Activity Timeline */}
      <div className="dashboard-grid-equal">
        {/* Sites Overview */}
        <div className="bw-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Building2 size={18} style={{ color: 'var(--amber-600)' }} />
                Sites Overview
              </h3>
              <p className="card-subtitle">Milestones & supervisor tracking</p>
            </div>

            <button
              onClick={() => setActiveView('sites')}
              style={{ fontSize: '0.78rem', color: 'var(--amber-700)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              All Sites <ArrowUpRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {sites.map((site) => (
              <div
                key={site.id}
                style={{
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.95rem',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--navy-900)' }}>{site.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{site.supervisor}</div>
                  </div>
                  <Badge variant={site.health === 'Good' ? 'success' : 'danger'}>
                    {site.progress}% Complete
                  </Badge>
                </div>

                <ProgressBar progress={site.progress} variant="warning" thickness="thin" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="bw-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Clock size={18} style={{ color: 'var(--amber-600)' }} />
                Recent Site Activity
              </h3>
              <p className="card-subtitle">Real-time log across materials, crew, & resale</p>
            </div>

            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Live Feed</span>
          </div>

          <div className="timeline">
            {activities.slice(0, 6).map((act) => (
              <div key={act.id} className="timeline-item">
                <div className={`timeline-dot ${act.statusClass}`} />
                <span className="timeline-text">{act.text}</span>
                <span className="timeline-time">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddMaterialModal
        isOpen={isAddMaterialOpen}
        onClose={() => setIsAddMaterialOpen(false)}
      />

      <AddWorkerModal
        isOpen={isAddWorkerOpen}
        onClose={() => setIsAddWorkerOpen(false)}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />
    </div>
  );
};
