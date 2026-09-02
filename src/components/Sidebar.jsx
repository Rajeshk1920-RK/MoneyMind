import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  PieChart,
  Target,
  Sparkles,
  FileText,
  HelpCircle
} from 'lucide-react';
import { useSplit } from '../context/SplitContext';

export function Sidebar({ currentTab, setCurrentTab }) {
  const { groups } = useSplit();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, badge: null },
    { id: 'splitwise', label: 'Split Groups', icon: Users, badge: `${groups.length} trips`, highlight: true },
    { id: 'budgets', label: 'Budgets & Alerts', icon: PieChart, badge: 'Active' },
    { id: 'goals', label: 'Savings Goals', icon: Target, badge: null },
    { id: 'ai-assistant', label: 'AI Advisor', icon: Sparkles, badge: 'Smart' },
    { id: 'reports', label: 'Reports & Export', icon: FileText, badge: 'PDF' }
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1rem',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ padding: '0 0.85rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Menu Navigation
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                backgroundColor: isActive
                  ? '#1b4332'
                  : 'transparent',
                boxShadow: isActive ? '0 4px 14px rgba(27, 67, 50, 0.28)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Icon size={19} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '99px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.22)' : '#e8efe9',
                  color: isActive ? '#ffffff' : '#1b4332'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mini Feature Card */}
      <div className="glass-panel" style={{ padding: '1.1rem', borderRadius: '16px', background: 'linear-gradient(145deg, #f0f5f1 0%, #eaf1ec 100%)', border: '1px solid #d8e4dc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Sparkles size={16} color="#1b4332" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16382b' }}>MoneyMind + SplitSmart</span>
        </div>
        <p style={{ fontSize: '0.74rem', color: '#52695c', lineHeight: 1.4 }}>
          Smarter tracking, minimal debt settlements & AI powered financial freedom.
        </p>
      </div>
    </aside>
  );
}