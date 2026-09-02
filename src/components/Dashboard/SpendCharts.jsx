import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

export function SpendCharts() {
  const { transactions, activeCurrency, activeCurrencyCode } = useFinance();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Group expenses by category
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

  const categoryTotals = {};
  const categoryColors = {
    'Food & Dining': '#f59e0b',
    'Travel & Transport': '#3b82f6',
    'Housing & Rent': '#8b5cf6',
    'Utilities & Bills': '#06b6d4',
    'Shopping & Electronics': '#ec4899',
    'Entertainment & Subs': '#f43f5e',
    'Healthcare & Wellness': '#10b981',
    'Investments & Savings': '#6366f1',
    'Settlement': '#a855f7'
  };

  expenseTransactions.forEach(t => {
    const cat = t.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount);
  });

  const categoriesSorted = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      color: categoryColors[name] || '#94a3b8',
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  // Donut SVG computation
  let accumulatedAngle = 0;
  const donutSlices = categoriesSorted.map(cat => {
    const sliceAngle = (cat.amount / (totalExpense || 1)) * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += sliceAngle;
    return {
      ...cat,
      startAngle,
      sliceAngle
    };
  });

  // Helper to get SVG arc path
  const getArcPath = (cx, cy, rInner, rOuter, startDeg, sweepDeg) => {
    const safeSweep = Math.min(sweepDeg, 359.99);
    const startRad = ((startDeg - 90) * Math.PI) / 180;
    const endRad = (((startDeg + safeSweep) - 90) * Math.PI) / 180;

    const x1 = cx + rOuter * Math.cos(startRad);
    const y1 = cy + rOuter * Math.sin(startRad);
    const x2 = cx + rOuter * Math.cos(endRad);
    const y2 = cy + rOuter * Math.sin(endRad);

    const x3 = cx + rInner * Math.cos(endRad);
    const y3 = cy + rInner * Math.sin(endRad);
    const x4 = cx + rInner * Math.cos(startRad);
    const y4 = cy + rInner * Math.sin(startRad);

    const largeArc = safeSweep > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  // Monthly flow mock data (last 6 months)
  const monthlyFlow = [
    { month: 'Apr', income: 82000, expense: 51000 },
    { month: 'May', income: 85000, expense: 56000 },
    { month: 'Jun', income: 94000, expense: 62000 },
    { month: 'Jul', income: 88000, expense: 54000 },
    { month: 'Aug', income: 103000, expense: 54040 },
    { month: 'Sep', income: 85000, expense: totalExpense }
  ];

  const maxVal = Math.max(...monthlyFlow.map(m => Math.max(m.income, m.expense))) * 1.15;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.75rem'
    }}>
      {/* Monthly Cashflow Bar Chart */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>Monthly Cash Flow</h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Income vs Expense comparison (Past 6 months)</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.74rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-income)' }} />
              <span>Income</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-expense)' }} />
              <span>Expense</span>
            </div>
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div style={{ width: '100%', height: '220px', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 500 220" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 50, 100, 150, 190].map((y, idx) => (
              <line
                key={idx}
                x1="40"
                y1={y}
                x2="480"
                y2={y}
                stroke="var(--border-subtle)"
                strokeDasharray="4"
              />
            ))}

            {/* Bars */}
            {monthlyFlow.map((item, idx) => {
              const xCenter = 70 + idx * 70;
              const barWidth = 18;
              const incomeHeight = (item.income / maxVal) * 160;
              const expenseHeight = (item.expense / maxVal) * 160;

              return (
                <g key={item.month}>
                  {/* Income bar */}
                  <rect
                    x={xCenter - barWidth - 2}
                    y={190 - incomeHeight}
                    width={barWidth}
                    height={incomeHeight}
                    rx="4"
                    fill="url(#incomeGrad)"
                  />
                  {/* Expense bar */}
                  <rect
                    x={xCenter + 2}
                    y={190 - expenseHeight}
                    width={barWidth}
                    height={expenseHeight}
                    rx="4"
                    fill="url(#expenseGrad)"
                  />
                  {/* Label */}
                  <text
                    x={xCenter}
                    y="210"
                    fill="var(--text-secondary)"
                    fontSize="11"
                    textAnchor="middle"
                    fontFamily="var(--font-display)"
                    fontWeight="500"
                  >
                    {item.month}
                  </text>
                </g>
              );
            })}

            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Category Breakdown Donut Chart */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>Spending by Category</h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Interactive expense allocation</p>
          </div>
          <span className="badge badge-split" style={{ fontSize: '0.7rem' }}>
            {categoriesSorted.length} Categories
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Donut graphic */}
          <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              {donutSlices.map((slice, i) => {
                const path = getArcPath(90, 90, 52, 80, slice.startAngle, slice.sliceAngle);
                const isHovered = hoveredCategory === slice.name;
                return (
                  <path
                    key={i}
                    d={path}
                    fill={slice.color}
                    opacity={hoveredCategory ? (isHovered ? 1 : 0.4) : 0.9}
                    style={{
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease, transform 0.2s ease',
                      transformOrigin: '90px 90px',
                      transform: isHovered ? 'scale(1.04)' : 'scale(1)'
                    }}
                    onMouseEnter={() => setHoveredCategory(slice.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Total Outflow
              </span>
              <span style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatCurrency(totalExpense, activeCurrencyCode, activeCurrency.rate)}
              </span>
            </div>
          </div>

          {/* Legend list */}
          <div style={{ flex: 1, minWidth: '150px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingRight: '0.25rem' }}>
            {categoriesSorted.map(cat => (
              <div
                key={cat.name}
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '6px',
                  backgroundColor: hoveredCategory === cat.name ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color, flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {cat.name}
                  </span>
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {cat.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}