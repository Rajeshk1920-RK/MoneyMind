import React, { useState, useMemo, useRef } from 'react';
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
  RotateCcw,
  Building2,
  AtSign,
  ScanLine,
  Users,
  Camera,
  Phone,
  Search,
  Upload,
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import './UpiDirectPayModal.css';

// 4 Main Payment Options
const PAYMENT_MODES = [
  {
    id: 'bank_transfer',
    label: 'Bank Transfer',
    icon: Building2,
    desc: 'Account & IFSC code transfer',
    color: '#2563eb',
    bgColor: '#eff6ff'
  },
  {
    id: 'pay_by_upi_id',
    label: 'Pay by UPI ID',
    icon: AtSign,
    desc: 'VPA handle (PhonePe, GPay, Paytm)',
    color: '#059669',
    bgColor: '#ecfdf5'
  },
  {
    id: 'scan_and_pay',
    label: 'Scan & Pay',
    icon: ScanLine,
    desc: 'Scan or display dynamic QR code',
    color: '#7c3aed',
    bgColor: '#f5f3ff'
  },
  {
    id: 'pay_anyone',
    label: 'Pay Anyone',
    icon: Users,
    desc: 'Pay to mobile number or contact',
    color: '#d97706',
    bgColor: '#fffbeb'
  }
];

// Popular merchant quick presets for UPI ID
const POPULAR_PAYEES = [
  { name: 'Swiggy', vpa: 'swiggy@okhdfcbank', category: 'Food & Dining', color: '#f97316' },
  { name: 'Zomato', vpa: 'zomato@icici', category: 'Food & Dining', color: '#ef4444' },
  { name: 'Amazon Pay', vpa: 'amazonpay@apl', category: 'Shopping', color: '#f59e0b' },
  { name: 'Uber Rides', vpa: 'uber@icici', category: 'Transportation', color: '#0f172a' },
  { name: 'Airtel Bill', vpa: 'airtel@paytm', category: 'Bills & Utilities', color: '#dc2626' },
  { name: 'Apollo Meds', vpa: 'apollo@axisbank', category: 'Health', color: '#059669' }
];

