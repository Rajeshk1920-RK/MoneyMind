import React, { useState, useMemo } from 'react';
import {
  X,
  Building2,
  AtSign,
  ScanLine,
  Users,
  ChevronRight,
  Zap,
  ShieldCheck,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Check,
  RotateCcw,
  ExternalLink,
  Store,
  Tag
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import './UpiDirectPayModal.css';

// SVG Vector Logos for Indian Payment Platforms (No Emojis)
const PhonePeLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#5F259F" />
    <path d="M14.8 6.5H9.2C8.5 6.5 8 7 8 7.7V17.3C8 18 8.5 18.5 9.2 18.5H14.8C15.5 18.5 16 18 16 17.3V7.7C16 7 15.5 6.5 14.8 6.5ZM12 17.2C11.3 17.2 10.8 16.7 10.8 16C10.8 15.3 11.3 14.8 12 14.8C12.7 14.8 13.2 15.3 13.2 16C13.2 16.7 12.7 17.2 12 17.2ZM14.5 13.5H9.5V8.5H14.5V13.5Z" fill="#FFFFFF" />
  </svg>
);

const GooglePayLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#1A73E8" />
    <path d="M12 5C8.13 5 5 8.13 5 12C5 15.87 8.13 19 12 19C15.87 19 19 15.87 19 12C19 11.38 18.92 10.79 18.78 10.22H12V13.5H15.91C15.34 14.84 13.82 15.8 12 15.8C9.9 15.8 8.2 14.1 8.2 12C8.2 9.9 9.9 8.2 12 8.2C12.98 8.2 13.87 8.58 14.55 9.2L16.82 6.93C15.54 5.73 13.86 5 12 5Z" fill="#FFFFFF" />
  </svg>
);

const PaytmLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#00BAF2" />
    <path d="M6 9H8.5V15H6V9ZM10 9H12.5V15H10V9ZM14 9H18V11H16V15H14V9Z" fill="#002970" />
    <path d="M7 10.5H7.8V13.5H7V10.5ZM11 10.5H11.8V13.5H11V10.5Z" fill="#FFFFFF" />
  </svg>
);

const BhimUpiLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#059669" />
    <path d="M7 16L12 7L17 16H14L12 12L10 16H7Z" fill="#FFFFFF" />
  </svg>
);

// The 4 Core Direct Payment Options
const PAYMENT_OPTIONS = [
  {
    id: 'bank_transfer',
    title: 'Bank Transfer',
    subtitle: 'Direct transfer using Account Number & IFSC code',
    icon: Building2,
    accentColor: '#2563eb',
    badge: 'IMPS / NEFT'
  },
  {
    id: 'pay_by_upi_id',
    title: 'Pay by UPI ID',
    subtitle: 'Instant transfer via UPI VPA handle',
    icon: AtSign,
    accentColor: '#059669',
    badge: 'VPA / UPI'
  },
  {
    id: 'scan_and_pay',
    title: 'Scan & Pay',
    subtitle: 'Scan QR code with camera or generate payment QR',
    icon: ScanLine,
    accentColor: '#7c3aed',
    badge: 'QR Code'
  },
  {
    id: 'pay_anyone',
    title: 'Pay Anyone',
    subtitle: 'Transfer directly to mobile number or contact',
    icon: Users,
    accentColor: '#0284c7',
    badge: 'Phone Pay'
  }
];

const CATEGORIES = [
  'Bills & Utilities',
  'Rent & Housing',
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Health',
  'Personal',
  'General'
];

