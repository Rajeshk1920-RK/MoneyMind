import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_SPLIT_GROUPS } from '../data/initialData';
import { calculateGroupBalances, simplifyDebts } from '../utils/debtSimplifier';
import { useFinance } from './FinanceContext';
import { useAuth } from './AuthContext';

const SplitContext = createContext(null);

export function SplitProvider({ children }) {
  const { addNotification } = useFinance();
  const { user } = useAuth();
  const currentUserId = user?.id || 'guest';
  const prevUserIdRef = useRef(currentUserId);

  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem(`moneymind_split_groups_${currentUserId}`);
      if (saved) return JSON.parse(saved);
      return currentUserId === 'guest' ? INITIAL_SPLIT_GROUPS : [];
    } catch {
      return [];
    }
  });

  const [selectedGroupId, setSelectedGroupId] = useState(() => {
    return groups.length > 0 ? groups[0].id : null;
  });

  // Switch groups when user account switches
  useEffect(() => {
    if (prevUserIdRef.current !== currentUserId) {
      prevUserIdRef.current = currentUserId;
      try {
        const saved = localStorage.getItem(`moneymind_split_groups_${currentUserId}`);
        const userGroups = saved ? JSON.parse(saved) : (currentUserId === 'guest' ? INITIAL_SPLIT_GROUPS : []);
        setGroups(userGroups);
        setSelectedGroupId(userGroups.length > 0 ? userGroups[0].id : null);
      } catch {
        setGroups([]);
        setSelectedGroupId(null);
      }
    }
  }, [currentUserId]);

  // Persist current user's groups to their specific cache
  useEffect(() => {
    try {
      localStorage.setItem(`moneymind_split_groups_${currentUserId}`, JSON.stringify(groups));
    } catch (e) {
      console.warn('Could not cache split groups:', e);
    }
  }, [groups, currentUserId]);

  const activeGroup = groups.find(g => g.id === selectedGroupId) || groups[0] || null;

  // Compute live balances and simplified debts for active group
  const activeBalances = activeGroup ? calculateGroupBalances(activeGroup.members, activeGroup.expenses) : {};
  const activeSimplifiedDebts = activeGroup ? simplifyDebts(activeGroup.members, activeBalances) : [];

  // Group actions
  const createGroup = (groupData) => {
    const newGroup = {
      id: `grp-${Date.now()}`,
      currency: 'INR',
      expenses: [],
      ...groupData
    };
    setGroups(prev => [newGroup, ...prev]);
    setSelectedGroupId(newGroup.id);
    addNotification({
      title: 'New Group Created',
      message: `"${newGroup.name}" with ${newGroup.members.length} members is ready for splitting!`,
      type: 'success'
    });
    return newGroup;
  };

  const addExpenseToGroup = (groupId, expenseData) => {
    const newExpense = {
      id: `se-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      splitType: 'equal',
      ...expenseData,
      amount: Number(expenseData.amount) || 0
    };

    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          expenses: [newExpense, ...g.expenses]
        };
      }
      return g;
    }));

    const payer = activeGroup?.members.find(m => m.id === newExpense.paidBy);
    addNotification({
      title: 'Group Expense Added',
      message: `${payer ? payer.name : 'Someone'} paid ₹${newExpense.amount.toLocaleString('en-IN')} for "${newExpense.title}".`,
      type: 'info'
    });
  };

  const settleDebt = (groupId, fromMemberId, toMemberId, amount) => {
    const fromMember = activeGroup?.members.find(m => m.id === fromMemberId);
    const toMember = activeGroup?.members.find(m => m.id === toMemberId);

    const settlementExpense = {
      id: `settle-${Date.now()}`,
      title: `Settlement: ${fromMember?.name || 'Member'} -> ${toMember?.name || 'Member'}`,
      amount: Number(amount),
      paidBy: fromMemberId,
      splitType: 'exact',
      involvedMembers: [fromMemberId, toMemberId],
      exactShares: {
        [toMemberId]: Number(amount)
      },
      date: new Date().toISOString().split('T')[0],
      isSettlement: true,
      category: 'Settlement'
    };

    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          expenses: [settlementExpense, ...g.expenses]
        };
      }
      return g;
    }));

    addNotification({
      title: 'Debt Settled!',
      message: `${fromMember?.name} paid ₹${Number(amount).toLocaleString('en-IN')} to ${toMember?.name}.`,
      type: 'success'
    });
  };

  const deleteGroupExpense = (groupId, expenseId) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          expenses: g.expenses.filter(e => e.id !== expenseId)
        };
      }
      return g;
    }));
  };

  return (
    <SplitContext.Provider
      value={{
        groups,
        selectedGroupId,
        setSelectedGroupId,
        activeGroup,
        activeBalances,
        activeSimplifiedDebts,
        createGroup,
        addExpenseToGroup,
        settleDebt,
        deleteGroupExpense
      }}
    >
      {children}
    </SplitContext.Provider>
  );
}

export function useSplit() {
  const context = useContext(SplitContext);
  if (!context) {
    throw new Error('useSplit must be used within SplitProvider');
  }
  return context;
}