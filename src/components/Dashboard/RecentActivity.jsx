import React from 'react';
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  Users,
  Trash2,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportTransactionsToCSV } from '../../utils/exportUtils';

export function RecentActivity({ onOpenAddTx, onOpenAddSplit, onViewAllTransactions }) {
  const {
    transactions,
    deleteTransaction,
    activeCurrency,
    activeCurrencyCode
  } = useFinance();

  const recent = transactions.slice(0, 5);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      {/* Top Header & Actions Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.08rem', color: 'var(--text-primary)' }}>Recent Transactions</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Latest inflows and outflows</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => onOpenAddTx('expense')}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => onOpenAddTx('income')}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
          >
            <ArrowUpRight size={16} color="var(--accent-income)" />
            <span>Add Income</span>
          </button>

          <button
            className="btn btn-split"
            onClick={onOpenAddSplit}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
          >
            <Users size={16} />
            <span>Split Bill</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => exportTransactionsToCSV(transactions)}
            title="Export CSV Statement"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <FileSpreadsheet size={16} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {recent.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            No transactions found. Click "Add Expense" to get started!
          </div>
        ) : (
          recent.map(t => {
            const isIncome = t.type === 'income';

            return (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: isIncome ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    color: isIncome ? 'var(--accent-income)' : 'var(--accent-expense)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.title}
                      </span>
                      <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`} style={{ fontSize: '0.66rem' }}>
                        {t.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.2rem', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} />
                        {formatDate(t.date)}
                      </span>
                      {t.paymentMethod && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CreditCard size={12} />
                          {t.paymentMethod}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: isIncome ? 'var(--accent-income)' : 'var(--accent-expense)'
                  }}>
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount, activeCurrencyCode, activeCurrency.rate)}
                  </span>

                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="btn-icon"
                    style={{ width: '32px', height: '32px', color: 'var(--text-tertiary)' }}
                    title="Delete transaction"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {transactions.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            className="btn btn-secondary"
            onClick={onViewAllTransactions}
            style={{ fontSize: '0.82rem', padding: '0.45rem 1.25rem' }}
          >
            View All {transactions.length} Transactions
          </button>
        </div>
      )}
    </div>
  );
}