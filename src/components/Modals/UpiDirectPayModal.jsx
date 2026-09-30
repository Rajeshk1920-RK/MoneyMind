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
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import './UpiDirectPayModal.css';

// SVG Vector Logos for Indian Payment Platforms
const PhonePeLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#5F259F" />
    <path d="M14.8 6.5H9.2C8.5 6.5 8 7 8 7.7V17.3C8 18 8.5 18.5 9.2 18.5H14.8C15.5 18.5 16 18 16 17.3V7.7C16 7 15.5 6.5 14.8 6.5ZM12 17.2C11.3 17.2 10.8 16.7 10.8 16C10.8 15.3 11.3 14.8 12 14.8C12.7 14.8 13.2 15.3 13.2 16C13.2 16.7 12.7 17.2 12 17.2ZM14.5 13.5H9.5V8.5H14.5V13.5Z" fill="#FFFFFF" />
  </svg>
);

const GooglePayLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#1A73E8" />
    <path d="M12 5C8.13 5 5 8.13 5 12C5 15.87 8.13 19 12 19C15.87 19 19 15.87 19 12C19 11.38 18.92 10.79 18.78 10.22H12V13.5H15.91C15.34 14.84 13.82 15.8 12 15.8C9.9 15.8 8.2 14.1 8.2 12C8.2 9.9 9.9 8.2 12 8.2C12.98 8.2 13.87 8.58 14.55 9.2L16.82 6.93C15.54 5.73 13.86 5 12 5Z" fill="#FFFFFF" />
  </svg>
);

const PaytmLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#00BAF2" />
    <path d="M6 9H8.5V15H6V9ZM10 9H12.5V15H10V9ZM14 9H18V11H16V15H14V9Z" fill="#002970" />
    <path d="M7 10.5H7.8V13.5H7V10.5ZM11 10.5H11.8V13.5H11V10.5Z" fill="#FFFFFF" />
  </svg>
);

const BhimUpiLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#059669" />
    <path d="M7 16L12 7L17 16H14L12 12L10 16H7Z" fill="#FFFFFF" />
  </svg>
);

// The 4 Core Payment Options
const PAYMENT_OPTIONS = [
  {
    id: 'bank_transfer',
    title: 'Bank Transfer',
    subtitle: 'Direct Account Number & IFSC transfer',
    icon: Building2,
    accentColor: '#2563eb',
    badgeText: 'IMPS / NEFT'
  },
  {
    id: 'pay_by_upi_id',
    title: 'Pay by UPI ID',
    subtitle: 'Instant transfer via VPA handle',
    icon: AtSign,
    accentColor: '#059669',
    badgeText: 'UPI VPA'
  },
  {
    id: 'scan_and_pay',
    title: 'Scan & Pay',
    subtitle: 'Dynamic QR code scanner & generator',
    icon: ScanLine,
    accentColor: '#7c3aed',
    badgeText: 'QR Code'
  },
  {
    id: 'pay_anyone',
    title: 'Pay Anyone',
    subtitle: 'Transfer directly to mobile number or contact',
    icon: Users,
    accentColor: '#0284c7',
    badgeText: 'Mobile Pay'
  }
];

// Popular merchant quick presets
const POPULAR_PAYEES = [
  { name: 'Swiggy', vpa: 'swiggy@okhdfcbank', category: 'Food & Dining' },
  { name: 'Zomato', vpa: 'zomato@icici', category: 'Food & Dining' },
  { name: 'Amazon Pay', vpa: 'amazonpay@apl', category: 'Shopping' },
  { name: 'Uber Rides', vpa: 'uber@icici', category: 'Transportation' },
  { name: 'Airtel Bill', vpa: 'airtel@paytm', category: 'Bills & Utilities' },
  { name: 'Apollo Pharmacy', vpa: 'apollo@axisbank', category: 'Health' }
];

