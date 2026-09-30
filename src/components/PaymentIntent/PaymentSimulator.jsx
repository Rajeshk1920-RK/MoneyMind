import React, { useState } from 'react';
import {
  Smartphone,
  X,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Store,
  Hash,
  IndianRupee,
  Loader2
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import confetti from 'canvas-confetti';

const POPULAR_MERCHANTS = [
  'ABC Restaurant',
  'Starbucks Coffee',
  'Swiggy Foods',
  'Uber Rides',
  'Apollo Pharmacy',
  'Airtel Broadband'
];

export function PaymentSimulator({ onClose, onPaymentComplete }) {
  const { simulateUPIPayment, activeCurrencyCode, activeCurrency } = useFinance();

  const [amount, setAmount] = useState('710');
  const [merchant, setMerchant] = useState('ABC Restaurant');
  const [reference, setReference] = useState(() => `UPI/${Date.now().toString().slice(-6)}`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleCompletePayment = async (e) => {
    e?.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (!merchant.trim()) {
      setError('Please enter a merchant name');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      // Simulate realistic network delay
      await new Promise(r => setTimeout(r, 450));

      // Trigger confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Create transaction via FinanceContext
      const txObj = await simulateUPIPayment({
        amount: numAmount,
        merchant: merchant.trim(),
        reference: reference.trim(),
        date: new Date().toISOString().split('T')[0]
      });

      setIsProcessing(false);
      onPaymentComplete(txObj);
    } catch (err) {
      console.error('Error in simulated UPI payment:', err);
      setIsProcessing(false);
      setError('Failed to simulate UPI payment: ' + err.message);
    }
  };

  return (
    <div className="payment-intent-overlay" role="dialog" aria-modal="true" aria-labelledby="sim-title">
      <div className="payment-intent-modal" style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #edf2f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Smartphone size={20} />
            </div>
            <div>
              <h2 id="sim-title" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                Record UPI Transaction
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Instant Payment Intent categorization
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-icon"
            style={{ color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', width: '30px', height: '30px' }}
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCompletePayment} className="pi-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {error && (
            <div style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          {/* Amount Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Amount (₹)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#64748b'
              }}>
                ₹
              </span>
              <input
                type="number"
                step="any"
                required
                min="1"
                placeholder="710"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
                style={{
                  width: '100%',
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  borderRadius: '14px'
                }}
              />
            </div>
          </div>

          {/* Merchant Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Merchant / Payee Name
            </label>
            <div style={{ position: 'relative' }}>
              <Store size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                required
                placeholder="e.g., ABC Restaurant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="form-control"
                style={{
                  width: '100%',
                  paddingLeft: '2.4rem',
                  paddingRight: '1rem',
                  paddingTop: '0.65rem',
                  paddingBottom: '0.65rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  borderRadius: '12px'
                }}
              />
            </div>

            {/* Quick Merchant Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
              {POPULAR_MERCHANTS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMerchant(m)}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    backgroundColor: merchant === m ? '#e0e7ff' : '#f1f5f9',
                    color: merchant === m ? '#3730a3' : '#64748b',
                    border: '1px solid',
                    borderColor: merchant === m ? '#c7d2fe' : '#e2e8f0',
                    cursor: 'pointer'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method & Reference */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Payment Method
              </label>
              <div style={{
                padding: '0.6rem 0.85rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#1e293b'
              }}>
                <Smartphone size={15} color="#2563eb" />
                <span>UPI</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Ref / Tx ID (Optional)
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="form-control"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.82rem',
                  borderRadius: '12px'
                }}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={isProcessing}
              className="btn-dark-pill"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem 1.5rem',
                fontSize: '0.92rem',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)'
              }}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  <span>Complete Payment</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
