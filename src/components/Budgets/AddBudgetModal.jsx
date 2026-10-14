import React, { useState } from 'react';
import { X, Check, Lock, ShieldCheck } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export function AddBudgetModal({ isOpen, onClose }) {
  const { categories, addBudget, activeCurrencyCode } = useFinance();

  const [category, setCategory] = useState('Food & Dining');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [isLocked, setIsLocked] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!monthlyLimit) return;

    addBudget({
      category,
      monthlyLimit: parseFloat(monthlyLimit),
      alertThreshold: parseInt(alertThreshold, 10),
      isLocked: Boolean(isLocked)
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={16} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
              Set Category Budget & Lock
            </h3>
          </div>
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
              placeholder="e.g. 5000"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              className="form-control"
              style={{ fontSize: '1.25rem', fontWeight: 700 }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alert Warning: {alertThreshold}% of Limit</label>
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

          {/* Strict Budget Lock Toggle */}
          <div style={{
            marginTop: '1.25rem',
            padding: '0.95rem 1rem',
            borderRadius: '14px',
            backgroundColor: isLocked ? '#fef2f2' : '#f8fafc',
            border: `1.5px solid ${isLocked ? '#fecaca' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }} onClick={() => setIsLocked(!isLocked)}>
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              id="budget-lock-check"
              style={{
                width: '18px',
                height: '18px',
                accentColor: '#dc2626',
                marginTop: '2px',
                cursor: 'pointer'
              }}
            />
            <div style={{ flex: 1 }}>
              <label htmlFor="budget-lock-check" style={{
                fontSize: '0.86rem',
                fontWeight: 800,
                color: isLocked ? '#991b1b' : '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                marginBottom: '0.2rem'
              }}>
                <Lock size={14} color={isLocked ? '#dc2626' : '#64748b'} />
                <span>Hard Lock Payments When Reached</span>
              </label>
              <p style={{ fontSize: '0.75rem', color: isLocked ? '#b91c1c' : '#64748b', margin: 0, lineHeight: 1.35 }}>
                Strictly block any UPI transfer, card payment, or expense that exceeds ₹{monthlyLimit || '5,000'} for {category}.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              fontWeight: 700
            }}>
              <Check size={16} />
              <span>Save & Lock Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}