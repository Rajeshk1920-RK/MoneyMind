import React from 'react';
import { ShieldCheck, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { HealthScoreBreakdown } from './HealthScoreBreakdown';
import './MoneyIntelligence.css';

export function FinancialHealthScore({
  healthData,
  onOpenAddTx
}) {
  const {
    totalScore = 0,
    isNewUser = true,
    status = 'Healthy',
    statusColor = '#059669',
    statusBg = '#ecfdf5',
    statusBorder = '#a7f3d0',
    summary = '',
    breakdown = {}
  } = healthData || {};

  // Radial progress calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isNewUser
    ? circumference
    : circumference - (totalScore / 100) * circumference;

  if (isNewUser) {
    return (
      <div className="health-score-card">
        <div className="health-gauge-wrapper">
          <div className="health-gauge-svg-box">
            <svg className="health-gauge-svg" viewBox="0 0 140 140">
              <circle
                className="health-gauge-circle-bg"
                cx="70"
                cy="70"
                r={radius}
              />
            </svg>
            <div className="health-gauge-center">
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#94a3b8' }}>—</span>
              <span className="health-gauge-max">/ 100</span>
            </div>
          </div>
          <div
            className="health-status-badge"
            style={{ backgroundColor: '#f1f5f9', color: '#64748b', borderColor: '#e2e8f0' }}
          >
            <span>Uncalibrated</span>
          </div>
        </div>

        <div className="health-details-wrapper">
          <div>
            <h3 className="health-app-indicator-title">Start building your financial picture</h3>
            <p className="health-app-disclaimer">
              Add a few transactions to generate your Money Mind Financial Health Score and Smart Money Insights.
            </p>
          </div>

          {onOpenAddTx && (
            <button
              type="button"
              onClick={() => onOpenAddTx('expense')}
              className="btn btn-primary"
              style={{
                alignSelf: 'flex-start',
                padding: '0.55rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                borderRadius: '12px'
              }}
            >
              <Plus size={15} />
              <span>Record First Transaction</span>
            </button>
          )}

          <HealthScoreBreakdown isNewUser={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="health-score-card">
      {/* Circular Radial Score */}
      <div className="health-gauge-wrapper">
        <div className="health-gauge-svg-box">
          <svg className="health-gauge-svg" viewBox="0 0 140 140">
            <circle
              className="health-gauge-circle-bg"
              cx="70"
              cy="70"
              r={radius}
            />
            <circle
              className="health-gauge-circle-fill"
              cx="70"
              cy="70"
              r={radius}
              stroke={statusColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          <div className="health-gauge-center">
            <span className="health-gauge-number" style={{ color: statusColor }}>
              {totalScore}
            </span>
            <span className="health-gauge-max">/ 100</span>
          </div>
        </div>

        <div
          className="health-status-badge"
          style={{
            backgroundColor: statusBg,
            color: statusColor,
            borderColor: statusBorder
          }}
        >
          <ShieldCheck size={14} />
          <span>{status}</span>
        </div>
      </div>

      {/* Breakdown and Description */}
      <div className="health-details-wrapper">
        <div>
          <h3 className="health-app-indicator-title">Money Mind Financial Health Score</h3>
          <p className="health-app-disclaimer">
            {summary} An on-device indicator calculated from your recorded activity.
          </p>
        </div>

        <HealthScoreBreakdown breakdown={breakdown} isNewUser={false} />
      </div>
    </div>
  );
}
