import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  PieChart,
  Target,
  Sparkles,
  FileText,
  Zap,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useSplit } from '../context/SplitContext';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

export function WebSidebar({
  currentTab,
  onSelectTab,
  onOpenUpiPay,
  onOpenProfile
}) {
  const { groups } = useSplit();
  const {
    transactions,
    goals,
    budgets,
    activeProfile,
    totalIncome,
    totalExpense,
    activeCurrencyCode,
    activeCurrency
  } = useFinance();
  const { user, signOut } = useAuth();

  const healthScore = totalIncome > 0
    ? Math.min(100, Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)))
    : 78;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, badge: transactions.length ? `${transactions.length}` : null },
    { id: 'splitwise', label: 'Split Groups', icon: Users, badge: `${groups.length || 2} groups`, highlight: true },
    { id: 'budgets', label: 'Budgets & Alerts', icon: PieChart, badge: 'Live' },
    { id: 'goals', label: 'Savings Goals', icon: Target, badge: goals.length ? `${goals.length}` : null },
    { id: 'intelligence', label: 'Money Intelligence', icon: Sparkles, badge: 'AI Score' },
    { id: 'reports', label: 'Reports & Export', icon: FileText, badge: 'PDF' }
  ];

  return (
    <aside className="web-sidebar">
      {/* Navigation Menu Links */}
      <div className="web-sidebar-nav">
        <div className="web-sidebar-heading">Workspace Menu</div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`web-sidebar-item ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <div className="web-sidebar-item-left">
                <Icon size={19} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="web-sidebar-badge">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Bottom Widgets */}
      <div className="web-sidebar-footer">
        {/* Financial Health Meter Mini Card */}
        <div
          className="web-sidebar-health-card"
          onClick={() => onSelectTab('intelligence')}
          style={{ cursor: 'pointer' }}
          title="View AI Money Intelligence Score"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#059669" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#065f46' }}>Financial Health</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>
              {healthScore}%
            </span>
          </div>

          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#d1fae5',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${healthScore}%`,
              height: '100%',
              backgroundColor: '#059669',
              borderRadius: '9999px',
              transition: 'width 0.4s ease'
            }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.45rem', fontSize: '0.7rem', color: '#047857' }}>
            <span>Healthy Cashflow</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* Quick Instant UPI Simulator Card */}
        {onOpenUpiPay && (
          <div
            onClick={() => onOpenUpiPay({ amount: '350', payee: 'Swiggy Food' })}
            style={{
              padding: '0.85rem',
              borderRadius: '14px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2ede8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#a7f3d0';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2ede8';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title="Simulate Direct UPI Payment"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Direct UPI Pay</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Instant simulation</div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>₹350</span>
          </div>
        )}

        {/* User Account Snippet */}
        <div className="web-sidebar-user-card">
          <div
            onClick={onOpenProfile}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', flex: 1, minWidth: 0 }}
            title="Manage Profile"
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.82rem',
              flexShrink: 0
            }}>
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : (activeProfile?.avatar || 'R')}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || activeProfile?.name || 'Rajesh K'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <UserCheck size={11} color="#059669" />
                <span>Personal Account</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut && signOut()}
            className="btn-icon"
            style={{ width: '28px', height: '28px', color: '#94a3b8' }}
            title="Sign Out"
            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
