import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Users,
  Search,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useSplit } from '../../context/SplitContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { predictMonthEndExpense, generateAISavingSuggestions } from '../../utils/aiEngine';
import { exportTransactionsToCSV } from '../../utils/exportUtils';
import confetti from 'canvas-confetti';

export function UnifiedDashboard({
  onOpenAddTx,
  onOpenAddSplit,
  onNavigateTab
}) {
  const {
    transactions,
    totalIncome,
    totalExpense,
    netBalance,
    savingsRate,
    activeCurrency,
    activeCurrencyCode,
    activeProfile,
    budgets
  } = useFinance();

  const { groups, settleDebt } = useSplit();
  const [chartMode, setChartMode] = useState('all'); // 'all' | 'income' | 'expense'

  const prediction = predictMonthEndExpense(transactions);
  const aiSuggestions = generateAISavingSuggestions(transactions, budgets);

  // Trigger celebration confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Monthly flow mock data (last 6 months)
  const monthlyFlow = [
    { month: 'Jan', income: 75000, expense: 48000, growth: 22 },
    { month: 'Feb', income: 82000, expense: 51000, growth: 30 },
    { month: 'Mar', income: 85000, expense: 56000, growth: 38 },
    { month: 'Apr', income: 94000, expense: 62000, growth: 52 },
    { month: 'May', income: 103000, expense: 54040, growth: 75 },
    { month: 'Jun', income: 125000, expense: totalExpense || 54040, growth: 95 }
  ];

  // Category totals for donut
  const expenseTx = transactions.filter(t => t.type === 'expense');
  const categoryTotals = {};
  expenseTx.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
  });
  const categoryColors = {
    'Food & Dining': '#f59e0b',
    'Travel & Transport': '#0284c7',
    'Housing & Rent': '#8b5cf6',
    'Utilities & Bills': '#10b981',
    'Shopping & Electronics': '#ec4899',
    'Entertainment & Subs': '#f43f5e',
    'Settlement': '#16382b',
    'Other': '#64748b'
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 5rem' }}>
      {/* Hero Welcome Banner - Exactly styled like the landing page hero */}
      <section style={{
        backgroundColor: '#ffffff',
        borderRadius: '28px',
        padding: '2.5rem 2.5rem',
        border: '1px solid #e3ebe5',
        boxShadow: '0 10px 30px rgba(22, 56, 43, 0.04)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#eaf3ed', color: '#16382b', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            <Sparkles size={14} />
            <span>AI COMMAND CENTER ACTIVE</span>
          </div>
          <h1 style={{
            fontSize: '2.6rem',
            lineHeight: 1.15,
            fontWeight: 800,
            color: '#16382b',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.03em',
            marginBottom: '0.5rem'
          }}>
            Smarter Finance · Better Future
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#52695c', maxWidth: '560px' }}>
            Welcome back, <strong>{activeProfile?.name || 'Rajesh'}</strong>. Your cashflow velocity is up <strong>+12.4%</strong> with 0 overdue group trip debts.
          </p>
        </div>

        {/* Quick Actions (styled identically to the landing hero buttons) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onOpenAddTx('expense')}
            style={{
              padding: '0.75rem 1.6rem',
              borderRadius: '9999px',
              backgroundColor: '#1b4332',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(27, 67, 50, 0.3)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#122f23'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1b4332'}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Expense</span>
          </button>

          <button
            onClick={() => onOpenAddTx('income')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #cfded4',
              color: '#16382b',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#16382b'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cfded4'}
          >
            <ArrowDownRight size={16} color="#10b981" />
            <span>Add Income</span>
          </button>

          <button
            onClick={onOpenAddSplit}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              backgroundColor: '#eaf3ed',
              border: '1px solid #c8ded0',
              color: '#16382b',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Users size={16} />
            <span>Split Group Bill</span>
          </button>

          <button
            onClick={() => exportTransactionsToCSV(transactions)}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              border: '1px solid #cfded4',
              color: '#52695c',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
            title="Download CSV Statement"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </section>

      {/* Row 1: 4 Stat Cards (Styled like the Phone Mockup stats!) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Card 1: Net Total Balance */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '1.75rem 1.6rem',
          border: '1px solid #e3ebe5',
          boxShadow: '0 8px 24px rgba(22, 56, 43, 0.04)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#52695c', fontWeight: 600 }}>Net Total Balance</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#eaf3ed', color: '#16382b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#16382b', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            {formatCurrency(netBalance, activeCurrencyCode, activeCurrency.rate)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
            <span>↑ +12.4%</span>
            <span style={{ color: '#7e9788', fontWeight: 500 }}>vs last billing cycle</span>
          </div>
        </div>

        {/* Card 2: Revenue / Inflow (Matching $26,300 card in Phone) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '1.75rem 1.6rem',
          border: '1px solid #e3ebe5',
          boxShadow: '0 8px 24px rgba(22, 56, 43, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#52695c', fontWeight: 600 }}>Revenue / Inflow</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#eaf7ee', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#16382b', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            {formatCurrency(totalIncome, activeCurrencyCode, activeCurrency.rate)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
            <span>↑ 5.14%</span>
            <span style={{ color: '#7e9788', fontWeight: 500 }}>salary & freelance</span>
          </div>
        </div>

        {/* Card 3: Orders / Outflow (Matching 2,465 card in Phone) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '1.75rem 1.6rem',
          border: '1px solid #e3ebe5',
          boxShadow: '0 8px 24px rgba(22, 56, 43, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#52695c', fontWeight: 600 }}>Total Outflow</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fdebee', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#16382b', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            {formatCurrency(totalExpense, activeCurrencyCode, activeCurrency.rate)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#0284c7', fontWeight: 700 }}>
            <span>↑ 3.2%</span>
            <span style={{ color: '#7e9788', fontWeight: 500 }}>{transactions.filter(t => t.type === 'expense').length} transactions</span>
          </div>
        </div>

        {/* Card 4: AI Projected Spend */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '1.75rem 1.6rem',
          border: '1px solid #e3ebe5',
          boxShadow: '0 8px 24px rgba(22, 56, 43, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#52695c', fontWeight: 600 }}>AI Projected Spend</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#16382b', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            {formatCurrency(prediction.projectedTotal, activeCurrencyCode, activeCurrency.rate)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#0284c7', fontWeight: 700 }}>
            <span>{prediction.confidence}</span>
            <span style={{ color: '#7e9788', fontWeight: 500 }}>daily burn {formatCurrency(prediction.dailyBurnRate, activeCurrencyCode, activeCurrency.rate)}/d</span>
          </div>
        </div>
      </div>

      {/* Row 2: Dual Live Charts (Exact Match to Phone Mockup Sales Area Wave + Revenue Growth Bars) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '1.75rem',
        marginBottom: '2rem'
      }}>
        {/* Chart 1: Sales Velocity & Cash Flow (Cyan/Blue Wave Gradient from Phone Screen) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2rem',
          border: '1px solid #e3ebe5',
          boxShadow: '0 8px 24px rgba(22, 56, 43, 0.04)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16382b' }}>Sales Velocity & Cash Flow</h3>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, backgroundColor: '#eaf7ee', padding: '0.15rem 0.5rem', borderRadius: '99px' }}>
                  +18.4%
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#52695c', marginTop: '2px' }}>
                Interactive 6-month trajectory with income inflow and expenditure velocity
              </p>
            </div>

            {/* Toggle filter */}
            <div style={{ display: 'flex', backgroundColor: '#f2f5f1', borderRadius: '99px', padding: '3px' }}>
              {['all', 'income', 'expense'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setChartMode(mode)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '99px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    backgroundColor: chartMode === mode ? '#1b4332' : 'transparent',
                    color: chartMode === mode ? '#ffffff' : '#657e70',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Glowing Cyan-Blue Wave Curve (Matching Phone Screen!) */}
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg width="100%" height="220" viewBox="0 0 600 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mainAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="expenseAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[30, 80, 130, 180].map((y, idx) => (
                <line key={idx} x1="0" y1={y} x2="600" y2={y} stroke="#edf2ee" strokeWidth="1" strokeDasharray="4 4" />
              ))}

              {/* Expense area if mode !== 'income' */}
              {chartMode !== 'income' && (
                <>
                  <path
                    d="M 0 160 Q 100 145 200 150 T 400 135 T 600 120 L 600 200 L 0 200 Z"
                    fill="url(#expenseAreaGrad)"
                  />
                  <path
                    d="M 0 160 Q 100 145 200 150 T 400 135 T 600 120"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    strokeDasharray="5 5"
                  />
                </>
              )}

              {/* Main Glowing Cyan-Blue Wave Curve (Matching Phone Mockup) */}
              {chartMode !== 'expense' && (
                <>
                  <path
                    d="M 0 170 Q 120 110 240 125 T 440 60 T 600 30 L 600 200 L 0 200 Z"
                    fill="url(#mainAreaGrad)"
                  />
                  <path
                    d="M 0 170 Q 120 110 240 125 T 440 60 T 600 30"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="4"
                  />
                  {/* Point dots */}
                  {[
                    { cx: 0, cy: 170 },
                    { cx: 120, cy: 110 },
                    { cx: 240, cy: 125 },
                    { cx: 360, cy: 90 },
                    { cx: 480, cy: 45 },
                    { cx: 600, cy: 30 }
                  ].map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.cx}
                      cy={pt.cy}
                      r="5"
                      fill="#ffffff"
                      stroke="#0284c7"
                      strokeWidth="3"
                    />
                  ))}
                </>
              )}
            </svg>

            {/* X-Axis Labels (Jan, Feb, Mar, Apr, May, Jun) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#7e9788', fontWeight: 600, marginTop: '8px', padding: '0 4px' }}>
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun (Current)</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Revenue Growth Bar Chart (Purple-to-Indigo Gradient Bars from Phone Screen) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2rem',
          border: '1px solid #e3ebe5',
          boxShadow: '0 8px 24px rgba(22, 56, 43, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16382b' }}>Revenue Growth</h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366f1' }}>Yearly +32%</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#52695c', marginBottom: '1.75rem' }}>
              Monthly progression and compounding savings efficiency
            </p>

            {/* Bars container */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '145px',
              padding: '0 6px',
              borderBottom: '1px solid #e3ebe5',
              paddingBottom: '8px'
            }}>
              {monthlyFlow.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6366f1' }}>{item.growth}%</span>
                  <div
                    style={{
                      width: '28px',
                      height: `${(item.growth / 100) * 115}px`,
                      borderRadius: '6px 6px 2px 2px',
                      background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)',
                      transition: 'height 0.3s ease'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#52695c', fontWeight: 600 }}>{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fbf9', padding: '0.85rem 1.1rem', borderRadius: '14px', border: '1px solid #e3ebe5' }}>
            <span style={{ fontSize: '0.82rem', color: '#52695c', fontWeight: 500 }}>Target Year-End Portfolio</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16382b' }}>$150,000</span>
          </div>
        </div>
      </div>

      {/* Row 3: Connected Schematic Widgets (Inspired by the Hero's floating badges!) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.75rem',
        marginBottom: '2rem'
      }}>
        {/* Left: FINANCE - AI Spend & Waste Audit (Top Badge Style) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2rem',
          border: '1px solid #e3ebe5',
          boxShadow: '0 8px 24px rgba(22, 56, 43, 0.04)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Search size={20} strokeWidth={2.5} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16382b', letterSpacing: '0.08em' }}>FINANCE AUDIT</span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16382b' }}>AI Waste & Opportunity Scanner</h4>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('ai-assistant')}
              style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1b4332', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
            >
              <span>Ask FinAI</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {aiSuggestions.slice(0, 2).map((sug, i) => (
              <div
                key={i}
                style={{
                  padding: '1rem 1.15rem',
                  borderRadius: '16px',
                  backgroundColor: '#f9fbf9',
                  border: '1px solid #e3ebe5',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#16382b' }}>{sug.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#52695c', marginTop: '2px' }}>{sug.description}</div>
                </div>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#0d8248',
                  backgroundColor: '#eaf7ee',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '99px',
                  whiteSpace: 'nowrap'
                }}>
                  +{formatCurrency(sug.potentialSaving, activeCurrencyCode, activeCurrency.rate)}/mo
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Debt Settlement - SplitSmart Engine (Bottom Badge Style) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2rem',
          border: '1px solid #e3ebe5',
          boxShadow: '0 8px 24px rgba(22, 56, 43, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#eaf3ed',
                color: '#16382b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16382b', letterSpacing: '0.08em' }}>SPLITSMART ENGINE</span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16382b' }}>Minimal Debt Settlement</h4>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('splitwise')}
              style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1b4332', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
            >
              <span>View Trips</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {groups.slice(0, 2).map((grp, i) => (
              <div
                key={grp.id}
                style={{
                  padding: '1rem 1.15rem',
                  borderRadius: '16px',
                  backgroundColor: '#f9fbf9',
                  border: '1px solid #e3ebe5',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16382b' }}>{grp.name}</div>
                  <div style={{ fontSize: '0.76rem', color: '#52695c', marginTop: '2px' }}>
                    {grp.members.length} members · Total {formatCurrency(grp.expenses.reduce((s, e) => s + e.amount, 0), activeCurrencyCode, activeCurrency.rate)}
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerCelebration();
                    onNavigateTab('splitwise');
                  }}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '99px',
                    backgroundColor: '#1b4332',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(27, 67, 50, 0.25)'
                  }}
                >
                  Settle Up
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Category Donut & Recent Transactions Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid #e3ebe5',
        boxShadow: '0 8px 24px rgba(22, 56, 43, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16382b' }}>Recent Activity & Statements</h3>
            <p style={{ fontSize: '0.82rem', color: '#52695c' }}>Verified transactions across cash, cards & SplitSmart groups</p>
          </div>
          <button
            onClick={() => onNavigateTab('transactions')}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '99px',
              backgroundColor: '#eaf3ed',
              color: '#16382b',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            View All Ledger →
          </button>
        </div>

        {/* Transactions Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e3ebe5', color: '#7e9788', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Transaction</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Method</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(tx => (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: '1px solid #f2f5f1',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fbf9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#16382b' }}>{tx.title}</div>
                    {tx.note && <div style={{ fontSize: '0.74rem', color: '#7e9788' }}>{tx.note}</div>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '99px',
                      backgroundColor: tx.type === 'income' ? '#eaf7ee' : '#fdebee',
                      color: tx.type === 'income' ? '#0d8248' : '#d92546'
                    }}>
                      {tx.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#52695c' }}>
                    {formatDate(tx.date)}
                  </td>
                  <td style={{ padding: '1rem', color: '#52695c' }}>
                    {tx.paymentMethod || 'UPI / Bank'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 800, color: tx.type === 'income' ? '#0d8248' : '#16382b' }}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, activeCurrencyCode, activeCurrency.rate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
