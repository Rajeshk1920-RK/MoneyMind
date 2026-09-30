import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_PROFILES,
  DEFAULT_CURRENCIES,
  CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import { useAuth } from './AuthContext';
import { financeApi } from '../utils/api';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const { user } = useAuth();

  // Theme state: unified permanently with the MoneyMind landing page design
  const [theme, setTheme] = useState('light');
  
  // Profile state
  const [profiles] = useState(INITIAL_PROFILES);
  const [userName, setUserName] = useState(() => localStorage.getItem('finai_user_name') || 'Rajesh Kumar');
  const [activeProfileId, setActiveProfileId] = useState(() => localStorage.getItem('finai_profile') || 'user-1');

  const updateUserName = (newName) => {
    if (!newName || !newName.trim()) return;
    setUserName(newName.trim());
    localStorage.setItem('finai_user_name', newName.trim());
  };

  // Currency state
  const [currencies] = useState(DEFAULT_CURRENCIES);
  const [activeCurrencyCode, setActiveCurrencyCode] = useState(() => localStorage.getItem('finai_currency') || 'INR');

  // Local/cached data states
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finai_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('finai_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('finai_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('finai_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [categories] = useState(CATEGORIES);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Sync theme to light permanently
  useEffect(() => {
    document.body.className = 'light-theme';
    localStorage.setItem('finai_theme', 'light');
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('finai_transactions', JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('finai_budgets', JSON.stringify(budgets));
    }
  }, [budgets, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('finai_goals', JSON.stringify(goals));
    }
  }, [goals, user]);

  useEffect(() => {
    localStorage.setItem('finai_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('finai_profile', activeProfileId);
  }, [activeProfileId]);

  useEffect(() => {
    localStorage.setItem('finai_currency', activeCurrencyCode);
  }, [activeCurrencyCode]);

  // Load data from PostgreSQL when user logs in
  const loadUserData = useCallback(async (userId) => {
    if (!userId) return;
    setIsCloudSyncing(true);

    try {
      const data = await financeApi.getFinances(userId);
      if (data) {
        if (data.transactions && data.transactions.length > 0) {
          setTransactions(data.transactions);
        }
        if (data.budgets && data.budgets.length > 0) {
          setBudgets(data.budgets);
        }
        if (data.goals && data.goals.length > 0) {
          setGoals(data.goals);
        }
      }
    } catch (err) {
      console.warn('PostgreSQL data load note:', err.message);
    } finally {
      setIsCloudSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    }
  }, [user?.id, loadUserData]);

  const rawProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const activeProfile = {
    ...rawProfile,
    name: userName || rawProfile?.name || 'Rajesh Kumar'
  };
  const activeCurrency = currencies.find(c => c.code === activeCurrencyCode) || currencies[0];

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Transaction Actions
  const addTransaction = async (newTx) => {
    const tempId = `tx-${Date.now()}`;
    const txObj = {
      id: tempId,
      profileId: activeProfileId,
      date: new Date().toISOString().split('T')[0],
      tags: [],
      ...newTx,
      amount: Number(newTx.amount) || 0
    };

    setTransactions(prev => [txObj, ...prev]);

    // Check budget alert automatically
    if (txObj.type === 'expense') {
      const budget = budgets.find(b => b.category === txObj.category);
      if (budget) {
        const categoryTotal = transactions
          .filter(t => t.type === 'expense' && t.category === txObj.category)
          .reduce((sum, t) => sum + t.amount, 0) + txObj.amount;

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

    if (user?.id) {
      try {
        const saved = await financeApi.addTransaction({
          userId: user.id,
          title: txObj.title,
          amount: txObj.amount,
          type: txObj.type,
          category: txObj.category,
          paymentMethod: txObj.paymentMethod,
          date: txObj.date,
          notes: txObj.note,
          tags: txObj.tags
        });
        if (saved?.id) {
          setTransactions(prev => prev.map(t => t.id === tempId ? { ...t, id: saved.id } : t));
        }
      } catch (err) {
        console.warn('PostgreSQL add transaction error:', err.message);
      }
    }

    return txObj;
  };

  const deleteTransaction = async (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (user?.id) {
      try {
        await financeApi.deleteTransaction(id);
      } catch (err) {
        console.warn('PostgreSQL delete transaction error:', err.message);
      }
    }
  };

  const editTransaction = async (id, updatedFields) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));

    if (user?.id) {
      try {
        await financeApi.updateTransaction?.(id, updatedFields);
      } catch (err) {
        console.warn('Could not update in cloud:', err.message);
      }
    }
  };

  // Payment Intent Integration Functions
  const simulateUPIPayment = async ({ amount, merchant, reference, date }) => {
    const tempId = `tx-upi-${Date.now()}`;
    const txObj = {
      id: tempId,
      profileId: activeProfileId,
      title: merchant || 'UPI Payment',
      merchant: merchant || 'UPI Merchant',
      amount: Number(amount) || 0,
      type: 'expense',
      category: 'Other',
      paymentMethod: 'UPI',
      date: date || new Date().toISOString().split('T')[0],
      intentCategory: null,
      intentNote: '',
      intentFor: '',
      intentCaptured: false,
      source: 'simulated_upi',
      paymentStatus: 'success',
      tags: ['upi', 'simulated'],
      note: reference ? `Ref: ${reference}` : ''
    };

    setTransactions(prev => [txObj, ...prev]);

    // Check budget limit alert
    const budget = budgets.find(b => b.category === txObj.category);
    if (budget) {
      const categoryTotal = transactions
        .filter(t => t.type === 'expense' && t.category === txObj.category)
        .reduce((sum, t) => sum + t.amount, 0) + txObj.amount;

      const percentage = Math.round((categoryTotal / budget.monthlyLimit) * 100);
      if (percentage >= budget.alertThreshold) {
        addNotification({
          title: `Budget Alert: ${budget.category}`,
          message: `You've utilized ${percentage}% of your limit (₹${categoryTotal.toLocaleString('en-IN')} / ₹${budget.monthlyLimit.toLocaleString('en-IN')})`,
          type: percentage >= 100 ? 'warning' : 'info'
        });
      }
    }

    // Sync to backend if logged in
    if (user?.id) {
      try {
        const saved = await financeApi.addTransaction({
          userId: user.id,
          title: txObj.title,
          amount: txObj.amount,
          type: txObj.type,
          category: txObj.category,
          paymentMethod: txObj.paymentMethod,
          date: txObj.date,
          notes: txObj.note,
          tags: txObj.tags,
          merchant: txObj.merchant,
          intentCategory: txObj.intentCategory,
          intentNote: txObj.intentNote,
          intentFor: txObj.intentFor,
          intentCaptured: txObj.intentCaptured,
          source: txObj.source,
          paymentStatus: txObj.paymentStatus
        });
        if (saved?.id) {
          setTransactions(prev => prev.map(t => t.id === tempId ? { ...t, id: saved.id } : t));
          txObj.id = saved.id;
        }
      } catch (err) {
        console.warn('PostgreSQL add simulated UPI error:', err.message);
      }
    }

    return txObj;
  };

  const capturePaymentIntent = async (id, { category, note, intentFor }) => {
    let updatedTx = null;
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        updatedTx = {
          ...t,
          category: category || t.category,
          intentCategory: category || t.intentCategory,
          intentNote: note !== undefined ? note : t.intentNote,
          intentFor: intentFor !== undefined ? intentFor : t.intentFor,
          intentCaptured: true,
          note: note ? note : t.note
        };
        return updatedTx;
      }
      return t;
    }));

    // Update cloud if logged in
    if (user?.id && updatedTx) {
      try {
        await financeApi.updateIntent?.(id, {
          category: updatedTx.category,
          intentCategory: updatedTx.intentCategory,
          intentNote: updatedTx.intentNote,
          intentFor: updatedTx.intentFor,
          intentCaptured: true,
          note: updatedTx.note
        });
      } catch (err) {
        console.warn('PostgreSQL update payment intent error:', err.message);
      }
    }

    return updatedTx;
  };

  const skipPaymentIntent = async (id) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          intentCaptured: false
        };
      }
      return t;
    }));
  };

  // Budget Actions
  const addBudget = async (newBudget) => {
    const budget = {
      id: `b-${Date.now()}`,
      alertThreshold: 80,
      ...newBudget,
      monthlyLimit: Number(newBudget.monthlyLimit)
    };
    setBudgets(prev => [...prev.filter(b => b.category !== budget.category), budget]);

    // Sync budget to PostgreSQL
    if (user?.id) {
      try {
        await financeApi.saveBudget({
          userId: user.id,
          category: budget.category,
          monthlyLimit: budget.monthlyLimit,
          alertThreshold: budget.alertThreshold
        });
      } catch (err) {
        console.warn('PostgreSQL save budget error:', err.message);
      }
    }
  };

  const deleteBudget = async (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));

    if (user?.id) {
      try {
        await financeApi.deleteBudget(id);
      } catch (err) {
        console.warn('Could not delete budget from cloud:', err.message);
      }
    }
  };

  // Goal Actions
  const addGoal = async (newGoal) => {
    const tempId = `g-${Date.now()}`;
    const goal = {
      id: tempId,
      currentAmount: 0,
      color: '#16382b',
      ...newGoal,
      targetAmount: Number(newGoal.targetAmount)
    };
    setGoals(prev => [...prev, goal]);

    // Sync goal to PostgreSQL
    if (user?.id) {
      try {
        const saved = await financeApi.saveGoal({
          userId: user.id,
          title: goal.title,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount || 0,
          targetDate: goal.targetDate,
          category: goal.category,
          color: goal.color
        });
        if (saved?.id) {
          setGoals(prev => prev.map(g => g.id === tempId ? { ...g, id: saved.id } : g));
        }
      } catch (err) {
        console.warn('PostgreSQL save goal error:', err.message);
      }
    }
  };

  const contributeToGoal = async (id, amount) => {
    let updatedGoal = null;
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const newAmt = Math.min(g.targetAmount, (Number(g.currentAmount) || 0) + Number(amount));
        updatedGoal = { ...g, currentAmount: newAmt };
        return updatedGoal;
      }
      return g;
    }));

    // Sync contribute to PostgreSQL
    if (user?.id && updatedGoal) {
      try {
        await financeApi.contributeGoal(id, amount);
      } catch (err) {
        console.warn('PostgreSQL contribute goal error:', err.message);
      }
    }
  };

  const deleteGoal = async (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));

    if (user?.id) {
      try {
        await supabase.from('goals').delete().eq('id', id);
      } catch (err) {
        console.warn('Could not delete goal from cloud:', err.message);
      }
    }
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

  // Transactions for account
  const filteredTransactions = transactions;

  // Financial summary metrics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  const clearAllData = () => {
    localStorage.removeItem('finai_transactions');
    localStorage.removeItem('finai_budgets');
    localStorage.removeItem('finai_goals');
    localStorage.removeItem('finai_notifs');
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setNotifications([]);
  };

  return (
    <FinanceContext.Provider
      value={{
        theme,
        toggleTheme,
        profiles,
        activeProfile,
        activeProfileId,
        setActiveProfileId,
        updateUserName,
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
        simulateUPIPayment,
        capturePaymentIntent,
        skipPaymentIntent,
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
        clearAllData,
        totalIncome,
        totalExpense,
        netBalance,
        savingsRate,
        isCloudSyncing
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