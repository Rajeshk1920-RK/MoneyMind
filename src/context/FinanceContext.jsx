import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PROFILES,
  DEFAULT_CURRENCIES,
  CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('finai_theme') || 'dark');
  
  // Profile state
  const [profiles] = useState(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState(() => localStorage.getItem('finai_profile') || 'user-1');

  // Currency state
  const [currencies] = useState(DEFAULT_CURRENCIES);
  const [activeCurrencyCode, setActiveCurrencyCode] = useState(() => localStorage.getItem('finai_currency') || 'INR');

  // Transactions state
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finai_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Budgets state
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('finai_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  // Goals state
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('finai_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('finai_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Categories
  const [categories] = useState(CATEGORIES);

  // Sync theme
  useEffect(() => {
    document.body.className = `${theme}-theme`;
    localStorage.setItem('finai_theme', theme);
  }, [theme]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('finai_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finai_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('finai_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('finai_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('finai_profile', activeProfileId);
  }, [activeProfileId]);

  useEffect(() => {
    localStorage.setItem('finai_currency', activeCurrencyCode);
  }, [activeCurrencyCode]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const activeCurrency = currencies.find(c => c.code === activeCurrencyCode) || currencies[0];

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Transaction Actions
  const addTransaction = (newTx) => {
    const created = {
      id: `tx-${Date.now()}`,
      profileId: activeProfileId,
      date: new Date().toISOString().split('T')[0],
      tags: [],
      ...newTx,
      amount: Number(newTx.amount) || 0
    };
    setTransactions(prev => [created, ...prev]);

    // Check budget alert automatically
    if (created.type === 'expense') {
      const budget = budgets.find(b => b.category === created.category);
      if (budget) {
        const categoryTotal = transactions
          .filter(t => t.type === 'expense' && t.category === created.category)
          .reduce((sum, t) => sum + t.amount, 0) + created.amount;

        const percentage = Math.round((categoryTotal / budget.monthlyLimit) * 100);
        if (percentage >= budget.alertThreshold) {
          addNotification({
            title: `Budget Alert: ${budget.category}`,
            message: `You've utilized ${percentage}% of your limit (₹${categoryTotal.toLocaleString('en-IN')} / ₹${budget.monthlyLimit.toLocaleString('en-IN')})`,
            type: percentage >= 100 ? 'warning' : 'info'
          });
        }
      }
    }

    return created;
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const editTransaction = (id, updatedFields) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  // Budget Actions
  const addBudget = (newBudget) => {
    const budget = {
      id: `b-${Date.now()}`,
      alertThreshold: 80,
      ...newBudget,
      monthlyLimit: Number(newBudget.monthlyLimit)
    };
    setBudgets(prev => [...prev.filter(b => b.category !== budget.category), budget]);
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Goal Actions
  const addGoal = (newGoal) => {
    const goal = {
      id: `g-${Date.now()}`,
      currentAmount: 0,
      color: '#6366f1',
      ...newGoal,
      targetAmount: Number(newGoal.targetAmount)
    };
    setGoals(prev => [...prev, goal]);
  };

  const contributeToGoal = (id, amount) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, currentAmount: Math.min(g.targetAmount, (Number(g.currentAmount) || 0) + Number(amount)) };
      }
      return g;
    }));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Notification Actions
  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Filter transactions by active profile if needed, or all for family view
  const filteredTransactions = activeProfileId === 'user-2'
    ? transactions // shared family view sees all
    : transactions.filter(t => t.profileId === activeProfileId);

  // Financial summary metrics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return (
    <FinanceContext.Provider
      value={{
        theme,
        toggleTheme,
        profiles,
        activeProfile,
        activeProfileId,
        setActiveProfileId,
        currencies,
        activeCurrency,
        activeCurrencyCode,
        setActiveCurrencyCode,
        categories,
        transactions: filteredTransactions,
        allTransactions: transactions,
        addTransaction,
        deleteTransaction,
        editTransaction,
        budgets,
        addBudget,
        deleteBudget,
        goals,
        addGoal,
        contributeToGoal,
        deleteGoal,
        notifications,
        addNotification,
        markAllNotificationsRead,
        clearNotification,
        totalIncome,
        totalExpense,
        netBalance,
        savingsRate
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
}