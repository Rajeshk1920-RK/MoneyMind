import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { SplitProvider } from './context/SplitContext';
import { AppHeader } from './components/Header/AppHeader';
import { LandingPage } from './components/Landing/LandingPage';
import { UnifiedDashboard } from './components/Dashboard/UnifiedDashboard';
import { TransactionList } from './components/Transactions/TransactionList';
import { AddTransactionModal } from './components/Transactions/AddTransactionModal';
import { SplitGroups } from './components/Splitwise/SplitGroups';
import { AddSplitModal } from './components/Splitwise/AddSplitModal';
import { BudgetManager } from './components/Budgets/BudgetManager';
import { SavingsGoals } from './components/Goals/SavingsGoals';
import { AIChatBot } from './components/AIAssistant/AIChatBot';
import { ReportsView } from './components/Reports/ReportsView';
import { ProfileModal } from './components/Modals/ProfileModal';
import { NotificationsDrawer } from './components/Modals/NotificationsDrawer';
import { Sparkles } from 'lucide-react';

function MainAppContent() {
  // Tabs: 'landing', 'dashboard', 'transactions', 'splitwise', 'budgets', 'goals', 'ai-assistant', 'reports'
  const [currentTab, setCurrentTab] = useState('landing');

  // Modals state
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txModalType, setTxModalType] = useState('expense');
  const [isAddSplitOpen, setIsAddSplitOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleOpenAddTx = (type = 'expense') => {
    setTxModalType(type);
    setIsAddTxOpen(true);
  };

  // If on landing / signing page, display the pixel-perfect MoneyMind landing page
  if (currentTab === 'landing') {
    return (
      <>
        <LandingPage
          onLaunchApp={() => setCurrentTab('dashboard')}
        />

        {/* Floating Quick Action to Launch Dashboard */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            borderRadius: '9999px',
            padding: '0.85rem 1.6rem',
            background: 'linear-gradient(135deg, #16382b 0%, #2d6a4f 100%)',
            color: '#ffffff',
            boxShadow: '0 8px 30px rgba(22, 56, 43, 0.45)',
            zIndex: 90,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Sparkles size={18} />
          <span>Open MoneyMind Dashboard</span>
        </button>
      </>
    );
  }

  // After signing up or logging in, the Main Dashboard has the EXACT same layout & aesthetic!
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f0',
      color: '#16382b',
      fontFamily: 'var(--font-body)',
      overflowX: 'hidden'
    }}>
      {/* Top Header - Exact styling as landing page with navigation tabs */}
      <AppHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddTx={handleOpenAddTx}
        onOpenAddSplit={() => setIsAddSplitOpen(true)}
        onBackToLanding={() => setCurrentTab('landing')}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Tab Content Canvas */}
      <main style={{ minHeight: 'calc(100vh - 80px)' }}>
        {currentTab === 'dashboard' && (
          <UnifiedDashboard
            onOpenAddTx={handleOpenAddTx}
            onOpenAddSplit={() => setIsAddSplitOpen(true)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'transactions' && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 5rem' }}>
            <TransactionList onOpenAddTx={handleOpenAddTx} />
          </div>
        )}

        {currentTab === 'splitwise' && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 5rem' }}>
            <SplitGroups />
          </div>
        )}

        {currentTab === 'budgets' && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 5rem' }}>
            <BudgetManager />
          </div>
        )}

        {currentTab === 'goals' && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 5rem' }}>
            <SavingsGoals />
          </div>
        )}

        {currentTab === 'ai-assistant' && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 5rem' }}>
            <AIChatBot />
          </div>
        )}

        {currentTab === 'reports' && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 5rem' }}>
            <ReportsView />
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      {isAddTxOpen && (
        <AddTransactionModal
          initialType={txModalType}
          onClose={() => setIsAddTxOpen(false)}
        />
      )}

      {isAddSplitOpen && (
        <AddSplitModal
          onClose={() => setIsAddSplitOpen(false)}
        />
      )}

      {isNotificationsOpen && (
        <NotificationsDrawer
          onClose={() => setIsNotificationsOpen(false)}
          onOpenSplitwise={() => {
            setIsNotificationsOpen(false);
            setCurrentTab('splitwise');
          }}
        />
      )}

      {isProfileOpen && (
        <ProfileModal
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <SplitProvider>
        <MainAppContent />
      </SplitProvider>
    </FinanceProvider>
  );
}