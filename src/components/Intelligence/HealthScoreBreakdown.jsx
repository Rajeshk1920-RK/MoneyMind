import React from 'react';
import {
  PiggyBank,
  PieChart,
  CreditCard,
  Target,
  Clock
} from 'lucide-react';

const BREAKDOWN_CONFIG = [
  {
    key: 'savings',
    label: 'Savings Performance',
    weight: '30%',
    icon: PiggyBank,
    color: '#059669',
    bg: '#ecfdf5'
  },
  {
    key: 'budget',
    label: 'Budget Management',
    weight: '25%',
    icon: PieChart,
    color: '#2563eb',
    bg: '#eff6ff'
  },
  {
    key: 'spending',
    label: 'Spending Behavior',
    weight: '20%',
    icon: CreditCard,
    color: '#8b5cf6',
    bg: '#f5f3ff'
  },
  {
    key: 'goals',
    label: 'Savings Goals',
    weight: '15%',
    icon: Target,
    color: '#f59e0b',
    bg: '#fffbeb'
  },
  {
    key: 'consistency',
    label: 'Financial Consistency',
    weight: '10%',
    icon: Clock,
    color: '#06b6d4',
    bg: '#cffafe'
  }
];

export function HealthScoreBreakdown({ breakdown = {}, isNewUser = false }) {
  return (
    <div className="health-breakdown-grid">
      {BREAKDOWN_CONFIG.map(item => {
        const score = isNewUser ? 0 : (breakdown[item.key] || 0);
        const Icon = item.icon;

        return (
          <div key={item.key} className="breakdown-row">
            <div className="breakdown-row-header">
              <div className="breakdown-label-box">
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  backgroundColor: item.bg,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={12} />
                </div>
                <span>{item.label}</span>
                <span className="breakdown-weight-pill">({item.weight})</span>
              </div>

              <div className="breakdown-score-value">
                {isNewUser ? '—' : `${score}/100`}
              </div>
            </div>

            <div className="breakdown-bar-track">
              <div
                className="breakdown-bar-fill"
                style={{
                  width: `${Math.min(100, Math.max(0, score))}%`,
                  backgroundColor: item.color
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
