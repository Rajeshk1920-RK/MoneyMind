import React, { useState } from 'react';
import {
  X,
  Building2,
  AtSign,
  ScanLine,
  Users,
  ChevronRight,
  Zap,
  ShieldCheck
} from 'lucide-react';
import './UpiDirectPayModal.css';

// The 4 Core Direct Payment Options with Clean Vector Icons (No Emojis)
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

export function UpiDirectPayModal({ isOpen, onClose, onSelectOption }) {
  const [selectedOption, setSelectedOption] = useState(null);

  if (!isOpen) return null;

  const handleOptionClick = (option) => {
    setSelectedOption(option.id);
    if (onSelectOption) {
      onSelectOption(option);
    }
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
              <p className="upi-pay-subtitle">Select payment method to proceed</p>
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

        {/* Modal Body: ONLY THE 4 CLEAN PAYMENT OPTIONS */}
        <div className="upi-pay-body">
          <div className="upi-options-list">
            {PAYMENT_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className={`upi-option-card-row ${isSelected ? 'active' : ''}`}
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

          {/* Security & Privacy Badge */}
          <div className="upi-footer-security">
            <ShieldCheck size={16} color="#059669" />
            <span>Encrypted Direct Routing with Live Expense Calculation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpiDirectPayModal;
