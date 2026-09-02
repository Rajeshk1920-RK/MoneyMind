import React, { useState } from 'react';
import { X, Check, Users } from 'lucide-react';
import { useSplit } from '../../context/SplitContext';
import { useFinance } from '../../context/FinanceContext';

export function AddSplitModal({ isOpen, onClose }) {
  const { activeGroup, addExpenseToGroup } = useSplit();
  const { activeCurrencyCode } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(activeGroup?.members[0]?.id || 'mem-1');
  const [category, setCategory] = useState('Food');
  const [involvedMembers, setInvolvedMembers] = useState(
    activeGroup ? activeGroup.members.map(m => m.id) : []
  );

  if (!isOpen || !activeGroup) return null;

  const toggleMemberInvolvement = (memberId) => {
    if (involvedMembers.includes(memberId)) {
      if (involvedMembers.length > 1) {
        setInvolvedMembers(involvedMembers.filter(id => id !== memberId));
      } else {
        alert('At least one member must be involved in the split!');
      }
    } else {
      setInvolvedMembers([...involvedMembers, memberId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) {
      alert('Please provide a title and amount!');
      return;
    }

    addExpenseToGroup(activeGroup.id, {
      title,
      amount: parseFloat(amount),
      paidBy,
      category,
      involvedMembers,
      splitType: 'equal'
    });

    // Reset & close
    setTitle('');
    setAmount('');
    onClose();
  };

  const perPersonShare = amount && involvedMembers.length > 0
    ? (parseFloat(amount) / involvedMembers.length).toFixed(0)
    : '0';

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-split)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Users size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Add Group Bill</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{activeGroup.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Bill / Expense Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Seafood Dinner, SUV Cab, Villa Stay"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Total Amount ({activeCurrencyCode})</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 2000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
                style={{ fontSize: '1.25rem', fontWeight: 700 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Paid By</label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="form-control"
              >
                {activeGroup.members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.avatar} {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
            >
              <option value="Food">Food & Drinks</option>
              <option value="Travel">Travel & Fuel / Tolls</option>
              <option value="Stay">Hotel / Villa Stay</option>
              <option value="Activity">Activities & Tickets</option>
              <option value="Groceries">Shared Groceries</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Members Split Selection */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Split Equally Among ({involvedMembers.length} People)</label>
              {amount > 0 && (
                <span className="badge badge-split" style={{ fontSize: '0.72rem' }}>
                  ₹{perPersonShare} / person
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {activeGroup.members.map(m => {
                const isSelected = involvedMembers.includes(m.id);
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => toggleMemberInvolvement(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      border: `1px solid ${isSelected ? 'var(--accent-split)' : 'var(--border-subtle)'}`,
                      background: isSelected ? 'rgba(168, 85, 247, 0.12)' : 'var(--bg-input)',
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>{m.avatar}</span>
                    <span style={{ fontWeight: isSelected ? 600 : 400, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.name}
                    </span>
                    {isSelected && <Check size={14} color="var(--accent-split)" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-split">
              <Check size={16} />
              <span>Record & Calculate Split</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}