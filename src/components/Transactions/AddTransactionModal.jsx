import React, { useState } from 'react';
import { X, Check, Tag } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export function AddTransactionModal({ isOpen, onClose, initialType = 'expense' }) {
  const { categories, addTransaction, activeCurrencyCode } = useFinance();

  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(initialType === 'income' ? 'Salary & Compensation' : 'Food & Dining');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) {
      alert('Please provide a title and amount!');
      return;
    }

    addTransaction({
      type,
      title,
      amount: parseFloat(amount),
      category,
      paymentMethod,
      date,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      note
    });

    // Reset form & close
    setTitle('');
    setAmount('');
    setNote('');
    setTags('');
    onClose();
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Record New Transaction</h3>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Income vs Expense Toggle */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            padding: '0.35rem',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '12px',
            marginBottom: '1.25rem'
          }}>
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('Food & Dining');
              }}
              style={{
                padding: '0.6rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                backgroundColor: type === 'expense' ? 'var(--accent-expense)' : 'transparent',
                color: type === 'expense' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Salary & Compensation');
              }}
              style={{
                padding: '0.6rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                backgroundColor: type === 'income' ? 'var(--accent-income)' : 'transparent',
                color: type === 'income' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              Income (+)
            </button>
          </div>

          {/* Amount input */}
          <div className="form-group">
            <label className="form-label">Amount ({activeCurrencyCode})</label>
            <input
              type="number"
              step="any"
              required
              placeholder="e.g. 1500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-control"
              style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}
              autoFocus
            />
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title / Merchant</label>
            <input
              type="text"
              required
              placeholder="e.g. Grocery Mart, Client Project, Dinner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Category & Payment Method Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
              >
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-control"
              >
                <option value="UPI">UPI (GPay / PhonePe)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
                <option value="Crypto / Other">Crypto / Other</option>
              </select>
            </div>
          </div>

          {/* Date & Tags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. food, trip, urgent"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Note */}
          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <input
              type="text"
              placeholder="Add details, bill reference or location..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              className={type === 'expense' ? 'btn btn-primary' : 'btn btn-primary'}
              style={{
                backgroundColor: type === 'expense' ? 'var(--accent-expense)' : 'var(--accent-income)',
                backgroundImage: 'none'
              }}
            >
              <Check size={16} />
              <span>Save {type === 'expense' ? 'Expense' : 'Income'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}