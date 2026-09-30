export const INITIAL_PROFILES = [
  { id: 'user-1', name: 'My Account', email: '', avatar: 'ME', role: 'Personal Account', upiId: '', netBalance: 0 }
];

export const DEFAULT_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0095 }
];

export const CATEGORIES = [
  { id: 'cat-food', name: 'Food & Dining', icon: 'Utensils', color: '#f59e0b', type: 'expense' },
  { id: 'cat-travel', name: 'Travel & Transport', icon: 'Plane', color: '#3b82f6', type: 'expense' },
  { id: 'cat-housing', name: 'Housing & Rent', icon: 'Home', color: '#8b5cf6', type: 'expense' },
  { id: 'cat-utilities', name: 'Utilities & Bills', icon: 'Zap', color: '#06b6d4', type: 'expense' },
  { id: 'cat-shopping', name: 'Shopping & Electronics', icon: 'ShoppingBag', color: '#ec4899', type: 'expense' },
  { id: 'cat-entertainment', name: 'Entertainment & Subs', icon: 'Film', color: '#f43f5e', type: 'expense' },
  { id: 'cat-health', name: 'Healthcare & Wellness', icon: 'HeartPulse', color: '#10b981', type: 'expense' },
  { id: 'cat-investments', name: 'Investments & Savings', icon: 'TrendingUp', color: '#6366f1', type: 'expense' },
  { id: 'cat-salary', name: 'Salary & Compensation', icon: 'Briefcase', color: '#10b981', type: 'income' },
  { id: 'cat-freelance', name: 'Freelance & Side Income', icon: 'Laptop', color: '#059669', type: 'income' },
  { id: 'cat-dividends', name: 'Dividends & Returns', icon: 'Coins', color: '#14b8a6', type: 'income' }
];

export const INITIAL_TRANSACTIONS = [];
export const INITIAL_BUDGETS = [];
export const INITIAL_GOALS = [];
export const INITIAL_NOTIFICATIONS = [];