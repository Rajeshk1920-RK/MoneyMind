/**
 * SplitSmart Debt Simplification Engine
 * Calculates net member balances and executes a greedy minimal cash-flow algorithm
 * to resolve all debts with the absolute minimum number of transactions.
 */

export function calculateGroupBalances(members, expenses) {
  // memberId -> net balance
  const balances = {};
  members.forEach(m => {
    balances[m.id] = 0;
  });

  expenses.forEach(exp => {
    const totalAmount = Number(exp.amount) || 0;
    const payerId = exp.paidBy;
    const splitType = exp.splitType || 'equal';
    const involved = exp.involvedMembers && exp.involvedMembers.length > 0
      ? exp.involvedMembers
      : members.map(m => m.id);

    if (involved.length === 0) return;

    // Add paid amount to payer
    if (balances[payerId] !== undefined) {
      balances[payerId] += totalAmount;
    }

    if (splitType === 'equal') {
      const perHead = totalAmount / involved.length;
      involved.forEach(memberId => {
        if (balances[memberId] !== undefined) {
          balances[memberId] -= perHead;
        }
      });
    } else if (splitType === 'exact' && exp.exactShares) {
      Object.entries(exp.exactShares).forEach(([memberId, share]) => {
        if (balances[memberId] !== undefined) {
          balances[memberId] -= Number(share) || 0;
        }
      });
    }
  });

  return balances;
}

export function simplifyDebts(members, balances) {
  const memberMap = new Map(members.map(m => [m.id, m]));

  // Separate into debtors (< -0.01) and creditors (> 0.01)
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([id, balance]) => {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded < -0.01) {
      debtors.push({ id, amount: -rounded });
    } else if (rounded > 0.01) {
      creditors.push({ id, amount: rounded });
    }
  });

  // Sort descending by amount
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0; // debtor index
  let j = 0; // creditor index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settled = Math.min(debtor.amount, creditor.amount);
    const settledRounded = Math.round(settled * 100) / 100;

    if (settledRounded > 0) {
      transactions.push({
        from: debtor.id,
        fromName: memberMap.get(debtor.id)?.name || 'Member',
        fromAvatar: memberMap.get(debtor.id)?.avatar || 'Member',
        to: creditor.id,
        toName: memberMap.get(creditor.id)?.name || 'Member',
        toAvatar: memberMap.get(creditor.id)?.avatar || 'Member',
        amount: settledRounded
      });
    }

    debtor.amount -= settled;
    creditor.amount -= settled;

    if (Math.round(debtor.amount * 100) / 100 <= 0.01) {
      i++;
    }
    if (Math.round(creditor.amount * 100) / 100 <= 0.01) {
      j++;
    }
  }

  return transactions;
}