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
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const DashboardView = () => {
  const {
    sites,
    workers,
    materials,
    tasks,
    activities,
    currentUser,
    setActiveView
  } = useApp();

  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const presentCount = workers.filter(w => w.isCheckedIn).length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  const lowStockCount = materials.filter(m => m.status === 'Low Stock').length;

  return (
    <div className="animate-fade-in">
      {/* 1. Welcoming Hero & Quick Actions */}
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div className="page-header-text">
          <h1 style={{ fontSize: '1.75rem', letterSpacing: '-0.03em' }}>
            Good morning, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Here's what's happening across your active construction sites today.
          </p>
        </div>

        {/* 3 Prominent Quick Action Buttons */}
        <div className="page-actions">
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

      {/* 2. Key 4 KPI Stat Cards */}
      <div className="stat-grid">
        <StatCard
          label="Active Sites"
          value={`${sites.length} Sites`}
          trend="100% Operational"
          trendDirection="neutral"
          icon={Building2}
          iconTheme="blue"
          onClick={() => setActiveView('sites')}
        />

        <StatCard
          label="Workers On Site"
          value={`${presentCount} / ${workers.length}`}
          trend="87.5% Attendance"
          trendDirection="up"
          trendPositive={true}
          icon={Users}
          iconTheme="green"
          onClick={() => setActiveView('attendance')}
        />

        <StatCard
          label="Material Stock"
          value="12,450 kg"
          trend="↓ 8.2% from last week"
          trendDirection="down"
          trendPositive={true}
          icon={Boxes}
          iconTheme="amber"
          subtitle={lowStockCount ? `• ${lowStockCount} items need reorder` : undefined}
          onClick={() => setActiveView('materials')}
        />

        <StatCard
          label="Pending Tasks"
          value={`${pendingTasksCount} Tasks`}
          trend="4 High Priority"
          trendDirection="up"
          trendPositive={false}
          icon={ListTodo}
          iconTheme="purple"
          onClick={() => setActiveView('tasks')}
        />
      </div>

      {/* 3. Waste -> Value Differentiator Section */}
      <LeftoverSection onNavigateToMarketplace={() => setActiveView('marketplace')} />

      {/* 4. Charts Section (Material Usage & Attendance Donut) */}
      <div className="dashboard-grid-2">
        <MaterialUsageChart />
        <AttendanceDonut />
      </div>

      {/* 5. Sites Overview & Recent Activity Timeline */}
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
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--navy-900)' }}>{site.name}</strong>
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
            {activities.slice(0, 5).map((act) => (
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
