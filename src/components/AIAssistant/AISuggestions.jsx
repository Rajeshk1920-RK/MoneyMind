import React from 'react';
import { Sparkles, TrendingDown, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { generateAISavingSuggestions } from '../../utils/aiEngine';
import { formatCurrency } from '../../utils/formatters';

export function AISuggestions({ onAction }) {
  const { transactions, budgets, activeCurrency, activeCurrencyCode } = useFinance();
  const suggestions = generateAISavingSuggestions(transactions, budgets);

  const totalPotentialSavings = suggestions.reduce((sum, s) => sum + (s.potentialSaving || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.4rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(217, 70, 239, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>AI Saving Opportunities Identified</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              FinAI analyzed your last 30 days of transactions and detected high-yield savings opportunities.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Estimated Monthly Savings
          </span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--accent-income)', fontFamily: 'var(--font-display)' }}>
            +{formatCurrency(totalPotentialSavings, activeCurrencyCode, activeCurrency.rate)}/mo
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {suggestions.map(sug => {
          return (
            <div
              key={sug.id}
              className="glass-panel"
              style={{
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <span className="badge badge-split">{sug.tag}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: sug.impact === 'High' ? 'var(--accent-expense)' : 'var(--accent-warning)'
                  }}>
                    {sug.impact} Impact
                  </span>
                </div>

                <h4 style={{ fontSize: '1.02rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {sug.title}
                </h4>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {sug.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Potential Saving
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-income)' }}>
                    +{formatCurrency(sug.potentialSaving, activeCurrencyCode, activeCurrency.rate)}
                  </div>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => onAction && onAction(sug)}
                  style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
                >
                  <span>{sug.action}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}