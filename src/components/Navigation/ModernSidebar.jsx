import React from 'react';
import logoImg from '@/assets/logo.png';
import {
  Home,
  Clock,
  Plus,
  FileText,
  Settings,
  Bell,
  ArrowLeftRight,
  Sparkles,
  PieChart,
  Target,
  Globe,
  Download
} from 'lucide-react';

export function ModernSidebar({
  currentTab,
  onSelectTab,
  onOpenNotifications,
  onOpenProfile,
  onOpenAddTx,
  onOpenSimulateUPI,
  unreadCount = 0
}) {
  return (
    <aside className="modern-sidebar-dock">
      {/* Top Section / Mobile Left: Logo & Main Navigation */}
      <div className="sidebar-top-section">
        {/* MoneyMind Rupee Brain Brand Logo (Desktop) */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="sidebar-logo-btn"
          style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0'
          }}
          title="MoneyMind"
        >
          <img
            src={logoImg}
            alt="MoneyMind Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }}
          />
        </button>

        {/* Navigation Icon Buttons */}
        <div className="sidebar-nav-list">
          {/* 1. Home Dashboard */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`nav-dock-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
            title="Dashboard"
            aria-label="Home Dashboard"
          >
            <Home size={20} />
            <span className="mobile-nav-label">Home</span>
          </button>

          {/* 2. History / Transactions */}
          <button
            onClick={() => onSelectTab('transactions')}
            className={`nav-dock-btn ${currentTab === 'transactions' ? 'active' : ''}`}
            title="Transactions"
            aria-label="Transactions & Calendar"
          >
            <Clock size={20} />
            <span className="mobile-nav-label">Activity</span>
          </button>

          {/* 3. MOBILE CENTER ACTION FAB (+) */}
          <div className="mobile-center-fab-wrapper">
            <button
              onClick={() => onOpenAddTx ? onOpenAddTx('expense') : onSelectTab('transactions')}
              className="mobile-center-fab-btn"
              title="Add Transaction"
              aria-label="Add Transaction"
            >
              <Plus size={22} color="#ffffff" strokeWidth={2.8} />
            </button>
          </div>

          {/* 4. Budgets */}
          <button
            onClick={() => onSelectTab('budgets')}
            className={`nav-dock-btn ${currentTab === 'budgets' ? 'active' : ''}`}
            title="Budgets"
            aria-label="Budgets"
          >
            <PieChart size={20} />
            <span className="mobile-nav-label">Budgets</span>
          </button>

          {/* 5. AI Advisor / Goals */}
          <button
            onClick={() => onSelectTab('ai-assistant')}
            className={`nav-dock-btn ${currentTab === 'ai-assistant' ? 'active' : ''}`}
            title="FinAI Assistant"
            aria-label="AI Advisor"
          >
            <Sparkles size={20} />
            <span className="mobile-nav-label">FinAI</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Desktop Actions & Profile */}
      <div className="sidebar-bottom-section">
        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="nav-dock-btn"
          style={{ position: 'relative' }}
          title="Notifications"
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444'
            }} />
          )}
        </button>

        {/* Reports & Analytics */}
        <button
          onClick={() => onSelectTab('reports')}
          className={`nav-dock-btn ${currentTab === 'reports' ? 'active' : ''}`}
          title="Reports & Analytics"
        >
          <ArrowLeftRight size={19} />
        </button>

        {/* Profile Avatar */}
        <button
          onClick={onOpenProfile}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #ffffff',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
            marginTop: '0.5rem',
            cursor: 'pointer',
            backgroundColor: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}
          title="Account Profile"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="User"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </button>
      </div>
    </aside>
  );
}