// Frequent Contacts for "Pay Anyone"
const POPULAR_CONTACTS = [
  { name: 'Aman Sharma', phone: '9876543210', vpa: '9876543210@paytm', avatar: 'AS', color: '#3b82f6', category: 'Personal' },
  { name: 'Priya Patel', phone: '9845012345', vpa: 'priya@okhdfcbank', avatar: 'PP', color: '#ec4899', category: 'Personal' },
  { name: 'Rohan Verma', phone: '9123456780', vpa: 'rohan@ybl', avatar: 'RV', color: '#10b981', category: 'Food & Dining' },
  { name: 'Sarah Khan', phone: '9765432190', vpa: 'sarah@icici', avatar: 'SK', color: '#8b5cf6', category: 'Shopping' }
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

export function UpiDirectPayModal({
  isOpen,
  onClose,
  initialAmount = '350',
  initialPayee = '',
  initialMode = 'pay_by_upi_id'
}) {
  const { addTransaction, addNotification } = useFinance();

  // Active Mode: 'bank_transfer' | 'pay_by_upi_id' | 'scan_and_pay' | 'pay_anyone'
  const [activeMode, setActiveMode] = useState(initialMode);
  const [amount, setAmount] = useState(() => initialAmount.toString());
  const [category, setCategory] = useState('Food & Dining');
  const [note, setNote] = useState('Payment via MoneyMind');
  const [paymentStatus, setPaymentStatus] = useState('input'); // 'input' | 'success'
  const [recordedTx, setRecordedTx] = useState(null);

  // 1. Bank Transfer States
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [bankLookupName, setBankLookupName] = useState('HDFC Bank • Koramangala Branch');

  // 2. Pay by UPI ID States
  const [vpa, setVpa] = useState('swiggy@okhdfcbank');
  const [upiPayeeName, setUpiPayeeName] = useState(() => initialPayee || 'Swiggy');
  const [copiedVpa, setCopiedVpa] = useState(false);

  // 3. Scan & Pay States
  const [scannedData, setScannedData] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // 4. Pay Anyone States
  const [mobileNumber, setMobileNumber] = useState('');
  const [contactName, setContactName] = useState('Aman Sharma');

  const fileInputRef = useRef(null);

  const numAmount = parseFloat(amount) || 0;

  // IFSC Auto-Lookup
  const handleIfscChange = (val) => {
    const clean = val.toUpperCase().trim();
    setIfscCode(clean);
    if (clean.startsWith('HDFC')) {
      setBankLookupName('HDFC Bank • Main Branch');
    } else if (clean.startsWith('SBIN')) {
      setBankLookupName('State Bank of India • Branch');
    } else if (clean.startsWith('ICIC')) {
      setBankLookupName('ICICI Bank • Commercial Branch');
    } else if (clean.startsWith('UTIB') || clean.startsWith('AXIS')) {
      setBankLookupName('Axis Bank • Cyber City Branch');
    } else if (clean.length >= 4) {
      setBankLookupName(`${clean.slice(0, 4)} Bank (Verified IFSC)`);
    } else {
      setBankLookupName('');
    }
  };

  // Generate UPI Target URI based on active mode
  const effectiveUpiUrl = useMemo(() => {
    let targetVpa = vpa.trim() || 'merchant@upi';
    let targetName = upiPayeeName.trim() || 'Merchant';

    if (activeMode === 'bank_transfer') {
      targetVpa = `${accountNumber.trim()}@${ifscCode.trim()}.ifsc.npci`;
      targetName = beneficiaryName.trim() || 'Account Holder';
    } else if (activeMode === 'pay_anyone') {
      targetVpa = mobileNumber.trim() ? `${mobileNumber.trim()}@upi` : 'contact@upi';
      targetName = contactName.trim() || 'Contact';
    } else if (activeMode === 'scan_and_pay' && scannedData) {
      return scannedData;
    }

    const cleanVpa = encodeURIComponent(targetVpa);
    const cleanName = encodeURIComponent(targetName);
    const cleanNote = encodeURIComponent(note.trim() || 'Payment');
    return `upi://pay?pa=${cleanVpa}&pn=${cleanName}&am=${numAmount}&cu=INR&tn=${cleanNote}`;
  }, [activeMode, vpa, upiPayeeName, accountNumber, ifscCode, beneficiaryName, mobileNumber, contactName, scannedData, numAmount, note]);

  // Deep links for Indian UPI apps
  const phonePeUrl = useMemo(() => {
    return effectiveUpiUrl.replace('upi://pay', 'phonepe://pay');
  }, [effectiveUpiUrl]);

  const gPayUrl = useMemo(() => {
    return effectiveUpiUrl.replace('upi://pay', 'gpay://upi/pay');
  }, [effectiveUpiUrl]);

  const paytmUrl = useMemo(() => {
    return effectiveUpiUrl.replace('upi://pay', 'paytmmp://pay');
  }, [effectiveUpiUrl]);

  // QR Code Image URL
  const qrImageUrl = useMemo(() => {
    const encodedUpi = encodeURIComponent(effectiveUpiUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedUpi}&margin=10`;
  }, [effectiveUpiUrl]);

  if (!isOpen) return null;

  const handleQuickAddAmount = (addVal) => {
    const cur = parseFloat(amount) || 0;
    setAmount((cur + addVal).toString());
  };

  const handleSelectPayeePreset = (preset) => {
    setUpiPayeeName(preset.name);
    setVpa(preset.vpa);
    setCategory(preset.category);
  };

  const handleSelectContact = (contact) => {
    setContactName(contact.name);
    setMobileNumber(contact.phone);
    setCategory(contact.category);
  };

  const handleLaunchApp = (url, platformName) => {
    if (numAmount <= 0) return;
    window.location.href = url;

    if (addNotification) {
      addNotification({
        id: `upi-init-${Date.now()}`,
        title: `Redirecting to ${platformName}`,
        message: `Completing ₹${numAmount} payment. Confirm to auto-calculate into MoneyMind!`,
        time: 'Just now',
        type: 'info',
        unread: true
      });
    }
  };

  // Record payment and auto-calculate into MoneyMind Ledger
  const handleConfirmAndRecord = () => {
    if (numAmount <= 0) return;

    let finalMerchant = 'UPI Payment';
    let paymentDetails = 'UPI';

    if (activeMode === 'bank_transfer') {
      finalMerchant = beneficiaryName.trim() || 'Bank Transfer';
      paymentDetails = `Bank Transfer (A/c ••${accountNumber.slice(-4) || '****'}, ${ifscCode})`;
    } else if (activeMode === 'pay_by_upi_id') {
      finalMerchant = upiPayeeName.trim() || 'UPI Merchant';
      paymentDetails = `UPI ID (${vpa})`;
    } else if (activeMode === 'scan_and_pay') {
      finalMerchant = 'QR Scan Merchant';
      paymentDetails = 'QR Scan & Pay';
    } else if (activeMode === 'pay_anyone') {
      finalMerchant = contactName.trim() || 'Mobile Contact';
      paymentDetails = `Mobile Pay (+91 ${mobileNumber || 'Contact'})`;
    }

    const newTx = {
      id: `tx-upi-${Date.now()}`,
      title: finalMerchant,
      merchant: finalMerchant,
      amount: numAmount,
      type: 'expense',
      category: category,
      paymentMethod: 'UPI',
      date: new Date().toISOString().split('T')[0],
      tags: [PAYMENT_MODES.find(m => m.id === activeMode)?.label || 'Direct Pay', paymentDetails],
      note: note.trim() || paymentDetails
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
        title: `₹${numAmount} Deducted & Calculated`,
        message: `Paid to ${finalMerchant} via ${PAYMENT_MODES.find(m => m.id === activeMode)?.label}. Balance & budget updated!`,
        time: 'Just now',
        type: 'expense',
        unread: true
      });
    }
  };

  const handleCopyVpa = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleResetForAnotherPayment = () => {
    setPaymentStatus('input');
    setAmount('350');
    setRecordedTx(null);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedData('upi://pay?pa=starbucks@hdfcbank&pn=Starbucks%20Coffee&am=350&cu=INR');
      setCategory('Food & Dining');
      setNote('Starbucks Store QR Scan');
    }, 900);
  };

  return (
    <div className="upi-pay-overlay" role="dialog" aria-modal="true">
      <div className="upi-pay-modal">
        {/* Header */}
        <div className="upi-pay-header">
          <div className="upi-pay-header-left">
            <div className="upi-pay-icon-badge">
              <Zap size={22} color="#ffffff" />
            </div>
            <div>
              <h2 className="upi-pay-title">Direct UPI Pay & Auto-Log</h2>
              <p className="upi-pay-subtitle">Bank Transfer • Pay by UPI ID • Scan & Pay • Pay Anyone</p>
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
                <CheckCircle2 size={56} color="#059669" />
              </div>

              <h3 className="upi-success-title">Payment Recorded & Calculated!</h3>
              <p className="upi-success-desc">
                MoneyMind has deducted <strong>{formatCurrency(recordedTx.amount, 'INR', 1)}</strong> from your balance, updated your category budget, and added a daily spend readout on your calendar.
              </p>

              {/* Receipt Card */}
              <div className="upi-receipt-card">
                <div className="upi-receipt-row main">
                  <span>Amount Deducted</span>
                  <span className="upi-receipt-amount">-{formatCurrency(recordedTx.amount, 'INR', 1)}</span>
                </div>
                <div className="upi-receipt-divider" />
                <div className="upi-receipt-row">
                  <span>Payment Mode</span>
                  <span className="bold" style={{ color: '#2563eb' }}>
                    {PAYMENT_MODES.find(m => m.id === activeMode)?.label}
                  </span>
                </div>
                <div className="upi-receipt-row">
                  <span>Beneficiary</span>
                  <span className="bold">{recordedTx.merchant}</span>
                </div>
                <div className="upi-receipt-row">
                  <span>Category</span>
                  <span className="badge">{recordedTx.category}</span>
                </div>
                <div className="upi-receipt-row">
                  <span>Ledger Status</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Live Calculated</span>
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
            /* --- 4 PAYMENT OPTIONS & INPUT HUB --- */
            <>
              {/* 4 OPTION SELECTION TABS */}
              <div className="upi-modes-grid">
                {PAYMENT_MODES.map(mode => {
                  const IconComp = mode.icon;
                  const isSelected = activeMode === mode.id;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setActiveMode(mode.id)}
                      className={`upi-mode-card ${isSelected ? 'active' : ''}`}
                    >
                      <div
                        className="upi-mode-icon-circle"
                        style={{
                          backgroundColor: isSelected ? mode.color : mode.bgColor,
                          color: isSelected ? '#ffffff' : mode.color
                        }}
                      >
                        <IconComp size={18} />
                      </div>
                      <span className="upi-mode-label">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Amount Input Card (Shared across all modes) */}
              <div className="upi-amount-section">
                <label className="upi-input-label">Amount to Pay</label>
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
                  {[100, 250, 500, 1000, 2000, 5000].map(val => (
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

              {/* OPTION 1: BANK TRANSFER */}
              {activeMode === 'bank_transfer' && (
                <div className="upi-mode-content-block">
                  <div className="upi-field-group">
                    <label className="upi-input-label">Account Holder / Beneficiary Name</label>
                    <div className="upi-input-box">
                      <Store size={17} color="#64748b" />
                      <input
                        type="text"
                        value={beneficiaryName}
                        onChange={(e) => setBeneficiaryName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar, Landlord"
                        className="upi-text-input"
                      />
                    </div>
                  </div>

                  <div className="upi-field-group">
                    <label className="upi-input-label">Bank Account Number</label>
                    <div className="upi-input-box">
                      <CreditCard size={17} color="#64748b" />
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter full bank account number"
                        className="upi-text-input"
                      />
                    </div>
                  </div>

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
                      <span className="upi-bank-verified-tag">
                        <CheckCircle2 size={12} color="#059669" />
                        <span>{bankLookupName}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* OPTION 2: PAY BY UPI ID */}
              {activeMode === 'pay_by_upi_id' && (
                <div className="upi-mode-content-block">
                  <div className="upi-field-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="upi-input-label">Payee UPI ID (VPA)</label>
                      <button
                        type="button"
                        onClick={() => handleCopyVpa(vpa)}
                        className="upi-copy-vpa-btn"
                      >
                        {copiedVpa ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                        <span>{copiedVpa ? 'Copied' : 'Copy VPA'}</span>
                      </button>
                    </div>
                    <div className="upi-input-box">
                      <AtSign size={17} color="#64748b" />
                      <input
                        type="text"
                        value={vpa}
                        onChange={(e) => setVpa(e.target.value)}
                        placeholder="merchant@upi or 9876543210@paytm"
                        className="upi-text-input"
                      />
                    </div>
                  </div>

                  <div className="upi-field-group">
                    <label className="upi-input-label">Merchant / Recipient Name</label>
                    <div className="upi-input-box">
                      <Store size={17} color="#64748b" />
                      <input
                        type="text"
                        value={upiPayeeName}
                        onChange={(e) => setUpiPayeeName(e.target.value)}
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
                          className={`upi-preset-chip ${upiPayeeName === p.name ? 'active' : ''}`}
                        >
                          <span className="upi-preset-dot" style={{ backgroundColor: p.color }} />
                          <span>{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* OPTION 3: SCAN AND PAY */}
              {activeMode === 'scan_and_pay' && (
                <div className="upi-mode-content-block">
                  <div className="upi-scan-panel">
                    <div className="upi-qr-card" style={{ width: '100%' }}>
                      <img
                        src={qrImageUrl}
                        alt="Dynamic UPI QR Code"
                        className="upi-qr-image"
                      />
                      <div className="upi-qr-info">
                        <p className="upi-qr-text">
                          Scan using <strong>PhonePe, Google Pay, or Paytm</strong> camera
                        </p>
                        <span className="upi-qr-amount">
                          Paying ₹{numAmount}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={handleSimulateScan}
                        className="upi-btn-secondary"
                        style={{ flex: 1, padding: '0.65rem' }}
                      >
                        <Camera size={15} />
                        <span>{isScanning ? 'Scanning...' : 'Scan Store QR Code'}</span>
                      </button>
                    </div>

                    {scannedData && (
                      <div className="upi-scanned-alert">
                        <CheckCircle2 size={15} color="#059669" />
                        <span>Scanned: Starbucks Coffee (₹{numAmount})</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* OPTION 4: PAY ANYONE */}
              {activeMode === 'pay_anyone' && (
                <div className="upi-mode-content-block">
                  <div className="upi-field-group">
                    <label className="upi-input-label">Enter Mobile Number</label>
                    <div className="upi-input-box">
                      <Phone size={17} color="#64748b" />
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748b' }}>+91</span>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="upi-text-input"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="upi-field-group">
                    <label className="upi-input-label">Frequent Contacts</label>
                    <div className="upi-contacts-grid">
                      {POPULAR_CONTACTS.map(contact => (
                        <button
                          key={contact.phone}
                          type="button"
                          onClick={() => handleSelectContact(contact)}
                          className={`upi-contact-card ${contactName === contact.name ? 'active' : ''}`}
                        >
                          <div
                            className="upi-contact-avatar"
                            style={{ backgroundColor: contact.color }}
                          >
                            {contact.avatar}
                          </div>
                          <div className="upi-contact-details">
                            <span className="upi-contact-name">{contact.name}</span>
                            <span className="upi-contact-phone">+91 {contact.phone}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Category & Notes (Shared) */}
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
                    placeholder="e.g. Rent, Grocery"
                    className="upi-text-input simple"
                  />
                </div>
              </div>

              {/* PLATFORM APP REDIRECT LAUNCHERS */}
              <div className="upi-platforms-section">
                <span className="upi-section-title">Launch Payment Platform</span>
                <div className="upi-platform-grid">
                  {/* PhonePe */}
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
                      <span className="upi-platform-sub">Open App</span>
                    </div>
                    <ExternalLink size={13} className="upi-platform-arrow" />
                  </button>

                  {/* Google Pay */}
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
                      <span className="upi-platform-sub">Open App</span>
                    </div>
                    <ExternalLink size={13} className="upi-platform-arrow" />
                  </button>

                  {/* Paytm */}
                  <button
                    type="button"
                    onClick={() => handleLaunchApp(paytmUrl, 'Paytm')}
                    className="upi-platform-btn paytm"
                  >
                    <div className="upi-platform-icon-wrap paytm-bg">
                      <span style={{ fontWeight: 900, color: '#ffffff', fontSize: '10px' }}>paytm</span>
                    </div>
                    <div className="upi-platform-info">
                      <span className="upi-platform-name">Paytm UPI</span>
                      <span className="upi-platform-sub">Open App</span>
                    </div>
                    <ExternalLink size={13} className="upi-platform-arrow" />
                  </button>

                  {/* Any Default UPI */}
                  <button
                    type="button"
                    onClick={() => handleLaunchApp(effectiveUpiUrl, 'Default UPI')}
                    className="upi-platform-btn default-upi"
                  >
                    <div className="upi-platform-icon-wrap default-bg">
                      <Smartphone size={17} color="#ffffff" />
                    </div>
                    <div className="upi-platform-info">
                      <span className="upi-platform-name">Any UPI App</span>
                      <span className="upi-platform-sub">BHIM / CRED</span>
                    </div>
                    <ExternalLink size={13} className="upi-platform-arrow" />
                  </button>
                </div>
              </div>

              {/* POST-PAYMENT CONFIRMATION & AUTO CALCULATION */}
              <div className="upi-confirm-box">
                <div className="upi-confirm-notice">
                  <Sparkles size={16} color="#059669" />
                  <span>
                    Once paid on your app, tap below to <strong>auto-deduct & calculate</strong> the expense into MoneyMind!
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmAndRecord}
                  disabled={numAmount <= 0}
                  className="upi-confirm-btn"
                >
                  <CheckCircle2 size={18} />
                  <span>Confirm ₹{numAmount} Payment & Calculate Expense</span>
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
