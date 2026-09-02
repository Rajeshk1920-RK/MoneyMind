import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export function AddBudgetModal({ isOpen, onClose }) {
  const { categories, addBudget, activeCurrencyCode } = useFinance();

  const [category, setCategory] = useState('Food & Dining');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState(80);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!monthlyLimit) return;

    addBudget({
      category,
      monthlyLimit: parseFloat(monthlyLimit),
      alertThreshold: parseInt(alertThreshold, 10)
    });

    onClose();
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Set Category Budget</h3>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
            >
              {expenseCategories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Limit ({activeCurrencyCode})</label>
            <input
              type="number"
              required
              placeholder="e.g. 10000"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              className="form-control"
              style={{ fontSize: '1.25rem', fontWeight: 700 }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alert Threshold: {alertThreshold}% of Limit</label>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
              <span>50% Early warning</span>
              <span>80% Default</span>
              <span>100% Strict</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Save Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}