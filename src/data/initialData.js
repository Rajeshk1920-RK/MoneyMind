export const INITIAL_PROFILES = [
  { id: 'user-1', name: 'Rajesh Kumar', email: 'rajesh.kumar@moneymind.in', avatar: 'RK', role: 'Personal Account', upiId: 'rajesh@okhdfcbank', netBalance: 74500 }
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

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'income',
    title: 'Monthly Tech Salary',
    merchant: 'Google DeepMind R&D',
    amount: 85000,
    category: 'Salary & Compensation',
    date: '2026-09-01',
    paymentMethod: 'Bank Transfer',
    profileId: 'user-1',
    note: 'Inflow from Google DeepMind R&D',
    tags: ['salary', 'recurring'],
    intentCaptured: false,
    source: 'bank_direct'
  },
  {
    id: 'tx-2',
    type: 'expense',
    title: 'Modern Apartment Rent',
    merchant: 'Skyline Properties',
    amount: 22000,
    category: 'Housing & Rent',
    date: '2026-09-02',
    paymentMethod: 'Net Banking',
    profileId: 'user-1',
    note: 'Paid to landlord for September',
    tags: ['rent', 'fixed'],
    intentCategory: 'Bills & Utilities',
    intentNote: 'Monthly home lease',
    intentFor: 'Myself',
    intentCaptured: true,
    source: 'manual'
  },
  {
    id: 'tx-3',
    type: 'expense',
    title: 'Gourmet Dinner & Swiggy',
    merchant: 'ABC Restaurant',
    amount: 2450,
    category: 'Food & Dining',
    date: '2026-09-02',
    paymentMethod: 'UPI',
    profileId: 'user-1',
    note: 'Weekend family celebration',
    tags: ['dining', 'weekend'],
    intentCategory: 'Food & Dining',
    intentNote: 'Dinner with friends',
    intentFor: 'Friends',
    intentCaptured: true,
    source: 'simulated_upi',
    paymentStatus: 'success'
  },
  {
    id: 'tx-4',
    type: 'expense',
    title: 'Uber Airport Ride & Metro Card',
    merchant: 'Uber Rides India',
    amount: 1200,
    category: 'Travel & Transport',
    date: '2026-09-01',
    paymentMethod: 'UPI',
    profileId: 'user-1',
    note: 'Client meeting transit',
    tags: ['commute'],
    intentCategory: 'Travel',
    intentNote: 'Airport cab to client office',
    intentFor: 'Work / Client',
    intentCaptured: true,
    source: 'simulated_upi',
    paymentStatus: 'success'
  },
  {
    id: 'tx-5',
    type: 'income',
    title: 'Freelance UI/UX Audit',
    merchant: 'Fintech Studio Client',
    amount: 18000,
    category: 'Freelance & Side Income',
    date: '2026-08-28',
    paymentMethod: 'UPI',
    profileId: 'user-1',
    note: 'Completed Fintech dashboard design audit',
    tags: ['sidegig'],
    intentCaptured: false,
    source: 'simulated_upi'
  },
  {
    id: 'tx-6',
    type: 'expense',
    title: 'Fibre Internet & Cloud Servers',
    merchant: 'Airtel Broadband',
    amount: 1850,
    category: 'Utilities & Bills',
    date: '2026-08-27',
    paymentMethod: 'UPI',
    profileId: 'user-1',
    note: 'Airtel Broadband + AWS hosting',
    tags: ['utilities'],
    intentCategory: 'Bills & Utilities',
    intentNote: 'Home fiber WiFi and AWS hosting',
    intentFor: 'Myself',
    intentCaptured: true,
    source: 'simulated_upi',
    paymentStatus: 'success'
  },
  {
    id: 'tx-7',
    type: 'expense',
    title: 'Mechanical Keyboard & Desk Lamp',
    merchant: 'Keychron India',
    amount: 4600,
    category: 'Shopping & Electronics',
    date: '2026-08-24',
    paymentMethod: 'UPI',
    profileId: 'user-1',
    note: 'Keychron wireless & BenQ screenbar',
    tags: ['setup', 'shopping'],
    intentCategory: 'Shopping',
    intentNote: 'Desk productivity upgrade',
    intentFor: 'Myself',
    intentCaptured: true,
    source: 'simulated_upi',
    paymentStatus: 'success'
  },
  {
    id: 'tx-8',
    type: 'expense',
    title: 'Mutual Fund SIP (Index Nifty 50)',
    merchant: 'Groww Mutual Funds',
    amount: 15000,
    category: 'Investments & Savings',
    date: '2026-08-20',
    paymentMethod: 'Auto Debit',
    profileId: 'user-1',
    note: 'Long-term equity investment',
    tags: ['investing', 'wealth'],
    intentCategory: 'Investment',
    intentNote: 'Monthly index SIP',
    intentFor: 'Myself',
    intentCaptured: true,
    source: 'bank_direct'
  },
  {
    id: 'tx-9',
    type: 'expense',
    title: 'Netflix, Spotify & ChatGPT Plus',
    merchant: 'Digital Subscriptions',
    amount: 2890,
    category: 'Entertainment & Subs',
    date: '2026-08-18',
    paymentMethod: 'UPI',
    profileId: 'user-1',
    note: 'Monthly digital subscription stack',
    tags: ['subscriptions'],
    intentCategory: 'Entertainment',
    intentNote: 'Family streaming bundle',
    intentFor: 'Family',
    intentCaptured: true,
    source: 'simulated_upi',
    paymentStatus: 'success'
  },
  {
    id: 'tx-10',
    type: 'expense',
    title: 'Annual Gym Membership & Supplements',
    merchant: 'Cult.fit Fitness',
    amount: 6500,
    category: 'Healthcare & Wellness',
    date: '2026-08-14',
    paymentMethod: 'UPI',
    profileId: 'user-1',
    note: 'Cult.fit fitness pass renewal',
    tags: ['health'],
    intentCategory: 'Fitness',
    intentNote: 'Gym pass renewal',
    intentFor: 'Myself',
    intentCaptured: true,
    source: 'simulated_upi',
    paymentStatus: 'success'
  },
  {
    id: 'tx-11',
    type: 'expense',
    title: 'Corner Supermarket Grocery Store',
    merchant: 'Nature Basket',
    amount: 1420,
    category: 'Food & Dining',
    date: '2026-09-03',
    paymentMethod: 'UPI',
    profileId: 'user-1',
    note: 'Quick QR scan at checkout',
    tags: ['groceries'],
    intentCategory: null,
    intentNote: '',
    intentFor: '',
    intentCaptured: false,
    source: 'simulated_upi',
    paymentStatus: 'success'
  }
];

