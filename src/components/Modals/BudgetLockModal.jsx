import React from 'react';
import {
  Lock,
  AlertOctagon,
  ShieldAlert,
  X,
  Sliders,
  Utensils,
  Plane,
  Home,
  Zap,
  ShoppingBag,
  Film,
  HeartPulse,
  TrendingUp,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import './BudgetLockModal.css';

const CATEGORY_ICONS = {
  'Food & Dining': Utensils,
  'Food': Utensils,
  'Travel & Transport': Plane,
  'Housing & Rent': Home,
  'Utilities & Bills': Zap,
  'Shopping & Electronics': ShoppingBag,
  'Shopping': ShoppingBag,
  'Entertainment & Subs': Film,
  'Healthcare & Wellness': HeartPulse,
  'Investments & Savings': TrendingUp
};

export function BudgetLockModal({
  isOpen,
  lockDetails,
  onClose,
  onNavigateToBudgets
}) {
  const { activeCurrencyCode, activeCurrency } = useFinance();

  if (!isOpen || !lockDetails) return null;

  const {
    budgetName = 'Category',
    limit = 0,
    currentSpent = 0,
    attemptedAmount = 0,
    excessAmount = 0,
    projectedSpent = currentSpent + attemptedAmount
  } = lockDetails;

  const CategoryIcon = CATEGORY_ICONS[budgetName] || Tag;

  return (
    <div
      className="budget-lock-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lock-title"
    >
      <div className="budget-lock-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="budget-lock-header">
          <div className="budget-lock-icon-badge">
            <Lock size={26} strokeWidth={2.4} />
          </div>

          <div className="budget-lock-tag">
            <ShieldAlert size={12} />
            <span>Budget Lock Active</span>
          </div>

          <h2 id="lock-title" className="budget-lock-title">
            Payment Locked & Blocked
          </h2>

          <p className="budget-lock-subtitle">
            You have reached the spending limit set for <strong>{budgetName}</strong>.
          </p>
        </div>

        {/* Content Body */}
        <div className="budget-lock-body">
          <div className="budget-lock-metrics-card">
            <div className="budget-lock-category-row">
              <div className="budget-lock-cat-info">
                <div className="budget-lock-cat-icon">
                  <CategoryIcon size={18} />
                </div>
                <div>
                  <div className="budget-lock-cat-name">{budgetName}</div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Strict Category Limit</span>
                </div>
              </div>
              <span className="budget-lock-status-pill">
                🔒 Limit Exceeded
              </span>
            </div>

            <div className="budget-lock-grid">
              <div className="budget-lock-cell">
                <span className="budget-lock-cell-label">Set Budget Limit</span>
                <div className="budget-lock-cell-value limit">
                  {formatCurrency(limit, activeCurrencyCode, activeCurrency?.rate)}
                </div>
              </div>

              <div className="budget-lock-cell">
                <span className="budget-lock-cell-label">Current Spent</span>
                <div className="budget-lock-cell-value">
                  {formatCurrency(currentSpent, activeCurrencyCode, activeCurrency?.rate)}
                </div>
              </div>

              <div className="budget-lock-cell">
                <span className="budget-lock-cell-label">This Payment</span>
                <div className="budget-lock-cell-value danger">
                  {formatCurrency(attemptedAmount, activeCurrencyCode, activeCurrency?.rate)}
                </div>
              </div>

              <div className="budget-lock-cell">
                <span className="budget-lock-cell-label">Over Budget By</span>
                <div className="budget-lock-cell-value danger">
                  +{formatCurrency(excessAmount > 0 ? excessAmount : (projectedSpent - limit), activeCurrencyCode, activeCurrency?.rate)}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="budget-lock-excess-banner">
            <AlertOctagon size={20} color="#dc2626" style={{ flexShrink: 0 }} />
            <p className="budget-lock-excess-text">
              Making this payment would bring your <strong>{budgetName}</strong> spend to{' '}
              <strong>{formatCurrency(projectedSpent, activeCurrencyCode, activeCurrency?.rate)}</strong>,{' '}
              which exceeds your <strong>{formatCurrency(limit, activeCurrencyCode, activeCurrency?.rate)}</strong> limit.
              Payment was blocked to keep your finances safe.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="budget-lock-footer">
          <button
            type="button"
            className="budget-lock-btn-cancel"
            onClick={onClose}
          >
            <X size={16} />
            <span>Cancel Payment</span>
          </button>

          {onNavigateToBudgets && (
            <button
              type="button"
              className="budget-lock-btn-adjust"
              onClick={() => {
                onClose();
                onNavigateToBudgets();
              }}
            >
              <Sliders size={15} />
              <span>Adjust Budget Limit in Budgets</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
