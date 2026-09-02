import React, { useState } from 'react';
import { X, Check, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSplit } from '../../context/SplitContext';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

export function SettleModal({ isOpen, onClose, settlement }) {
  const { activeGroup, settleDebt } = useSplit();
  const { activeCurrencyCode } = useFinance();

  if (!isOpen || !settlement) return null;

  const handleConfirm = () => {
    settleDebt(activeGroup.id, settlement.from, settlement.to, settlement.amount);

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Settle Up Debt</h3>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.75rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            {/* From */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                border: '2px solid rgba(244, 63, 94, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem'
              }}>
                {settlement.fromAvatar}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {settlement.fromName}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Payer</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ArrowRight size={20} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 600 }}>PAYS</span>
            </div>

            {/* To */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem'
              }}>
                {settlement.toAvatar}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {settlement.toName}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Receiver</span>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-input)',
            borderRadius: '14px',
            padding: '1.1rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Settlement Amount
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-income)', fontFamily: 'var(--font-display)' }}>
              {formatCurrency(settlement.amount, activeCurrencyCode)}
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
              This will record a settlement transaction and clear this debt balance completely.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn btn-primary"
              style={{ flex: 1, background: 'var(--success-gradient)' }}
            >
              <Check size={16} />
              <span>Record Settle Up</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}