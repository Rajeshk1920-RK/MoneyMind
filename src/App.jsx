import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { AppHeader } from './components/Header/AppHeader';
import { LandingPage } from './components/Landing/LandingPage';
import { ModernSidebar } from './components/Navigation/ModernSidebar';
import { UnifiedDashboard } from './components/Dashboard/UnifiedDashboard';
import { TransactionList } from './components/Transactions/TransactionList';
import { AddTransactionModal } from './components/Transactions/AddTransactionModal';
import { BudgetManager } from './components/Budgets/BudgetManager';
import { SavingsGoals } from './components/Goals/SavingsGoals';
import { AIChatBot } from './components/AIAssistant/AIChatBot';
import { ReportsView } from './components/Reports/ReportsView';
import { ProfileModal } from './components/Modals/ProfileModal';
import { NotificationsDrawer } from './components/Modals/NotificationsDrawer';
import { BankSMSReader } from './components/BankingSMS/BankSMSReader';
import { PaymentIntentPopup } from './components/PaymentIntent/PaymentIntentPopup';

function MainAppContent() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Modals state
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txModalType, setTxModalType] = useState('expense');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSimulateUPIOpen, setIsSimulateUPIOpen] = useState(false);
  const [activeIntentTx, setActiveIntentTx] = useState(null);

  const handleOpenAddTx = (type = 'expense') => {
    setTxModalType(type);
    setIsAddTxOpen(true);
  };

  const handleOpenSimulateUPI = () => {
    setIsSimulateUPIOpen(true);
  };

  const handlePaymentComplete = (newTx) => {
    setIsSimulateUPIOpen(false);
    setActiveIntentTx(newTx);
  };

  // When visiting landing tab explicitly
  if (currentTab === 'landing') {
    return (
      <LandingPage
        onLaunchApp={() => setCurrentTab('dashboard')}
      />
    );
  }

  // Main Dashboard
  return (
    <div className="app-container">
      {/* Modern Mind Left Vertical Navigation Dock on Desktop / Bottom Dock on Mobile */}
      <ModernSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAddTx={handleOpenAddTx}
        onOpenSimulateUPI={handleOpenSimulateUPI}
      />

      {/* Main Content Canvas */}
      <div className="app-main-canvas">
        <main style={{ width: '100%', minHeight: '100%' }}>
          {currentTab === 'dashboard' && (
            <UnifiedDashboard
              onOpenAddTx={handleOpenAddTx}
              onOpenSimulateUPI={handleOpenSimulateUPI}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          )}

          {currentTab === 'transactions' && (
            <div className="page-content-wrapper">
              <TransactionList
                onOpenAddTx={handleOpenAddTx}
                onOpenSimulateUPI={handleOpenSimulateUPI}
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
            <div className="page-content-wrapper">
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

      {/* Modals & Drawers */}
      {isAddTxOpen && (
        <AddTransactionModal
          isOpen={isAddTxOpen}
          initialType={txModalType}
          onClose={() => setIsAddTxOpen(false)}
        />
      )}

      {isSimulateUPIOpen && (
        <BankSMSReader
          isOpen={isSimulateUPIOpen}
          onClose={() => setIsSimulateUPIOpen(false)}
          onTransactionAdded={() => {}}
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
          onNavigateLanding={() => setCurrentTab('landing')}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <MainAppContent />
      </FinanceProvider>
    </AuthProvider>
  );
}