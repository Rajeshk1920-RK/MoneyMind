/**
 * Payment Intent Utilities & Analytics
 * Provides calculations, categorizations, and stats for UPI Payment Intents.
 */

export const PAYMENT_INTENT_CATEGORIES = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'Utensils',
    color: '#f59e0b',
    bg: '#fef3c7',
    description: 'Restaurants, cafes, food delivery & groceries'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#ec4899',
    bg: '#fce7f3',
    description: 'Clothing, gadgets, retail & online shopping'
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'Car',
    color: '#3b82f6',
    bg: '#dbeafe',
    description: 'Cabs, metro, flights, fuel & tolls'
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    icon: 'Zap',
    color: '#06b6d4',
    bg: '#cffafe',
    description: 'Electricity, water, broadband & mobile recharge'
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    color: '#8b5cf6',
    bg: '#ede9fe',
    description: 'Tuition, courses, books & certifications'
  },
  {
    id: 'work',
    name: 'Work',
    icon: 'Briefcase',
    color: '#64748b',
    bg: '#f1f5f9',
    description: 'Office supplies, client meals & software tools'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'Gamepad2',
    color: '#f43f5e',
    bg: '#ffe4e6',
    description: 'Movies, gaming, OTT subscriptions & concerts'
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'HeartPulse',
    color: '#10b981',
    bg: '#d1fae5',
    description: 'Medicines, consultations & medical tests'
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: 'Dumbbell',
    color: '#14b8a6',
    bg: '#ccfbf1',
    description: 'Gym, trainer fees, sports gear & supplements'
  },
  {
    id: 'family',
    name: 'Family',
    icon: 'Users',
    color: '#e11d48',
    bg: '#ffe4e6',
    description: 'Household expenses, gifts & kid allowances'
  },
  {
    id: 'investment',
    name: 'Investment',
    icon: 'TrendingUp',
    color: '#6366f1',
    bg: '#e0e7ff',
    description: 'Mutual funds, stocks, gold & fixed deposits'
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'Package',
    color: '#64748b',
    bg: '#f1f5f9',
    description: 'Miscellaneous or uncategorized spends'
  }
];

export const INTENT_FOR_OPTIONS = [
  'Myself',
  'Family',
  'Friends',
  'Work / Client',
  'Partner',
  'Shared Group'
];

/**
 * Calculates comprehensive payment intent statistics from transaction list
 */
export function getPaymentIntentStats(transactions = []) {
  if (!Array.isArray(transactions)) {
    return {
      totalUPIPayments: 0,
      capturedPayments: 0,
      uncapturedPayments: 0,
      captureRate: 0,
      totalUPIAmount: 0,
      capturedUPIAmount: 0,
      uncapturedUPIAmount: 0,
      categories: {},
      categoryList: []
    };
  }

  // Filter UPI transactions (expenses only)
  const upiTransactions = transactions.filter(t => 
    t.type === 'expense' && (t.paymentMethod === 'UPI' || t.source === 'simulated_upi')
  );

  const totalUPIPayments = upiTransactions.length;
  let capturedPayments = 0;
  let uncapturedPayments = 0;
  let totalUPIAmount = 0;
  let capturedUPIAmount = 0;
  let uncapturedUPIAmount = 0;

  const categories = {};

  upiTransactions.forEach(t => {
    const amt = Number(t.amount) || 0;
    totalUPIAmount += amt;

    const isCaptured = Boolean(t.intentCaptured || t.intentCategory);

    if (isCaptured) {
      capturedPayments += 1;
      capturedUPIAmount += amt;

      const catName = t.intentCategory || t.category || 'Other';
      if (!categories[catName]) {
        categories[catName] = {
          count: 0,
          amount: 0,
          percentage: 0
        };
      }
      categories[catName].count += 1;
      categories[catName].amount += amt;
    } else {
      uncapturedPayments += 1;
      uncapturedUPIAmount += amt;
    }
  });

  const captureRate = totalUPIPayments > 0 
    ? Math.round((capturedPayments / totalUPIPayments) * 100 * 10) / 10 
    : 0;

  // Convert categories map to sorted array with percentages
  const categoryList = Object.entries(categories).map(([name, data]) => {
    const meta = PAYMENT_INTENT_CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase()) || {
      color: '#3c6cf6',
      bg: '#eaf0f9',
      icon: 'Tag'
    };
    const percentage = capturedUPIAmount > 0 ? Math.round((data.amount / capturedUPIAmount) * 100) : 0;
    return {
      name,
      count: data.count,
      amount: data.amount,
      percentage,
      color: meta.color,
      bg: meta.bg,
      icon: meta.icon
    };
  }).sort((a, b) => b.amount - a.amount);

  return {
    totalUPIPayments,
    capturedPayments,
    uncapturedPayments,
    captureRate,
    totalUPIAmount,
    capturedUPIAmount,
    uncapturedUPIAmount,
    categories,
    categoryList
  };
}
