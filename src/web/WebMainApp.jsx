import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { useSplit } from '../context/SplitContext';
import { WebNavbar } from './WebNavbar';
import { WebSidebar } from './WebSidebar';
import './WebMainApp.css';

// Feature Views
import { UnifiedDashboard } from '../components/Dashboard/UnifiedDashboard';
import { TransactionList } from '../components/Transactions/TransactionList';
import { SplitGroups } from '../components/Splitwise/SplitGroups';
import { BudgetManager } from '../components/Budgets/BudgetManager';
import { SavingsGoals } from '../components/Goals/SavingsGoals';
import { MoneyIntelligenceView } from '../components/Intelligence/MoneyIntelligenceView';
import { ReportsView } from '../components/Reports/ReportsView';

// Modals
import { AddTransactionModal } from '../components/Transactions/AddTransactionModal';
import { UpiDirectPayModal } from '../components/Modals/UpiDirectPayModal';
import { NotificationsDrawer } from '../components/Modals/NotificationsDrawer';
import { ProfileModal } from '../components/Modals/ProfileModal';
import { BudgetLockModal } from '../components/Modals/BudgetLockModal';
import { PaymentIntentPopup } from '../components/PaymentIntent/PaymentIntentPopup';
import { QuickActionMenuModal } from '../components/Modals/QuickActionMenuModal';
import { Calendar, Sparkles } from 'lucide-react';

export function WebMainApp({ onBackToLanding, initialTab = 'dashboard' }) {
  const { user } = useAuth();
  const { budgetLockAlert, closeBudgetLock } = useFinance();

  // Tab State with URL Hash synchronization
  const [currentTab, setCurrentTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['dashboard', 'transactions', 'splitwise', 'budgets', 'goals', 'intelligence', 'reports'];
      if (validTabs.includes(hash)) return hash;
    }
    return initialTab;
  });

  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    if (typeof window !== 'undefined') {
      window.location.hash = `#${tabId}`;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['dashboard', 'transactions', 'splitwise', 'budgets', 'goals', 'intelligence', 'reports'];
      if (validTabs.includes(hash)) {
        setCurrentTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Modals state
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txModalType, setTxModalType] = useState('expense');
  const [isUpiPayOpen, setIsUpiPayOpen] = useState(false);
  const [upiPayInitialData, setUpiPayInitialData] = useState({ amount: '500', payee: 'Swiggy' });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [activeIntentTx, setActiveIntentTx] = useState(null);

  const handleOpenAddTx = (type = 'expense') => {
    setTxModalType(type);
    setIsAddTxOpen(true);
  };

  const handleOpenUpiPay = (initialData = { amount: '500', payee: 'Swiggy' }) => {
    setUpiPayInitialData(initialData);
    setIsUpiPayOpen(true);
  };

  // Dynamic Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedToday = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const TAB_TITLES = {
    dashboard: 'Financial Dashboard & Inflow / Outflow',
    transactions: 'Transaction Ledger & Statement Search',
    splitwise: 'SplitSmart Group Expenses & Settle Up',
    budgets: 'Category Spending Limits & Anti-Overspend Alerts',
    goals: 'Savings Milestones & Target Accumulation',
    intelligence: 'AI Smart Money Insights & Local Vault Health',
    reports: 'Printable Audit Reports & PDF Statements'
  };

  return (
    <div className="web-app-container">
      {/* Desktop Sticky Header */}
      <WebNavbar
        onOpenAddTx={handleOpenAddTx}
        onOpenUpiPay={handleOpenUpiPay}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onBackToLanding={onBackToLanding}
        onNavigateTab={handleSelectTab}
      />

      {/* Main Two-Column Desktop Layout */}
      <div className="web-app-layout">
        {/* Left Sticky Sidebar */}
        <WebSidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onOpenUpiPay={handleOpenUpiPay}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Center Main Scrollable Canvas */}
        <main className="web-app-main-canvas">
          {/* Top Greeting & Date Banner */}
          <div className="web-view-header">
            <div>
              <h1 className="web-view-greeting">
                {getGreeting()}, {user?.fullName || 'Rajesh'} 👋
              </h1>
              <p className="web-view-subgreeting">
                {TAB_TITLES[currentTab] || 'Manage your finances seamlessly'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.95rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2ede8',
                borderRadius: '12px',
                fontSize: '0.82rem',
                color: '#64748b',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <Calendar size={14} color="#059669" />
                <span>{formattedToday}</span>
              </div>
            </div>
          </div>

          {/* Active Tab View */}
          <div className="web-tab-content-area" key={currentTab}>
            {currentTab === 'dashboard' && (
              <UnifiedDashboard
                onOpenAddTx={handleOpenAddTx}
                onNavigateTab={handleSelectTab}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenUpiPay={handleOpenUpiPay}
              />
            )}

            {currentTab === 'transactions' && (
              <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                <TransactionList
                  onOpenAddTx={handleOpenAddTx}
                  onOpenUpiPay={handleOpenUpiPay}
                />
              </div>
            )}

            {currentTab === 'splitwise' && (
              <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                <SplitGroups />
              </div>
            )}

            {currentTab === 'budgets' && (
              <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                <BudgetManager />
              </div>
            )}

            {currentTab === 'goals' && (
              <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                <SavingsGoals />
              </div>
            )}

            {currentTab === 'intelligence' && (
              <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                <MoneyIntelligenceView onOpenAddTx={handleOpenAddTx} />
              </div>
            )}

            {currentTab === 'reports' && (
              <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                <ReportsView />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals & Overlays */}
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

      {activeIntentTx && (
        <PaymentIntentPopup
          isOpen={Boolean(activeIntentTx)}
          transaction={activeIntentTx}
          onClose={() => setActiveIntentTx(null)}
          onSaved={() => setActiveIntentTx(null)}
        />
      )}

      {budgetLockAlert && (
        <BudgetLockModal
          isOpen={Boolean(budgetLockAlert)}
          alertData={budgetLockAlert}
          onClose={closeBudgetLock}
        />
      )}

      {isQuickActionOpen && (
        <QuickActionMenuModal
          isOpen={isQuickActionOpen}
          onClose={() => setIsQuickActionOpen(false)}
          onSelectDirectUpiPay={() => {
            setIsQuickActionOpen(false);
            handleOpenUpiPay();
          }}
          onSelectRecordTransfer={() => {
            setIsQuickActionOpen(false);
            handleOpenAddTx('income');
          }}
        />
      )}
    </div>
  );
}
