import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { MaterialCard } from './MaterialCard';
import { LeftoverSection } from './LeftoverSection';
import { AddMaterialModal } from './AddMaterialModal';
import { RecordUsageModal } from './RecordUsageModal';
import { EmptyState } from '../common/EmptyState';
import { downloadMaterialAuditPDF } from '../../utils/pdfGenerator';
import {
  Plus,
  ClipboardList,
  Store,
  LayoutGrid,
  List,
  Filter,
  Search,
  AlertTriangle,
  Boxes,
  FileText
} from 'lucide-react';

export const MaterialsView = () => {
  const { materials, leftovers, marketplace, sites, setActiveView, searchQuery, addToast, undoStack, undoLastAction } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSite, setSelectedSite] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [selectedMaterialForUsage, setSelectedMaterialForUsage] = useState(null);

  const categories = ['All', 'Cement', 'Steel', 'Tiles', 'Plumbing', 'Electrical', 'Aggregates'];

  // Filter materials
  const filteredMaterials = materials.filter(m => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSite = selectedSite === 'All' || m.siteId === selectedSite;
    const matchesSearch = !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.siteName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSite && matchesSearch;
  });

  const handleOpenUsageModal = (mat) => {
    setSelectedMaterialForUsage(mat);
    setIsUsageModalOpen(true);
  };

  const handleDownloadInventoryPDF = () => {
    try {
      downloadMaterialAuditPDF(materials, leftovers, marketplace);
      addToast('✓ Construction Materials Stock & Recovery PDF downloaded', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error generating Inventory PDF', 'danger');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Material Stock & Inventory</h1>
          <p>Track site deliveries, monitor consumption rates, and eliminate material stockouts.</p>
        </div>

        <div className="page-actions">
          <Button
            variant="secondary"
            icon={FileText}
            onClick={handleDownloadInventoryPDF}
          >
            Download Stock PDF
          </Button>

          {undoStack.length > 0 && (
            <Button
              variant="secondary"
              onClick={undoLastAction}
              style={{ color: 'var(--amber-700)', borderColor: 'var(--amber-300)', backgroundColor: 'var(--amber-50)' }}
            >
              ↩ Undo Last Action
            </Button>
          )}

          <Button
            variant="secondary"
            icon={ClipboardList}
            onClick={() => { setSelectedMaterialForUsage(null); setIsUsageModalOpen(true); }}
          >
            Record Usage
          </Button>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Material
          </Button>
        </div>
      </div>

      {/* Differentiator: Leftovers Value Recovery Section */}
      <LeftoverSection onNavigateToMarketplace={() => setActiveView('marketplace')} />

      {/* Filter and View Mode Controls */}
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
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-dark' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Site Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="All">All Sites</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'var(--gray-100)', padding: '0.2rem', borderRadius: 'var(--radius-md)' }}>
            <button
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              style={{ background: viewMode === 'grid' ? 'var(--white)' : 'transparent', padding: '0.35rem' }}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
              style={{ background: viewMode === 'table' ? 'var(--white)' : 'transparent', padding: '0.35rem' }}
              onClick={() => setViewMode('table')}
              aria-label="Table view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Grid or Table */}
      {filteredMaterials.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No materials found"
          description="Try adjusting your category or site filter, or add a new material delivery."
          actionLabel="+ Add Material"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredMaterials.map((mat) => (
            <MaterialCard
              key={mat.id}
              material={mat}
              onRecordUsage={handleOpenUsageModal}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bw-table-container">
          <table className="bw-table">
            <thead>
              <tr>
                <th className="bw-th">Material Name</th>
                <th className="bw-th">Category</th>
                <th className="bw-th">Site</th>
                <th className="bw-th">Purchased</th>
                <th className="bw-th">Used</th>
                <th className="bw-th">Remaining</th>
                <th className="bw-th">Status</th>
                <th className="bw-th" style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((mat) => {
                const isLow = mat.remaining <= mat.threshold;
                const percent = Math.round((mat.used / mat.purchased) * 100);
                return (
                  <tr key={mat.id}>
                    <td className="bw-td">
                      <strong style={{ color: 'var(--navy-900)' }}>{mat.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated {mat.lastUpdated}</div>
                    </td>
                    <td className="bw-td">
                      <span className="badge badge-neutral">{mat.category}</span>
                    </td>
                    <td className="bw-td">{mat.siteName}</td>
                    <td className="bw-td">{mat.purchased} {mat.unit}</td>
                    <td className="bw-td">
                      <div>{mat.used} {mat.unit}</div>
                      <div style={{ width: '80px', marginTop: '4px' }}>
                        <ProgressBar progress={percent} variant={percent >= 80 ? 'danger' : 'warning'} thickness="thin" />
                      </div>
                    </td>
                    <td className="bw-td">
                      <strong style={{ color: isLow ? 'var(--danger)' : 'var(--navy-900)' }}>
                        {mat.remaining} {mat.unit}
                      </strong>
                    </td>
                    <td className="bw-td">
                      <Badge variant={isLow ? 'danger' : 'success'}>
                        {isLow ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </td>
                    <td className="bw-td" style={{ textAlign: 'right' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenUsageModal(mat)}
                      >
                        Record
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <AddMaterialModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <RecordUsageModal
        isOpen={isUsageModalOpen}
        onClose={() => setIsUsageModalOpen(false)}
        selectedMaterial={selectedMaterialForUsage}
      />
    </div>
  );
};
