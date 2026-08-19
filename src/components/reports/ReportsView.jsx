import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { StatCard } from '../common/StatCard';
import { ProgressBar } from '../common/ProgressBar';
import {
  downloadMaterialAuditPDF,
  downloadSitesSummaryPDF,
  exportCSV
} from '../../utils/pdfGenerator';
import {
  BarChart3,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Sparkles,
  PieChart,
  Calendar,
  Building2,
  FileText
} from 'lucide-react';

export const ReportsView = () => {
  const { addToast, materials, leftovers, marketplace, sites, workers, tasks } = useApp();

  const handleDownloadMaterialAuditPDF = () => {
    try {
      downloadMaterialAuditPDF(materials, leftovers, marketplace);
      addToast('✓ Material Efficiency & Recovery Audit PDF downloaded to your device', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error generating Material Audit PDF', 'danger');
    }
  };

  const handleDownloadSitesSummaryPDF = () => {
    try {
      downloadSitesSummaryPDF(sites, workers, tasks);
      addToast('✓ Multi-Site Operations Summary PDF downloaded to your device', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error generating Site Summary PDF', 'danger');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Material Efficiency & Financial Reports</h1>
          <p>Audit site consumption ratios, leftover recovery dividends, and construction timelines.</p>
        </div>

        <div className="page-actions">
          <Button
            variant="secondary"
            icon={Building2}
            onClick={handleDownloadSitesSummaryPDF}
          >
            Download Sites Summary (PDF)
          </Button>

          <Button
            variant="primary"
            icon={FileText}
            onClick={handleDownloadMaterialAuditPDF}
          >
            Download Material Audit (PDF)
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard
          label="Value Recovered via Resale"
          value="₹1,85,400"
          trend="+34% vs last project"
          trendDirection="up"
          trendPositive={true}
          icon={DollarSign}
          iconTheme="green"
        />

        <StatCard
          label="Material Utilization Ratio"
          value="94.2%"
          trend="Target: >90%"
          trendDirection="up"
          trendPositive={true}
          icon={TrendingUp}
          iconTheme="blue"
        />

        <StatCard
          label="Site Waste Reduction"
          value="18.6%"
          trend="Zero-dump target"
          trendDirection="down"
          trendPositive={true}
          icon={Sparkles}
          iconTheme="amber"
        />

        <StatCard
          label="Contractor Wage Payout"
          value="₹8.42 Lakh"
          subtitle="96% on-time payouts"
          icon={BarChart3}
          iconTheme="purple"
        />
      </div>

      {/* Material Efficiency Breakdown Card (Exact requirement from prompt) */}
      <div className="bw-card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <PieChart size={18} style={{ color: 'var(--amber-600)' }} />
              Aggregate Material Efficiency Lifecycle
            </h3>
            <p className="card-subtitle">Complete breakdown across all procured structural and finishing supplies</p>
          </div>

          <span className="badge badge-success">94.2% Effective Yield</span>
        </div>

        {/* 4 Summary Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Purchased Materials
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-900)', margin: '0.25rem 0' }}>
              12,500 <small style={{ fontSize: '0.8rem', fontWeight: 500 }}>units</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% procured volume</div>
          </div>

          <div style={{ background: 'var(--success-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--success-border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--success-dark)', fontWeight: 600, textTransform: 'uppercase' }}>
              Used in Structure
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-dark)', margin: '0.25rem 0' }}>
              9,400 <small style={{ fontSize: '0.8rem', fontWeight: 500 }}>units</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--success-dark)' }}>75.2% installed into building</div>
          </div>

          <div style={{ background: 'var(--amber-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--amber-200)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--amber-800)', fontWeight: 600, textTransform: 'uppercase' }}>
              Recoverable Leftovers
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber-800)', margin: '0.25rem 0' }}>
              1,800 <small style={{ fontSize: '0.8rem', fontWeight: 500 }}>units</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--amber-800)' }}>14.4% listed for resale / reuse</div>
          </div>

          <div style={{ background: 'var(--danger-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger-border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--danger-dark)', fontWeight: 600, textTransform: 'uppercase' }}>
              Unrecoverable Waste
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger-dark)', margin: '0.25rem 0' }}>
              1,300 <small style={{ fontSize: '0.8rem', fontWeight: 500 }}>units</small>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--danger-dark)' }}>10.4% site debris / cutting scrap</div>
          </div>
        </div>

        {/* Stacked Visual Bar */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Lifecycle Volume Distribution:
          </div>
          <div style={{ height: '24px', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '75.2%', background: 'var(--success)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Used (75.2%)
            </div>
            <div style={{ width: '14.4%', background: 'var(--amber-500)', color: '#0f172a', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Leftover (14.4%)
            </div>
            <div style={{ width: '10.4%', background: 'var(--danger)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Waste (10.4%)
            </div>
          </div>
        </div>
      </div>

      {/* Cost Savings & Site Progress comparison */}
      <div className="dashboard-grid-equal">
        <div className="bw-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Sparkles size={18} style={{ color: 'var(--amber-600)' }} />
                Leftover Marketplace Cost Dividends
              </h3>
              <p className="card-subtitle">Capital recovered vs scrapped material losses</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <strong>Vitrified Ceramic Tiles</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>250 pieces sold to Sunrise Colony</div>
              </div>
              <strong style={{ color: 'var(--success-dark)', fontSize: '1rem' }}>+ ₹4,500</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <strong>TMT 500D Rebar Offcuts</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1.2 Tons purchased by Apex Constr.</div>
              </div>
              <strong style={{ color: 'var(--success-dark)', fontSize: '1rem' }}>+ ₹62,000</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0' }}>
              <div>
                <strong>Teakwood Door Frames (Surplus)</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>8 units sold to Shree Builders</div>
              </div>
              <strong style={{ color: 'var(--success-dark)', fontSize: '1rem' }}>+ ₹16,000</strong>
            </div>
          </div>
        </div>

        <div className="bw-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Building2 size={18} style={{ color: 'var(--amber-600)' }} />
                Site Completion Timeline Audit
              </h3>
              <p className="card-subtitle">Actual progress vs planned milestone targets</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <span>Sunrise Residency (Target: 65%)</span>
                <strong style={{ color: 'var(--success-dark)' }}>68% (+3% Ahead)</strong>
              </div>
              <ProgressBar progress={68} variant="success" thickness="thick" />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <span>Green Valley Commercial Hub (Target: 40%)</span>
                <strong style={{ color: 'var(--success-dark)' }}>42% (+2% Ahead)</strong>
              </div>
              <ProgressBar progress={42} variant="success" thickness="thick" />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <span>Metro Line Phase 2 Depot (Target: 90%)</span>
                <strong style={{ color: 'var(--danger)' }}>85% (-5% Behind)</strong>
              </div>
              <ProgressBar progress={85} variant="danger" thickness="thick" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
