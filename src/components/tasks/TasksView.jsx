import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
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
  MapPin
} from 'lucide-react';

export const TasksView = () => {
  const { tasks, sites, searchQuery } = useApp();
  const [selectedSite, setSelectedSite] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const columns = [
    { id: 'To Do', label: 'To Do', color: 'var(--gray-500)', bg: 'var(--gray-100)' },
    { id: 'In Progress', label: 'In Progress', color: 'var(--info-dark)', bg: 'var(--info-light)' },
    { id: 'Review', label: 'Review / Inspection', color: 'var(--warning-dark)', bg: 'var(--warning-light)' },
    { id: 'Completed', label: 'Completed', color: 'var(--success-dark)', bg: 'var(--success-light)' }
  ];

  const filteredTasks = tasks.filter((t) => {
    const matchesSite = selectedSite === 'All' || t.siteId === selectedSite;
    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;
    const matchesSearch = !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.siteName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSite && matchesPriority && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Site Tasks & Operations</h1>
          <p>Coordinate daily site activities, concrete pours, formwork, and trade inspections.</p>
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

      {/* Filter Row */}
      <div
        style={{
          background: 'var(--white)',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Site:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
            >
              <option value="All">All Sites</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Priority:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟠 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredTasks.length}</strong> active tasks
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="kanban-col">
              <div className="kanban-col-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                  <span>{col.label}</span>
                </div>
                <span className="kanban-count-pill">{colTasks.length}</span>
              </div>

              {colTasks.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--gray-300)' }}>
                  No tasks in {col.label}
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
