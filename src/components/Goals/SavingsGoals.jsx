import React, { useState } from 'react';
import {
  Plus,
  Target,
  Sparkles,
  Trash2,
  Calendar,
  DollarSign,
  Award,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { AddGoalModal } from './AddGoalModal';

export function SavingsGoals() {
  const {
    goals,
    contributeToGoal,
    deleteGoal,
    activeCurrency,
    activeCurrencyCode
  } = useFinance();

  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  const handleDeposit = (e, goal) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return;

    contributeToGoal(goal.id, amount);

    // If goal is now reached
    if ((goal.currentAmount + amount) >= goal.targetAmount) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }

    setDepositAmount('');
    setDepositGoalId(null);
  };

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>Savings Goals & Milestones</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Turn dreams into reality by allocating and tracking target wealth milestones
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsAddGoalOpen(true)}
        >
          <Plus size={16} />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Overview Stat Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Target Portfolio</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(totalTarget, activeCurrencyCode, activeCurrency.rate)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Stashed Away</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-income)', fontFamily: 'var(--font-display)' }}>
            {formatCurrency(totalSaved, activeCurrencyCode, activeCurrency.rate)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Overall Completion</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>
            {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {goals.map(goal => {
          const progress = Math.min(100, Math.round((goal.currentAmount / (goal.targetAmount || 1)) * 100));
          const isCompleted = progress >= 100;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.2rem',
                border: isCompleted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div>
                  <span className="badge badge-split" style={{ fontSize: '0.68rem', marginBottom: '0.35rem' }}>
                    {goal.category}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {goal.title}
                  </h3>
                </div>

                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="btn-icon"
                  style={{ width: '32px', height: '32px', color: 'var(--text-tertiary)' }}
                  title="Delete goal"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Progress Bar & Amounts */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {formatCurrency(goal.currentAmount, activeCurrencyCode, activeCurrency.rate)}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isCompleted ? 'var(--accent-income)' : 'var(--accent-primary)' }}>
                    {progress}%
                  </span>
                </div>

                <div style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '99px',
                  overflow: 'hidden',
                  marginBottom: '0.4rem'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: isCompleted ? 'var(--success-gradient)' : 'var(--primary-gradient)',
                    borderRadius: '99px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                  <span>Target: {formatCurrency(goal.targetAmount, activeCurrencyCode, activeCurrency.rate)}</span>
                  <span>{isCompleted ? 'Goal Achieved!' : `${formatCurrency(remaining, activeCurrencyCode, activeCurrency.rate)} remaining`}</span>
                </div>
              </div>

              {/* Deposit Action or Form */}
              {depositGoalId === goal.id ? (
                <form onSubmit={(e) => handleDeposit(e, goal)} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <input
                    type="number"
                    step="any"
                    required
                    autoFocus
                    placeholder={`Amount (${activeCurrencyCode})`}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="form-control"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setDepositGoalId(null)} className="btn btn-secondary" style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}>
                    Cancel
                  </button>
                </form>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.74rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={13} />
                    <span>Target: {formatDate(goal.targetDate)}</span>
                  </div>

                  <button
                    onClick={() => setDepositGoalId(goal.id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem', borderRadius: '8px' }}
                  >
                    + Add Savings
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
      />
    </div>
  );
}