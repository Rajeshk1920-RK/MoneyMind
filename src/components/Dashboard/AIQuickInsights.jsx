import React from 'react';
import {
  Sparkles,
  TrendingDown,
  Users,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useSplit } from '../../context/SplitContext';
import { generateAISavingSuggestions } from '../../utils/aiEngine';
import { formatCurrency } from '../../utils/formatters';

export function AIQuickInsights({ onOpenAI, onOpenSplitwise }) {
  const { transactions, budgets, activeCurrency, activeCurrencyCode } = useFinance();
  const { activeSimplifiedDebts, activeGroup } = useSplit();

  const suggestions = generateAISavingSuggestions(transactions, budgets);
  const topSuggestion = suggestions[0];

  // Check if someone owes user
  const owesYouDebt = activeSimplifiedDebts.find(d => d.to === 'mem-1');

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.75rem'
    }}>
      {/* AI Saving Opportunity Banner */}
      {topSuggestion && (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.4rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <Sparkles size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-split">{topSuggestion.tag}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                FinAI Recommendation
              </span>
            </div>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {topSuggestion.title}
            </h4>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.65rem' }}>
              {topSuggestion.description}
            </p>
            <button
              onClick={onOpenAI}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--accent-primary)'
              }}
            >
              <span>Explore All Saving Strategies</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* SplitSmart Debt Highlight */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.4rem',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(236, 72, 153, 0.05) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          flexShrink: 0
        }}>
          <Users size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-split">SplitSmart Hub</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-split)' }}>
              {activeGroup?.name || 'Group Expense'}
            </span>
          </div>

          {owesYouDebt ? (
            <>
              <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {owesYouDebt.fromName} owes you {formatCurrency(owesYouDebt.amount, activeCurrencyCode, activeCurrency.rate)}
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.65rem' }}>
                From food and trip shares. Debt engine automatically simplified 4 cross-debts into 1 direct settlement!
              </p>
            </>
          ) : (
            <>
              <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                All Trip Debts Balanced!
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.65rem' }}>
                Every friend is squared away. Add a new bill or start a new group anytime.
              </p>
            </>
          )}

          <button
            onClick={onOpenSplitwise}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--accent-split)'
            }}
          >
            <span>View Goa Trip Settlement Matrix</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}