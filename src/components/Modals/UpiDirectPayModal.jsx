import React, { useState, useMemo } from 'react';
import {
  X,
  Smartphone,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Tag,
  Store,
  CreditCard,
  Check,
  Copy,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import './UpiDirectPayModal.css';

// Popular merchant quick presets
const POPULAR_PAYEES = [
  { name: 'Swiggy', vpa: 'swiggy@okhdfcbank', category: 'Food & Dining', color: '#f97316' },
  { name: 'Zomato', vpa: 'zomato@icici', category: 'Food & Dining', color: '#ef4444' },
  { name: 'Amazon Pay', vpa: 'amazonpay@apl', category: 'Shopping', color: '#f59e0b' },
  { name: 'Uber Rides', vpa: 'uber@icici', category: 'Transportation', color: '#0f172a' },
  { name: 'Airtel Bill', vpa: 'airtel@paytm', category: 'Bills & Utilities', color: '#dc2626' },
  { name: 'Apollo Meds', vpa: 'apollo@axisbank', category: 'Health', color: '#059669' }
];

const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Health',
  'Personal',
  'General'
];

export function UpiDirectPayModal({ isOpen, onClose, initialAmount = '350', initialPayee = '' }) {
  const { addTransaction, addNotification, totalBalance, transactions, categories = [] } = useFinance();

  const [amount, setAmount] = useState(() => initialAmount.toString());
  const [payeeName, setPayeeName] = useState(() => initialPayee || 'Swiggy');
  const [vpa, setVpa] = useState('swiggy@okhdfcbank');
  const [category, setCategory] = useState('Food & Dining');
  const [note, setNote] = useState('UPI Payment via MoneyMind');
  const [showQr, setShowQr] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('input'); // 'input' | 'redirected' | 'success'
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [recordedTx, setRecordedTx] = useState(null);

  const numAmount = parseFloat(amount) || 0;

  // Generate UPI URI
  const upiUrl = useMemo(() => {
    const cleanVpa = encodeURIComponent(vpa.trim() || 'merchant@upi');
    const cleanName = encodeURIComponent(payeeName.trim() || 'Merchant');
    const cleanNote = encodeURIComponent(note.trim() || 'Payment');
    return `upi://pay?pa=${cleanVpa}&pn=${cleanName}&am=${numAmount}&cu=INR&tn=${cleanNote}`;
  }, [vpa, payeeName, numAmount, note]);

  // Deep links for popular Indian UPI platforms
  const phonePeUrl = useMemo(() => {
    const cleanVpa = encodeURIComponent(vpa.trim() || 'merchant@upi');
    const cleanName = encodeURIComponent(payeeName.trim() || 'Merchant');
    const cleanNote = encodeURIComponent(note.trim() || 'Payment');
    return `phonepe://pay?pa=${cleanVpa}&pn=${cleanName}&am=${numAmount}&cu=INR&tn=${cleanNote}`;
  }, [vpa, payeeName, numAmount, note]);

  const gPayUrl = useMemo(() => {
    const cleanVpa = encodeURIComponent(vpa.trim() || 'merchant@upi');
    const cleanName = encodeURIComponent(payeeName.trim() || 'Merchant');
    const cleanNote = encodeURIComponent(note.trim() || 'Payment');
    return `gpay://upi/pay?pa=${cleanVpa}&pn=${cleanName}&am=${numAmount}&cu=INR&tn=${cleanNote}`;
  }, [vpa, payeeName, numAmount, note]);

  const paytmUrl = useMemo(() => {
    const cleanVpa = encodeURIComponent(vpa.trim() || 'merchant@upi');
    const cleanName = encodeURIComponent(payeeName.trim() || 'Merchant');
    const cleanNote = encodeURIComponent(note.trim() || 'Payment');
    return `paytmmp://pay?pa=${cleanVpa}&pn=${cleanName}&am=${numAmount}&cu=INR&tn=${cleanNote}`;
  }, [vpa, payeeName, numAmount, note]);

  // QR Code Image URL using open standard QR generator
  const qrImageUrl = useMemo(() => {
    const encodedUpi = encodeURIComponent(upiUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUpi}&margin=10`;
  }, [upiUrl]);

  if (!isOpen) return null;

  const handleSelectPayeePreset = (preset) => {
    setPayeeName(preset.name);
    setVpa(preset.vpa);
    setCategory(preset.category);
  };

  const handleQuickAddAmount = (addVal) => {
    const cur = parseFloat(amount) || 0;
    setAmount((cur + addVal).toString());
  };

  const handleLaunchApp = (url, platformName) => {
    if (numAmount <= 0) return;

    // Trigger platform deep link
    window.location.href = url;
    setPaymentStatus('redirected');

    if (addNotification) {
      addNotification({
        id: `upi-init-${Date.now()}`,
        title: `Redirecting to ${platformName}`,
        message: `Completing ₹${numAmount} payment to ${payeeName}. Remember to confirm once paid!`,
        time: 'Just now',
        type: 'info',
        unread: true
      });
    }
  };

  // Record payment and auto-calculate into MoneyMind Ledger
  const handleConfirmAndRecord = () => {
    if (numAmount <= 0) return;

    const newTx = {
      id: `tx-upi-${Date.now()}`,
      title: payeeName.trim() || 'UPI Payment',
      merchant: payeeName.trim() || 'UPI Merchant',
      amount: numAmount,
      type: 'expense',
      category: category,
      paymentMethod: 'UPI',
      date: new Date().toISOString().split('T')[0],
      tags: ['UPI Direct Pay', vpa],
      note: note.trim() || `Paid to ${vpa}`
    };

    // 1. Add to Ledger in FinanceContext (updates balance, budgets, calendar)
    addTransaction(newTx);
    setRecordedTx(newTx);
    setPaymentStatus('success');

    // 2. Trigger Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    // 3. Add Notification
    if (addNotification) {
      addNotification({
        id: `upi-done-${Date.now()}`,
        title: `₹${numAmount} Logged to Expenses`,
        message: `Paid to ${payeeName} via UPI. Your balance and ${category} budget updated!`,
        time: 'Just now',
        type: 'expense',
        unread: true
      });
    }
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleResetForAnotherPayment = () => {
    setPaymentStatus('input');
    setAmount('350');
    setRecordedTx(null);
  };

  return (
    <div className="upi-pay-overlay" role="dialog" aria-modal="true">
      <div className="upi-pay-modal">
        {/* Header */}
        <div className="upi-pay-header">
          <div className="upi-pay-header-left">
            <div className="upi-pay-icon-badge">
              <Zap size={20} color="#ffffff" />
            </div>
            <div>
              <h2 className="upi-pay-title">UPI Instant Pay & Auto-Log</h2>
              <p className="upi-pay-subtitle">PhonePe • Google Pay • Paytm • BHIM UPI</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="upi-pay-close-btn"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="upi-pay-body">
          {paymentStatus === 'success' && recordedTx ? (
            /* --- SUCCESS CONFIRMATION RECEIPT SCREEN --- */
            <div className="upi-success-view">
              <div className="upi-success-checkmark">
                <CheckCircle2 size={54} color="#059669" />
              </div>

              <h3 className="upi-success-title">Payment Recorded & Calculated!</h3>
              <p className="upi-success-desc">
                MoneyMind has logged this transaction to your expense ledger, updated your daily calendar readout, and deducted it from your budget.
              </p>

              {/* Receipt Card */}
              <div className="upi-receipt-card">
                <div className="upi-receipt-row main">
                  <span>Amount Deducted</span>
                  <span className="upi-receipt-amount">-{formatCurrency(recordedTx.amount, 'INR', 1)}</span>
                </div>
                <div className="upi-receipt-divider" />
                <div className="upi-receipt-row">
                  <span>Paid To</span>
                  <span className="bold">{recordedTx.merchant}</span>
                </div>
                <div className="upi-receipt-row">
                  <span>UPI ID</span>
                  <span className="mono">{vpa}</span>
                </div>
                <div className="upi-receipt-row">
                  <span>Category</span>
                  <span className="badge">{recordedTx.category}</span>
                </div>
                <div className="upi-receipt-row">
                  <span>Payment Mode</span>
                  <span>UPI Instant</span>
                </div>
                <div className="upi-receipt-row">
                  <span>Date & Status</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Completed & Synced</span>
                </div>
              </div>

              <div className="upi-success-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="upi-btn-primary"
                >
                  <Check size={16} />
                  <span>Done & View Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetForAnotherPayment}
                  className="upi-btn-secondary"
                >
                  <RotateCcw size={15} />
                  <span>Make Another Payment</span>
                </button>
              </div>
            </div>
          ) : (
            /* --- PAYMENT INPUT & PLATFORM SELECTION SCREEN --- */
            <>
              {/* Amount Input Section */}
              <div className="upi-amount-section">
                <label className="upi-input-label">Enter Amount to Pay</label>
                <div className="upi-amount-input-wrap">
                  <span className="upi-amount-symbol">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="upi-amount-input"
                    autoFocus
                    min="1"
                  />
                </div>

                {/* Quick Add Presets */}
                <div className="upi-quick-pills">
                  {[100, 250, 500, 1000, 2000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAddAmount(val)}
                      className="upi-quick-pill"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payee / Receiver Selection */}
              <div className="upi-field-group">
                <label className="upi-input-label">Payee / Merchant Name</label>
                <div className="upi-input-box">
                  <Store size={17} color="#64748b" />
                  <input
                    type="text"
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    placeholder="e.g. Swiggy, Starbucks, Rohan"
                    className="upi-text-input"
                  />
                </div>

                {/* Quick Merchant Presets */}
                <div className="upi-presets-scroll">
                  {POPULAR_PAYEES.map(p => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleSelectPayeePreset(p)}
                      className={`upi-preset-chip ${payeeName === p.name ? 'active' : ''}`}
                    >
                      <span className="upi-preset-dot" style={{ backgroundColor: p.color }} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI ID / VPA Input */}
              <div className="upi-field-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="upi-input-label">Payee UPI ID (VPA)</label>
                  <button
                    type="button"
                    onClick={handleCopyVpa}
                    className="upi-copy-vpa-btn"
                  >
                    {copiedVpa ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                    <span>{copiedVpa ? 'Copied' : 'Copy VPA'}</span>
                  </button>
                </div>
                <div className="upi-input-box">
                  <Smartphone size={17} color="#64748b" />
                  <input
                    type="text"
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    placeholder="merchant@upi or 9876543210@paytm"
                    className="upi-text-input"
                  />
                </div>
              </div>

              {/* Category & Notes */}
              <div className="upi-row-two-col">
                <div className="upi-field-group">
                  <label className="upi-input-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="upi-select-input"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="upi-field-group">
                  <label className="upi-input-label">Note / Reference</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Dinner, Grocery"
                    className="upi-text-input simple"
                  />
                </div>
              </div>

              {/* PLATFORM REDIRECT BUTTONS SECTION */}
              <div className="upi-platforms-section">
                <div className="upi-platforms-header">
                  <span className="upi-section-title">Select Platform to Pay</span>
                  <button
                    type="button"
                    onClick={() => setShowQr(!showQr)}
                    className="upi-toggle-qr-btn"
                  >
                    <QrCode size={14} />
                    <span>{showQr ? 'Hide QR' : 'Show UPI QR'}</span>
                  </button>
                </div>

                {/* QR Code view if toggled or on Desktop */}
                {showQr && (
                  <div className="upi-qr-card">
                    <img
                      src={qrImageUrl}
                      alt="UPI QR Code"
                      className="upi-qr-image"
                    />
                    <div className="upi-qr-info">
                      <p className="upi-qr-text">Scan with <strong>PhonePe, Google Pay, or Paytm</strong> camera</p>
                      <span className="upi-qr-amount">Paying ₹{numAmount} to {payeeName}</span>
                    </div>
                  </div>
                )}

                {/* Platform Action Grid */}
                <div className="upi-platform-grid">
                  {/* 1. PhonePe */}
                  <button
                    type="button"
                    onClick={() => handleLaunchApp(phonePeUrl, 'PhonePe')}
                    className="upi-platform-btn phonepe"
                  >
                    <div className="upi-platform-icon-wrap phonepe-bg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"/>
                      </svg>
                    </div>
                    <div className="upi-platform-info">
                      <span className="upi-platform-name">PhonePe</span>
                      <span className="upi-platform-sub">Open & Pay ₹{numAmount}</span>
                    </div>
                    <ExternalLink size={14} className="upi-platform-arrow" />
                  </button>

                  {/* 2. Google Pay */}
                  <button
                    type="button"
                    onClick={() => handleLaunchApp(gPayUrl, 'Google Pay')}
                    className="upi-platform-btn gpay"
                  >
                    <div className="upi-platform-icon-wrap gpay-bg">
                      <span style={{ fontWeight: 900, color: '#ffffff', fontSize: '13px' }}>G</span>
                    </div>
                    <div className="upi-platform-info">
                      <span className="upi-platform-name">Google Pay</span>
                      <span className="upi-platform-sub">Open & Pay ₹{numAmount}</span>
                    </div>
                    <ExternalLink size={14} className="upi-platform-arrow" />
                  </button>

                  {/* 3. Paytm */}
                  <button
                    type="button"
                    onClick={() => handleLaunchApp(paytmUrl, 'Paytm')}
                    className="upi-platform-btn paytm"
                  >
                    <div className="upi-platform-icon-wrap paytm-bg">
                      <span style={{ fontWeight: 900, color: '#ffffff', fontSize: '11px' }}>paytm</span>
                    </div>
                    <div className="upi-platform-info">
                      <span className="upi-platform-name">Paytm UPI</span>
                      <span className="upi-platform-sub">Open & Pay ₹{numAmount}</span>
                    </div>
                    <ExternalLink size={14} className="upi-platform-arrow" />
                  </button>

                  {/* 4. Any Default UPI App */}
                  <button
                    type="button"
                    onClick={() => handleLaunchApp(upiUrl, 'Default UPI App')}
                    className="upi-platform-btn default-upi"
                  >
                    <div className="upi-platform-icon-wrap default-bg">
                      <Smartphone size={17} color="#ffffff" />
                    </div>
                    <div className="upi-platform-info">
                      <span className="upi-platform-name">Any UPI App</span>
                      <span className="upi-platform-sub">BHIM / CRED / Bank</span>
                    </div>
                    <ExternalLink size={14} className="upi-platform-arrow" />
                  </button>
                </div>
              </div>

              {/* POST-PAYMENT CONFIRMATION & CALCULATION BUTTON */}
              <div className="upi-confirm-box">
                <div className="upi-confirm-notice">
                  <Sparkles size={16} color="#059669" />
                  <span>
                    After completing the payment on your UPI app, tap below to <strong>auto-record & calculate</strong> the expense in MoneyMind!
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmAndRecord}
                  disabled={numAmount <= 0}
                  className="upi-confirm-btn"
                >
                  <CheckCircle2 size={18} />
                  <span>I Paid ₹{numAmount} • Confirm & Calculate Expense</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpiDirectPayModal;
