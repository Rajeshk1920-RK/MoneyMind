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
  ArrowUpDown,
  Smartphone,
  Edit3,
  Tag,
  MessageSquare,
  List,
  Calendar as CalendarIcon,
  X,
  Zap
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportTransactionsToCSV } from '../../utils/exportUtils';
import { PaymentIntentPopup } from '../PaymentIntent/PaymentIntentPopup';
import { Calendar as UICalendar } from '../ui/calendar';

export function TransactionList({ onOpenAddTx, onOpenSimulateUPI, onOpenUpiPay }) {
  const {
    transactions,
    deleteTransaction,
    categories,
    activeCurrency,
    activeCurrencyCode
  } = useFinance();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [sortOrder, setSortOrder] = useState('date-desc');
  const [editingIntentTx, setEditingIntentTx] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter transactions
  const filtered = transactions.filter(t => {
    const matchesSearch =
      (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.merchant || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Activity & History
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            {filtered.length} total transactions
          </span>
        </div>

        {/* View Mode Pill */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderRadius: '9999px',
          padding: '3px',
          gap: '2px'
        }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: viewMode === 'list' ? '#ffffff' : 'transparent',
              color: viewMode === 'list' ? '#0f172a' : '#64748b',
              boxShadow: viewMode === 'list' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <List size={13} />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: viewMode === 'calendar' ? '#ffffff' : 'transparent',
              color: viewMode === 'calendar' ? '#0f172a' : '#64748b',
              boxShadow: viewMode === 'calendar' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <CalendarIcon size={13} />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* Horizontal Action Chips Bar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '4px',
        WebkitOverflowScrolling: 'touch'
      }}>
        {onOpenUpiPay && (
          <button
            onClick={() => onOpenUpiPay({ amount: '500' })}
            style={{
              flexShrink: 0,
              padding: '0.45rem 0.85rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
            }}
            title="Direct Pay via PhonePe, Google Pay, Paytm & Auto-Record Expense"
          >
            <Zap size={14} color="#ffffff" />
            <span>Direct UPI Pay</span>
          </button>
        )}

        {onOpenSimulateUPI && (
          <button
            onClick={onOpenSimulateUPI}
            style={{
              flexShrink: 0,
              padding: '0.45rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#059669',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={14} />
            <span>Sync SMS</span>
          </button>
        )}

        <button
          onClick={() => onOpenAddTx && onOpenAddTx('expense')}
          style={{
            flexShrink: 0,
            padding: '0.45rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer'
          }}
        >
          <Plus size={14} />
          <span>Add Transaction</span>
        </button>

        <button
          onClick={() => exportTransactionsToCSV(filtered, 'moneymind_transactions.csv')}
          style={{
            flexShrink: 0,
            padding: '0.45rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#475569',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer'
          }}
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      {viewMode === 'calendar' ? (
        <div style={{ width: '100%' }}>
          <UICalendar
            transactions={transactions}
            captionLayout="dropdown"
            onOpenAddTx={onOpenAddTx}
          />
        </div>
      ) : (
        <>
          {/* Mobile Search & Filter Section */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '0.85rem',
            border: '1px solid #e2ede8',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }}
              />
              <input
                type="text"
                placeholder="Search activity, merchant, note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Quick Type Filter Chips */}
            <div style={{
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              paddingBottom: '2px'
            }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'expense', label: 'Expenses' },
                { id: 'income', label: 'Income' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    backgroundColor: selectedType === tab.id ? '#059669' : '#f1f5f9',
                    color: selectedType === tab.id ? '#ffffff' : '#64748b',
                    transition: 'all 0.14s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}

              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  backgroundColor: showFilters ? '#e0e7ff' : '#f1f5f9',
                  color: showFilters ? '#3730a3' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Filter size={11} />
                <span>Filters</span>
              </button>
            </div>

            {/* Extended Dropdowns (shown if filter toggle active) */}
            {showFilters && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                paddingTop: '0.5rem',
                borderTop: '1px dashed #e2e8f0'
              }}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    padding: '0.45rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{
                    padding: '0.45rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                </select>
              </div>
            )}

            {/* Inflow / Outflow Summary */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0.4rem',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              <span style={{ color: '#059669' }}>
                Inflow: +{formatCurrency(totalFilteredIncome, activeCurrencyCode, activeCurrency.rate)}
              </span>
              <span style={{ color: '#ef4444' }}>
                Outflow: -{formatCurrency(totalFilteredExpense, activeCurrencyCode, activeCurrency.rate)}
              </span>
            </div>
          </div>

          {/* Native Mobile Transaction Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filtered.length === 0 ? (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                padding: '2.5rem 1rem',
                textAlign: 'center',
                border: '1px solid #e2ede8'
              }}>
                <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.5rem' }}>🍃</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  No Transactions Found
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                  Tap the (+) button below or Sync SMS to log your expenses.
                </p>
              </div>
            ) : (
              filtered.map((t) => {
                const isIncome = t.type === 'income';
                const isUPI = t.paymentMethod === 'UPI' || t.source === 'simulated_upi';
                const hasIntent = Boolean(t.intentCaptured || t.intentCategory);

                return (
                  <div
                    key={t.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '0.85rem',
                      border: '1px solid #e2ede8',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Left: Icon + Merchant & Category */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        backgroundColor: isIncome ? '#ecfdf5' : '#fef2f2',
                        color: isIncome ? '#059669' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {t.merchant || t.title}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '6px',
                            backgroundColor: isIncome ? '#ecfdf5' : '#f8fafc',
                            color: isIncome ? '#059669' : '#64748b',
                            border: '1px solid #e2e8f0'
                          }}>
                            {t.category}
                          </span>

                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                            {formatDate(t.date)}
                          </span>
                        </div>

                        {/* UPI Payment reason note */}
                        {isUPI && (
                          <div style={{ marginTop: '3px' }}>
                            {hasIntent ? (
                              <span style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 600 }}>
                                💡 {t.intentCategory || t.category}
                              </span>
                            ) : (
                              <button
                                onClick={() => setEditingIntentTx(t)}
                                style={{
                                  fontSize: '0.66rem',
                                  color: '#2563eb',
                                  fontWeight: 700,
                                  backgroundColor: '#eff6ff',
                                  border: '1px solid #bfdbfe',
                                  borderRadius: '6px',
                                  padding: '1px 6px',
                                  cursor: 'pointer'
                                }}
                              >
                                + Add reason
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Amount & Delete Button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: '4px' }}>
                      <span style={{
                        fontSize: '0.98rem',
                        fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                        color: isIncome ? '#059669' : '#ef4444',
                        letterSpacing: '-0.02em'
                      }}>
                        {isIncome ? '+' : '-'}{formatCurrency(t.amount, activeCurrencyCode, activeCurrency.rate)}
                      </span>

                      <button
                        onClick={() => deleteTransaction(t.id)}
                        style={{
                          color: '#cbd5e1',
                          padding: '2px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          borderRadius: '6px'
                        }}
                        title="Delete transaction"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Edit Payment Intent Popup Modal */}
      {editingIntentTx && (
        <PaymentIntentPopup
          transaction={editingIntentTx}
          isEditMode={true}
          onClose={() => setEditingIntentTx(null)}
        />
      )}
    </div>
  );
}