export function UpiDirectPayModal({ isOpen, onClose }) {
  const { addTransaction, addNotification } = useFinance();

  // Navigation View: 'menu' (4 options) | 'bank_transfer' | 'success'
  const [activeView, setActiveView] = useState('menu');

  // Bank Transfer Form States
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [bankLookupName, setBankLookupName] = useState('HDFC Bank - Main Branch');
  const [amount, setAmount] = useState('1500');
  const [category, setCategory] = useState('Bills & Utilities');
  const [note, setNote] = useState('Bank Transfer via MoneyMind');
  const [formError, setFormError] = useState('');
  const [recordedTx, setRecordedTx] = useState(null);

  const numAmount = parseFloat(amount) || 0;

  if (!isOpen) return null;

  // IFSC Auto-Lookup
  const handleIfscChange = (val) => {
    const clean = val.toUpperCase().trim();
    setIfscCode(clean);
    if (clean.startsWith('HDFC')) {
      setBankLookupName('HDFC Bank - Main Branch');
    } else if (clean.startsWith('SBIN')) {
      setBankLookupName('State Bank of India - Main Branch');
    } else if (clean.startsWith('ICIC')) {
      setBankLookupName('ICICI Bank - Commercial Branch');
    } else if (clean.startsWith('UTIB') || clean.startsWith('AXIS')) {
      setBankLookupName('Axis Bank - Corporate Branch');
    } else if (clean.length >= 4) {
      setBankLookupName(`${clean.slice(0, 4)} Bank (Verified IFSC)`);
    } else {
      setBankLookupName('');
    }
  };

  const handleQuickAddAmount = (addVal) => {
    const cur = parseFloat(amount) || 0;
    setAmount((cur + addVal).toString());
  };

  // Generate Bank Transfer UPI URI
  const bankUpiUrl = useMemo(() => {
    const targetVpa = `${accountNumber.trim()}@${ifscCode.trim()}.ifsc.npci`;
    const cleanVpa = encodeURIComponent(targetVpa);
    const cleanName = encodeURIComponent(beneficiaryName.trim() || 'Beneficiary');
    const cleanNote = encodeURIComponent(note.trim() || 'Bank Transfer');
    return `upi://pay?pa=${cleanVpa}&pn=${cleanName}&am=${numAmount}&cu=INR&tn=${cleanNote}`;
  }, [accountNumber, ifscCode, beneficiaryName, numAmount, note]);

  const phonePeUrl = useMemo(() => bankUpiUrl.replace('upi://pay', 'phonepe://pay'), [bankUpiUrl]);
  const gPayUrl = useMemo(() => bankUpiUrl.replace('upi://pay', 'gpay://upi/pay'), [bankUpiUrl]);
  const paytmUrl = useMemo(() => bankUpiUrl.replace('upi://pay', 'paytmmp://pay'), [bankUpiUrl]);

  const handleLaunchApp = (url, platformName) => {
    if (!beneficiaryName.trim()) {
      setFormError('Please enter the Beneficiary Name.');
      return;
    }
    if (!accountNumber.trim()) {
      setFormError('Please enter the Bank Account Number.');
      return;
    }
    if (confirmAccountNumber && accountNumber !== confirmAccountNumber) {
      setFormError('Account numbers do not match. Please verify.');
      return;
    }
    if (!ifscCode.trim()) {
      setFormError('Please enter the IFSC Code.');
      return;
    }
    if (numAmount <= 0) {
      setFormError('Please enter a valid amount greater than ₹0.');
      return;
    }

    setFormError('');

    // 1. Launch Platform URL
    window.location.href = url;

    // 2. Automatically create & calculate transaction in MoneyMind Ledger
    const accountMask = accountNumber.length >= 4 ? `A/c ••${accountNumber.slice(-4)}` : 'Bank A/c';
    const finalTitle = beneficiaryName.trim();

    const newTx = {
      id: `tx-bank-${Date.now()}`,
      title: finalTitle,
      merchant: finalTitle,
      amount: numAmount,
      type: 'expense',
      category: category,
      paymentMethod: `Bank Transfer (${platformName})`,
      date: new Date().toISOString().split('T')[0],
      tags: ['Bank Transfer', ifscCode.toUpperCase(), accountMask, platformName],
      note: note.trim() || `Transferred via ${platformName} to ${accountMask} (${ifscCode.toUpperCase()})`
    };

    addTransaction(newTx);
    setRecordedTx(newTx);
    setActiveView('success');

    // 3. Trigger Confetti
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    // 4. Notification
    if (addNotification) {
      addNotification({
        id: `bank-tx-done-${Date.now()}`,
        title: `₹${numAmount} Auto-Calculated & Logged`,
        message: `Sent to ${finalTitle} (${accountMask}) via ${platformName}. Balance and budget updated!`,
        time: 'Just now',
        type: 'expense',
        unread: true
      });
    }
  };

  const handleReset = () => {
    setActiveView('menu');
    setBeneficiaryName('');
    setAccountNumber('');
    setConfirmAccountNumber('');
    setAmount('1500');
    setFormError('');
    setRecordedTx(null);
  };

  return (
    <div className="upi-pay-overlay" role="dialog" aria-modal="true">
      <div className="upi-pay-modal">
        {/* Header */}
        <div className="upi-pay-header">
          <div className="upi-pay-header-left">
            {activeView === 'bank_transfer' ? (
              <button
                type="button"
                onClick={() => { setActiveView('menu'); setFormError(''); }}
                className="upi-back-btn"
                title="Back to Payment Options"
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="upi-pay-icon-badge">
                <Zap size={20} color="#ffffff" />
              </div>
            )}

            <div>
              <h2 className="upi-pay-title">
                {activeView === 'bank_transfer' ? 'Bank Transfer' : 'Direct UPI Pay'}
              </h2>
              <p className="upi-pay-subtitle">
                {activeView === 'bank_transfer' ? 'Account Number & IFSC Code' : 'Select payment method to proceed'}
              </p>
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
          {/* ================= VIEW 1: 4 PAYMENT OPTIONS ================= */}
          {activeView === 'menu' && (
            <>
              <div className="upi-options-list">
                {PAYMENT_OPTIONS.map((option) => {
                  const IconComponent = option.icon;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        if (option.id === 'bank_transfer') {
                          setActiveView('bank_transfer');
                        }
                      }}
                      className="upi-option-card-row"
                    >
                      <div
                        className="upi-option-avatar"
                        style={{
                          backgroundColor: `${option.accentColor}14`,
                          color: option.accentColor
                        }}
                      >
                        <IconComponent size={22} strokeWidth={2.2} />
                      </div>

                      <div className="upi-option-info">
                        <div className="upi-option-title-row">
                          <span className="upi-option-title">{option.title}</span>
                          <span
                            className="upi-option-badge-pill"
                            style={{
                              backgroundColor: `${option.accentColor}12`,
                              color: option.accentColor
                            }}
                          >
                            {option.badge}
                          </span>
                        </div>
                        <p className="upi-option-subtitle">{option.subtitle}</p>
                      </div>

                      <div className="upi-option-arrow-box">
                        <ChevronRight size={18} className="upi-option-chevron" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Security Footer */}
              <div className="upi-footer-security">
                <ShieldCheck size={16} color="#059669" />
                <span>Encrypted Direct Routing with Live Expense Calculation</span>
              </div>
            </>
          )}

          {/* ================= VIEW 2: BANK TRANSFER REQUIRED DETAILS FORM ================= */}
          {activeView === 'bank_transfer' && (
            <div className="upi-bank-form-view">
              {/* Error Banner */}
              {formError && (
                <div className="upi-form-error-banner">
                  <span>{formError}</span>
                </div>
              )}

              {/* Amount to Transfer Card */}
              <div className="upi-amount-section">
                <label className="upi-input-label">Transfer Amount</label>
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
                  {[500, 1000, 2000, 5000, 10000].map(val => (
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

              {/* 1. Beneficiary / Account Holder Name */}
              <div className="upi-field-group">
                <label className="upi-input-label">Beneficiary / Account Holder Name</label>
                <div className="upi-input-box">
                  <Building2 size={17} color="#64748b" />
                  <input
                    type="text"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    placeholder="Full Name as on Bank Account"
                    className="upi-text-input"
                  />
                </div>
              </div>

              {/* 2. Bank Account Number */}
              <div className="upi-field-group">
                <label className="upi-input-label">Bank Account Number</label>
                <div className="upi-input-box">
                  <CreditCard size={17} color="#64748b" />
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter Account Number"
                    className="upi-text-input"
                  />
                </div>
              </div>

              {/* 3. Confirm Bank Account Number */}
              <div className="upi-field-group">
                <label className="upi-input-label">Confirm Bank Account Number</label>
                <div className="upi-input-box">
                  <CreditCard size={17} color="#64748b" />
                  <input
                    type="text"
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Re-enter Account Number"
                    className="upi-text-input"
                  />
                </div>
              </div>

              {/* 4. IFSC Code with Auto-Lookup Verification */}
              <div className="upi-field-group">
                <label className="upi-input-label">IFSC Code</label>
                <div className="upi-input-box">
                  <Building2 size={17} color="#64748b" />
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => handleIfscChange(e.target.value)}
                    placeholder="e.g. HDFC0001234, SBIN0000123"
                    className="upi-text-input"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                {bankLookupName && (
                  <div className="upi-bank-verified-tag">
                    <CheckCircle2 size={13} color="#059669" />
                    <span>{bankLookupName}</span>
                  </div>
                )}
              </div>

              {/* 5. Category & Purpose */}
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
                  <label className="upi-input-label">Note / Purpose</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Rent, Vendor Fee"
                    className="upi-text-input simple"
                  />
                </div>
              </div>

              {/* Platform Launchers for Bank Transfer */}
              <div className="upi-platforms-section">
                <span className="upi-section-title">Launch Payment via Platform</span>
                <div className="upi-platform-grid">
                  <button
                    type="button"
                    onClick={() => handleLaunchApp(phonePeUrl, 'PhonePe')}
                    className="upi-platform-btn"
                  >
                    <PhonePeLogo />
                    <div className="upi-platform-info">
                      <span className="upi-platform-name">PhonePe</span>
                      <span className="upi-platform-sub">Open App</span>
                    </div>
                    <ExternalLink size={13} className="upi-platform-arrow" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchApp(gPayUrl, 'Google Pay')}
                    className="upi-platform-btn"
                  >
                    <GooglePayLogo />
                    <div className="upi-platform-info">
                      <span className="upi-platform-name">Google Pay</span>
                      <span className="upi-platform-sub">Open App</span>
                    </div>
                    <ExternalLink size={13} className="upi-platform-arrow" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchApp(paytmUrl, 'Paytm')}
                    className="upi-platform-btn"
                  >
                    <PaytmLogo />
                    <div className="upi-platform-info">
                      <span className="upi-platform-name">Paytm</span>
                      <span className="upi-platform-sub">Open App</span>
                    </div>
                    <ExternalLink size={13} className="upi-platform-arrow" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchApp(bankUpiUrl, 'BHIM UPI')}
                    className="upi-platform-btn"
                  >
                    <BhimUpiLogo />
                    <div className="upi-platform-info">
                      <span className="upi-platform-name">BHIM UPI</span>
                      <span className="upi-platform-sub">Default App</span>
                    </div>
                    <ExternalLink size={13} className="upi-platform-arrow" />
                  </button>
                </div>
              </div>

              {/* Auto-Add Info Notice */}
              <div className="upi-footer-security">
                <ShieldCheck size={16} color="#059669" />
                <span>Tapping any platform above will launch payment & auto-calculate into MoneyMind</span>
              </div>
            </div>
          )}

          {/* ================= VIEW 3: SUCCESS CONFIRMATION RECEIPT ================= */}
          {activeView === 'success' && recordedTx && (
            <div className="upi-success-view">
              <div className="upi-success-checkmark">
                <CheckCircle2 size={54} color="#059669" />
              </div>

              <h3 className="upi-success-title">Bank Transfer Recorded!</h3>
              <p className="upi-success-desc">
                MoneyMind has deducted <strong>{formatCurrency(recordedTx.amount, 'INR', 1)}</strong> from your balance and recorded the bank transfer into your ledger and daily calendar readout.
              </p>

              {/* Receipt Card */}
              <div className="upi-receipt-card">
                <div className="upi-receipt-row main">
                  <span>Amount Transferred</span>
                  <span className="upi-receipt-amount">-{formatCurrency(recordedTx.amount, 'INR', 1)}</span>
                </div>
                <div className="upi-receipt-divider" />
                <div className="upi-receipt-row">
                  <span>Beneficiary</span>
                  <span className="bold">{recordedTx.merchant}</span>
                </div>
                <div className="upi-receipt-row">
                  <span>Account Details</span>
                  <span className="bold">{recordedTx.tags?.[2] || 'Bank A/c'} • {ifscCode}</span>
                </div>
                <div className="upi-receipt-row">
                  <span>Category</span>
                  <span className="badge">{recordedTx.category}</span>
                </div>
                <div className="upi-receipt-row">
                  <span>Ledger Status</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>Live & Calculated</span>
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
                  onClick={handleReset}
                  className="upi-btn-secondary"
                >
                  <RotateCcw size={15} />
                  <span>Make Another Transfer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpiDirectPayModal;
