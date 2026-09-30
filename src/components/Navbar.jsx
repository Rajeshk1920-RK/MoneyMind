import React, { useState } from 'react';
import {
  Sparkles,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Users,
  Briefcase,
  Layers,
  Check,
  Globe
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export function Navbar({ onOpenAI, onOpenNotifications, onOpenProfile, onBackToLanding }) {
  const {
    theme,
    toggleTheme,
    currencies,
    activeCurrencyCode,
    setActiveCurrencyCode,
    activeProfile,
    notifications
  } = useFinance();

  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="navbar-container" style={{
      height: '74px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: '#ffffff',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
            color: '#fff'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#16382b', fontFamily: 'var(--font-display)' }}>
                MoneyMind
              </span>
              <span className="badge" style={{ backgroundColor: '#eaf3ed', color: '#1b4332', border: '1px solid #c8ded0', fontSize: '0.68rem', padding: '0.15rem 0.5rem', fontWeight: 700 }}>
                LIVE APP
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#52695c', marginTop: '-2px' }}>
              Smarter Finance · Better Future
            </p>
          </div>
        </div>

        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', borderRadius: '10px' }}
          >
            <Globe size={15} />
            <span>Landing Page</span>
          </button>
        )}
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Currency Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrencyDropdown(!currencyDropdown)}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', borderRadius: '10px' }}
          >
            <span>{currencies.find(c => c.code === activeCurrencyCode)?.symbol}</span>
            <span style={{ fontWeight: 600 }}>{activeCurrencyCode}</span>
            <ChevronDown size={14} />
          </button>

          {currencyDropdown && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '180px',
                padding: '0.5rem',
                zIndex: 200,
                borderRadius: '14px',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
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
                    color: activeCurrencyCode === curr.code ? 'var(--accent-primary)' : 'var(--text-primary)',
                    background: activeCurrencyCode === curr.code ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                    transition: 'all 0.15s ease'
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

        {/* AI Copilot Quick Summon */}
        <button
          className="btn btn-primary"
          onClick={onOpenAI}
          style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', borderRadius: '10px' }}
        >
          <Sparkles size={16} />
          <span>Ask FinAI</span>
        </button>

        {/* Notification Bell */}
        <button
          className="btn-icon"
          onClick={onOpenNotifications}
          style={{ position: 'relative' }}
          title="Notifications"
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

        {/* Theme Toggle */}
        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Profile / Family Switcher */}
        <button
          className="btn btn-secondary"
          onClick={onOpenProfile}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{activeProfile?.avatar}</span>
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {activeProfile?.name}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1 }}>
              {activeProfile?.role}
            </span>
          </div>
          <ChevronDown size={14} color="var(--text-tertiary)" />
        </button>
      </div>
    </header>
  );
}