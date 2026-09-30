import React, { useState, useEffect } from 'react';
import {
  Check,
  X,
  Utensils,
  ShoppingBag,
  Car,
  Zap,
  GraduationCap,
  Briefcase,
  Gamepad2,
  HeartPulse,
  Dumbbell,
  Users,
  TrendingUp,
  Package,
  Tag,
  ArrowRight,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { PAYMENT_INTENT_CATEGORIES, INTENT_FOR_OPTIONS } from './paymentIntentUtils';
import './PaymentIntentPopup.css';

// Lucide icon dictionary mapping for payment intent categories
const ICON_MAP = {
  Utensils,
  ShoppingBag,
  Car,
  Zap,
  GraduationCap,
  Briefcase,
  Gamepad2,
  HeartPulse,
  Dumbbell,
  Users,
  TrendingUp,
  Package,
  Tag
};

export function PaymentIntentPopup({
  transaction,
  onClose,
  onSaved,
  isEditMode = false
}) {
  const { capturePaymentIntent, skipPaymentIntent, activeCurrencyCode, activeCurrency } = useFinance();

  const [selectedCategory, setSelectedCategory] = useState(
    transaction?.intentCategory || transaction?.category || 'Food & Dining'
  );
  const [note, setNote] = useState(transaction?.intentNote || transaction?.note || '');
  const [intentFor, setIntentFor] = useState(transaction?.intentFor || 'Myself');
  const [isSaving, setIsSaving] = useState(false);

  // Focus trap & Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!transaction) return null;

  const merchantName = transaction.merchant || transaction.title || 'Merchant';
  const amount = Number(transaction.amount) || 0;

  const handleSave = async () => {
    if (!selectedCategory) return;
    setIsSaving(true);
    try {
      await capturePaymentIntent(transaction.id, {
        category: selectedCategory,
        note: note.trim(),
        intentFor
      });
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error('Error capturing payment intent:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    try {
      if (!isEditMode) {
        await skipPaymentIntent(transaction.id);
      }
      onClose();
    } catch (err) {
      console.error('Error skipping payment intent:', err);
      onClose();
    }
  };

  return (
    <div className="payment-intent-overlay" role="dialog" aria-modal="true" aria-labelledby="pi-title">
      <div className="payment-intent-modal">
        {/* Top Success Banner */}
        <div className="pi-success-banner">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div className="pi-check-icon-circle">
                <Check size={22} strokeWidth={3} />
              </div>
              <div>
                <div className="pi-badge-upi">
                  <Smartphone size={11} />
                  <span>UPI Payment Completed</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem', letterSpacing: '-0.02em' }}>
                  {formatCurrency(amount, activeCurrencyCode, activeCurrency?.rate || 1)}
                </div>
                <div style={{ fontSize: '0.86rem', opacity: 0.95, fontWeight: 500 }}>
                  Paid to <strong>{merchantName}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="btn-icon"
              style={{ color: '#ffffff', opacity: 0.85, background: 'rgba(0,0,0,0.15)', borderRadius: '50%', width: '32px', height: '32px' }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="pi-modal-body">
          <div style={{ marginBottom: '0.5rem' }}>
            <h2 id="pi-title" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
              {isEditMode ? 'Edit Payment Reason' : 'What was this payment for?'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
              Help Money Mind categorize your spending habits accurately
            </p>
          </div>

          {/* Category Selection Grid */}
          <div className="pi-category-grid" role="radiogroup" aria-label="Spending Reason Category">
            {PAYMENT_INTENT_CATEGORIES.map(cat => {
              const IconComp = ICON_MAP[cat.icon] || Tag;
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

              return (
                <div
                  key={cat.id}
                  className={`pi-category-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(cat.name)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setSelectedCategory(cat.name);
                    }
                  }}
                >
                  {isSelected && (
                    <div className="pi-cat-check-badge">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                  <div
                    className="pi-cat-icon-wrap"
                    style={{
                      backgroundColor: isSelected ? '#dbeafe' : cat.bg,
                      color: isSelected ? '#1d4ed8' : cat.color
                    }}
                  >
                    <IconComp size={18} />
                  </div>
                  <span className="pi-cat-title">{cat.name}</span>
                </div>
              );
            })}
          </div>

          {/* Optional Note Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Add a note (optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Dinner with friends, grocery restock, taxi ride..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-control"
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                fontSize: '0.85rem',
                borderRadius: '12px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>

          {/* Who was this payment for? */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>
              Who was this payment for?
            </label>
            <div className="pi-chip-row">
              {INTENT_FOR_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIntentFor(opt)}
                  className={`pi-chip ${intentFor === opt ? 'active' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pi-modal-footer">
          <button
            type="button"
            onClick={handleSkip}
            className="btn-light-pill"
            style={{ fontSize: '0.82rem', padding: '0.6rem 1.15rem' }}
          >
            {isEditMode ? 'Cancel' : 'Skip for now'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !selectedCategory}
            className="btn-dark-pill"
            style={{
              fontSize: '0.84rem',
              padding: '0.65rem 1.4rem',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            }}
          >
            <span>{isSaving ? 'Saving...' : 'Save Reason'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
