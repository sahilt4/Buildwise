import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { AddSiteModal } from './AddSiteModal';
import { downloadSitesSummaryPDF } from '../../utils/pdfGenerator';
import {
  Building2,
  Plus,
  MapPin,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  HardHat,
  FileText
} from 'lucide-react';

export const SitesView = () => {
  const { sites, setActiveView, workers, materials, tasks, addToast } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDownloadSitesPDF = () => {
    try {
      downloadSitesSummaryPDF(sites, workers, tasks);
      addToast('✓ Sites Progress & Operations Summary PDF downloaded', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error generating Sites PDF', 'danger');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Active Construction Sites</h1>
          <p>Real-time site milestones, supervisor allocations, worker capacity, and budget expenditures.</p>
        </div>

        <div className="page-actions">
          <Button
            variant="secondary"
            icon={FileText}
            onClick={handleDownloadSitesPDF}
          >
            Download Sites PDF
          </Button>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Site
          </Button>
        </div>
      </div>

      {/* Sites Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {sites.map((site) => {
          const siteWorkers = workers.filter(w => w.siteId === site.id || w.siteName.includes(site.name.split(' ')[0]));
          const siteMaterials = materials.filter(m => m.siteId === site.id);
          const lowStockMats = siteMaterials.filter(m => m.status === 'Low Stock');

          return (
            <div key={site.id} className="bw-card bw-card--interactive" style={{ overflow: 'hidden', padding: 0 }}>
              {/* Site banner image */}
              <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={site.image}
                  alt={site.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.1) 60%)' }} />

                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <Badge variant={site.health === 'Good' ? 'success' : 'danger'}>
                    {site.health === 'Good' ? '🟢 On Schedule' : '🔴 Critical Attention'}
                  </Badge>
                </div>

                <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
                  <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800 }}>{site.name}</h3>
                  <div style={{ color: 'var(--amber-400)', fontSize: '0.8rem', fontWeight: 600 }}>{site.subName}</div>
                </div>
              </div>

              {/* Site Details Body */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <MapPin size={14} style={{ color: 'var(--amber-600)' }} />
                  <span>{site.location}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--navy-800)', fontSize: '0.85rem' }}>
                  <HardHat size={15} style={{ color: 'var(--navy-600)' }} />
                  <span>Supervisor: <strong>{site.supervisor}</strong></span>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Construction Completion</span>
                    <strong style={{ color: 'var(--navy-900)' }}>{site.progress}%</strong>
                  </div>
                  <ProgressBar progress={site.progress} variant="warning" thickness="thick" />
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: 'var(--gray-50)', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Crew</div>
                    <strong style={{ color: 'var(--navy-900)' }}>{site.workerCount || siteWorkers.length} Workers</strong>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Spent</div>
                    <strong style={{ color: 'var(--navy-900)' }}>{site.spent}</strong>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Budget</div>
                    <strong style={{ color: 'var(--navy-900)' }}>{site.totalBudget}</strong>
                  </div>
                </div>

                {lowStockMats.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--danger-dark)', background: 'var(--danger-light)', padding: '0.4rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
                    <AlertTriangle size={13} />
                    <span>{lowStockMats.length} material(s) low in stock!</span>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    style={{ flex: 1 }}
                    onClick={() => setActiveView('materials')}
                  >
                    View Materials
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    style={{ flex: 1 }}
                    onClick={() => setActiveView('tasks')}
                  >
                    View Tasks
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Site Modal */}
      <AddSiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
