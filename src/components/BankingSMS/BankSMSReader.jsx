import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Send,
  Zap,
  Building2,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { parseBankingSMS, SAMPLE_BANK_SMS_MESSAGES } from '../../utils/smsParser';
import confetti from 'canvas-confetti';

export function BankSMSReader({ isOpen = true, onClose, onTransactionAdded }) {
  const { addTransaction, activeCurrencyCode } = useFinance();

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'custom'
  const [customSMS, setCustomSMS] = useState('');
  const [parsedPreview, setParsedPreview] = useState(null);
  const [processedSMSIds, setProcessedSMSIds] = useState(new Set());
  const [toastMsg, setToastMsg] = useState('');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleProcessSMS = (sms) => {
    const parsed = parseBankingSMS(sms.text);
    if (!parsed) return;

    addTransaction({
      type: parsed.type,
      title: parsed.merchant,
      amount: parsed.amount,
      category: parsed.category,
      paymentMethod: parsed.paymentMethod,
      date: parsed.date,
      tags: ['Banking SMS', parsed.bank],
      note: `Auto-parsed from ${sms.sender || parsed.bank}: "${sms.text.substring(0, 60)}..."`
    });

    setProcessedSMSIds(prev => new Set([...prev, sms.id]));

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });

    showToast(`Parsed ${parsed.bank}: ${parsed.type === 'expense' ? '₹' + parsed.amount + ' spent at ' : '₹' + parsed.amount + ' received from '}${parsed.merchant}!`);
    if (onTransactionAdded) onTransactionAdded();
  };

  const handleParseCustomSMS = () => {
    if (!customSMS.trim()) return;
    const parsed = parseBankingSMS(customSMS);
    setParsedPreview(parsed);
  };

  const handleSaveCustomParsed = () => {
    if (!parsedPreview) return;

    addTransaction({
      type: parsedPreview.type,
      title: parsedPreview.merchant,
      amount: parsedPreview.amount,
      category: parsedPreview.category,
      paymentMethod: parsedPreview.paymentMethod,
      date: parsedPreview.date,
      tags: ['Banking SMS', parsedPreview.bank],
      note: `Auto-parsed from SMS: "${customSMS.substring(0, 60)}..."`
    });

    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.6 }
    });

    showToast(`Successfully added ₹${parsedPreview.amount} transaction to cashflow!`);
    setCustomSMS('');
    setParsedPreview(null);
    if (onTransactionAdded) onTransactionAdded();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '0.75rem', alignItems: 'center' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          maxHeight: '92vh',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22)',
          border: '1px solid #e2ede8',
          overflow: 'hidden'
        }}
      >
        {/* Toast Banner */}
        {toastMsg && (
          <div style={{
            backgroundColor: '#059669',
            color: '#ffffff',
            padding: '0.6rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            flexShrink: 0
          }}>
            <CheckCircle2 size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2ede8',
          background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(5, 150, 105, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              flexShrink: 0
            }}>
              <MessageSquare size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  Banking SMS Reader
                </h3>
                <span style={{
                  fontSize: '0.65rem',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#6ee7b7' }} />
                  AUTO-SYNC
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '3px 0 0', fontWeight: 500, lineHeight: 1.3 }}>
                Auto-parse banking & UPI alerts into cashflow
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2ede8',
          backgroundColor: '#f8fafc',
          flexShrink: 0
        }}>
          <button
            onClick={() => setActiveTab('feed')}
            style={{
              flex: 1,
              padding: '0.85rem',
              border: 'none',
              background: 'transparent',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'feed' ? '#059669' : '#64748b',
              borderBottom: activeTab === 'feed' ? '2.5px solid #059669' : '2.5px solid transparent'
            }}
          >
            Incoming Bank Alerts ({SAMPLE_BANK_SMS_MESSAGES.length})
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            style={{
              flex: 1,
              padding: '0.85rem',
              border: 'none',
              background: 'transparent',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'custom' ? '#059669' : '#64748b',
              borderBottom: activeTab === 'custom' ? '2.5px solid #059669' : '2.5px solid transparent'
            }}
          >
            Paste Bank SMS
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.25rem 1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>

          {/* 1. BANK SMS FEED TAB */}
          {activeTab === 'feed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                backgroundColor: '#ecfdf5',
                borderRadius: '12px',
                border: '1px solid #a7f3d0',
                fontSize: '0.76rem',
                color: '#065f46'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} color="#059669" />
                  <span>SMS auto-detection is active for Indian Banks (HDFC, SBI, ICICI, Axis, UPI).</span>
                </div>
              </div>

              {SAMPLE_BANK_SMS_MESSAGES.map((sms) => {
                const isParsed = processedSMSIds.has(sms.id);
                const parsed = parseBankingSMS(sms.text);

                return (
                  <div
                    key={sms.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '16px',
                      backgroundColor: isParsed ? '#f8fafc' : '#ffffff',
                      border: `1.5px solid ${isParsed ? '#e2e8f0' : '#d1fae5'}`,
                      boxShadow: isParsed ? 'none' : '0 2px 10px rgba(5, 150, 105, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Building2 size={15} color="#059669" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                          {sms.bank}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                          • {sms.sender}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {sms.time}
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.8rem',
                      color: '#334155',
                      lineHeight: 1.45,
                      backgroundColor: '#f8fafc',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontFamily: 'monospace'
                    }}>
                      {sms.text}
                    </div>

                    {/* Extracted Details Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '99px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          backgroundColor: parsed.type === 'expense' ? '#fee2e2' : '#d1fae5',
                          color: parsed.type === 'expense' ? '#b91c1c' : '#047857'
                        }}>
                          {parsed.type === 'expense' ? `-₹${parsed.amount}` : `+₹${parsed.amount}`}
                        </span>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>
                          {parsed.merchant}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                          ({parsed.category})
                        </span>
                      </div>

                      {isParsed ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#059669', fontSize: '0.74rem', fontWeight: 700 }}>
                          <CheckCircle2 size={14} />
                          <span>Added to Cashflow</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleProcessSMS(sms)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '99px',
                            backgroundColor: '#059669',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
                          }}
                        >
                          <Plus size={13} />
                          <span>Auto-Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. CUSTOM SMS PASTE TAB */}
          {activeTab === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  Paste Banking / UPI Alert SMS:
                </label>
                <textarea
                  rows={4}
                  value={customSMS}
                  onChange={(e) => {
                    setCustomSMS(e.target.value);
                    if (e.target.value.trim().length > 10) {
                      const p = parseBankingSMS(e.target.value);
                      setParsedPreview(p);
                    } else {
                      setParsedPreview(null);
                    }
                  }}
                  className="form-control"
                  placeholder="e.g. Rs. 750.00 debited from A/C XX9281 on 29-SEP-26 to ZOMATO. Ref 429188..."
                  style={{ fontSize: '0.86rem', resize: 'none' }}
                />
              </div>

              {parsedPreview && (
                <div style={{
                  padding: '1.1rem',
                  borderRadius: '16px',
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #a7f3d0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={16} color="#059669" />
                      <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#166534' }}>
                        Auto-Parsed Intelligence
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
                      {parsedPreview.bank}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Amount:</span>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: parsedPreview.type === 'expense' ? '#dc2626' : '#059669' }}>
                        {parsedPreview.type === 'expense' ? `-₹${parsedPreview.amount}` : `+₹${parsedPreview.amount}`}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Merchant / Entity:</span>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{parsedPreview.merchant}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Category:</span>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{parsedPreview.category}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Account:</span>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{parsedPreview.account}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveCustomParsed}
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      padding: '0.7rem',
                      borderRadius: '12px',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
                    }}
                  >
                    <Plus size={16} />
                    <span>Auto-Add to Cashflow Records</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2ede8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.74rem',
          color: '#64748b'
        }}>
          <span>🔒 100% On-Device SMS Parsing (Read-Only)</span>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem 0.95rem',
              borderRadius: '99px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default BankSMSReader;
