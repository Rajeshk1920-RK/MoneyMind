import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  ChevronDown,
  Globe,
  LogOut,
  Check,
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  PieChart,
  Target,
  FileText,
  User,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '@/assets/logo.png';

export function AppHeader({ currentTab, setCurrentTab, onOpenAddTx, onBackToLanding, onOpenNotifications, onOpenProfile }) {
  const {
    currencies,
    activeCurrencyCode,
    setActiveCurrencyCode,
    activeProfile,
    notifications,
    isCloudSyncing
  } = useFinance();

  const { user, profile: authProfile, isAuthenticated, signOut } = useAuth();
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'goals', label: 'Savings Goals', icon: Target },
    { id: 'ai-assistant', label: 'AI Advisor', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <header style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '1.25rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      backgroundColor: '#f4f6f0',
      zIndex: 100,
      borderBottom: '1px solid #e3ebe5',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Brand / Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        onClick={() => setCurrentTab('dashboard')}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0',
          padding: '2px'
        }}>
          <img
            src={logoImg}
            alt="MoneyMind"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16382b', fontFamily: 'var(--font-display)', letterSpacing: '-0.025em' }}>
          MoneyMind
        </span>
      </div>

      {/* Center Navigation Tabs (Matching exact landing font & spacing) */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: '#ffffff',
        padding: '0.35rem 0.5rem',
        borderRadius: '9999px',
        border: '1px solid #e3ebe5',
        boxShadow: '0 2px 8px rgba(22, 56, 43, 0.04)'
      }}>
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : '#52695c',
                backgroundColor: isActive ? '#1b4332' : 'transparent',
                boxShadow: isActive ? '0 4px 12px rgba(27, 67, 50, 0.28)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#16382b';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#52695c';
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '99px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : '#eaf3ed',
                  color: isActive ? '#ffffff' : '#16382b'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Currency Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setCurrencyDropdown(!currencyDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              border: '1px solid #cfded4',
              color: '#16382b',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span>{currencies.find(c => c.code === activeCurrencyCode)?.symbol}</span>
            <span>{activeCurrencyCode}</span>
            <ChevronDown size={13} />
          </button>

          {currencyDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '170px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '0.5rem',
              border: '1px solid #e3ebe5',
              boxShadow: '0 10px 30px rgba(22, 56, 43, 0.12)',
              zIndex: 200
            }}>
              {currencies.map(curr => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setActiveCurrencyCode(curr.code);
                    setCurrencyDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    color: activeCurrencyCode === curr.code ? '#1b4332' : '#16382b',
                    backgroundColor: activeCurrencyCode === curr.code ? '#eaf3ed' : 'transparent',
                    cursor: 'pointer',
                    fontWeight: activeCurrencyCode === curr.code ? 700 : 500
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700 }}>{curr.symbol}</span>
                    <span>{curr.name}</span>
                  </div>
                  {activeCurrencyCode === curr.code && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon (matching phone mockup icon) */}
        <button
          onClick={onOpenNotifications}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '1px solid #cfded4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            color: '#475569'
          }}
          title="Notifications"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444'
            }} />
          )}
        </button>

        {/* User Profile Pill */}
        {(() => {
          const displayName = isAuthenticated
            ? (authProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User')
            : (activeProfile?.name || 'Rajesh');

          const initials = displayName
            .split(' ')
            .filter(Boolean)
            .map(part => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'MM';

          return (
            <button
              onClick={onOpenProfile}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem 0.35rem 0.45rem',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                border: isAuthenticated ? '1.5px solid #2d6a4f' : '1px solid #cfded4',
                cursor: 'pointer'
              }}
              title={isAuthenticated ? `Signed in as ${user?.email}` : 'Guest Profile'}
            >
              <span style={{ fontSize: '1.15rem' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isAuthenticated ? '#2d6a4f' : '#eaf3ed',
                  color: isAuthenticated ? '#ffffff' : '#16382b',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {initials}
                </span>
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16382b' }}>
                {displayName}
              </span>
              <ChevronDown size={13} color="#7e9788" />
            </button>
          );
        })()}

        {/* Supabase Sign Out (if authenticated) */}
        {isAuthenticated && (
          <button
            onClick={async () => {
              await signOut();
              onBackToLanding();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Sign out of Supabase"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        )}

        {/* Back to Public Landing Page Link */}
        <button
          onClick={onBackToLanding}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cfded4',
            color: '#16382b',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#16382b'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cfded4'}
          title="Return to Public Landing Page"
        >
          <Globe size={14} />
          <span>Landing</span>
        </button>
      </div>
    </header>
  );
}
