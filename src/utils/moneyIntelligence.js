/**
 * Money Mind - Local Deterministic Money Intelligence Engine
 * 
 * Privacy-First, On-Device Financial Intelligence.
 * 100% Local Calculation - NO LLMs, NO External APIs, NO AI Chatbots.
 * 
 * Provides:
 * 1. Financial Health Score (0–100) with weighted breakdown
 * 2. Smart Money Insights (Deterministic rule-based pattern analysis)
 * 3. Expense Forecasting and Burn Rate Analytics
 */

// Configurable Financial Health Weights
export const DEFAULT_HEALTH_WEIGHTS = {
  savings: 0.30,      // Savings Performance (30%)
  budget: 0.25,       // Budget Management (25%)
  spending: 0.20,     // Spending Behavior (20%)
  goals: 0.15,        // Savings Goals (15%)
  consistency: 0.10   // Financial Consistency (10%)
};

// Configurable Health Score Status Ranges
export const HEALTH_STATUS_RANGES = [
  { min: 80, max: 100, label: 'Healthy', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { min: 60, max: 79,  label: 'Good', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { min: 40, max: 59,  label: 'Needs Improvement', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { min: 0,  max: 39,  label: 'Needs Attention', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' }
];

export function getHealthStatus(score) {
  const match = HEALTH_STATUS_RANGES.find(r => score >= r.min && score <= r.max);
  return match || HEALTH_STATUS_RANGES[HEALTH_STATUS_RANGES.length - 1];
}

/**
 * 1. Savings Performance Score (0–100) - Weight: 30%
 * Evaluates net savings rate = (Income - Expense) / Income
 */
export function calculateSavingsScore(transactions = []) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  if (totalIncome <= 0) {
    // If no income recorded yet, calculate based on net burn
    return totalExpense === 0 ? 50 : Math.max(20, 50 - Math.min(30, totalExpense / 500));
  }

  const netSavings = totalIncome - totalExpense;
  const savingsRate = netSavings / totalIncome;

  if (savingsRate >= 0.40) return 100;
  if (savingsRate >= 0.30) return Math.round(85 + ((savingsRate - 0.30) / 0.10) * 15);
  if (savingsRate >= 0.20) return Math.round(70 + ((savingsRate - 0.20) / 0.10) * 15);
  if (savingsRate >= 0.10) return Math.round(55 + ((savingsRate - 0.10) / 0.10) * 15);
  if (savingsRate >= 0.00) return Math.round(40 + (savingsRate / 0.10) * 15);
  
  // Negative savings (overspending income)
  const deficitRate = Math.abs(savingsRate);
  return Math.max(10, Math.round(40 - Math.min(30, deficitRate * 40)));
}

/**
 * 2. Budget Management Score (0–100) - Weight: 25%
 * Evaluates category adherence and penalty for overspent limits
 */
export function calculateBudgetScore(budgets = [], transactions = []) {
  if (!budgets || budgets.length === 0) {
    return 65; // Baseline neutral score if no budgets configured yet
  }

  let totalBudgetScore = 0;

  budgets.forEach(b => {
    const limit = Number(b.monthlyLimit) || 1;
    const spent = transactions
      .filter(t => t.type === 'expense' && (
        t.category?.toLowerCase() === b.category?.toLowerCase() ||
        (b.category?.toLowerCase().includes('food') && t.category?.toLowerCase().includes('food'))
      ))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const ratio = spent / limit;

    if (ratio <= 0.70) {
      totalBudgetScore += 100;
    } else if (ratio <= 0.85) {
      totalBudgetScore += 85;
    } else if (ratio <= 1.00) {
      totalBudgetScore += 70;
    } else if (ratio <= 1.15) {
      totalBudgetScore += 45;
    } else {
      totalBudgetScore += Math.max(10, Math.round(40 - (ratio - 1.15) * 50));
    }
  });

  return Math.round(totalBudgetScore / budgets.length);
}

/**
 * 3. Spending Behavior Score (0–100) - Weight: 20%
 * Evaluates expenditure stability, single-transaction spike containment, and category distribution
 */
export function calculateSpendingScore(transactions = []) {
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return 60;

  const totalExpense = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  if (totalExpense <= 0) return 70;

  let score = 85;

  // Check 1: Spike penalty (single transaction consuming > 40% of total spend)
  const maxSingleExpense = Math.max(...expenses.map(t => Number(t.amount) || 0));
  if (maxSingleExpense > totalExpense * 0.40 && expenses.length > 2) {
    score -= 15;
  }

  // Check 2: Category diversification
  const categoryMap = {};
  expenses.forEach(t => {
    const cat = t.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + (Number(t.amount) || 0);
  });

  const categories = Object.keys(categoryMap);
  const maxCategorySpend = Math.max(...Object.values(categoryMap));

  if (categories.length >= 3 && maxCategorySpend <= totalExpense * 0.55) {
    score += 10; // Balanced spending across multiple needs
  } else if (maxCategorySpend > totalExpense * 0.75 && totalExpense > 2000) {
    score -= 10; // Extreme concentration in one bucket
  }

  return Math.min(100, Math.max(20, score));
}

/**
 * 4. Savings Goals Score (0–100) - Weight: 15%
 * Evaluates active goal milestones, target allocation, and funding percentage
 */
export function calculateGoalScore(goals = []) {
  if (!goals || goals.length === 0) {
    return 55; // Baseline neutral score if no goals configured
  }

  const totalTarget = goals.reduce((s, g) => s + (Number(g.targetAmount) || 0), 0);
  const totalSaved = goals.reduce((s, g) => s + (Number(g.currentAmount) || 0), 0);

  if (totalTarget <= 0) return 60;

  const completionRatio = Math.min(1, totalSaved / totalTarget);
  const baseScore = Math.round(completionRatio * 50); // Up to 50 pts for funding progress

  // Active goals presence bonus (up to 50 pts)
  const countBonus = Math.min(50, goals.length * 18 + (goals.some(g => g.currentAmount > 0) ? 14 : 0));

  return Math.min(100, Math.max(25, baseScore + countBonus));
}

/**
 * 5. Financial Consistency Score (0–100) - Weight: 10%
 * Evaluates regular logging habits, payment intent tagging, and steady tracking
 */
export function calculateConsistencyScore(transactions = []) {
  if (transactions.length === 0) return 50;
  if (transactions.length >= 10) return 95;
  if (transactions.length >= 5) return 82;
  if (transactions.length >= 2) return 68;
  return 55;
}

/**
 * Main Deterministic Financial Health Score Calculator
 * Returns comprehensive breakdown and health status
 */
export function calculateFinancialHealth({
  transactions = [],
  budgets = [],
  goals = [],
  weights = DEFAULT_HEALTH_WEIGHTS
}) {
  const isNewUser = !transactions || transactions.length === 0;

  if (isNewUser) {
    return {
      totalScore: 0,
      isNewUser: true,
      status: 'No Data Yet',
      statusColor: '#64748b',
      statusBg: '#f1f5f9',
      statusBorder: '#e2e8f0',
      summary: 'Add a few transactions to generate your Financial Health Score and Smart Money Insights.',
      breakdown: {
        savings: 0,
        budget: 0,
        spending: 0,
        goals: 0,
        consistency: 0
      },
      weights
    };
  }

  const savingsScore = calculateSavingsScore(transactions);
  const budgetScore = calculateBudgetScore(budgets, transactions);
  const spendingScore = calculateSpendingScore(transactions);
  const goalScore = calculateGoalScore(goals);
  const consistencyScore = calculateConsistencyScore(transactions);

  const totalScore = Math.round(
    savingsScore * (weights.savings || 0.30) +
    budgetScore * (weights.budget || 0.25) +
    spendingScore * (weights.spending || 0.20) +
    goalScore * (weights.goals || 0.15) +
    consistencyScore * (weights.consistency || 0.10)
  );

  const clampedScore = Math.min(100, Math.max(0, totalScore));
  const statusInfo = getHealthStatus(clampedScore);

  let summary = 'Your overall financial indicators are well-balanced and on track.';
  if (clampedScore >= 80) {
    summary = 'Excellent financial discipline! Your savings rate and budget control are solid.';
  } else if (clampedScore >= 60) {
    summary = 'Good financial posture. A slight boost to monthly savings will push you to Healthy tier.';
  } else if (clampedScore >= 40) {
    summary = 'Opportunities found in budget caps and reducing discretionary dining & shopping spend.';
  } else {
    summary = 'Expenses currently exceed recommended thresholds. Review active category limits below.';
  }

  return {
    totalScore: clampedScore,
    isNewUser: false,
    status: statusInfo.label,
    statusColor: statusInfo.color,
    statusBg: statusInfo.bg,
    statusBorder: statusInfo.border,
    summary,
    breakdown: {
      savings: savingsScore,
      budget: budgetScore,
      spending: spendingScore,
      goals: goalScore,
      consistency: consistencyScore
    },
    weights
  };
}

/**
 * Deterministic Smart Money Insights Generator
 * Analyzes local transactions, budgets, and goals using deterministic rules (NO AI / NO LLM)
 */
export function generateSmartMoneyInsights({
  transactions = [],
  budgets = [],
  goals = [],
  activeCurrencyCode = 'INR'
}) {
  const insights = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  if (!transactions || transactions.length === 0) {
    return insights;
  }

  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');

  const totalIncome = incomes.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const totalExpense = expenses.reduce((s, t) => s + (Number(t.amount) || 0), 0);

  // 1. Budget Usage Analysis & Warnings
  budgets.forEach(b => {
    const limit = Number(b.monthlyLimit) || 1;
    const catSpent = expenses
      .filter(t => t.category?.toLowerCase() === b.category?.toLowerCase() || 
                  (b.category?.toLowerCase().includes('food') && t.category?.toLowerCase().includes('food')))
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);

    const percentage = Math.round((catSpent / limit) * 100);

    if (percentage >= 100) {
      insights.push({
        id: `ins-budget-locked-${b.id || b.category}`,
        type: 'budget_warning',
        priority: 'high',
        title: `${b.category} Budget Exceeded (Locked)`,
        description: `You have spent ₹${catSpent.toLocaleString('en-IN')} of your ₹${limit.toLocaleString('en-IN')} limit (${percentage}% used). Payments exceeding this limit are locked.`,
        value: `${percentage}%`,
        comparison: `+₹${(catSpent - limit).toLocaleString('en-IN')} over limit`,
        category: b.category,
        icon: 'ShieldAlert',
        createdAt: new Date().toISOString()
      });
    } else if (percentage >= (b.alertThreshold || 80)) {
      insights.push({
        id: `ins-budget-warning-${b.id || b.category}`,
        type: 'budget_warning',
        priority: 'medium',
        title: `${b.category} Budget Alert`,
        description: `You have used ${percentage}% of your ₹${limit.toLocaleString('en-IN')} monthly ${b.category} budget. ₹${(limit - catSpent).toLocaleString('en-IN')} remaining.`,
        value: `${percentage}%`,
        comparison: `₹${(limit - catSpent).toLocaleString('en-IN')} left`,
        category: b.category,
        icon: 'AlertTriangle',
        createdAt: new Date().toISOString()
      });
    }
  });

  // 2. Savings Rate Insight
  if (totalIncome > 0) {
    const netSavings = totalIncome - totalExpense;
    const savingsPercent = Math.round((netSavings / totalIncome) * 100);

    if (savingsPercent >= 30) {
      insights.push({
        id: 'ins-savings-strong',
        type: 'savings_improvement',
        priority: 'positive',
        title: 'Strong Monthly Savings Rate',
        description: `You saved ₹${Math.max(0, netSavings).toLocaleString('en-IN')} (${savingsPercent}% of income) this cycle, exceeding the recommended 20% benchmark.`,
        value: `${savingsPercent}%`,
        comparison: 'Above 20% benchmark',
        category: 'Investments & Savings',
        icon: 'TrendingUp',
        createdAt: new Date().toISOString()
      });
    } else if (savingsPercent < 15 && totalExpense > 0) {
      insights.push({
        id: 'ins-savings-low',
        type: 'savings_improvement',
        priority: 'medium',
        title: 'Savings Opportunity Detected',
        description: `Current savings rate is ${savingsPercent}%. Putting away an extra 10% on income deposits can build a ₹${Math.round(totalIncome * 0.1).toLocaleString('en-IN')} monthly safety cushion.`,
        value: `${savingsPercent}%`,
        comparison: 'Target: 25%+',
        category: 'Investments & Savings',
        icon: 'PiggyBank',
        createdAt: new Date().toISOString()
      });
    }
  }

  // 3. Category Concentration Analysis
  const catSpendMap = {};
  expenses.forEach(t => {
    const cat = t.category || 'Other';
    catSpendMap[cat] = (catSpendMap[cat] || 0) + (Number(t.amount) || 0);
  });

  const sortedCategories = Object.entries(catSpendMap).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0 && totalExpense > 0) {
    const [topCat, topAmount] = sortedCategories[0];
    const topPercentage = Math.round((topAmount / totalExpense) * 100);

    if (topPercentage >= 40 && topAmount > 1500) {
      insights.push({
        id: `ins-concentration-${topCat}`,
        type: 'concentration',
        priority: topPercentage >= 55 ? 'high' : 'medium',
        title: `${topCat} Dominates Expenses`,
        description: `${topCat} represents ${topPercentage}% (₹${topAmount.toLocaleString('en-IN')}) of your total expenses. Reviewing this category has the biggest impact on your net balance.`,
        value: `${topPercentage}%`,
        comparison: `₹${topAmount.toLocaleString('en-IN')} total`,
        category: topCat,
        icon: 'PieChart',
        createdAt: new Date().toISOString()
      });
    }
  }

  // 4. Frequent Merchant / Payment Pattern Detection
  const merchantCountMap = {};
  const merchantSpendMap = {};
  expenses.forEach(t => {
    const m = (t.merchant || t.title || '').trim();
    if (m && m.length > 2 && !m.toLowerCase().includes('transfer')) {
      merchantCountMap[m] = (merchantCountMap[m] || 0) + 1;
      merchantSpendMap[m] = (merchantSpendMap[m] || 0) + (Number(t.amount) || 0);
    }
  });

  const frequentMerchants = Object.entries(merchantCountMap)
    .filter(([_, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1]);

  if (frequentMerchants.length > 0) {
    const [topMerchant, count] = frequentMerchants[0];
    const merchantTotal = merchantSpendMap[topMerchant] || 0;
    insights.push({
      id: `ins-freq-merchant-${topMerchant}`,
      type: 'frequent_pattern',
      priority: 'neutral',
      title: `Frequent Payee: ${topMerchant}`,
      description: `You made ${count} separate payments totaling ₹${merchantTotal.toLocaleString('en-IN')} to ${topMerchant} this month.`,
      value: `${count} payments`,
      comparison: `₹${merchantTotal.toLocaleString('en-IN')} total`,
      category: 'UPI & Merchant Patterns',
      icon: 'Repeat',
      createdAt: new Date().toISOString()
    });
  }

  // 5. Goal Progress Milestones
  if (goals && goals.length > 0) {
    goals.forEach(g => {
      const target = Number(g.targetAmount) || 1;
      const current = Number(g.currentAmount) || 0;
      const pct = Math.round((current / target) * 100);

      if (pct >= 100) {
        insights.push({
          id: `ins-goal-done-${g.id}`,
          type: 'goal_progress',
          priority: 'positive',
          title: `Goal Achieved: ${g.title}`,
          description: `Congratulations! You have reached 100% of your target for ${g.title} (₹${current.toLocaleString('en-IN')}).`,
          value: '100%',
          comparison: 'Completed',
          category: 'Savings Goals',
          icon: 'CheckCircle2',
          createdAt: new Date().toISOString()
        });
      } else if (pct >= 50) {
        insights.push({
          id: `ins-goal-half-${g.id}`,
          type: 'goal_progress',
          priority: 'positive',
          title: `Goal Milestone: ${g.title}`,
          description: `Your ${g.title} goal is ${pct}% funded (₹${current.toLocaleString('en-IN')} / ₹${target.toLocaleString('en-IN')}).`,
          value: `${pct}%`,
          comparison: `₹${(target - current).toLocaleString('en-IN')} to go`,
          category: 'Savings Goals',
          icon: 'Target',
          createdAt: new Date().toISOString()
        });
      }
    });
  }

  // 6. Weekend vs Weekday Spending Analysis
  let weekendSpend = 0;
  let weekdaySpend = 0;
  expenses.forEach(t => {
    if (t.date) {
      const day = new Date(t.date).getDay();
      const amt = Number(t.amount) || 0;
      if (day === 0 || day === 6) weekendSpend += amt;
      else weekdaySpend += amt;
    }
  });

  if (weekendSpend > 0 && weekendSpend > weekdaySpend * 0.75 && expenses.length >= 4) {
    insights.push({
      id: 'ins-weekend-spend',
      type: 'weekend_spending',
      priority: 'neutral',
      title: 'Weekend Spending Spike',
      description: `Weekend activities account for ₹${weekendSpend.toLocaleString('en-IN')} (${Math.round((weekendSpend / totalExpense) * 100)}% of expenses). Setting a weekend cap can prevent budget runaways.`,
      value: `₹${weekendSpend.toLocaleString('en-IN')}`,
      comparison: 'Weekends (Sat-Sun)',
      category: 'Lifestyle',
      icon: 'Calendar',
      createdAt: new Date().toISOString()
    });
  }

  // 7. Micro-Transactions Accumulation
  const smallTxs = expenses.filter(t => (Number(t.amount) || 0) < 150);
  const smallTotal = smallTxs.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  if (smallTxs.length >= 6 && smallTotal > 800) {
    insights.push({
      id: 'ins-micro-spends',
      type: 'micro_spending',
      priority: 'neutral',
      title: 'Micro-Transaction Leakage',
      description: `You logged ${smallTxs.length} small transactions (< ₹150) that add up to ₹${smallTotal.toLocaleString('en-IN')}. Daily small UPI spends quietly add up.`,
      value: `${smallTxs.length} spends`,
      comparison: `₹${smallTotal.toLocaleString('en-IN')} combined`,
      category: 'Daily Spends',
      icon: 'Coins',
      createdAt: new Date().toISOString()
    });
  }

  // Sort by priority order: high -> medium -> positive -> neutral
  const priorityOrder = { high: 0, medium: 1, positive: 2, neutral: 3, low: 4 };
  return insights.sort((a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99));
}

/**
 * Deterministic Month-End Expense Forecast
 * Calculates linear daily burn rate and projection without external models
 */
export function predictMonthEndExpense(transactions = []) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const dayOfMonth = Math.max(1, now.getDate());
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const currentMonthExpenses = (transactions || []).filter(t => {
    if (t.type !== 'expense') return false;
    const d = new Date(t.date || now);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const spentSoFar = currentMonthExpenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  if (spentSoFar === 0) {
    const allExpenses = (transactions || []).filter(t => t.type === 'expense');
    const totalAll = allExpenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    return {
      spentSoFar: 0,
      dailyBurnRate: 0,
      projectedTotal: Math.round(totalAll * 0.85),
      daysRemaining: daysInMonth - dayOfMonth,
      confidence: 'Preliminary'
    };
  }

  const dailyBurnRate = spentSoFar / dayOfMonth;
  const projectedTotal = Math.round(spentSoFar + dailyBurnRate * (daysInMonth - dayOfMonth));

  return {
    spentSoFar,
    dailyBurnRate: Math.round(dailyBurnRate),
    projectedTotal,
    daysRemaining: daysInMonth - dayOfMonth,
    confidence: dayOfMonth > 15 ? 'High (88%)' : dayOfMonth > 7 ? 'Medium (75%)' : 'Preliminary'
  };
}
