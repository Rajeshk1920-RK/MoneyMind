import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { parseBankingSMS } from '../utils/smsParser';
import confetti from 'canvas-confetti';
import { LoginPage } from '../components/Auth/LoginPage';
import { ModernSidebar } from '../components/Navigation/ModernSidebar';
import { UnifiedDashboard } from '../components/Dashboard/UnifiedDashboard';
import { TransactionList } from '../components/Transactions/TransactionList';
import { AddTransactionModal } from '../components/Transactions/AddTransactionModal';
import { BudgetManager } from '../components/Budgets/BudgetManager';
import { SavingsGoals } from '../components/Goals/SavingsGoals';
import { AIChatBot } from '../components/AIAssistant/AIChatBot';
import { ReportsView } from '../components/Reports/ReportsView';
import { ProfileModal } from '../components/Modals/ProfileModal';
import { NotificationsDrawer } from '../components/Modals/NotificationsDrawer';
import { PaymentIntentPopup } from '../components/PaymentIntent/PaymentIntentPopup';
import { UpiDirectPayModal } from '../components/Modals/UpiDirectPayModal';
import { QuickActionMenuModal } from '../components/Modals/QuickActionMenuModal';
import { SplashScreen } from '../components/Splash/SplashScreen';

/**
 * MobileFinanceApp
 * Standalone Mobile Application component (Android APK / Flutter-style Native UI)
 */
export function MobileFinanceApp() {
  const { user, isAuthenticated } = useAuth();
  const { addTransaction, addNotification } = useFinance();
  
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isGuest, setIsGuest] = useState(false);

  // Modals state
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txModalType, setTxModalType] = useState('expense');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpiPayOpen, setIsUpiPayOpen] = useState(false);
  const [upiPayInitialData, setUpiPayInitialData] = useState({ amount: '350', payee: '' });
  const [activeIntentTx, setActiveIntentTx] = useState(null);

  // Automatic Background/Foreground Incoming Banking SMS Detection
  useEffect(() => {
    const handleNativeSms = (e) => {
      const sms = e.detail;
      if (!sms || !sms.text) return;
      const parsed = parseBankingSMS(sms.text);
      if (parsed && parsed.amount > 0) {
        const newTx = {
          type: parsed.type,
          title: parsed.merchant || 'Bank Transaction',
          amount: parsed.amount,
          category: parsed.category || 'General',
          paymentMethod: parsed.paymentMethod || 'UPI',
          date: parsed.date || new Date().toISOString().split('T')[0],
          tags: ['Auto Bank SMS', parsed.bank],
          note: `Auto-detected from ${sms.sender || parsed.bank}: "${sms.text.substring(0, 60)}..."`
        };

        addTransaction(newTx);
        
        if (addNotification) {
          addNotification({
            id: `sms-notif-${Date.now()}`,
            title: `SMS Auto-Read: ${parsed.bank}`,
            message: `${parsed.type === 'expense' ? 'Spent ₹' : 'Received ₹'}${parsed.amount} at ${parsed.merchant}`,
            time: 'Just now',
            type: parsed.type,
            unread: true
          });
        }

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}

        // Open Payment Intent Popup to explain transaction
        setActiveIntentTx(newTx);
      }
    };

    window.addEventListener('nativeSmsReceived', handleNativeSms);
    return () => window.removeEventListener('nativeSmsReceived', handleNativeSms);
  }, [addTransaction, addNotification]);

  const handleOpenAddTx = (type = 'expense') => {
    setTxModalType(type);
    setIsAddTxOpen(true);
  };

  const handleOpenQuickAction = () => {
    setIsQuickActionOpen(true);
  };

  const handleSelectDirectUpiPay = () => {
    setIsQuickActionOpen(false);
    handleOpenUpiPay();
  };

  const handleSelectRecordTransfer = () => {
    setIsQuickActionOpen(false);
    handleOpenAddTx('expense');
  };

  const handleOpenUpiPay = (initialData = {}) => {
    setUpiPayInitialData({
      amount: initialData.amount || '350',
      payee: initialData.payee || ''
    });
    setIsUpiPayOpen(true);
  };

  // 1. Initial 2.5s Brand Animated Splash Screen with Loading Bar
  if (showSplash) {
    return (
      <SplashScreen
        duration={2500}
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  // 2. Login Screen if not authenticated and not in guest mode
  if (!isAuthenticated && !isGuest) {
    return <LoginPage onGuestAccess={() => setIsGuest(true)} />;
  }

  return (
    <div className="mobile-app-desktop-frame">
      <div className="app-container">
        {/* Native Bottom Navigation Dock */}
        <ModernSidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAddTx={handleOpenAddTx}
          onOpenUpiPay={handleOpenUpiPay}
          onOpenQuickAction={handleOpenQuickAction}
        />

        {/* Main Screen Canvas */}
        <div className="app-main-canvas">
          <main style={{ width: '100%', minHeight: '100%' }}>
            {currentTab === 'dashboard' && (
              <UnifiedDashboard
                onOpenAddTx={handleOpenAddTx}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            )}

            {currentTab === 'transactions' && (
              <div className="page-content-wrapper">
                <TransactionList
                  onOpenAddTx={handleOpenAddTx}
                  onOpenUpiPay={handleOpenUpiPay}
                />
              </div>
            )}

            {currentTab === 'budgets' && (
              <div className="page-content-wrapper">
                <BudgetManager />
              </div>
            )}

            {currentTab === 'goals' && (
              <div className="page-content-wrapper">
                <SavingsGoals />
              </div>
            )}

            {currentTab === 'ai-assistant' && (
              <div className="page-content-wrapper page-content-wrapper-ai">
                <AIChatBot />
              </div>
            )}

            {currentTab === 'reports' && (
              <div className="page-content-wrapper">
                <ReportsView />
              </div>
            )}
          </main>
        </div>

        {/* Modals & Native Bottom Sheets */}
        {isQuickActionOpen && (
          <QuickActionMenuModal
            isOpen={isQuickActionOpen}
            onClose={() => setIsQuickActionOpen(false)}
            onSelectDirectUpiPay={handleSelectDirectUpiPay}
            onSelectRecordTransfer={handleSelectRecordTransfer}
          />
        )}

        {isAddTxOpen && (
          <AddTransactionModal
            isOpen={isAddTxOpen}
            initialType={txModalType}
            onClose={() => setIsAddTxOpen(false)}
          />
        )}

        {isUpiPayOpen && (
          <UpiDirectPayModal
            isOpen={isUpiPayOpen}
            initialAmount={upiPayInitialData.amount}
            initialPayee={upiPayInitialData.payee}
            onClose={() => setIsUpiPayOpen(false)}
          />
        )}

        {activeIntentTx && (
          <PaymentIntentPopup
            isOpen={Boolean(activeIntentTx)}
            transaction={activeIntentTx}
            onClose={() => setActiveIntentTx(null)}
            onSaved={() => setActiveIntentTx(null)}
          />
        )}

        {isNotificationsOpen && (
          <NotificationsDrawer
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        )}

        {isProfileOpen && (
          <ProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
