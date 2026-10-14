import React, { useMemo, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { calculateFinancialHealth, generateSmartMoneyInsights } from '../../utils/moneyIntelligence';
import { createEncryptedBackup } from '../../utils/backupEngine';
import { FinancialHealthScore } from './FinancialHealthScore';
import { SmartMoneyInsights } from './SmartMoneyInsights';
import {
  ShieldCheck,
  HardDrive,
  CheckCircle2,
  RefreshCw,
  Lock,
  CloudUpload,
  Sparkles
} from 'lucide-react';
import './MoneyIntelligence.css';

export function MoneyIntelligenceView({ onOpenAddTx }) {
  const { transactions, budgets, goals, activeCurrencyCode } = useFinance();
  const { user } = useAuth();

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupNotice, setBackupNotice] = useState('');

  // Local-only deterministic calculations with useMemo for optimal performance
  const healthData = useMemo(() => {
    return calculateFinancialHealth({
      transactions,
      budgets,
      goals
    });
  }, [transactions, budgets, goals]);

  const insights = useMemo(() => {
    return generateSmartMoneyInsights({
      transactions,
      budgets,
      goals,
      activeCurrencyCode
    });
  }, [transactions, budgets, goals, activeCurrencyCode]);

  const handleManualBackup = async () => {
    if (!user?.id) return;
    setIsBackingUp(true);
    setBackupNotice('');

    try {
      const res = await createEncryptedBackup(user.id);
      if (res.success) {
        setBackupNotice('✅ Encrypted local backup generated successfully!');
        setTimeout(() => setBackupNotice(''), 4000);
      } else {
        setBackupNotice('❌ Backup failed: ' + res.error);
      }
    } catch (err) {
      setBackupNotice('❌ Error: ' + err.message);
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="intel-container">
      {/* Header */}
      <div className="intel-header">
        <div>
          <h2 className="intel-title">Money Intelligence</h2>
          <p className="intel-subtitle">
            100% on-device financial health score and deterministic pattern insights
          </p>
        </div>

        {/* Manual Encrypted Backup Trigger */}
        <button
          type="button"
          onClick={handleManualBackup}
          disabled={isBackingUp}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2ede8',
            color: '#0f172a',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          {isBackingUp ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : (
            <Lock size={13} color="#059669" />
          )}
          <span>{isBackingUp ? 'Encrypting...' : 'Encrypted Backup'}</span>
        </button>
      </div>

      {backupNotice && (
        <div style={{
          padding: '0.65rem 1rem',
          borderRadius: '12px',
          backgroundColor: backupNotice.startsWith('✅') ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${backupNotice.startsWith('✅') ? '#a7f3d0' : '#fecaca'}`,
          fontSize: '0.78rem',
          fontWeight: 700,
          color: backupNotice.startsWith('✅') ? '#065f46' : '#991b1b'
        }}>
          {backupNotice}
        </div>
      )}

      {/* Privacy Guarantee Pill Banner */}
      <div className="privacy-badge-banner">
        <div className="privacy-badge-left">
          <ShieldCheck size={18} color="#059669" />
          <div>
            <div className="privacy-badge-title">Local-First Privacy Architecture</div>
            <div className="privacy-badge-desc">
              Your financial transactions and health scores never leave this device. No AI models or cloud databases process your money data.
            </div>
          </div>
        </div>
      </div>

      {/* 1. Financial Health Score (Radial Gauge & Breakdown) */}
      <FinancialHealthScore
        healthData={healthData}
        onOpenAddTx={onOpenAddTx}
      />

      {/* 2. Smart Money Insights */}
      <SmartMoneyInsights
        insights={insights}
        onOpenAddTx={onOpenAddTx}
      />
    </div>
  );
}
