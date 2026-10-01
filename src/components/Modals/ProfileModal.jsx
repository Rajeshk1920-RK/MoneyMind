import React, { useState } from 'react';
import {
  X,
  User,
  CreditCard,
  Bot,
  Bell,
  Coins,
  Palette,
  FileSpreadsheet,
  Database,
  HelpCircle,
  Info,
  ChevronRight,
  Check,
  Edit2,
  Download,
  Upload,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Save,
  Trash2,
  LogOut
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarFallback } from '../ui/avatar';
import logoImg from '@/assets/logo.png';

export function ProfileModal({ isOpen = true, onClose, onLogout, onNavigateLanding }) {
  const {
    activeProfile,
    updateUserName,
    activeCurrencyCode,
    setActiveCurrencyCode,
    currencies,
    transactions,
    budgets,
    goals,
    clearAllData
  } = useFinance();

  const { user, signOut } = useAuth();

  // Active view: null = main list, or 'payment' | 'finai' | 'notifications' | 'currency' | 'appearance' | 'export' | 'backup' | 'help' | 'about'
  const [activeSubView, setActiveSubView] = useState(null);

  // Edit Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(() => user?.fullName || user?.full_name || user?.name || activeProfile?.name || 'User');

  // Sub-view interactive toggles
  const [upiVpa, setUpiVpa] = useState(() => localStorage.getItem('finai_upi_vpa') || 'rajesh@okhdfcbank');
  const [upiLimit, setUpiLimit] = useState(() => localStorage.getItem('finai_upi_limit') || '50000');
  const [finaiAutoTips, setFinaiAutoTips] = useState(true);
  const [finaiForecasts, setFinaiForecasts] = useState(true);
  const [notifDailyDigest, setNotifDailyDigest] = useState(true);
  const [notifBudgetAlerts, setNotifBudgetAlerts] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleSaveName = (e) => {
    e.preventDefault();
    if (editedName.trim()) {
      updateUserName(editedName.trim());
      setIsEditingName(false);
      showToast('Name updated successfully!');
    }
  };

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      showToast('No transactions to export.');
      return;
    }

    const headers = ['ID', 'Title', 'Amount', 'Type', 'Category', 'PaymentMethod', 'Date', 'Note'];
    const rows = transactions.map(t => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      `"${t.category || ''}"`,
      `"${t.paymentMethod || 'UPI'}"`,
      t.date || '',
      `"${(t.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MoneyMind_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV file exported successfully!');
  };

  const handleExportJSONBackup = () => {
    const backupData = {
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      profile: activeProfile,
      transactions,
      budgets,
      goals
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MoneyMind_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Backup JSON file generated!');
  };

  const handleRestoreBackup = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.transactions && Array.isArray(data.transactions)) {
          localStorage.setItem('finai_transactions', JSON.stringify(data.transactions));
          if (data.budgets) localStorage.setItem('finai_budgets', JSON.stringify(data.budgets));
          if (data.goals) localStorage.setItem('finai_goals', JSON.stringify(data.goals));
          showToast('Data restored! Refreshing...');
          setTimeout(() => window.location.reload(), 800);
        } else {
          showToast('Invalid backup file format.');
        }
      } catch (err) {
        showToast('Failed to parse backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out of MoneyMind?');
    if (confirmLogout) {
      if (onClose) onClose();
      if (onLogout) onLogout();
      await signOut();
    }
  };

  const displayName = user?.fullName || user?.name || activeProfile?.name || 'Rajesh Kumar';
  const displayEmail = user?.email || '';
  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'RK';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.16)',
          border: '1px solid #e2ede8',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Toast alert banner */}
        {toastMessage && (
          <div style={{
            backgroundColor: '#059669',
            color: '#ffffff',
            padding: '0.6rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            animation: 'fadeIn 0.2s ease'
          }}>
            <Check size={14} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2ede8',
          backgroundColor: '#ffffff'
        }}>
          {activeSubView ? (
            <button
              onClick={() => setActiveSubView(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: 'none',
                background: 'transparent',
                color: '#059669',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Profile & Preferences
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0', fontWeight: 600 }}>
                Personalize your Money Mind
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>

          {/* ================= MAIN VIEW ================= */}
          {!activeSubView && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* 1. User Avatar & Identity Card */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1.25rem 1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '20px',
                border: '1px solid #e2e8f0'
              }}>
                <Avatar style={{
                  width: '72px',
                  height: '72px',
                  border: '3px solid #059669',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
                  marginBottom: '0.75rem'
                }}>
                  <AvatarFallback style={{
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    fontSize: '1.5rem',
                    fontWeight: 800
                  }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {isEditingName ? (
                  <form onSubmit={handleSaveName} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '280px', margin: '0.25rem 0' }}>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="form-control"
                      style={{ fontSize: '0.9rem', padding: '0.4rem 0.65rem' }}
                      autoFocus
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 0.75rem' }}>
                      <Save size={14} />
                    </button>
                    <button type="button" onClick={() => setIsEditingName(false)} className="btn btn-secondary" style={{ padding: '0 0.65rem' }}>
                      <X size={14} />
                    </button>
                  </form>
                ) : (
                  <>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {displayName}
                    </h3>
                    {displayEmail && (
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginTop: '0.15rem' }}>
                        {displayEmail}
                      </span>
                    )}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      marginTop: '0.35rem',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '99px',
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      fontSize: '0.72rem',
                      color: '#059669',
                      fontWeight: 700
                    }}>
                      <CheckCircle2 size={13} />
                      <span>Personal Finance</span>
                    </div>

                    <button
                      onClick={() => {
                        setEditedName(displayName);
                        setIsEditingName(true);
                      }}
                      style={{
                        marginTop: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '99px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#334155',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Edit2 size={12} />
                      <span>Edit Name</span>
                    </button>
                  </>
                )}
              </div>

              {/* 2. PREFERENCES SECTION */}
              <div>
                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#64748b',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '0.65rem'
                }}>
                  PREFERENCES
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2ede8',
                  overflow: 'hidden'
                }}>
                  {/* Payment & UPI */}
                  <div
                    onClick={() => setActiveSubView('payment')}
                    style={menuItemStyle}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={iconBadgeStyle('#059669', '#ecfdf5')}>
                        <CreditCard size={17} />
                      </div>
                      <span style={menuTitleStyle}>Payment & UPI</span>
                    </div>
                    <ChevronRight size={17} color="#94a3b8" />
                  </div>

                  {/* FinAI Settings */}
                  <div
                    onClick={() => setActiveSubView('finai')}
                    style={menuItemStyle}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={iconBadgeStyle('#2563eb', '#eff6ff')}>
                        <Bot size={17} />
                      </div>
                      <span style={menuTitleStyle}>FinAI Settings</span>
                    </div>
                    <ChevronRight size={17} color="#94a3b8" />
                  </div>

                  {/* Notifications */}
                  <div
                    onClick={() => setActiveSubView('notifications')}
                    style={menuItemStyle}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={iconBadgeStyle('#f59e0b', '#fffbeb')}>
                        <Bell size={17} />
                      </div>
                      <span style={menuTitleStyle}>Notifications</span>
                    </div>
                    <ChevronRight size={17} color="#94a3b8" />
                  </div>

                  {/* Currency & Format */}
                  <div
                    onClick={() => setActiveSubView('currency')}
                    style={menuItemStyle}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={iconBadgeStyle('#10b981', '#f0fdf4')}>
                        <Coins size={17} />
                      </div>
                      <span style={menuTitleStyle}>Currency & Format</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>₹ INR</span>
                      <ChevronRight size={17} color="#94a3b8" />
                    </div>
                  </div>

                  {/* Appearance */}
                  <div
                    onClick={() => setActiveSubView('appearance')}
                    style={{ ...menuItemStyle, borderBottom: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={iconBadgeStyle('#8b5cf6', '#f5f3ff')}>
                        <Palette size={17} />
                      </div>
                      <span style={menuTitleStyle}>Appearance</span>
                    </div>
                    <ChevronRight size={17} color="#94a3b8" />
                  </div>
                </div>
              </div>

              {/* 3. DATA SECTION */}
              <div>
                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#64748b',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '0.65rem'
                }}>
                  DATA
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2ede8',
                  overflow: 'hidden'
                }}>
                  {/* Export Transactions */}
                  <div
                    onClick={handleExportCSV}
                    style={menuItemStyle}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={iconBadgeStyle('#0284c7', '#f0f9ff')}>
                        <FileSpreadsheet size={17} />
                      </div>
                      <span style={menuTitleStyle}>Export Transactions</span>
                    </div>
                    <Download size={16} color="#0284c7" />
                  </div>

                  {/* Backup & Restore */}
                  <div
                    onClick={() => setActiveSubView('backup')}
                    style={{ ...menuItemStyle, borderBottom: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={iconBadgeStyle('#059669', '#ecfdf5')}>
                        <Database size={17} />
                      </div>
                      <span style={menuTitleStyle}>Backup & Restore</span>
                    </div>
                    <ChevronRight size={17} color="#94a3b8" />
                  </div>
                </div>
              </div>

              {/* 4. HELP & ABOUT SECTION */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2ede8',
                overflow: 'hidden'
              }}>
                <div
                  onClick={() => setActiveSubView('help')}
                  style={menuItemStyle}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={iconBadgeStyle('#64748b', '#f1f5f9')}>
                      <HelpCircle size={17} />
                    </div>
                    <span style={menuTitleStyle}>Help & Support</span>
                  </div>
                  <ChevronRight size={17} color="#94a3b8" />
                </div>

                <div
                  onClick={() => setActiveSubView('about')}
                  style={{ ...menuItemStyle, borderBottom: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={iconBadgeStyle('#2563eb', '#eff6ff')}>
                      <Info size={17} />
                    </div>
                    <span style={menuTitleStyle}>About Money Mind</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>v2.4</span>
                </div>
              </div>

              {/* 5. ACCOUNT & LOGOUT SECTION */}
              <div style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    border: '1.5px solid #fecaca',
                    borderRadius: '16px',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                    e.currentTarget.style.borderColor = '#fca5a5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                    e.currentTarget.style.borderColor = '#fecaca';
                  }}
                >
                  <LogOut size={18} color="#dc2626" />
                  <span>Log Out Account</span>
                </button>
              </div>

            </div>
          )}

          {/* ================= SUB-VIEWS ================= */}

          {/* PAYMENT & UPI SUB-VIEW */}
          {activeSubView === 'payment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                💳 Payment & UPI Settings
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Primary UPI VPA</label>
                <input
                  type="text"
                  value={upiVpa}
                  onChange={(e) => {
                    setUpiVpa(e.target.value);
                    localStorage.setItem('finai_upi_vpa', e.target.value);
                  }}
                  className="form-control"
                  placeholder="name@okhdfcbank"
                  style={{ fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Daily Quick Transfer Limit (₹)</label>
                <input
                  type="number"
                  value={upiLimit}
                  onChange={(e) => {
                    setUpiLimit(e.target.value);
                    localStorage.setItem('finai_upi_limit', e.target.value);
                  }}
                  className="form-control"
                  placeholder="50000"
                  style={{ fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', fontSize: '0.78rem', color: '#166534' }}>
                ⚡ Auto-Categorization for Swiggy, Zomato, Uber, and UPI payments is <strong>Active</strong>.
              </div>
            </div>
          )}

          {/* FINAI SETTINGS SUB-VIEW */}
          {activeSubView === 'finai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🤖 FinAI Assistant Settings
              </h4>

              <div style={toggleRowStyle}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Autonomous Spending Tips</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Proactively notify when food or travel expenses peak</div>
                </div>
                <input
                  type="checkbox"
                  checked={finaiAutoTips}
                  onChange={(e) => setFinaiAutoTips(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#059669' }}
                />
              </div>

              <div style={toggleRowStyle}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Month-End Cashflow Forecast</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Project remaining balance based on recurring bills</div>
                </div>
                <input
                  type="checkbox"
                  checked={finaiForecasts}
                  onChange={(e) => setFinaiForecasts(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#059669' }}
                />
              </div>
            </div>
          )}

          {/* NOTIFICATIONS SUB-VIEW */}
          {activeSubView === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🔔 Notification Preferences
              </h4>

              <div style={toggleRowStyle}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Daily Spend Summary</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Receive a brief digest at 9:00 PM every evening</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifDailyDigest}
                  onChange={(e) => setNotifDailyDigest(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#059669' }}
                />
              </div>

              <div style={toggleRowStyle}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>80% Budget Threshold Alerts</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Alert when nearing category budget limit</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifBudgetAlerts}
                  onChange={(e) => setNotifBudgetAlerts(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#059669' }}
                />
              </div>
            </div>
          )}

          {/* CURRENCY & FORMAT SUB-VIEW */}
          {activeSubView === 'currency' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                💰 Currency & Number Format
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currencies.map(c => (
                  <div
                    key={c.code}
                    onClick={() => {
                      setActiveCurrencyCode(c.code);
                      localStorage.setItem('finai_currency', c.code);
                      showToast(`Currency changed to ${c.name} (${c.symbol})`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: `1.5px solid ${activeCurrencyCode === c.code ? '#059669' : '#e2e8f0'}`,
                      backgroundColor: activeCurrencyCode === c.code ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{c.symbol}</span>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ISO Code: {c.code}</div>
                      </div>
                    </div>
                    {activeCurrencyCode === c.code && <Check size={18} color="#059669" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPEARANCE SUB-VIEW */}
          {activeSubView === 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🎨 App Aesthetics
              </h4>

              <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Sparkles size={16} color="#059669" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#166534' }}>MoneyMind Brand Palette</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#14532d', margin: 0 }}>
                  Crafted with <strong>Growth Emerald Green</strong> (#059669) & <strong>Trust Royal Blue</strong> (#2563eb) for a clean, high-contrast mobile experience.
                </p>
              </div>
            </div>
          )}

          {/* BACKUP & RESTORE SUB-VIEW */}
          {activeSubView === 'backup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                💾 Backup & Restore Data
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={handleExportJSONBackup}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
                >
                  <Download size={16} />
                  <span>Download Complete Backup (JSON)</span>
                </button>

                <label
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', cursor: 'pointer' }}
                >
                  <Upload size={16} />
                  <span>Restore from Backup File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreBackup}
                    style={{ display: 'none' }}
                  />
                </label>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all data from every section? This will reset all transactions, budgets, goals, and metrics to zero.')) {
                      clearAllData();
                      showToast('All data has been cleared.');
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  <Trash2 size={16} />
                  <span>Clear All Data from Every Section</span>
                </button>
              </div>
            </div>
          )}

          {/* HELP SUB-VIEW */}
          {activeSubView === 'help' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                ❓ Help & Support
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>How to record a UPI Transfer?</div>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                    Tap the center (+) Action FAB on the bottom navigation dock or select Quick UPI Transfer from the dashboard.
                  </p>
                </div>

                <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>Where is my data stored?</div>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                    Your financial records are encrypted on your local device and synchronized with your personal MoneyMind vault.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT SUB-VIEW */}
          {activeSubView === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2ede8', padding: '4px' }}>
                <img src={logoImg} alt="MoneyMind" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>MoneyMind</h4>
                <p style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, margin: '2px 0 0' }}>Personal Cashflow & UPI Tracker</p>
                <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '6px 0 0' }}>Version 2.4.0 (2026 Release)</p>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '12px', fontSize: '0.74rem', color: '#64748b' }}>
                Autonomous AI Financial Analytics • Safe & Encrypted
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.85rem 1rem',
  borderBottom: '1px solid #f1f5f9',
  cursor: 'pointer',
  transition: 'all 0.15s ease'
};

const menuTitleStyle = {
  fontSize: '0.88rem',
  fontWeight: 700,
  color: '#1e293b'
};

const toggleRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.85rem 1rem',
  backgroundColor: '#f8fafc',
  borderRadius: '14px',
  border: '1px solid #e2e8f0'
};

function iconBadgeStyle(color, bg) {
  return {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    backgroundColor: bg,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  };
}

export default ProfileModal;