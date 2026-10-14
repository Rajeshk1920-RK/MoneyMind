import React, { useState } from 'react';
import { InsightCard } from './InsightCard';
import { Sparkles, Layers, ShieldAlert, CheckCircle2 } from 'lucide-react';
import './MoneyIntelligence.css';

export function SmartMoneyInsights({ insights = [], onOpenAddTx }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredInsights = insights.filter(ins => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'priority') return ins.priority === 'high' || ins.priority === 'medium';
    if (activeFilter === 'positive') return ins.priority === 'positive';
    if (activeFilter === 'budgets') return ins.type === 'budget_warning' || ins.type === 'concentration';
    return true;
  });

  return (
    <div className="insights-section">
      <div className="insights-header-row">
        <div>
          <h3 className="insights-title">Smart Money Insights</h3>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            {insights.length} local deterministic financial patterns detected
          </span>
        </div>

        {insights.length > 0 && (
          <div className="insights-filter-pills">
            <button
              type="button"
              className={`insights-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({insights.length})
            </button>
            <button
              type="button"
              className={`insights-pill ${activeFilter === 'priority' ? 'active' : ''}`}
              onClick={() => setActiveFilter('priority')}
            >
              Priority
            </button>
            <button
              type="button"
              className={`insights-pill ${activeFilter === 'positive' ? 'active' : ''}`}
              onClick={() => setActiveFilter('positive')}
            >
              Positive
            </button>
            <button
              type="button"
              className={`insights-pill ${activeFilter === 'budgets' ? 'active' : ''}`}
              onClick={() => setActiveFilter('budgets')}
            >
              Budgets
            </button>
          </div>
        )}
      </div>

      {insights.length === 0 ? (
        <div className="intel-empty-card">
          <span className="intel-empty-emoji">💡</span>
          <h4 className="intel-empty-title">No Insights Generated Yet</h4>
          <p className="intel-empty-desc">
            As you log income, UPI payments, and budget categories, your on-device engine will automatically detect trends and opportunities.
          </p>
          {onOpenAddTx && (
            <button
              type="button"
              onClick={() => onOpenAddTx('expense')}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: '10px' }}
            >
              Add Expense
            </button>
          )}
        </div>
      ) : (
        <div className="insights-grid">
          {filteredInsights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}
