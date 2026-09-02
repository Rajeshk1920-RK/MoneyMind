export const INITIAL_PROFILES = [
  { id: 'user-1', name: 'Rajesh Kumar', email: 'rajesh@example.com', avatar: 'RK', role: 'Personal Account', netBalance: 74500 },
  { id: 'user-2', name: 'Kumar Family', email: 'family@home.net', avatar: 'KF', role: 'Shared Household', netBalance: 125000 },
  { id: 'user-3', name: 'Freelance Studio', email: 'studio@creative.work', avatar: 'FS', role: 'Business / Projects', netBalance: 48200 }
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
    amount: 85000,
    category: 'Salary & Compensation',
    date: '2026-09-01',
    paymentMethod: 'Bank Transfer',
    profileId: 'user-1',
    note: 'Inflow from Google DeepMind R&D',
    tags: ['salary', 'recurring']
  },
  {
    id: 'tx-2',
    type: 'expense',
    title: 'Modern Apartment Rent',
    amount: 22000,
    category: 'Housing & Rent',
    date: '2026-09-02',
    paymentMethod: 'Net Banking',
    profileId: 'user-1',
    note: 'Paid to landlord for September',
    tags: ['rent', 'fixed']
  },
  {
    id: 'tx-3',
    type: 'expense',
    title: 'Gourmet Dinner & Swiggy',
    amount: 2450,
    category: 'Food & Dining',
    date: '2026-09-02',
    paymentMethod: 'UPI',
    profileId: 'user-1',
    note: 'Weekend family celebration',
    tags: ['dining', 'weekend']
  },
  {
    id: 'tx-4',
    type: 'expense',
    title: 'Uber Airport Ride & Metro Card',
    amount: 1200,
    category: 'Travel & Transport',
    date: '2026-09-01',
    paymentMethod: 'Credit Card',
    profileId: 'user-1',
    note: 'Client meeting transit',
    tags: ['commute']
  },
  {
    id: 'tx-5',
    type: 'income',
    title: 'Freelance UI/UX Audit',
    amount: 18000,
    category: 'Freelance & Side Income',
    date: '2026-08-28',
    paymentMethod: 'UPI',
    profileId: 'user-1',
    note: 'Completed Fintech dashboard design audit',
    tags: ['sidegig']
  },
  {
    id: 'tx-6',
    type: 'expense',
    title: 'Fibre Internet & Cloud Servers',
    amount: 1850,
    category: 'Utilities & Bills',
    date: '2026-08-27',
    paymentMethod: 'Credit Card',
    profileId: 'user-1',
    note: 'Airtel Broadband + AWS hosting',
    tags: ['utilities']
  },
  {
    id: 'tx-7',
    type: 'expense',
    title: 'Mechanical Keyboard & Desk Lamp',
    amount: 4600,
    category: 'Shopping & Electronics',
    date: '2026-08-24',
    paymentMethod: 'Credit Card',
    profileId: 'user-1',
    note: 'Keychron wireless & BenQ screenbar',
    tags: ['setup', 'shopping']
  },
  {
    id: 'tx-8',
    type: 'expense',
    title: 'Mutual Fund SIP (Index Nifty 50)',
    amount: 15000,
    category: 'Investments & Savings',
    date: '2026-08-20',
    paymentMethod: 'Auto Debit',
    profileId: 'user-1',
    note: 'Long-term equity investment',
    tags: ['investing', 'wealth']
  },
  {
    id: 'tx-9',
    type: 'expense',
    title: 'Netflix, Spotify & ChatGPT Plus',
    amount: 2890,
    category: 'Entertainment & Subs',
    date: '2026-08-18',
    paymentMethod: 'Credit Card',
    profileId: 'user-1',
    note: 'Monthly digital subscription stack',
    tags: ['subscriptions']
  },
  {
    id: 'tx-10',
    type: 'expense',
    title: 'Annual Gym Membership & Supplements',
    amount: 6500,
    category: 'Healthcare & Wellness',
    date: '2026-08-14',
    paymentMethod: 'UPI',
    profileId: 'user-1',
    note: 'Cult.fit fitness pass renewal',
    tags: ['health']
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

/* Splitwise initial groups and expenses */
export const INITIAL_SPLIT_GROUPS = [
  {
    id: 'grp-goa',
    name: 'Goa Weekend Trip',
    description: '4 friends roadtrip & beach villa vacation',
    currency: 'INR',
    members: [
      { id: 'mem-1', name: 'Rajesh (You)', avatar: 'RK' },
      { id: 'mem-2', name: 'Aman Sharma', avatar: 'AS' },
      { id: 'mem-3', name: 'Priya Patel', avatar: 'PP' },
      { id: 'mem-4', name: 'Rohan Verma', avatar: 'RV' }
    ],
    expenses: [
      {
        id: 'se-1',
        title: 'Seafood Beach Shack Feast',
        amount: 2000,
        paidBy: 'mem-1', // Rajesh paid 2000
        splitType: 'equal',
        involvedMembers: ['mem-1', 'mem-2', 'mem-3', 'mem-4'],
        date: '2026-09-01',
        category: 'Food'
      },
      {
        id: 'se-2',
        title: 'SUV Rental & Highway Tolls',
        amount: 1500,
        paidBy: 'mem-2', // Aman paid 1500
        splitType: 'equal',
        involvedMembers: ['mem-1', 'mem-2', 'mem-3', 'mem-4'],
        date: '2026-09-01',
        category: 'Travel'
      },
      {
        id: 'se-3',
        title: 'Heritage Villa Airbnb Stay',
        amount: 8000,
        paidBy: 'mem-3', // Priya paid 8000
        splitType: 'equal',
        involvedMembers: ['mem-1', 'mem-2', 'mem-3', 'mem-4'],
        date: '2026-09-02',
        category: 'Stay'
      },
      {
        id: 'se-4',
        title: 'Scuba Diving & Water Sports',
        amount: 3200,
        paidBy: 'mem-4', // Rohan paid 3200
        splitType: 'equal',
        involvedMembers: ['mem-1', 'mem-2', 'mem-3', 'mem-4'],
        date: '2026-09-02',
        category: 'Activity'
      }
    ]
  },
  {
    id: 'grp-flat',
    name: 'Flat 402 Roommates',
    description: 'Shared groceries, WiFi & cook salary',
    currency: 'INR',
    members: [
      { id: 'mem-1', name: 'Rajesh (You)', avatar: 'RK' },
      { id: 'mem-2', name: 'Aman Sharma', avatar: 'AS' }
    ],
    expenses: [
      {
        id: 'se-10',
        title: 'Monthly Organic Groceries & Milk',
        amount: 4200,
        paidBy: 'mem-1',
        splitType: 'equal',
        involvedMembers: ['mem-1', 'mem-2'],
        date: '2026-08-28',
        category: 'Groceries'
      }
    ]
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
    title: 'Splitwise Balance Update',
    message: 'Aman Sharma owes you ₹125 from the Goa Weekend Trip.',
    type: 'success',
    timestamp: '1 day ago',
    read: true
  }
];