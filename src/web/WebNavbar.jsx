import React, { useState } from 'react';
import {
  Sparkles,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Plus,
  Zap,
  Globe,
  Check,
  TrendingUp,
  Wallet,
  ShieldCheck,
  LogOut,
  Settings,
  ExternalLink
} from 'lucide-react';
import logoImg from '@/assets/logo.png';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

export function WebNavbar({
  onOpenAddTx,
  onOpenUpiPay,
  onOpenNotifications,
  onOpenProfile,
  onBackToLanding,
  onNavigateTab
}) {
  const {
    theme,
    toggleTheme,
    currencies,
    activeCurrencyCode,
    setActiveCurrencyCode,
    activeCurrency,
    activeProfile,
    notifications,
    netBalance,
    totalExpense,
    totalIncome,
    savingsRate
  } = useFinance();

  const { user, signOut } = useAuth();

  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="web-navbar">
      {/* Left: Brand Logo & Navigation Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div
          className="web-navbar-brand"
          onClick={() => onNavigateTab ? onNavigateTab('dashboard') : null}
          title="MoneyMind Dashboard"
        >
          <div className="web-navbar-logo-wrap">
            <img
              src={logoImg}
              alt="MoneyMind"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span className="web-navbar-title">MoneyMind</span>
              <span className="web-navbar-badge">
                <Sparkles size={11} />
                Web Edition
              </span>
            </div>
          </div>
        </div>

        {/* Back to Landing Page / Showcase Button */}
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="btn-web-secondary"
            title="Return to Public Landing Showcase"
            style={{ padding: '0.45rem 0.85rem' }}
          >
            <Globe size={14} color="#059669" />
            <span>Website Showcase</span>
          </button>
        )}
      </div>

      {/* Center: Live Financial Tickers (Desktop only) */}
      <div className="web-navbar-stats">
        <div className="web-navbar-stat-item">
          <Wallet size={15} color="#059669" />
          <span className="web-navbar-stat-label">Net Balance:</span>
          <span className="web-navbar-stat-val positive">
            {formatCurrency(netBalance, activeCurrencyCode, activeCurrency.rate)}
          </span>
        </div>

        <div style={{ width: '1px', height: '16px', backgroundColor: '#cbd5e1' }} />

        <div className="web-navbar-stat-item">
          <TrendingUp size={15} color="#2563eb" />
          <span className="web-navbar-stat-label">Savings:</span>
          <span className="web-navbar-stat-val">
            {savingsRate}%
          </span>
        </div>
      </div>

      {/* Right: Quick Action Controls & Profile */}
      <div className="web-navbar-actions">
        {/* + Add Transaction Button */}
        <button
          className="btn-web-add"
          onClick={() => onOpenAddTx && onOpenAddTx('expense')}
          title="Add New Transaction (Expense/Income)"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Transaction</span>
        </button>

        {/* Direct UPI Pay Quick Simulation */}
        <button
          className="btn-web-upi"
          onClick={() => onOpenUpiPay && onOpenUpiPay({ amount: '500', payee: 'Swiggy' })}
          title="Direct UPI Instant Transfer Simulation"
        >
          <Zap size={15} />
          <span>Pay UPI</span>
        </button>

        {/* Currency Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-web-secondary"
            onClick={() => {
              setCurrencyDropdown(!currencyDropdown);
              setProfileDropdown(false);
            }}
            title="Change Display Currency"
          >
            <span style={{ fontWeight: 800 }}>{currencies.find(c => c.code === activeCurrencyCode)?.symbol}</span>
            <span>{activeCurrencyCode}</span>
            <ChevronDown size={13} />
          </button>

          {currencyDropdown && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '180px',
                padding: '0.4rem',
                zIndex: 200,
                borderRadius: '14px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2ede8',
                boxShadow: '0 14px 35px rgba(15, 23, 42, 0.12)'
              }}
            >
              <div style={{ padding: '0.35rem 0.65rem 0.25rem', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                Select Currency
              </div>
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
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    color: activeCurrencyCode === curr.code ? '#059669' : '#0f172a',
                    background: activeCurrencyCode === curr.code ? '#ecfdf5' : 'transparent',
                    fontWeight: activeCurrencyCode === curr.code ? 700 : 500,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800 }}>{curr.symbol}</span>
                    <span>{curr.name}</span>
                  </div>
                  {activeCurrencyCode === curr.code && <Check size={14} color="#059669" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <button
          className="btn-web-icon"
          onClick={onOpenNotifications}
          title="Banking & Activity Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 8px #ef4444'
            }} />
          )}
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          className="btn-web-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2ede8', margin: '0 0.15rem' }} />

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-web-secondary"
            onClick={() => {
              setProfileDropdown(!profileDropdown);
              setCurrencyDropdown(false);
            }}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#059669',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem'
            }}>
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : (activeProfile?.avatar || 'R')}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
                {user?.fullName || activeProfile?.name || 'Rajesh K'}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600, lineHeight: 1 }}>
                Active Profile
              </span>
            </div>
            <ChevronDown size={13} color="#64748b" />
          </button>

          {profileDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                padding: '0.65rem',
                zIndex: 200,
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2ede8',
                boxShadow: '0 16px 40px rgba(15, 23, 42, 0.14)'
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                  {user?.fullName || 'Rajesh K'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {user?.email || 'rajesh@moneymind.app'}
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileDropdown(false);
                  if (onOpenProfile) onOpenProfile();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  color: '#0f172a',
                  fontWeight: 600,
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Settings size={15} color="#64748b" />
                <span>Account & Settings</span>
              </button>

              {onBackToLanding && (
                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    onBackToLanding();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    color: '#0f172a',
                    fontWeight: 600,
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Globe size={15} color="#059669" />
                  <span>Public Showcase</span>
                </button>
              )}

              <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.4rem 0' }} />

              <button
                onClick={() => {
                  setProfileDropdown(false);
                  if (signOut) signOut();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  color: '#ef4444',
                  fontWeight: 600,
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={15} color="#ef4444" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