export const INITIAL_BUDGETS = [
  { id: 'b-1', category: 'Food & Dining', monthlyLimit: 8000, alertThreshold: 80 },
  { id: 'b-2', category: 'Travel & Transport', monthlyLimit: 5000, alertThreshold: 75 },
  { id: 'b-3', category: 'Shopping & Electronics', monthlyLimit: 7000, alertThreshold: 85 },
  { id: 'b-4', category: 'Entertainment & Subs', monthlyLimit: 3500, alertThreshold: 90 },
  { id: 'b-5', category: 'Housing & Rent', monthlyLimit: 25000, alertThreshold: 100 }
];

export const INITIAL_GOALS = [
  {
    id: 'g-1',
    title: 'Emergency Rainy Day Fund',
    targetAmount: 150000,
    currentAmount: 95000,
    targetDate: '2026-12-31',
    category: 'Safety Net',
    color: '#10b981'
  },
  {
    id: 'g-2',
    title: 'New M4 Max MacBook Pro',
    targetAmount: 220000,
    currentAmount: 145000,
    targetDate: '2026-11-15',
    category: 'Gadgets',
    color: '#6366f1'
  },
  {
    id: 'g-3',
    title: 'Japan Autumn Trip 2027',
    targetAmount: 250000,
    currentAmount: 80000,
    targetDate: '2027-10-01',
    category: 'Travel',
    color: '#ec4899'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Budget Alert: Food & Dining',
    message: 'You have utilized 82% of your monthly food budget (₹6,560 / ₹8,000).',
    type: 'warning',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'AI Smart Tip',
    message: 'Cutting down 2 food deliveries per week can save you ~₹3,200 this month!',
    type: 'info',
    timestamp: '5 hours ago',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Goal Milestone Achieved',
    message: 'You have reached 66% of your M4 Max MacBook Pro savings target!',
    type: 'success',
    timestamp: '1 day ago',
    read: true
  }
];