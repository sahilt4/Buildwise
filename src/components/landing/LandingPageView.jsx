import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  Boxes,
  Users,
  ClipboardCheck,
  Store,
  ListTodo,
  BarChart3,
  ShieldCheck,
  HardHat,
  Briefcase,
  UserCheck,
  DollarSign
} from 'lucide-react';

export const LandingPageView = () => {
  const { setIsLandingPage, setUserRole, setActiveView } = useApp();

  const handleLaunchApp = (role = 'builder') => {
    setUserRole(role);
    setActiveView(role === 'worker' ? 'attendance' : 'dashboard');
    setIsLandingPage(false);
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* Top Navbar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          maxWidth: '1280px',
          margin: '0 auto',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="sidebar-logo-icon">
            <Layers size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em' }}>
              Buildwise
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--amber-700)', fontWeight: 700, textTransform: 'uppercase' }}>
              Build Smarter. Waste Less.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => handleLaunchApp('worker')}
            style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}
          >
            Worker App
          </button>

          <Button
            variant="primary"
            iconRight={ArrowRight}
            onClick={() => handleLaunchApp('builder')}
          >
            Open Dashboard
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero animate-fade-in">
        <div className="landing-tagline-pill">
          <Sparkles size={14} /> Modern Construction SaaS & Resale Platform
        </div>

        <h1 className="landing-h1">
          Build Smarter.<br />
          <span>Waste Less.</span>
        </h1>

        <p className="landing-subtext">
          One simple platform to manage construction materials, site workers, and daily tasks — while turning leftover surplus into immediate cash flow.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="lg"
            iconRight={ArrowRight}
            onClick={() => handleLaunchApp('builder')}
          >
            Get Started Free
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleLaunchApp('builder')}
          >
            Explore Live Demo
          </Button>
        </div>

        {/* Polished Interactive Dashboard Mockup Preview */}
        <div className="landing-preview-frame">
          {/* Mockup Header bar */}
          <div style={{ background: '#0f172a', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginLeft: '0.5rem' }}>app.buildwise.io / dashboard</span>
            </div>
            <span style={{ color: 'var(--amber-400)', fontSize: '0.75rem', fontWeight: 700 }}>Live Interactive Preview</span>
          </div>

          {/* Mockup Body Content */}
          <div style={{ padding: '1.5rem', background: '#f8fafc', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Sites</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-900)' }}>3 Sites</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--success-dark)', fontWeight: 600 }}>100% Operational</div>
              </div>
              <div style={{ background: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Workers On-Site</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-900)' }}>42 / 48</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--success-dark)', fontWeight: 600 }}>87.5% Attendance</div>
              </div>
              <div style={{ background: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Leftover Value</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber-700)' }}>₹1,85,400</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Recovered via Resale</div>
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-lg)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ color: 'var(--amber-400)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Waste → Value Engine
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>250 Ceramic Tiles & 1.2 Tons TMT Offcuts Ready for Sale</div>
              </div>
              <Button variant="primary" size="sm" onClick={() => handleLaunchApp('builder')}>
                Enter Dashboard →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid: Everything Your Site Needs */}
      <section style={{ padding: '4rem 1.5rem', background: '#f8fafc', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--navy-950)' }}>
              Everything Your Construction Site Needs
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
              Designed to eliminate paperwork, stop material loss, and empower site crews.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Boxes, title: 'Real-Time Material Tracking', desc: 'Monitor cement bags, rebar tonnage, and pipe inventories. Automated low-stock alerts before work stalls.' },
              { icon: Store, title: 'Leftover Resale Marketplace', desc: 'Monetize surplus tile boxes and steel offcuts directly with other builders in your city.' },
              { icon: ClipboardCheck, title: '1-Click Digital Attendance', desc: 'Instant mobile punch card and entrance QR code verification with automated payroll rolls.' },
              { icon: Users, title: 'Trade Crew Management', desc: 'Organize masons, carpenters, bar benders, and electricians with transparent skill profiles.' },
              { icon: ListTodo, title: 'Daily Task Kanban', desc: 'Assign structural pours and masonry tasks with progress tracking and trade sign-offs.' },
              { icon: BarChart3, title: 'Material Yield & Cost Reports', desc: 'Audit purchasing efficiency, waste ratios, and capital recovered from circular resale.' }
            ].map((f, i) => (
              <div key={i} className="bw-card" style={{ padding: '1.5rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--amber-50)', color: 'var(--amber-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <f.icon size={22} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>{f.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Every Construction Role */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--navy-950)' }}>
            Built for Every Construction Role
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
            Tailored interfaces engineered for the boardroom, the site office, and the construction slab.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Builder */}
          <div className="bw-card" style={{ padding: '1.75rem', borderTop: '4px solid var(--navy-900)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Briefcase size={20} style={{ color: 'var(--navy-800)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>The Builder</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Full multi-site executive oversight, financial tracking, and circular marketplace resale to protect operating margins.
            </p>
            <Button variant="secondary" size="sm" onClick={() => handleLaunchApp('builder')}>
              Preview Builder View →
            </Button>
          </div>

          {/* Engineer */}
          <div className="bw-card" style={{ padding: '1.75rem', borderTop: '4px solid var(--amber-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <HardHat size={20} style={{ color: 'var(--amber-700)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>The Site Engineer</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Fast material usage logs, daily crew muster tracking, task assignment, and concrete pour inspections.
            </p>
            <Button variant="secondary" size="sm" onClick={() => handleLaunchApp('engineer')}>
              Preview Engineer View →
            </Button>
          </div>

          {/* Worker */}
          <div className="bw-card" style={{ padding: '1.75rem', borderTop: '4px solid var(--success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <UserCheck size={20} style={{ color: 'var(--success)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>The Site Worker</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Distraction-free mobile interface with one-click check-in, QR scan, and today's assigned tasks list.
            </p>
            <Button variant="secondary" size="sm" onClick={() => handleLaunchApp('worker')}>
              Preview Worker Mode →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer style={{ background: '#0f172a', color: '#fff', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Build Smarter. Waste Less.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            Join forward-thinking developers and contractors building modern construction workflows with Buildwise.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleLaunchApp('builder')}
          >
            Launch Buildwise App Now
          </Button>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: '#64748b' }}>
            © 2026 Buildwise Technologies Ltd. • All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
