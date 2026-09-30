import React, { useState } from 'react';
import {
  Send,
  Plus,
  Search,
  ChevronRight,
  RotateCw,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Sparkles,
  Check,
  Smartphone,
  BrainCircuit,
  ArrowRight,
  Calendar,
  Tag,
  ShieldCheck,
  Zap,
  Wallet,
  CreditCard,
  PiggyBank,
  MessageSquare,
  Bell
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getPaymentIntentStats } from '../PaymentIntent/paymentIntentUtils';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { SAMPLE_BANK_SMS_MESSAGES, parseBankingSMS } from '../../utils/smsParser';
import confetti from 'canvas-confetti';
import { Avatar, AvatarFallback, AvatarImage } from '../ui';
import logoImg from '@/assets/logo.png';

export function UnifiedDashboard({
  onOpenAddTx,
  onNavigateTab,
  onOpenNotifications,
  onOpenProfile
}) {
  const {
    transactions,
    totalIncome,
    totalExpense,
    netBalance,
    savingsRate,
    budgets,
    goals,
    activeCurrency,
    activeCurrencyCode,
    activeProfile
  } = useFinance();

  const [quickTransferAmount, setQuickTransferAmount] = useState('710');
  const [selectedContact, setSelectedContact] = useState(0);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(4); // Default to SEP (index 4)

  // Dynamic Payment Intent stats calculated from real transactions
  const intentStats = getPaymentIntentStats(transactions);

  // Contacts for Quick UPI Transfer
  const contacts = [
    { name: 'Aman S.', role: 'Friend', avatar: 'AS', color: '#3b82f6' },
    { name: 'Priya P.', role: 'Family', avatar: 'PP', color: '#ec4899' },
    { name: 'Rohan V.', role: 'Colleague', avatar: 'RV', color: '#10b981' },
    { name: 'Swiggy', role: 'Food', avatar: 'SW', color: '#f59e0b' }
  ];

  const handleQuickTransfer = () => {
    const amt = parseFloat(quickTransferAmount);
    if (!amt || amt <= 0) return;

    if (onOpenUpiPay) {
      const contact = contacts[selectedContact];
      onOpenUpiPay({
        amount: quickTransferAmount,
        payee: contact ? contact.name : 'Swiggy'
      });
      return;
    }

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTransferSuccess(true);
    setTimeout(() => {
      setTransferSuccess(false);
      if (onOpenSimulateUPI) {
        onOpenSimulateUPI();
      }
    }, 1200);
  };

  // Recent 6 transactions from real state
  const latestTransactions = transactions.slice(0, 6);

  // Dynamic Monthly breakdown calculation from real transactions
  const monthLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthlyBreakdown = [4, 3, 2, 1, 0].map(offset => {
    const d = new Date();
    d.setMonth(d.getMonth() - offset);
    const mIdx = d.getMonth();
    const yr = d.getFullYear();
    const monthTx = transactions.filter(t => {
      if (t.type !== 'expense') return false;
      const tDate = new Date(t.date);
      return !isNaN(tDate) && tDate.getMonth() === mIdx && tDate.getFullYear() === yr;
    });
    const total = monthTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return {
      label: monthLabels[mIdx],
      monthNum: mIdx,
      amount: total
    };
  });
  const maxMonthExpense = Math.max(...monthlyBreakdown.map(m => m.amount), 1);
  const healthScore = totalIncome > 0
    ? Math.min(100, Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)))
    : (totalExpense > 0 ? 0 : 100);

  // Dynamic Upcoming/Active Budgets list from real state
  const activeBudgetsList = budgets.slice(0, 3).map((b, idx) => {
    const spentInCat = transactions
      .filter(t => t.type === 'expense' && t.category === b.category)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const pct = Math.min(100, Math.round((spentInCat / b.monthlyLimit) * 100));

    return {
      id: b.id || `b-${idx}`,
      title: b.category,
      category: `${pct}% of monthly cap`,
      amount: formatCurrency(b.monthlyLimit, 'INR', 1),
      dateBadge: pct > 80 ? 'Near Limit' : 'Active',
      isWarning: pct > 80
    };
  });

  return (
    <div className="page-content-wrapper" style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header Row with Logo, Brand & Profile in Top Right */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        {/* Left: Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(5, 150, 105, 0.2), 0 1px 3px rgba(0,0,0,0.08)',
            border: '2px solid #a7f3d0',
            padding: '3px',
            flexShrink: 0
          }}>
            <img src={logoImg} alt="MoneyMind" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              lineHeight: 1.1
            }}>
              MoneyMind
            </h1>
            <p style={{
              fontSize: '0.74rem',
              color: '#059669',
              marginTop: '1px',
              fontWeight: 700
            }}>
              Smart Banking SMS & Cashflow
            </p>
          </div>
        </div>

        {/* Right (Marked Header Area): Profile Avatar + Notification Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexShrink: 0
        }}>
          {/* Profile Avatar Button (Logo only) */}
          <button
            onClick={onOpenProfile}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1.5px solid #e2ede8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
              transition: 'all 0.15s ease'
            }}
            title="Profile & Preferences"
          >
            <Avatar size="sm" style={{ width: '34px', height: '34px', border: '1.5px solid #059669' }}>
              <AvatarFallback style={{
                backgroundColor: '#059669',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                {activeProfile?.name ? activeProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'RK'}
              </AvatarFallback>
            </Avatar>
          </button>

          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid #e2ede8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                position: 'relative'
              }}
              title="Notifications"
            >
              <Bell size={17} color="#059669" />
              <span style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                border: '1.5px solid #ffffff'
              }} />
            </button>
          )}
        </div>
      </div>

      {/* Main Dashboard Grid: Left Content & Right Column */}
      <div className="dashboard-main-grid">
        
        {/* ================= LEFT MAIN COLUMN ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 1. HERO TOTAL BALANCE CARD (3 INTERCONNECTED LIQUID BUBBLES DESIGN) */}
          <div className="mm-card" style={{ padding: '1.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Total Net Balance</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    fontWeight: 700,
                    border: '1px solid #a7f3d0'
                  }}>
                    {savingsRate}% Saved
                  </span>
                </div>
                <div className="hero-balance-text" style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.03em',
                  lineHeight: 1
                }}>
                  {formatCurrency(netBalance, 'INR', 1)}
                </div>
              </div>

            </div>

            {/* Three Interconnected Clean Full Circular Cards (Icons & Text Perfectly Aligned) */}
            <div className="liquid-bubbles-wrapper">
              <div className="liquid-bubbles-group">
                {/* Connecting backdrop bridge */}
                <div className="bubble-bridge" />

                {/* Circle 1: Total Inflow (Full Circle - Green) */}
                <div className="bubble-c1">
                  {/* Top Wallet Icon Badge */}
                  <div className="bubble-icon-badge inflow-badge">
                    <Wallet size={15} color="#059669" />
                  </div>

                  {/* Amount */}
                  <div className="bubble-amount inflow-amount">
                    +{formatCurrency(totalIncome, 'INR', 1)}
                  </div>

                  {/* Label */}
                  <div className="bubble-label">
                    Total Inflow
                  </div>
                </div>

                {/* Circle 2: Net Balance (Hero Full Circle - Blue) */}
                <div className="bubble-c2">
                  {/* Top Shield/Reserve Icon Badge */}
                  <div className="bubble-icon-badge hero-badge">
                    <ShieldCheck size={17} color="#2563eb" />
                  </div>

                  {/* Amount */}
                  <div className="bubble-amount hero-amount">
                    {formatCurrency(netBalance, 'INR', 1)}
                  </div>

                  {/* Label */}
                  <div className="bubble-label hero-label">
                    Net Balance
                  </div>
                </div>

                {/* Circle 3: Total Outflow (Full Circle - Red) */}
                <div className="bubble-c3">
                  {/* Top Outflow Icon Badge */}
                  <div className="bubble-icon-badge outflow-badge">
                    <ArrowUpRight size={15} color="#ef4444" />
                  </div>

                  {/* Amount */}
                  <div className="bubble-amount outflow-amount">
                    -{formatCurrency(totalExpense, 'INR', 1)}
                  </div>

                  {/* Label */}
                  <div className="bubble-label">
                    Total Outflow
                  </div>
                </div>
              </div>
            </div>

            {/* Sleek Dual Quick-Action Toolbar (Compact & Modern) */}
            <div className="dashboard-quick-actions-bar">
              <button
                type="button"
                onClick={() => onOpenAddTx('income')}
                className="quick-action-tab income-tab"
                title="Log incoming money or salary"
              >
                <div className="quick-action-icon-circle income-icon-circle">
                  <ArrowDownRight size={14} color="#059669" />
                </div>
                <span className="quick-action-text">+ Log Income</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAddTx('expense')}
                className="quick-action-tab expense-tab"
                title="Log a payment or expense"
              >
                <div className="quick-action-icon-circle expense-icon-circle">
                  <Plus size={14} color="#2563eb" />
                </div>
                <span className="quick-action-text">+ Log Expense</span>
              </button>
            </div>
          </div>

          {/* 2. MIDDLE ROW: EXPENSE STATISTIC + FINANCIAL HEALTH */}
          <div className="dashboard-middle-grid">
            {/* Expense statistic Card */}
            <div className="mm-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#131826' }}>Expense statistic</h3>
                <div style={{
                  padding: '0.3rem 0.75rem',
                  backgroundColor: '#edf2fa',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#55657a'
                }}>
                  Monthly
                </div>
              </div>

              {/* 3D Capsule Columns (Interactive Clickable Months) */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '140px',
                padding: '0 0.5rem 0.5rem'
              }}>
                {monthlyBreakdown.map((m, idx) => {
                  const isSelected = selectedMonthIdx === idx;
                  const barHeight = Math.max(48, Math.round((m.amount / maxMonthExpense) * 110));

                  return (
                    <div
                      key={m.label}
                      onClick={() => setSelectedMonthIdx(idx)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        position: 'relative',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'transform 0.18s ease'
                      }}
                      title={`Click to view ${m.label} expenses: ${formatCurrency(m.amount, 'INR', 1)}`}
                    >
                      {/* Active floating amount badge on selected month (Pristine Light White) */}
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '-28px',
                          backgroundColor: '#ffffff',
                          color: '#0f172a',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          border: '1.5px solid #059669',
                          boxShadow: '0 4px 14px rgba(5, 150, 105, 0.18)',
                          whiteSpace: 'nowrap',
                          zIndex: 10,
                          animation: 'popInBadge 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}>
                          {formatCurrency(m.amount, 'INR', 1)}
                        </div>
                      )}

                      {/* Capsule Column Bar (Light White Theme) */}
                      <div
                        style={{
                          width: isSelected ? '34px' : '32px',
                          height: `${barHeight}px`,
                          borderRadius: isSelected ? '17px' : '16px',
                          backgroundColor: isSelected ? '#ecfdf5' : '#f1f5f9',
                          border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                          boxShadow: isSelected
                            ? '0 4px 14px rgba(5, 150, 105, 0.18), inset 0 2px 4px rgba(255,255,255,0.9)'
                            : 'inset 0 2px 4px rgba(255,255,255,0.8), 0 2px 6px rgba(110,130,160,0.06)',
                          transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                          transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxSizing: 'border-box'
                        }}
                      />

                      {/* Month Label */}
                      <span style={{
                        fontSize: '0.72rem',
                        color: isSelected ? '#131826' : '#9aa8bc',
                        fontWeight: isSelected ? 800 : 600,
                        transition: 'color 0.18s ease'
                      }}>
                        {m.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Health Card (Pristine Light White Theme) */}
            <div className="mm-card" style={{
              padding: '1.35rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.85rem'
            }}>
              {/* Card Header & Score */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Financial Health & Growth</span>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: '#ecfdf5',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#059669',
                    border: '1px solid #a7f3d0'
                  }}>
                    <ShieldCheck size={13} color="#059669" />
                    <span>Safe</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '2.3rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em', color: '#059669' }}>
                    {healthScore}%
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                    {savingsRate}% savings ratio
                  </span>
                </div>
              </div>

              {/* Smooth Dynamic Bezier Wave Chart */}
              <div style={{ width: '100%', height: '52px', position: 'relative', margin: '0.15rem 0' }}>
                <svg width="100%" height="100%" viewBox="0 0 280 55" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  {/* Filled Area below wave */}
                  <path
                    d="M 10 42 Q 75 48, 140 28 T 270 10 L 270 55 L 10 55 Z"
                    fill="rgba(5, 150, 105, 0.1)"
                  />
                  {/* Wave Line */}
                  <path
                    d="M 10 42 Q 75 48, 140 28 T 270 10"
                    stroke="#059669"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Peak Indicator Dot */}
                  <circle cx="270" cy="10" r="4.5" fill="#059669" stroke="#ffffff" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Responsive Clean Bottom Tags */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                flexWrap: 'wrap',
                paddingTop: '0.45rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#dc2626',
                  backgroundColor: '#fef2f2',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  <span style={{ opacity: 0.8, fontSize: '0.68rem', fontWeight: 600 }}>Outflow</span>
                  <span>-{formatCurrency(totalExpense, 'INR', 1)}</span>
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#059669',
                  backgroundColor: '#f0fdf4',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  <span style={{ opacity: 0.8, fontSize: '0.68rem', fontWeight: 600 }}>Inflow</span>
                  <span>+{formatCurrency(totalIncome, 'INR', 1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ACTIVE BUDGETS & UPCOMING CARD */}
          <div className="mm-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#131826' }}>Active Budgets & Targets</h3>
                <span style={{ fontSize: '0.75rem', color: '#748296' }}>Monthly limit tracking</span>
              </div>
              <button
                onClick={() => onNavigateTab('budgets')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                View All
              </button>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activeBudgetsList.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.84rem' }}>
                  No active budgets created yet.
                </div>
              ) : (
                activeBudgetsList.map(p => (
                  <div key={p.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0',
                    borderBottom: '1px solid #f8fafc'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2563eb',
                        fontWeight: 800,
                        fontSize: '0.9rem'
                      }}>
                        ₹
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#131826' }}>{p.title}</div>
                        <div style={{ fontSize: '0.74rem', color: '#748296' }}>{p.category}</div>
                      </div>
                    </div>

                    {/* Badge & Amount in INR */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: p.isWarning ? '#fee2e2' : '#f1f5fa',
                        color: p.isWarning ? '#dc2626' : '#55657a'
                      }}>
                        {p.dateBadge}
                      </div>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#131826' }}>{p.amount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tips banner at bottom */}
            <div style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid #f1f5fa'
            }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#131826' }}>
                How to optimize monthly savings by 20%?
              </div>
              <div style={{ fontSize: '0.76rem', color: '#748296', marginTop: '2px' }}>
                Set category alert limits and track payment intents regularly. <span onClick={() => onNavigateTab('ai-assistant')} style={{ textDecoration: 'underline', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>Ask FinAI</span>
              </div>
            </div>
          </div>

          {/* 4. PAYMENT INTENT DYNAMIC ANALYTICS CARD */}
          <div className="mm-card" style={{ padding: '1.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: '2px',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)'
                }}>
                  <img src={logoImg} alt="MoneyMind Intelligence" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#131826', letterSpacing: '-0.01em' }}>
                    Payment Intent
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#748296', marginTop: '1px' }}>
                    Why you made your payments & categorized intents
                  </p>
                </div>
              </div>

              {/* Action: Add Transaction */}
              <button
                onClick={() => onOpenAddTx('expense')}
                className="btn-light-pill"
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.78rem',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  borderColor: '#e2e8f0',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Plus size={14} color="#059669" />
                <span>Add Expense</span>
              </button>
            </div>

            {/* Ratio Metric Hero Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.85rem',
              padding: '1.15rem',
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid #eef2f7',
              marginBottom: '1.35rem'
            }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                  Payments Explained
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                  {intentStats.capturedPayments} <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: 600 }}>/ {intentStats.totalUPIPayments}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Total UPI payments
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                  Intent Capture Rate
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2563eb', marginTop: '0.15rem' }}>
                  {intentStats.captureRate}%
                </div>
                {/* Visual Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '9999px',
                  marginTop: '0.4rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(100, Math.max(0, intentStats.captureRate))}%`,
                    height: '100%',
                    backgroundColor: '#2563eb',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                  Explained Volume
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10b981', marginTop: '0.15rem' }}>
                  {formatCurrency(intentStats.capturedUPIAmount, 'INR', 1)}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {intentStats.uncapturedPayments > 0 ? `${intentStats.uncapturedPayments} unclassified` : 'All explained'}
                </span>
              </div>
            </div>

            {/* Dynamic Intent Categories Breakdown */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                  Spending Intent Breakdown
                </span>
                <button
                  onClick={() => onNavigateTab('transactions')}
                  style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  <span>View All in History</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {intentStats.categoryList.length === 0 ? (
                <div style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1.5px dashed #cbd5e1',
                  color: '#64748b',
                  fontSize: '0.84rem'
                }}>
                  <p>No explained UPI transactions yet.</p>
                  <button
                    onClick={() => onOpenAddTx && onOpenAddTx('expense')}
                    style={{
                      marginTop: '0.65rem',
                      color: '#059669',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      background: 'none',
                      border: 'none'
                    }}
                  >
                    + Record Transaction
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {intentStats.categoryList.map(item => (
                    <div
                      key={item.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: item.bg || '#eff6ff',
                          color: item.color || '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}>
                          <Tag size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {item.count} {item.count === 1 ? 'payment' : 'payments'} ({item.percentage}% share)
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                          {formatCurrency(item.amount, 'INR', 1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR COLUMN ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 1. TRANSACTIONS CARD (Real Latest transfers) */}
          <div className="mm-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#131826' }}>Transactions</h3>
                <span style={{ fontSize: '0.76rem', color: '#748296' }}>Latest transfers</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => onNavigateTab('transactions')}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    backgroundColor: '#ffffff',
                    color: '#059669',
                    border: '1px solid #a7f3d0',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  View All
                </button>
              </div>
            </div>

            {/* List of Real Latest Transfers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {latestTransactions.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.84rem' }}>
                  No transactions recorded yet.
                </div>
              ) : (
                latestTransactions.map(tx => {
                  const isIncome = tx.type === 'income';

                  return (
                    <div key={tx.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.35rem 0',
                      borderBottom: '1px solid #f8fafc'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: isIncome ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isIncome ? '#10b981' : '#ef4444'
                        }}>
                          {isIncome ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#131826' }}>
                            {tx.merchant || tx.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#9aa8bc' }}>
                            {formatDate(tx.date)} • {tx.paymentMethod || 'UPI'}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          color: isIncome ? '#10b981' : '#131826'
                        }}>
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount, 'INR', 1)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
