import React, { useState } from 'react';
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Trash2,
  PieChart,
  ShieldCheck,
  Lock,
  Unlock,
  ShieldAlert
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { AddBudgetModal } from './AddBudgetModal';

export function BudgetManager() {
  const {
    budgets,
    deleteBudget,
    toggleBudgetLock,
    transactions,
    activeCurrency,
    activeCurrencyCode
  } = useFinance();

  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

  // Compute spent for each budget category
  const budgetStats = budgets.map(budget => {
    const isLocked = budget.isLocked !== false;
    const spent = transactions
      .filter(t => t.type === 'expense' && (
        t.category?.toLowerCase() === budget.category?.toLowerCase() ||
        (budget.category === 'Food & Dining' && (t.category?.toLowerCase().includes('food') || t.category?.toLowerCase().includes('dining')))
      ))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const percentage = Math.round((spent / (Number(budget.monthlyLimit) || 1)) * 100);
    const remaining = Math.max(0, Number(budget.monthlyLimit) - spent);
    const isOverspent = spent >= Number(budget.monthlyLimit);
    const isWarning = percentage >= (budget.alertThreshold || 80) && !isOverspent;

    return {
      ...budget,
      isLocked,
      spent,
      remaining,
      percentage,
      isOverspent,
      isWarning
    };
  });

  const totalBudgeted = budgets.reduce((s, b) => s + Number(b.monthlyLimit || 0), 0);
  const totalSpentAcrossBudgets = budgetStats.reduce((s, b) => s + b.spent, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Budgets & Spending Limits
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            {budgets.length} active categories • Lock protects against overspending
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
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: totalSpentAcrossBudgets > totalBudgeted && totalBudgeted > 0 ? '#ef4444' : '#059669', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
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
              Tap "+ New Budget" above to set category spending limits with automatic payment lock.
            </p>
          </div>
        ) : (
          budgetStats.map(budget => {
            let statusColor = '#059669';
            let statusText = 'On Track';
            let statusBg = '#ecfdf5';

            if (budget.isOverspent) {
              statusColor = '#ef4444';
              statusText = budget.isLocked ? 'Locked / Limit Reached' : 'Overspent';
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
                  border: budget.isOverspent ? '1.5px solid #fca5a5' : '1px solid #e2ede8',
                  boxShadow: budget.isOverspent ? '0 4px 14px rgba(239, 68, 68, 0.08)' : '0 2px 6px rgba(15, 23, 42, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {budget.category}
                      </h4>
                      {budget.isLocked && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '6px'
                        }}>
                          <Lock size={10} />
                          <span>Lock ON</span>
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
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
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {/* Toggle Lock Button */}
                    <button
                      type="button"
                      onClick={() => toggleBudgetLock(budget.id)}
                      style={{
                        backgroundColor: budget.isLocked ? '#fef2f2' : '#f1f5f9',
                        color: budget.isLocked ? '#dc2626' : '#64748b',
                        border: `1px solid ${budget.isLocked ? '#fecaca' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: 'pointer'
                      }}
                      title={budget.isLocked ? 'Strict Lock Enabled (Blocks payments exceeding limit)' : 'Lock Disabled (Warning only)'}
                    >
                      {budget.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                      <span>{budget.isLocked ? 'Strict Lock' : 'No Lock'}</span>
                    </button>

                    <button
                      onClick={() => deleteBudget(budget.id)}
                      style={{
                        color: '#94a3b8',
                        background: 'transparent',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        borderRadius: '6px'
                      }}
                      title="Delete budget"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
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

                {/* Overspent / Lock Warning Box */}
                {budget.isOverspent && budget.isLocked && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '10px',
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.72rem',
                    color: '#991b1b',
                    fontWeight: 700
                  }}>
                    <ShieldAlert size={14} color="#dc2626" style={{ flexShrink: 0 }} />
                    <span>Limit reached! Further payments for {budget.category} are locked.</span>
                  </div>
                )}

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