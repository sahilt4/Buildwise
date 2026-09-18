import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Avatar } from '../common/Avatar';
import { MapPin, Calendar, CheckSquare, Clock, ArrowRight, AlertCircle } from 'lucide-react';

export const TaskCard = ({ task }) => {
  const { updateTaskStatus, workers, tasks } = useApp();
  const worker = workers.find(w => w.id === task.workerId) || { name: task.workerName, avatar: null };

  const priorityVariant = task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'neutral';
  const statusVariant = {
    'To Do': 'neutral',
    'In Progress': 'info',
    'Review': 'warning',
    'Completed': 'success'
  }[task.status] || 'neutral';

  const nextStatus = {
    'To Do': 'In Progress',
    'In Progress': 'Review',
    'Review': 'Completed',
    'Completed': 'To Do'
  }[task.status];

  // DAG Prerequisite Check for UI
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
    <div className="bw-card bw-card--interactive" style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--navy-900)', lineHeight: 1.3 }}>
          {task.title}
        </h4>
        <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
          <Badge variant={statusVariant}>
            {task.status}
          </Badge>
          <Badge variant={priorityVariant}>
            {task.priority}
          </Badge>
        </div>
      </div>

      {task.description && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
          {task.description}
        </p>
      )}
      
      {isBlocked && (
        <div style={{ fontSize: '0.72rem', color: 'var(--danger-dark)', background: 'var(--danger-light)', padding: '0.35rem 0.5rem', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertCircle size={12} />
          [!] BLOCKED BY: {prereqTaskName}
        </div>
      )}

      {/* Assignee & Location */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Avatar src={worker.avatar} name={worker.name} size="sm" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy-800)' }}>
            {task.workerName}
          </span>
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <MapPin size={11} /> {task.siteName.split(' ')[0]}
        </div>
      </div>

      {/* Progress & Due Date */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--text-muted)' }}>Progress</span>
          <span style={{ color: 'var(--navy-900)' }}>{task.progress}%</span>
        </div>
        <ProgressBar
          progress={task.progress}
          variant={task.progress === 100 ? 'success' : task.progress >= 50 ? 'warning' : 'info'}
          thickness="thin"
        />
      </div>

      {/* Footer controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Calendar size={12} /> Due: <strong>{task.dueDate}</strong>
        </span>

        <button
          onClick={() => updateTaskStatus(task.id, nextStatus)}
          disabled={isBlocked}
          style={{
            color: isBlocked ? 'var(--gray-500)' : 'var(--amber-700)',
            fontWeight: 700,
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            background: isBlocked ? 'var(--gray-200)' : 'var(--amber-50)',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${isBlocked ? 'var(--gray-300)' : 'var(--amber-200)'}`,
            cursor: isBlocked ? 'not-allowed' : 'pointer'
          }}
        >
          <span>→ {nextStatus}</span>
        </button>
      </div>
    </div>
  );
};
