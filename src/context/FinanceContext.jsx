import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  INITIAL_PROFILES,
  DEFAULT_CURRENCIES,
  CATEGORIES,
  INITIAL_BUDGETS
} from '../data/initialData';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabase';
import { financeApi } from '../utils/api';

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

  // Load cloud data strictly scoped to this user ID
  const loadUserData = useCallback(async (userId) => {
    if (!userId || userId === 'guest') return;
    setIsCloudSyncing(true);

    try {
      if (!userId.startsWith('usr_')) {
        // Query Supabase strictly for this user's data
        const { data: txs, error: txErr } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (!txErr && Array.isArray(txs)) {
          const mappedTxs = txs.map(t => ({
            id: t.id,
            title: t.title,
            amount: Number(t.amount),
            type: t.type,
            category: t.category,
            paymentMethod: t.payment_method || 'UPI',
            date: t.date,
            notes: t.notes || '',
            note: t.notes || '',
            tags: t.tags || [],
            merchant: t.merchant || t.title,
            intentCategory: t.intent_category,
            intentNote: t.intent_note,
            intentFor: t.intent_for,
            intentCaptured: Boolean(t.intent_captured),
            source: t.source || 'manual',
            paymentStatus: t.payment_status || 'success'
          }));
          setTransactions(mappedTxs);
          localStorage.setItem(`moneymind_transactions_${userId}`, JSON.stringify(mappedTxs));
        }

        const { data: bgs, error: bgErr } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', userId);

        if (!bgErr && Array.isArray(bgs) && bgs.length > 0) {
          const mappedBgs = bgs.map(b => ({
            id: b.id,
            category: b.category,
            monthlyLimit: Number(b.monthly_limit),
            alertThreshold: Number(b.alert_threshold || 80)
          }));
          setBudgets(mappedBgs);
          localStorage.setItem(`moneymind_budgets_${userId}`, JSON.stringify(mappedBgs));
        }

        const { data: gls, error: glErr } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', userId);

        if (!glErr && Array.isArray(gls)) {
          const mappedGls = gls.map(g => ({
            id: g.id,
            title: g.title,
            targetAmount: Number(g.target_amount),
            currentAmount: Number(g.current_amount || 0),
            targetDate: g.target_date,
            category: g.category,
            color: g.color || '#16382b'
          }));
          setGoals(mappedGls);
          localStorage.setItem(`moneymind_goals_${userId}`, JSON.stringify(mappedGls));
        }
      }

      // Query backend if available
      try {
        const data = await financeApi.getFinances(userId);
        if (data) {
          if (Array.isArray(data.transactions)) {
            setTransactions(data.transactions);
            localStorage.setItem(`moneymind_transactions_${userId}`, JSON.stringify(data.transactions));
          }
          if (Array.isArray(data.budgets) && data.budgets.length > 0) {
            setBudgets(data.budgets);
            localStorage.setItem(`moneymind_budgets_${userId}`, JSON.stringify(data.budgets));
          }
          if (Array.isArray(data.goals)) {
            setGoals(data.goals);
            localStorage.setItem(`moneymind_goals_${userId}`, JSON.stringify(data.goals));
          }
        }
      } catch {}
    } catch (err) {
      console.warn('Cloud data load note:', err.message);
    } finally {
      setIsCloudSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id && user.id !== 'guest') {
      loadUserData(user.id);
    }
  }, [user?.id, loadUserData]);

  const rawProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const activeProfile = {
    ...rawProfile,
    name: user?.fullName || user?.full_name || user?.name || userName || 'User'
  };
  const activeCurrency = currencies.find(c => c.code === activeCurrencyCode) || currencies[0];

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Activity Logger Helper for Supabase
  const logUserActivity = async (type, title, details = {}) => {
    if (user?.id && !user.id.startsWith('usr_')) {
      try {
        await supabase.from('user_activities').insert([{
          user_id: user.id,
          activity_type: type,
          title: title,
          details: details
        }]);
      } catch (err) {}
    }
  };

  // Transaction Actions strictly bound to user.id
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

    logUserActivity('transaction_added', `Recorded ${txObj.type}: ₹${txObj.amount} at ${txObj.title}`, {
      category: txObj.category,
      amount: txObj.amount,
      type: txObj.type
    });

    if (user?.id) {
      if (!user.id.startsWith('usr_')) {
        try {
          const { data: inserted } = await supabase.from('transactions').insert([{
            user_id: user.id,
            title: txObj.title,
            amount: txObj.amount,
            type: txObj.type,
            category: txObj.category,
            payment_method: txObj.paymentMethod || 'UPI',
            date: txObj.date,
            notes: txObj.note || txObj.notes || '',
            tags: txObj.tags || []
          }]).select().single();

          if (inserted?.id) {
            setTransactions(prev => prev.map(t => t.id === tempId ? { ...t, id: inserted.id } : t));
          }
        } catch (err) {
          console.warn('Supabase add transaction note:', err.message);
        }
      }

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
      if (!user.id.startsWith('usr_')) {
        try {
          await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
        } catch (err) {
          console.warn('Supabase delete transaction note:', err.message);
        }
      }
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
      if (!user.id.startsWith('usr_')) {
        try {
          const updatePayload = {};
          if (updatedFields.title) updatePayload.title = updatedFields.title;
          if (updatedFields.amount !== undefined) updatePayload.amount = Number(updatedFields.amount);
          if (updatedFields.type) updatePayload.type = updatedFields.type;
          if (updatedFields.category) updatePayload.category = updatedFields.category;
          if (updatedFields.paymentMethod) updatePayload.payment_method = updatedFields.paymentMethod;
          if (updatedFields.date) updatePayload.date = updatedFields.date;
          if (updatedFields.notes || updatedFields.note) updatePayload.notes = updatedFields.notes || updatedFields.note;
          
          await supabase.from('transactions').update(updatePayload).eq('id', id).eq('user_id', user.id);
        } catch (err) {
          console.warn('Supabase edit transaction note:', err.message);
        }
      }
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

    if (user?.id && updatedTx) {
      if (!user.id.startsWith('usr_')) {
        try {
          await supabase.from('transactions').update({
            category: updatedTx.category,
            intent_category: updatedTx.intentCategory,
            intent_note: updatedTx.intentNote,
            intent_for: updatedTx.intentFor,
            intent_captured: true,
            notes: updatedTx.note
          }).eq('id', id).eq('user_id', user.id);
        } catch (e) {}
      }
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

  // Budget Actions strictly bound to user.id
  const addBudget = async (newBudget) => {
    const budget = {
      id: `b-${Date.now()}`,
      alertThreshold: 80,
      ...newBudget,
      monthlyLimit: Number(newBudget.monthlyLimit)
    };
    setBudgets(prev => [...prev.filter(b => b.category !== budget.category), budget]);

    if (user?.id) {
      if (!user.id.startsWith('usr_')) {
        try {
          await supabase.from('budgets').upsert([{
            user_id: user.id,
            category: budget.category,
            monthly_limit: budget.monthlyLimit,
            alert_threshold: budget.alertThreshold
          }], { onConflict: 'user_id, category' });
        } catch (err) {
          console.warn('Supabase save budget error:', err.message);
        }
      }
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
      if (!user.id.startsWith('usr_')) {
        try {
          await supabase.from('budgets').delete().eq('id', id).eq('user_id', user.id);
        } catch (err) {}
      }
      try {
        await financeApi.deleteBudget(id);
      } catch (err) {
        console.warn('Could not delete budget from cloud:', err.message);
      }
    }
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

    if (user?.id) {
      if (!user.id.startsWith('usr_')) {
        try {
          const { data: inserted } = await supabase.from('goals').insert([{
            user_id: user.id,
            title: goal.title,
            target_amount: goal.targetAmount,
            current_amount: goal.currentAmount || 0,
            target_date: goal.targetDate,
            category: goal.category,
            color: goal.color
          }]).select().single();

          if (inserted?.id) {
            setGoals(prev => prev.map(g => g.id === tempId ? { ...g, id: inserted.id } : g));
          }
        } catch (err) {
          console.warn('Supabase save goal note:', err.message);
        }
      }

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

    if (user?.id && updatedGoal) {
      if (!user.id.startsWith('usr_')) {
        try {
          await supabase.from('goals').update({ current_amount: updatedGoal.currentAmount }).eq('id', id).eq('user_id', user.id);
        } catch (err) {}
      }
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
      if (!user.id.startsWith('usr_')) {
        try {
          await supabase.from('goals').delete().eq('id', id).eq('user_id', user.id);
        } catch (err) {}
      }
      try {
        await financeApi.deleteGoal?.(id);
      } catch (err) {
        console.warn('Could not delete goal from cloud:', err.message);
      }
    }
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