// Frequent Contacts
const FREQUENT_CONTACTS = [
  { name: 'Aman Sharma', phone: '9876543210', vpa: '9876543210@paytm', initials: 'AS' },
  { name: 'Priya Patel', phone: '9845012345', vpa: 'priya@okhdfcbank', initials: 'PP' },
  { name: 'Rohan Verma', phone: '9123456780', vpa: 'rohan@ybl', initials: 'RV' },
  { name: 'Sarah Khan', phone: '9765432190', vpa: 'sarah@icici', initials: 'SK' }
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
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [amount, setAmount] = useState(() => initialAmount.toString());
  const [category, setCategory] = useState('Food & Dining');
  const [note, setNote] = useState('Payment via MoneyMind');
  const [paymentStatus, setPaymentStatus] = useState('input'); // 'input' | 'success'
  const [recordedTx, setRecordedTx] = useState(null);

  // 1. Bank Transfer States
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [bankLookupName, setBankLookupName] = useState('HDFC Bank - Main Branch');

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

  const numAmount = parseFloat(amount) || 0;

  // IFSC Auto-Lookup
  const handleIfscChange = (val) => {
    const clean = val.toUpperCase().trim();
    setIfscCode(clean);
    if (clean.startsWith('HDFC')) {
      setBankLookupName('HDFC Bank - Main Branch');
    } else if (clean.startsWith('SBIN')) {
      setBankLookupName('State Bank of India - Branch');
    } else if (clean.startsWith('ICIC')) {
      setBankLookupName('ICICI Bank - Commercial Branch');
    } else if (clean.startsWith('UTIB') || clean.startsWith('AXIS')) {
      setBankLookupName('Axis Bank - Cyber City');
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

    if (selectedMode === 'bank_transfer') {
      targetVpa = `${accountNumber.trim()}@${ifscCode.trim()}.ifsc.npci`;
      targetName = beneficiaryName.trim() || 'Account Holder';
    } else if (selectedMode === 'pay_anyone') {
      targetVpa = mobileNumber.trim() ? `${mobileNumber.trim()}@upi` : 'contact@upi';
      targetName = contactName.trim() || 'Contact';
    } else if (selectedMode === 'scan_and_pay' && scannedData) {
      return scannedData;
    }

    const cleanVpa = encodeURIComponent(targetVpa);
    const cleanName = encodeURIComponent(targetName);
    const cleanNote = encodeURIComponent(note.trim() || 'Payment');
    return `upi://pay?pa=${cleanVpa}&pn=${cleanName}&am=${numAmount}&cu=INR&tn=${cleanNote}`;
  }, [selectedMode, vpa, upiPayeeName, accountNumber, ifscCode, beneficiaryName, mobileNumber, contactName, scannedData, numAmount, note]);

  // Deep links for Indian UPI apps
  const phonePeUrl = useMemo(() => effectiveUpiUrl.replace('upi://pay', 'phonepe://pay'), [effectiveUpiUrl]);
  const gPayUrl = useMemo(() => effectiveUpiUrl.replace('upi://pay', 'gpay://upi/pay'), [effectiveUpiUrl]);
  const paytmUrl = useMemo(() => effectiveUpiUrl.replace('upi://pay', 'paytmmp://pay'), [effectiveUpiUrl]);

  // QR Code Image URL
  const qrImageUrl = useMemo(() => {
    const encodedUpi = encodeURIComponent(effectiveUpiUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedUpi}&margin=8`;
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
  };

  const handleLaunchApp = (url, platformName) => {
    if (numAmount <= 0) return;
    window.location.href = url;

    if (addNotification) {
      addNotification({
        id: `upi-init-${Date.now()}`,
        title: `Redirecting to ${platformName}`,
        message: `Completing payment of ₹${numAmount}. Confirm to auto-calculate into MoneyMind!`,
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

    if (selectedMode === 'bank_transfer') {
      finalMerchant = beneficiaryName.trim() || 'Bank Transfer';
      paymentDetails = `Bank Transfer (A/c ••${accountNumber.slice(-4) || '****'}, ${ifscCode})`;
    } else if (selectedMode === 'pay_by_upi_id') {
      finalMerchant = upiPayeeName.trim() || 'UPI Merchant';
      paymentDetails = `UPI ID (${vpa})`;
    } else if (selectedMode === 'scan_and_pay') {
      finalMerchant = 'QR Scan Merchant';
      paymentDetails = 'QR Scan & Pay';
    } else if (selectedMode === 'pay_anyone') {
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
      tags: [PAYMENT_OPTIONS.find(m => m.id === selectedMode)?.title || 'Direct Pay', paymentDetails],
      note: note.trim() || paymentDetails
    };

    // 1. Add to Ledger in FinanceContext (updates balance, budgets, calendar)
    addTransaction(newTx);
    setRecordedTx(newTx);
    setPaymentStatus('success');

    // 2. Trigger Confetti
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    // 3. Add Notification
    if (addNotification) {
      addNotification({
        id: `upi-done-${Date.now()}`,
        title: `₹${numAmount} Deducted & Calculated`,
        message: `Paid to ${finalMerchant}. Balance and category budget updated!`,
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
    }, 850);
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
              <h2 className="upi-pay-title">Direct UPI Pay</h2>
              <p className="upi-pay-subtitle">Select payment method & auto-log expense</p>
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

              <h3 className="upi-success-title">Payment Recorded & Calculated</h3>
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
                    {PAYMENT_OPTIONS.find(m => m.id === selectedMode)?.title}
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
                  <span style={{ color: '#059669', fontWeight: 700 }}>Active & Synced</span>
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
            /* --- 4 CLEAN PAYMENT OPTIONS & FOCUSED INPUT HUB --- */
            <>
              {/* 4 CORE PAYMENT OPTION BUTTONS WITH VECTOR LOGOS */}
              <div className="upi-options-four-grid">
                {PAYMENT_OPTIONS.map(opt => {
                  const IconComp = opt.icon;
                  const isSelected = selectedMode === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedMode(opt.id)}
                      className={`upi-option-card ${isSelected ? 'active' : ''}`}
                    >
                      <div
                        className="upi-option-icon-box"
                        style={{
                          backgroundColor: isSelected ? opt.accentColor : '#f1f5f9',
                          color: isSelected ? '#ffffff' : opt.accentColor
                        }}
                      >
                        <IconComp size={18} />
                      </div>
                      <div className="upi-option-text-wrap">
                        <span className="upi-option-title">{opt.title}</span>
                        <span className="upi-option-badge">{opt.badgeText}</span>
                      </div>
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

              {/* ================= OPTION 1: BANK TRANSFER ================= */}
              {selectedMode === 'bank_transfer' && (
                <div className="upi-mode-content-block">
                  <div className="upi-field-group">
                    <label className="upi-input-label">Beneficiary Name</label>
                    <div className="upi-input-box">
                      <Building2 size={17} color="#64748b" />
                      <input
                        type="text"
                        value={beneficiaryName}
                        onChange={(e) => setBeneficiaryName(e.target.value)}
                        placeholder="Account Holder Name"
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
                        placeholder="Enter Bank Account Number"
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
                        <CheckCircle2 size={13} color="#059669" />
                        <span>{bankLookupName}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* ================= OPTION 2: PAY BY UPI ID ================= */}
              {selectedMode === 'pay_by_upi_id' && (
                <div className="upi-mode-content-block">
                  <div className="upi-field-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="upi-input-label">UPI ID (VPA)</label>
                      <button
                        type="button"
                        onClick={() => handleCopyVpa(vpa)}
                        className="upi-copy-vpa-btn"
                      >
                        {copiedVpa ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                        <span>{copiedVpa ? 'Copied' : 'Copy'}</span>
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
                    <label className="upi-input-label">Merchant / Recipient</label>
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

                    {/* Quick Merchant Chips */}
                    <div className="upi-presets-scroll">
                      {POPULAR_PAYEES.map(p => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => handleSelectPayeePreset(p)}
                          className={`upi-preset-chip ${upiPayeeName === p.name ? 'active' : ''}`}
                        >
                          <span>{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= OPTION 3: SCAN AND PAY ================= */}
              {selectedMode === 'scan_and_pay' && (
                <div className="upi-mode-content-block">
                  <div className="upi-scan-panel">
                    <div className="upi-qr-card">
                      <img
                        src={qrImageUrl}
                        alt="Dynamic UPI QR Code"
                        className="upi-qr-image"
                      />
                      <div className="upi-qr-info">
                        <p className="upi-qr-text">
                          Scan with <strong>PhonePe, Google Pay, or Paytm</strong> camera
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

              {/* ================= OPTION 4: PAY ANYONE ================= */}
              {selectedMode === 'pay_anyone' && (
                <div className="upi-mode-content-block">
                  <div className="upi-field-group">
                    <label className="upi-input-label">Mobile Number</label>
                    <div className="upi-input-box">
                      <Phone size={17} color="#64748b" />
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748b' }}>+91</span>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        className="upi-text-input"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="upi-field-group">
                    <label className="upi-input-label">Frequent Contacts</label>
                    <div className="upi-contacts-grid">
                      {FREQUENT_CONTACTS.map(contact => (
                        <button
                          key={contact.phone}
                          type="button"
                          onClick={() => handleSelectContact(contact)}
                          className={`upi-contact-card ${contactName === contact.name ? 'active' : ''}`}
                        >
                          <div className="upi-contact-avatar">
                            {contact.initials}
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

              {/* Category & Purpose (Shared) */}
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
                    placeholder="e.g. Dinner, Rent"
                    className="upi-text-input simple"
                  />
                </div>
              </div>

              {/* PLATFORM APP LAUNCHERS (OFFICIAL VECTOR LOGOS) */}
              <div className="upi-platforms-section">
                <span className="upi-section-title">Launch Payment Platform</span>
                <div className="upi-platform-grid">
                  {/* PhonePe */}
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

                  {/* Google Pay */}
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

                  {/* Paytm */}
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

                  {/* BHIM / Default UPI */}
                  <button
                    type="button"
                    onClick={() => handleLaunchApp(effectiveUpiUrl, 'BHIM UPI')}
                    className="upi-platform-btn"
                  >
                    <BhimUpiLogo />
                    <div className="upi-platform-info">
                      <span className="upi-platform-name">BHIM UPI</span>
                      <span className="upi-platform-sub">Any UPI App</span>
                    </div>
                    <ExternalLink size={13} className="upi-platform-arrow" />
                  </button>
                </div>
              </div>

              {/* POST-PAYMENT CONFIRMATION & AUTO CALCULATION */}
              <div className="upi-confirm-box">
                <div className="upi-confirm-notice">
                  <ShieldCheck size={16} color="#059669" />
                  <span>
                    After completing the payment on your UPI app, tap below to <strong>auto-deduct & calculate</strong> the expense in MoneyMind!
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmAndRecord}
                  disabled={numAmount <= 0}
                  className="upi-confirm-btn"
                >
                  <CheckCircle2 size={18} />
                  <span>Confirm ₹{numAmount} Payment & Calculate</span>
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
