import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Sparkles,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { predictMonthEndExpense } from '../../utils/aiEngine';

export function MetricCards() {
  const {
    totalIncome,
    totalExpense,
    netBalance,
    savingsRate,
    transactions,
    activeCurrency,
    activeCurrencyCode
  } = useFinance();

  const prediction = predictMonthEndExpense(transactions);

  const cards = [
    {
      title: 'Net Total Balance',
      amount: netBalance,
      icon: Wallet,
      gradient: 'linear-gradient(135deg, #16382b 0%, #2d6a4f 100%)',
      subtext: '+12.4% from last month',
      trendPositive: true
    },
    {
      title: 'Total Inflow (Income)',
      amount: totalIncome,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      subtext: 'Active Salary + Freelance',
      trendPositive: true
    },
    {
      title: 'Total Outflow (Spend)',
      amount: totalExpense,
      icon: TrendingDown,
      gradient: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
      subtext: `${transactions.filter(t => t.type === 'expense').length} recorded transactions`,
      trendPositive: false
    },
    {
      title: 'AI Predicted Month-End Spend',
      amount: prediction.projectedTotal,
      icon: Sparkles,
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      subtext: `Daily burn: ${formatCurrency(prediction.dailyBurnRate, activeCurrencyCode, activeCurrency.rate)}/day`,
      badge: prediction.confidence
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.75rem'
    }}>
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '1.4rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient background glow */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: c.gradient,
              opacity: 0.15,
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {c.title}
              </span>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: c.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <Icon size={18} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
                {formatCurrency(c.amount, activeCurrencyCode, activeCurrency.rate)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  {c.subtext}
                </span>
                {c.badge && (
                  <span className="badge badge-split" style={{ fontSize: '0.65rem' }}>
                    {c.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}