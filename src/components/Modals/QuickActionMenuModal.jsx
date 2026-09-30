import React from 'react';
import {
  X,
  Zap,
  ArrowLeftRight,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import './QuickActionMenuModal.css';

export function QuickActionMenuModal({
  isOpen,
  onClose,
  onSelectDirectUpiPay,
  onSelectRecordTransfer
}) {
  if (!isOpen) return null;

  return (
    <div className="quick-action-overlay" onClick={onClose}>
      <div
        className="quick-action-modal-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Drag handle / Pill indicator for mobile */}
        <div className="quick-action-drag-pill" />

        {/* Header */}
        <div className="quick-action-header">
          <div>
            <h3 className="quick-action-title">Quick Action</h3>
            <p className="quick-action-subtitle">Choose an action to proceed</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="quick-action-close-btn"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2 Routes Cards List */}
        <div className="quick-action-routes-list">
          {/* ROUTE 1: Direct UPI Pay */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectDirectUpiPay();
            }}
            className="quick-action-route-card route-direct-upi"
          >
            <div className="quick-action-route-icon-box upi-icon-box">
              <Zap size={24} color="#ffffff" strokeWidth={2.3} />
            </div>

            <div className="quick-action-route-info">
              <div className="quick-action-route-title-row">
                <span className="quick-action-route-title">Direct UPI Pay</span>
                <span className="quick-action-badge badge-emerald">Instant Pay</span>
              </div>
              <p className="quick-action-route-desc">
                Pay via Bank Transfer, UPI ID, QR, PhonePe, GPay, Paytm & auto-calculate.
              </p>
            </div>

            <div className="quick-action-chevron-box">
              <ChevronRight size={18} />
            </div>
          </button>

          {/* ROUTE 2: Record New Transfer / Transaction */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectRecordTransfer();
            }}
            className="quick-action-route-card route-record-transfer"
          >
            <div className="quick-action-route-icon-box transfer-icon-box">
              <ArrowLeftRight size={24} color="#ffffff" strokeWidth={2.3} />
            </div>

            <div className="quick-action-route-info">
              <div className="quick-action-route-title-row">
                <span className="quick-action-route-title">Record New Transfer</span>
                <span className="quick-action-badge badge-indigo">Manual Entry</span>
              </div>
              <p className="quick-action-route-desc">
                Log a manual expense, income deposit, or bank account transfer.
              </p>
            </div>

            <div className="quick-action-chevron-box">
              <ChevronRight size={18} />
            </div>
          </button>
        </div>

        {/* Footer Security Note */}
        <div className="quick-action-footer-note">
          <ShieldCheck size={14} color="#059669" />
          <span>100% Private On-Device Encrypted Financial Tracking</span>
        </div>
      </div>
    </div>
  );
}
