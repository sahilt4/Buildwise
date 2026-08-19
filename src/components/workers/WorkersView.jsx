import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { StatCard } from '../common/StatCard';
import { EmptyState } from '../common/EmptyState';
import { WorkerCard } from './WorkerCard';
import { AddWorkerModal } from './AddWorkerModal';
import { WorkerProfileModal } from './WorkerProfileModal';
import {
  Users,
  UserPlus,
  CheckCircle,
  MapPin,
  Search,
  Filter,
  DollarSign,
  TrendingUp
} from 'lucide-react';

export const WorkersView = () => {
  const { workers, sites, searchQuery } = useApp();
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [selectedSite, setSelectedSite] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedWorkerProfile, setSelectedWorkerProfile] = useState(null);

  const trades = ['All', 'Masonry', 'Steel', 'Carpentry', 'Electrical', 'Plumbing', 'Labor'];

  const filteredWorkers = workers.filter((w) => {
    const matchesTrade = selectedTrade === 'All' || w.category === selectedTrade;
    const matchesSite = selectedSite === 'All' || w.siteId === selectedSite;
    const matchesSearch = !searchQuery ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.siteName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrade && matchesSite && matchesSearch;
  });

  const presentCount = workers.filter(w => w.isCheckedIn).length;
  const avgAttendance = Math.round(workers.reduce((acc, w) => acc + (w.attendanceRate || 0), 0) / (workers.length || 1));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Workforce & Crew Management</h1>
          <p>Supervise tradesmen across sites, verify attendance, and ensure task allocation.</p>
        </div>

        <div className="page-actions">
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Worker
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="stat-grid">
        <StatCard
          label="Total Crew Members"
          value={`${workers.length} Workers`}
          trend="+4 this month"
          trendDirection="up"
          trendPositive={true}
          icon={Users}
          iconTheme="blue"
        />

        <StatCard
          label="Present on Site Today"
          value={`${presentCount} / ${workers.length}`}
          trend="87.5% attendance"
          trendDirection="up"
          trendPositive={true}
          icon={CheckCircle}
          iconTheme="green"
        />

        <StatCard
          label="Avg. Monthly Attendance"
          value={`${avgAttendance}%`}
          trend="Industry avg: 78%"
          trendDirection="up"
          trendPositive={true}
          icon={TrendingUp}
          iconTheme="amber"
        />

        <StatCard
          label="Daily Wage Roll"
          value="₹4,250"
          subtitle="Across active sites"
          icon={DollarSign}
          iconTheme="purple"
        />
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: 'var(--white)',
          padding: '1rem',
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
        {/* Trade Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {trades.map((trade) => (
            <button
              key={trade}
              onClick={() => setSelectedTrade(trade)}
              className={`btn btn-sm ${selectedTrade === trade ? 'btn-dark' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {trade}
            </button>
          ))}
        </div>

        {/* Site Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="All">All Sites</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Worker Card Grid */}
      {filteredWorkers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No workers found"
          description="No crew members match your current filters. Try changing your trade or site filters."
          actionLabel="+ Add Worker"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="worker-grid">
          {filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onViewProfile={(w) => setSelectedWorkerProfile(w)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddWorkerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <WorkerProfileModal
        isOpen={Boolean(selectedWorkerProfile)}
        onClose={() => setSelectedWorkerProfile(null)}
        worker={selectedWorkerProfile}
      />
    </div>
  );
};
