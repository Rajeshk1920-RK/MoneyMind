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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Budgets & Limits
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            {budgets.length} active limits
          </span>
        </div>

        <button
          onClick={() => setIsAddBudgetOpen(true)}
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: '#059669',
            color: '#ffffff',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
          }}
        >
          <Plus size={14} />
          <span>New Budget</span>
        </button>
      </div>

      {/* Global Budget Overview Stat Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          padding: '1rem',
          border: '1px solid #e2ede8',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.85rem',
          boxSizing: 'border-box'
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Total Allocated</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
            {formatCurrency(totalBudgeted, activeCurrencyCode, activeCurrency.rate)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Total Spent</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
            {formatCurrency(totalSpentAcrossBudgets, activeCurrencyCode, activeCurrency.rate)}
          </div>
        </div>
      </div>

      {/* Category Budget Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '100%'
      }}>
        {budgetStats.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '2.5rem 1rem',
            textAlign: 'center',
            border: '1px solid #e2ede8'
          }}>
            <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.5rem' }}>🎯</span>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              No Budgets Configured
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
              Tap "+ New Budget" above to set category spending limits.
            </p>
          </div>
        ) : (
          budgetStats.map(budget => {
            let statusColor = '#059669';
            let statusText = 'On Track';
            let statusBg = '#ecfdf5';

            if (budget.isOverspent) {
              statusColor = '#ef4444';
              statusText = 'Overspent';
              statusBg = '#fef2f2';
            } else if (budget.isWarning) {
              statusColor = '#f59e0b';
              statusText = 'Caution';
              statusBg = '#fffbeb';
            }

            return (
              <div
                key={budget.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1rem',
                  border: budget.isOverspent ? '1.5px solid #fecaca' : '1px solid #e2ede8',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                      {budget.category}
                    </h4>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: statusBg,
                      color: statusColor,
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {statusText} • {budget.percentage}%
                    </span>
                  </div>

                  <button
                    onClick={() => deleteBudget(budget.id)}
                    style={{
                      color: '#cbd5e1',
                      padding: '4px',
                      cursor: 'pointer',
                      borderRadius: '6px'
                    }}
                    title="Delete budget"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                    <span style={{ color: '#64748b' }}>
                      Spent: <strong style={{ color: '#0f172a' }}>{formatCurrency(budget.spent, activeCurrencyCode, activeCurrency.rate)}</strong>
                    </span>
                    <span style={{ color: '#64748b' }}>
                      Limit: <strong style={{ color: '#0f172a' }}>{formatCurrency(budget.monthlyLimit, activeCurrencyCode, activeCurrency.rate)}</strong>
                    </span>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '7px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '99px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, budget.percentage)}%`,
                        backgroundColor: statusColor,
                        borderRadius: '99px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.72rem',
                  paddingTop: '0.4rem',
                  borderTop: '1px dashed #f1f5f9'
                }}>
                  <span style={{ color: '#64748b' }}>Remaining:</span>
                  <span style={{ fontWeight: 800, color: budget.remaining === 0 ? '#ef4444' : '#059669' }}>
                    {formatCurrency(budget.remaining, activeCurrencyCode, activeCurrency.rate)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Budget Modal */}
      {isAddBudgetOpen && (
        <AddBudgetModal
          isOpen={isAddBudgetOpen}
          onClose={() => setIsAddBudgetOpen(false)}
        />
      )}
    </div>
  );
}