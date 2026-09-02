import React, { useState } from 'react';
import {
  Plus,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  Download,
  Trash2,
  Tag,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useSplit } from '../../context/SplitContext';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportSplitSummaryToCSV } from '../../utils/exportUtils';
import { AddSplitModal } from './AddSplitModal';
import { SettleModal } from './SettleModal';

export function GroupDetail() {
  const {
    activeGroup,
    activeBalances,
    activeSimplifiedDebts,
    deleteGroupExpense
  } = useSplit();

  const { activeCurrency, activeCurrencyCode } = useFinance();

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);

  if (!activeGroup) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        Select or create a group to view split details.
      </div>
    );
  }

  // Total group spending
  const totalGroupSpend = activeGroup.expenses
    .filter(e => !e.isSettlement)
    .reduce((sum, e) => sum + Number(e.amount), 0);

  // User's personal balance in this group (user is 'mem-1' / Rajesh)
  const myBalance = activeBalances['mem-1'] || 0;
  const isOwed = myBalance > 0.01;
  const owes = myBalance < -0.01;

  const memberMap = new Map(activeGroup.members.map(m => [m.id, m]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Group Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(217, 70, 239, 0.06) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '1.65rem', color: 'var(--text-primary)' }}>{activeGroup.name}</h2>
            <span className="badge badge-split" style={{ fontSize: '0.75rem' }}>
              {activeGroup.members.length} Members
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            {activeGroup.description || 'Shared group expenses & automatic debt settlement'}
          </p>

          {/* Members Avatars preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.75rem' }}>
            {activeGroup.members.map(m => (
              <span
                key={m.id}
                title={m.name}
                style={{
                  fontSize: '1.2rem',
                  padding: '0.2rem 0.35rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {m.avatar}
              </span>
            ))}
          </div>
        </div>

        {/* Group Stats & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Total Group Outlay
            </span>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {formatCurrency(totalGroupSpend, activeCurrencyCode, activeCurrency.rate)}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>
              {isOwed && <span style={{ color: 'var(--accent-income)' }}>You get back {formatCurrency(myBalance, activeCurrencyCode, activeCurrency.rate)}</span>}
              {owes && <span style={{ color: 'var(--accent-expense)' }}>You owe {formatCurrency(Math.abs(myBalance), activeCurrencyCode, activeCurrency.rate)}</span>}
              {!isOwed && !owes && <span style={{ color: 'var(--text-tertiary)' }}>You are all settled up!</span>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              className="btn btn-split"
              onClick={() => setIsAddExpenseOpen(true)}
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.86rem' }}
            >
              <Plus size={16} />
              <span>Add Group Bill</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => exportSplitSummaryToCSV(activeGroup)}
              style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
            >
              <Download size={14} />
              <span>Export Trip CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ WHO OWES WHOM: Minimal Debt Settlement Section ⭐ */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="var(--accent-split)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                Who Owes Whom (Minimal Debt Settlements)
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Our greedy algorithm simplifies complex group debts into the absolute minimum number of payments.
            </p>
          </div>
          <span className="badge badge-split">
            {activeSimplifiedDebts.length} Transfers Needed
          </span>
        </div>

        {activeSimplifiedDebts.length === 0 ? (
          <div style={{
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px dashed rgba(16, 185, 129, 0.3)',
            borderRadius: '16px'
          }}>
            <CheckCircle2 size={36} color="var(--accent-income)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Everyone is completely squared away!
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              No outstanding debts remain in this group.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {activeSimplifiedDebts.map((debt, index) => {
              const isYouDebtor = debt.from === 'mem-1';
              const isYouCreditor = debt.to === 'mem-1';

              return (
                <div
                  key={index}
                  style={{
                    padding: '1.15rem',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-card)',
                    border: `1px solid ${isYouDebtor || isYouCreditor ? 'var(--border-glow)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.35rem' }}>{debt.fromAvatar}</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {debt.fromName}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--accent-expense)' }}>Owes</span>
                      </div>
                    </div>

                    <ArrowRight size={18} color="var(--accent-split)" />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textAlign: 'right' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {debt.toName}
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--accent-income)' }}>Gets Paid</span>
                      </div>
                      <span style={{ fontSize: '1.35rem' }}>{debt.toAvatar}</span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      {formatCurrency(debt.amount, activeCurrencyCode, activeCurrency.rate)}
                    </span>

                    <button
                      className="btn btn-primary"
                      onClick={() => setSelectedSettlement(debt)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.76rem',
                        background: 'var(--success-gradient)'
                      }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Settle Up</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Member Balances Overview Grid */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Member Net Balances
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {activeGroup.members.map(member => {
            const bal = activeBalances[member.id] || 0;
            const positive = bal > 0.01;
            const negative = bal < -0.01;

            return (
              <div
                key={member.id}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <div style={{ fontSize: '1.6rem' }}>{member.avatar}</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {member.name}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: positive ? 'var(--accent-income)' : negative ? 'var(--accent-expense)' : 'var(--text-tertiary)'
                  }}>
                    {positive && `+${formatCurrency(bal, activeCurrencyCode, activeCurrency.rate)}`}
                    {negative && `-${formatCurrency(Math.abs(bal), activeCurrencyCode, activeCurrency.rate)}`}
                    {!positive && !negative && 'Settled ($0)'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Group Expenses History List */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>Group Expenses Log</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {activeGroup.expenses.length} Total items
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {activeGroup.expenses.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              No expenses recorded yet. Click "Add Group Bill" to start!
            </div>
          ) : (
            activeGroup.expenses.map(expense => {
              const payer = memberMap.get(expense.paidBy);

              return (
                <div
                  key={expense.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: expense.isSettlement ? 'rgba(16, 185, 129, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                      color: expense.isSettlement ? 'var(--accent-income)' : 'var(--accent-split)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>
                      {expense.isSettlement ? 'SETTLED' : 'EXPENSE'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {expense.title}
                        </span>
                        <span className={`badge ${expense.isSettlement ? 'badge-income' : 'badge-split'}`} style={{ fontSize: '0.65rem' }}>
                          {expense.category || 'Split'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                        Paid by <strong>{payer ? payer.name : 'Someone'}</strong> on {formatDate(expense.date)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                      {formatCurrency(expense.amount, activeCurrencyCode, activeCurrency.rate)}
                    </span>

                    <button
                      onClick={() => deleteGroupExpense(activeGroup.id, expense.id)}
                      className="btn-icon"
                      style={{ width: '32px', height: '32px', color: 'var(--text-tertiary)' }}
                      title="Delete expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      <AddSplitModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />

      <SettleModal
        isOpen={!!selectedSettlement}
        settlement={selectedSettlement}
        onClose={() => setSelectedSettlement(null)}
      />
    </div>
  );
}