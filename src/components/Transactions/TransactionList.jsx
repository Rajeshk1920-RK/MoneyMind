import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Calendar,
  CreditCard,
  Download,
  Plus,
  ArrowUpDown
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportTransactionsToCSV } from '../../utils/exportUtils';

export function TransactionList({ onOpenAddTx }) {
  const {
    transactions,
    deleteTransaction,
    categories,
    activeCurrency,
    activeCurrencyCode
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [sortOrder, setSortOrder] = useState('date-desc');

  // Filter transactions
  const filtered = transactions.filter(t => {
    const matchesSearch =
      (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.note || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || t.type === selectedType;
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesPay = selectedPayment === 'all' || t.paymentMethod === selectedPayment;

    return matchesSearch && matchesType && matchesCat && matchesPay;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortOrder === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortOrder === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortOrder === 'amount-desc') return b.amount - a.amount;
    if (sortOrder === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  const totalFilteredIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalFilteredExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Title & Top Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>Transaction History</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Search, filter, and track all your income & expenses
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => exportTransactionsToCSV(filtered, 'filtered_transactions.csv')}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onOpenAddTx('expense')}
          >
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          alignItems: 'center'
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search by title, tag, or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.4rem', fontSize: '0.86rem' }}
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-control"
            style={{ fontSize: '0.86rem' }}
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
            style={{ fontSize: '0.86rem' }}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Payment Method Filter */}
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="form-control"
            style={{ fontSize: '0.86rem' }}
          >
            <option value="all">All Payment Modes</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash">Cash</option>
          </select>

          {/* Sort selector */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="form-control"
            style={{ fontSize: '0.86rem' }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>

        {/* Filter summary banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <span>Showing <strong>{filtered.length}</strong> of {transactions.length} transactions</span>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Filtered Inflow: <strong style={{ color: 'var(--accent-income)' }}>+{formatCurrency(totalFilteredIncome, activeCurrencyCode, activeCurrency.rate)}</strong></span>
            <span>Filtered Outflow: <strong style={{ color: 'var(--accent-expense)' }}>-{formatCurrency(totalFilteredExpense, activeCurrencyCode, activeCurrency.rate)}</strong></span>
          </div>
        </div>
      </div>

      {/* Transactions Table/List */}
      <div className="glass-panel" style={{ padding: '0.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem' }}>Transaction</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Payment Mode</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  No transactions match your search or filters.
                </td>
              </tr>
            ) : (
              filtered.map(t => {
                const isIncome = t.type === 'income';

                return (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          backgroundColor: isIncome ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                          color: isIncome ? 'var(--accent-income)' : 'var(--accent-expense)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                            {t.title}
                          </div>
                          {t.note && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                              {t.note}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`} style={{ fontSize: '0.7rem' }}>
                        {t.category}
                      </span>
                    </td>

                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {t.paymentMethod || '—'}
                    </td>

                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {formatDate(t.date)}
                    </td>

                    <td style={{ padding: '0.9rem 1rem', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: isIncome ? 'var(--accent-income)' : 'var(--accent-expense)' }}>
                      {isIncome ? '+' : '-'}{formatCurrency(t.amount, activeCurrencyCode, activeCurrency.rate)}
                    </td>

                    <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="btn-icon"
                        style={{ width: '30px', height: '30px', color: 'var(--text-tertiary)' }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}