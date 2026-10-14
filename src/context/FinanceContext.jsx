import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  INITIAL_PROFILES,
  DEFAULT_CURRENCIES,
  CATEGORIES,
  INITIAL_BUDGETS
} from '../data/initialData';
import { useAuth } from './AuthContext';
import { checkAndTriggerDailyBackup } from '../utils/backupEngine';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const { user, updateProfileName } = useAuth();
  const currentUserId = user?.id || 'guest';
  const isRegisteredUser = Boolean(user?.id && !user.id.startsWith('usr_'));

  // Theme state
  const [theme, setTheme] = useState('light');
  
  // Profile state
  const [profiles] = useState(INITIAL_PROFILES);
  const [userName, setUserName] = useState(() => {
    return user?.fullName || user?.full_name || user?.name || 'User';
  });
  const [activeProfileId, setActiveProfileId] = useState('user-1');

  const updateUserName = (newName) => {
    if (!newName || !newName.trim()) return;
    const clean = newName.trim();
    setUserName(clean);
    if (updateProfileName) {
      updateProfileName(clean);
    }
  };

  // Currency state
  const [currencies] = useState(DEFAULT_CURRENCIES);
  const [activeCurrencyCode, setActiveCurrencyCode] = useState(() => {
    return localStorage.getItem(`moneymind_currency_${currentUserId}`) || 'INR';
  });

  // Local/cached data states strictly isolated to current user ID
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(`moneymind_transactions_${currentUserId}`);
      if (saved) return JSON.parse(saved);
      // New account starts with 0 transactions
      return [];
    } catch {
      return [];
    }
  });

  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem(`moneymind_budgets_${currentUserId}`);
      if (saved) return JSON.parse(saved);
      return INITIAL_BUDGETS;
    } catch {
      return INITIAL_BUDGETS;
    }
  });

  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem(`moneymind_goals_${currentUserId}`);
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(`moneymind_notifs_${currentUserId}`);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: `welcome-${Date.now()}`,
          title: `Welcome, ${user?.fullName || user?.name || 'User'}!`,
          message: 'Your personal finance workspace is ready. Start tracking your income & expenses.',
          time: 'Just now',
          read: false,
          type: 'success'
        }
      ];
    } catch {
      return [];
    }
  });

  const [categories] = useState(CATEGORIES);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Sync theme
  useEffect(() => {
    document.body.className = 'light-theme';
  }, []);

  // Save current user's state to their specific localStorage partition
  useEffect(() => {
    try {
      localStorage.setItem(`moneymind_transactions_${currentUserId}`, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Could not cache transactions:', e);
    }
  }, [transactions, currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(`moneymind_budgets_${currentUserId}`, JSON.stringify(budgets));
    } catch (e) {
      console.warn('Could not cache budgets:', e);
    }
  }, [budgets, currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(`moneymind_goals_${currentUserId}`, JSON.stringify(goals));
    } catch (e) {
      console.warn('Could not cache goals:', e);
    }
  }, [goals, currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(`moneymind_notifs_${currentUserId}`, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Could not cache notifs:', e);
    }
  }, [notifications, currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(`moneymind_currency_${currentUserId}`, activeCurrencyCode);
    } catch (e) {
      console.warn('Could not cache currency:', e);
    }
  }, [activeCurrencyCode, currentUserId]);

  // Automated 24-hour periodic encrypted local backup check (Privacy-First)
  useEffect(() => {
    if (user?.id && user.id !== 'guest') {
      const timer = setTimeout(() => {
        checkAndTriggerDailyBackup(user.id);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user?.id]);

  const rawProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const activeProfile = {
    ...rawProfile,
    name: user?.fullName || user?.full_name || user?.name || userName || 'User'
  };
  const activeCurrency = currencies.find(c => c.code === activeCurrencyCode) || currencies[0];

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Helper to match transaction category / merchant to budget category
  const matchCategoryToBudget = (inputName, budgetCategory) => {
    if (!inputName || !budgetCategory) return false;
    const inp = inputName.toLowerCase().trim();
    const b = budgetCategory.toLowerCase().trim();
    if (inp === b) return true;
    if (b.includes(inp) || inp.includes(b)) return true;

    // Check food/dining synonyms
    const foodTerms = ['food', 'dining', 'restaurant', 'swiggy', 'zomato', 'starbucks', 'cafe', 'eats', 'burger', 'pizza', 'meal', 'lunch', 'dinner'];
    if ((b.includes('food') || b.includes('dining')) && foodTerms.some(t => inp.includes(t))) return true;

    // Travel synonyms
    const travelTerms = ['travel', 'transport', 'uber', 'ola', 'cab', 'flight', 'metro', 'bus', 'fuel', 'petrol'];
    if ((b.includes('travel') || b.includes('transport')) && travelTerms.some(t => inp.includes(t))) return true;

    // Shopping synonyms
    const shopTerms = ['shop', 'amazon', 'flipkart', 'myntra', 'electronics', 'clothing'];
    if (b.includes('shop') && shopTerms.some(t => inp.includes(t))) return true;

    // Utilities / Bills synonyms
    const billTerms = ['bill', 'utility', 'electricity', 'water', 'broadband', 'airtel', 'jio', 'recharge'];
    if ((b.includes('util') || b.includes('bill')) && billTerms.some(t => inp.includes(t))) return true;

    return false;
  };

  // Global Budget Lock Modal Alert State
  const [budgetLockAlert, setBudgetLockAlert] = useState(null);

  const triggerBudgetLock = (lockInfo) => {
    setBudgetLockAlert(lockInfo);
  };

  const closeBudgetLock = () => {
    setBudgetLockAlert(null);
  };

  /**
   * Checks if adding an expense amount to a category would exceed its set budget limit
   * Returns { blocked: true/false, ...lockDetails }
   */
  const checkBudgetLock = useCallback(({ category, amount, merchant, type = 'expense' }) => {
    if (type !== 'expense') return { blocked: false };
    const numAmount = Number(amount) || 0;
    if (numAmount <= 0) return { blocked: false };

    // Find any configured budget that matches this category or merchant
    for (const budget of budgets) {
      // Budgets enforce lock by default unless explicitly disabled
      const isLocked = budget.isLocked !== false;
      if (!isLocked) continue;

      const matchesCat = category && matchCategoryToBudget(category, budget.category);
      const matchesMerch = merchant && matchCategoryToBudget(merchant, budget.category);

      if (matchesCat || matchesMerch) {
        // Calculate total already spent in this category
        const currentSpent = transactions
          .filter(t => t.type === 'expense' && (
            matchCategoryToBudget(t.category, budget.category) ||
            (t.merchant && matchCategoryToBudget(t.merchant, budget.category)) ||
            (t.title && matchCategoryToBudget(t.title, budget.category))
          ))
          .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        const projectedSpent = currentSpent + numAmount;
        if (projectedSpent > Number(budget.monthlyLimit)) {
          const excessAmount = projectedSpent - Number(budget.monthlyLimit);
          return {
            blocked: true,
            budget,
            budgetId: budget.id,
            budgetName: budget.category,
            limit: Number(budget.monthlyLimit),
            currentSpent,
            attemptedAmount: numAmount,
            projectedSpent,
            excessAmount,
            remaining: Math.max(0, Number(budget.monthlyLimit) - currentSpent),
            message: `You have reached the limit for ${budget.category}! Set limit is ₹${budget.monthlyLimit.toLocaleString('en-IN')}, and paying ₹${numAmount.toLocaleString('en-IN')} would exceed it by ₹${excessAmount.toLocaleString('en-IN')}. Payment is locked.`
          };
        }
      }
    }

    return { blocked: false };
  }, [budgets, transactions]);

  // Transaction Actions strictly bound to user.id
  const addTransaction = async (newTx) => {
    const numAmount = Number(newTx.amount) || 0;

    // 1. Budget Lock Check: block overspending if locked
    if (newTx.type === 'expense' && !newTx.bypassLock) {
      const lockCheck = checkBudgetLock({
        category: newTx.category,
        merchant: newTx.merchant || newTx.title,
        amount: numAmount,
        type: newTx.type
      });

      if (lockCheck.blocked) {
        triggerBudgetLock(lockCheck);
        addNotification({
          title: `🔒 Payment Blocked: ${lockCheck.budgetName}`,
          message: `Attempted payment of ₹${numAmount.toLocaleString('en-IN')} for ${lockCheck.budgetName} exceeds your limit of ₹${lockCheck.limit.toLocaleString('en-IN')}.`,
          type: 'danger'
        });
        return { blocked: true, lockCheck };
      }
    }

    const tempId = `tx-${Date.now()}`;
    const txObj = {
      id: tempId,
      profileId: activeProfileId,
      date: new Date().toISOString().split('T')[0],
      tags: [],
      ...newTx,
      amount: numAmount
    };

    setTransactions(prev => [txObj, ...prev]);

    // Check budget alert automatically
    if (txObj.type === 'expense') {
      const budget = budgets.find(b => matchCategoryToBudget(txObj.category, b.category));
      if (budget) {
        const categoryTotal = transactions
          .filter(t => t.type === 'expense' && matchCategoryToBudget(t.category, budget.category))
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

    logUserActivity('transaction_added', `Recorded ${txObj.type}: ₹${txObj.amount} at ${txObj.title}`, {
      category: txObj.category,
      amount: txObj.amount,
      type: txObj.type
    });

    return txObj;
  };

  const deleteTransaction = async (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const editTransaction = async (id, updatedFields) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  // Payment Intent Integration Functions
  const simulateUPIPayment = async ({ amount, merchant, reference, date, bypassLock }) => {
    const numAmount = Number(amount) || 0;

    // Detect category from merchant for accurate budget lock enforcement
    let inferredCategory = 'Other';
    const m = (merchant || '').toLowerCase();
    if (['swiggy', 'zomato', 'restaurant', 'cafe', 'starbucks', 'food', 'eats', 'burger', 'pizza', 'diner'].some(k => m.includes(k))) {
      inferredCategory = 'Food & Dining';
    } else if (['uber', 'ola', 'rapido', 'metro', 'petrol', 'fuel', 'cab'].some(k => m.includes(k))) {
      inferredCategory = 'Travel & Transport';
    } else if (['amazon', 'flipkart', 'myntra', 'zara', 'croma', 'store', 'shop'].some(k => m.includes(k))) {
      inferredCategory = 'Shopping & Electronics';
    } else if (['airtel', 'jio', 'bescom', 'tneb', 'electricity', 'broadband', 'wifi', 'bill'].some(k => m.includes(k))) {
      inferredCategory = 'Utilities & Bills';
    }

    // 1. Budget Lock Check: block payment simulation if limit reached
    if (!bypassLock) {
      const lockCheck = checkBudgetLock({
        category: inferredCategory,
        merchant: merchant,
        amount: numAmount,
        type: 'expense'
      });

      if (lockCheck.blocked) {
        triggerBudgetLock(lockCheck);
        addNotification({
          title: `🔒 UPI Payment Blocked: ${lockCheck.budgetName}`,
          message: `Payment of ₹${numAmount.toLocaleString('en-IN')} to ${merchant || 'merchant'} exceeds your ${lockCheck.budgetName} limit of ₹${lockCheck.limit.toLocaleString('en-IN')}.`,
          type: 'danger'
        });
        return { blocked: true, lockCheck };
      }
    }

    const tempId = `tx-upi-${Date.now()}`;
    const txObj = {
      id: tempId,
      profileId: activeProfileId,
      title: merchant || 'UPI Payment',
      merchant: merchant || 'UPI Merchant',
      amount: numAmount,
      type: 'expense',
      category: inferredCategory,
      paymentMethod: 'UPI',
      date: date || new Date().toISOString().split('T')[0],
      intentCategory: inferredCategory !== 'Other' ? inferredCategory : null,
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
    const budget = budgets.find(b => matchCategoryToBudget(txObj.category, b.category));
    if (budget) {
      const categoryTotal = transactions
        .filter(t => t.type === 'expense' && matchCategoryToBudget(t.category, budget.category))
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

  // Budget Actions strictly bound to user.id
  const addBudget = async (newBudget) => {
    const budget = {
      id: newBudget.id || `b-${Date.now()}`,
      alertThreshold: newBudget.alertThreshold !== undefined ? Number(newBudget.alertThreshold) : 80,
      isLocked: newBudget.isLocked !== false, // Strict Lock active by default
      ...newBudget,
      monthlyLimit: Number(newBudget.monthlyLimit)
    };
    setBudgets(prev => [...prev.filter(b => b.category !== budget.category), budget]);
  };

  const toggleBudgetLock = (budgetId) => {
    setBudgets(prev => prev.map(b => {
      if (b.id === budgetId) {
        const updatedLock = b.isLocked === false ? true : false;
        return { ...b, isLocked: updatedLock };
      }
      return b;
    }));
  };

  const deleteBudget = async (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Goal Actions strictly bound to user.id
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
  };

  const contributeToGoal = async (id, amount) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const newAmt = Math.min(g.targetAmount, (Number(g.currentAmount) || 0) + Number(amount));
        return { ...g, currentAmount: newAmt };
      }
      return g;
    }));
  };

  const deleteGoal = async (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Notification Actions strictly bound to user.id
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
    localStorage.removeItem(`moneymind_transactions_${currentUserId}`);
    localStorage.removeItem(`moneymind_budgets_${currentUserId}`);
    localStorage.removeItem(`moneymind_goals_${currentUserId}`);
    localStorage.removeItem(`moneymind_notifs_${currentUserId}`);
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
        toggleBudgetLock,
        budgetLockAlert,
        triggerBudgetLock,
        closeBudgetLock,
        checkBudgetLock,
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