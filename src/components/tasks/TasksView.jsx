import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Avatar } from '../common/Avatar';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import { EmptyState } from '../common/EmptyState';
import {
  ListTodo,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  LayoutGrid,
  List,
  ArrowRight,
  ShieldCheck,
  Lock,
  Sparkles
} from 'lucide-react';

export const TasksView = () => {
  const { tasks, sites, workers, searchQuery, updateTaskStatus } = useApp();
  const [selectedSite, setSelectedSite] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Status options
  const statusOptions = ['All', 'To Do', 'In Progress', 'Review', 'Completed'];

  // Metrics
  const totalCount = tasks.length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const reviewCount = tasks.filter(t => t.status === 'Review').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const blockedCount = tasks.filter(t => {
    if (!t.prerequisiteId || t.status === 'Completed') return false;
    const prereq = tasks.find(p => p.id === t.prerequisiteId);
    return prereq && prereq.status !== 'Completed';
  }).length;

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSite = selectedSite === 'All' || t.siteId === selectedSite;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;
    const matchesSearch = !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSite && matchesStatus && matchesPriority && matchesSearch;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Review': return 'warning';
      default: return 'neutral';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'To Do': return 'In Progress';
      case 'In Progress': return 'Review';
      case 'Review': return 'Completed';
      case 'Completed': return 'To Do';
      default: return 'In Progress';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Site Tasks & Work Allocation</h1>
          <p>Assign daily milestones, coordinate trade contractors, monitor stage progress, and enforce dependencies.</p>
        </div>

        <div className="page-actions">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div className="bw-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Tasks</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: '0.2rem' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Across active sites</div>
        </div>

        <div className="bw-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--info-dark)' }}>In Progress</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--info-dark)', marginTop: '0.2rem' }}>
            {inProgressCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Active on site</div>
        </div>

        <div className="bw-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--warning-dark)' }}>Review / Inspection</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--warning-dark)', marginTop: '0.2rem' }}>
            {reviewCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Engineer sign-off</div>
        </div>

        <div className="bw-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success-dark)' }}>Completed</div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--success-dark)', marginTop: '0.2rem' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {Math.round((completedCount / (totalCount || 1)) * 100)}% completion rate
          </div>
        </div>

        {blockedCount > 0 && (
          <div className="bw-card" style={{ padding: '1rem', borderLeft: '3px solid var(--danger)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger-dark)' }}>Blocked (DAG)</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--danger-dark)', marginTop: '0.2rem' }}>
              {blockedCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Waiting on prereq</div>
          </div>
        )}
      </div>

      {/* Filter and View Control Bar */}
      <div
        style={{
          background: 'var(--white)',
          padding: '0.85rem 1.15rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {statusOptions.map((st) => {
            const isSelected = selectedStatus === st;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`btn btn-sm ${isSelected ? 'btn-dark' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                {st}
                {st !== 'All' && (
                  <span style={{ marginLeft: '0.35rem', opacity: 0.75, fontSize: '0.72rem' }}>
                    ({tasks.filter(t => t.status === st).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Site, Priority & View Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Site Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.65rem', fontSize: '0.82rem' }}
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="All">All Sites</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          {/* Priority Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.65rem', fontSize: '0.82rem' }}
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">🔴 High Priority</option>
            <option value="Medium">🟠 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'var(--gray-100)', padding: '0.2rem', borderRadius: 'var(--radius-md)' }}>
            <button
              className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
              style={{ background: viewMode === 'table' ? 'var(--white)' : 'transparent', padding: '0.35rem', cursor: 'pointer' }}
              onClick={() => setViewMode('table')}
              title="Table View"
              aria-label="Table View"
            >
              <List size={16} />
            </button>
            <button
              className={`btn-icon ${viewMode === 'cards' ? 'active' : ''}`}
              style={{ background: viewMode === 'cards' ? 'var(--white)' : 'transparent', padding: '0.35rem', cursor: 'pointer' }}
              onClick={() => setViewMode('cards')}
              title="Cards View"
              aria-label="Cards View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No Tasks Found"
          description="No site tasks match the selected filters. Try changing your site or status selection."
          actionText="Clear Filters"
          onAction={() => {
            setSelectedSite('All');
            setSelectedStatus('All');
            setSelectedPriority('All');
          }}
        />
      ) : viewMode === 'table' ? (
        <div className="table-responsive bw-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="bw-table">
            <thead>
              <tr>
                <th className="bw-th">Task & Details</th>
                <th className="bw-th">Site</th>
                <th className="bw-th">Assigned Worker</th>
                <th className="bw-th">Due Date</th>
                <th className="bw-th">Priority</th>
                <th className="bw-th">Progress</th>
                <th className="bw-th">Status</th>
                <th className="bw-th" style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const worker = workers.find(w => w.id === task.workerId) || { name: task.workerName, trade: 'Tradesman' };
                const priorityVariant = task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'neutral';
                const statusVariant = getStatusBadgeVariant(task.status);
                const nextStatus = getNextStatus(task.status);

                // DAG Prerequisite Check
                let isBlocked = false;
                let prereqTaskName = '';
                if (task.prerequisiteId && task.status === 'To Do') {
                  const prereqTask = tasks.find(t => t.id === task.prerequisiteId);
                  if (prereqTask && prereqTask.status !== 'Completed') {
                    isBlocked = true;
                    prereqTaskName = prereqTask.title;
                  }
                }

                return (
                  <tr key={task.id}>
                    <td className="bw-td" style={{ minWidth: '220px' }}>
                      <strong style={{ color: 'var(--navy-900)', fontSize: '0.92rem' }}>
                        {task.title}
                      </strong>
                      {task.description && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>
                          {task.description}
                        </div>
                      )}
                      {isBlocked && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--danger-dark)', background: 'var(--danger-light)', padding: '0.2rem 0.45rem', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem' }}>
                          <AlertCircle size={12} />
                          Blocked by: {prereqTaskName}
                        </div>
                      )}
                    </td>

                    <td className="bw-td" style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                        <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{task.siteName}</span>
                      </div>
                    </td>

                    <td className="bw-td" style={{ minWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Avatar src={worker.avatar} name={worker.name} size="sm" />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                            {task.workerName}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {worker.trade}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="bw-td" style={{ whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{task.dueDate}</span>
                      </div>
                    </td>

                    <td className="bw-td">
                      <Badge variant={priorityVariant}>
                        {task.priority}
                      </Badge>
                    </td>

                    <td className="bw-td" style={{ minWidth: '120px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 600 }}>{task.progress}%</span>
                      </div>
                      <ProgressBar
                        progress={task.progress}
                        variant={task.progress === 100 ? 'success' : task.progress >= 50 ? 'warning' : 'info'}
                        thickness="thin"
                      />
                    </td>

                    <td className="bw-td">
                      <Badge variant={statusVariant}>
                        {task.status}
                      </Badge>
                    </td>

                    <td className="bw-td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => updateTaskStatus(task.id, nextStatus)}
                        disabled={isBlocked}
                        className="btn btn-sm"
                        style={{
                          background: isBlocked ? 'var(--gray-200)' : 'var(--amber-50)',
                          color: isBlocked ? 'var(--gray-500)' : 'var(--amber-800)',
                          border: `1px solid ${isBlocked ? 'var(--gray-300)' : 'var(--amber-300)'}`,
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          cursor: isBlocked ? 'not-allowed' : 'pointer'
                        }}
                        title={isBlocked ? `Complete prerequisite (${prereqTaskName}) first` : `Advance to ${nextStatus}`}
                      >
                        {isBlocked ? 'Locked (Prereq)' : `→ ${nextStatus}`}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View */
        <div className="tasks-cards-grid">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
