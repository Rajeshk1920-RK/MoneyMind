import React, { useState } from 'react';
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Trash2,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { AddBudgetModal } from './AddBudgetModal';

export function BudgetManager() {
  const {
    budgets,
    deleteBudget,
    transactions,
    activeCurrency,
    activeCurrencyCode
  } = useFinance();

  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

  // Compute spent for each budget category
  const budgetStats = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const percentage = Math.round((spent / (budget.monthlyLimit || 1)) * 100);
    const remaining = Math.max(0, budget.monthlyLimit - spent);
    const isOverspent = spent > budget.monthlyLimit;
    const isWarning = percentage >= (budget.alertThreshold || 80) && !isOverspent;

    return {
      ...budget,
      spent,
      remaining,
      percentage,
      isOverspent,
      isWarning
    };
  });

  const totalBudgeted = budgets.reduce((s, b) => s + b.monthlyLimit, 0);
  const totalSpentAcrossBudgets = budgetStats.reduce((s, b) => s + b.spent, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>Monthly Budgets & Alerts</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Set category limits and get proactive warning notifications before you overspend
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsAddBudgetOpen(true)}
        >
          <Plus size={16} />
          <span>Set Category Budget</span>
        </button>
      </div>

      {/* Global Budget Overview Stat Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Allocated Budget</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(totalBudgeted, activeCurrencyCode, activeCurrency.rate)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Spent So Far</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-expense)', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(totalSpentAcrossBudgets, activeCurrencyCode, activeCurrency.rate)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Budget Utilization</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>
            {totalBudgeted > 0 ? Math.round((totalSpentAcrossBudgets / totalBudgeted) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Category Budget Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {budgetStats.map(budget => {
          let statusColor = 'var(--accent-income)';
          let statusText = 'On Track';
          let statusBadgeClass = 'badge-income';

          if (budget.isOverspent) {
            statusColor = 'var(--accent-expense)';
            statusText = 'Overspent';
            statusBadgeClass = 'badge-expense';
          } else if (budget.isWarning) {
            statusColor = 'var(--accent-warning)';
            statusText = 'Caution Zone';
            statusBadgeClass = 'badge-warning';
          }

          return (
            <div
              key={budget.id}
              className="glass-panel"
              style={{
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.1rem',
                border: budget.isOverspent ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    {budget.category}
                  </h4>
                  <span className={`badge ${statusBadgeClass}`} style={{ fontSize: '0.7rem' }}>
                    {statusText}
                  </span>
                </div>

                <button
                  onClick={() => deleteBudget(budget.id)}
                  className="btn-icon"
                  style={{ width: '32px', height: '32px', color: 'var(--text-tertiary)' }}
                  title="Delete budget"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Spent: <strong>{formatCurrency(budget.spent, activeCurrencyCode, activeCurrency.rate)}</strong>
                  </span>
                  <span style={{ fontWeight: 700, color: statusColor }}>
                    {budget.percentage}%
                  </span>
                </div>

                <div style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '99px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(100, budget.percentage)}%`,
                    height: '100%',
                    backgroundColor: statusColor,
                    borderRadius: '99px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Footer info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.76rem',
                color: 'var(--text-tertiary)',
                paddingTop: '0.65rem',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <span>Limit: {formatCurrency(budget.monthlyLimit, activeCurrencyCode, activeCurrency.rate)}</span>
                <span>
                  {budget.isOverspent ? (
                    <strong style={{ color: 'var(--accent-expense)' }}>
                      Exceeded by {formatCurrency(budget.spent - budget.monthlyLimit, activeCurrencyCode, activeCurrency.rate)}
                    </strong>
                  ) : (
                    <span>{formatCurrency(budget.remaining, activeCurrencyCode, activeCurrency.rate)} left</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <AddBudgetModal
        isOpen={isAddBudgetOpen}
        onClose={() => setIsAddBudgetOpen(false)}
      />
    </div>
  );
}