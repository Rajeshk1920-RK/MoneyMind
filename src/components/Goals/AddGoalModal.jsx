import React, { useState } from 'react';
import { X, Check, Target } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export function AddGoalModal({ isOpen, onClose }) {
  const { addGoal, activeCurrencyCode } = useFinance();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Safety Net');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    addGoal({
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      targetDate: targetDate || '2027-01-01',
      category
    });

    onClose();
  };

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
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>New Savings Milestone</h3>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Goal Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Tesla Model 3 Downpayment, MacBook Pro, Emergency Fund"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Target Amount ({activeCurrencyCode})</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 150000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="form-control"
                style={{ fontSize: '1.2rem', fontWeight: 700 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Saved ({activeCurrencyCode})</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 25000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Target Completion Date</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
              >
                <option value="Safety Net">Safety Net & Emergency</option>
                <option value="Gadgets">Gadgets & Tech</option>
                <option value="Travel">Travel & Vacation</option>
                <option value="Real Estate">Real Estate / Home</option>
                <option value="Vehicles">Automobile / Vehicle</option>
                <option value="Other">Other Milestone</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Create Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}