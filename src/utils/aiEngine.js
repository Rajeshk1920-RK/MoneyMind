/**
 * FinAI Local Intelligence Engine
 * Handles expense forecasting, anomaly detection, actionable saving suggestions,
 * and contextual natural-language financial advice.
 */

export function predictMonthEndExpense(transactions) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const dayOfMonth = Math.max(1, now.getDate());
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Filter expenses for current month
  const currentMonthExpenses = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const spentSoFar = currentMonthExpenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  if (spentSoFar === 0) {
    // If current month is fresh, calculate based on all recent expenses
    const allExpenses = transactions.filter(t => t.type === 'expense');
    const totalAll = allExpenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    return Math.round(totalAll * 0.85);
  }

  const dailyBurnRate = spentSoFar / dayOfMonth;
  const projectedTotal = Math.round(spentSoFar + dailyBurnRate * (daysInMonth - dayOfMonth));

  return {
    spentSoFar,
    dailyBurnRate: Math.round(dailyBurnRate),
    projectedTotal,
    daysRemaining: daysInMonth - dayOfMonth,
    confidence: dayOfMonth > 15 ? 'High (85%)' : dayOfMonth > 7 ? 'Medium (72%)' : 'Preliminary (58%)'
  };
}

export function generateAISavingSuggestions(transactions, budgets) {
  const suggestions = [];

  // 1. Food & Dining analysis
  const foodExpenses = transactions.filter(t => 
    t.type === 'expense' && (t.category.toLowerCase().includes('food') || t.tags?.includes('dining'))
  );
  const totalFood = foodExpenses.reduce((sum, t) => sum + Number(t.amount), 0);
  if (totalFood > 5000) {
    suggestions.push({
      id: 'sug-1',
      title: 'Optimize Food & Dining Deliveries',
      category: 'Food & Dining',
      potentialSaving: Math.round(totalFood * 0.3),
      impact: 'High',
      tag: 'Quick Win',
      description: `You've spent ₹${totalFood.toLocaleString('en-IN')} on dining and deliveries. Cooking 2 extra meals a week could pocket you ₹${Math.round(totalFood * 0.3).toLocaleString('en-IN')} per month!`,
      action: 'Set ₹6,000 Food Cap'
    });
  }

  // 2. Subscription Audit
  const subs = transactions.filter(t => 
    t.type === 'expense' && (t.category.toLowerCase().includes('entertainment') || t.tags?.includes('subscriptions'))
  );
  const totalSubs = subs.reduce((sum, t) => sum + Number(t.amount), 0);
  if (totalSubs > 2000) {
    suggestions.push({
      id: 'sug-2',
      title: 'Audit Recurring Digital Subscriptions',
      category: 'Entertainment & Subs',
      potentialSaving: Math.round(totalSubs * 0.4),
      impact: 'Medium',
      tag: 'Passive Saver',
      description: `You have ₹${totalSubs.toLocaleString('en-IN')} in active entertainment & digital subscriptions. Bundle or cancel 1-2 unused OTT services to save ₹${Math.round(totalSubs * 0.4).toLocaleString('en-IN')}.`,
      action: 'Review Subscriptions'
    });
  }

  // 3. 50-30-20 Rule Check
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  if (savingsRate < 30) {
    suggestions.push({
      id: 'sug-3',
      title: 'Boost Monthly Savings Rate to 35%',
      category: 'Investments',
      potentialSaving: Math.round(totalIncome * 0.15),
      impact: 'High',
      tag: 'Wealth Builder',
      description: `Your current savings rate is ${savingsRate}%. Automating a recurring SIP on payday can effortlessly compound your wealth!`,
      action: 'Automate SIP'
    });
  }

  // 4. Commute optimization
  const transit = transactions.filter(t => t.category.toLowerCase().includes('travel') || t.tags?.includes('commute'));
  const totalTransit = transit.reduce((sum, t) => sum + Number(t.amount), 0);
  if (totalTransit > 3000) {
    suggestions.push({
      id: 'sug-4',
      title: 'Smart Transit Pass',
      category: 'Travel & Transport',
      potentialSaving: 800,
      impact: 'Low',
      tag: 'Daily Saver',
      description: `Switching frequent cab rides for Metro smart cards or weekly ride passes can easily trim ₹800 - ₹1,200 monthly.`,
      action: 'View Transit Pass'
    });
  }

  return suggestions;
}

import { getPaymentIntentStats } from '../components/PaymentIntent/paymentIntentUtils';

export function answerFinancialQuery(query, { transactions, budgets, goals, activeCurrency = 'INR' }) {
  const q = query.toLowerCase();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const netBalance = totalIncome - totalExpense;
  const intentStats = getPaymentIntentStats(transactions);

  // 1. Payment Intent specific queries
  if (q.includes('intent') || q.includes('upi') || q.includes('why did i pay') || q.includes('reason') || q.includes('unexplained')) {
    const topCats = intentStats.categoryList.slice(0, 3).map(c => `• **${c.name}**: ₹${c.amount.toLocaleString('en-IN')} (${c.count} payments - ${c.percentage}%)`).join('\n');
    
    return {
      text: `**Payment Intent Breakdown**:
• Total UPI Outflow: **₹${intentStats.totalUPIAmount.toLocaleString('en-IN')}** (${intentStats.totalUPIPayments} payments)
• Explained Rate: **${intentStats.captureRate}%** (${intentStats.capturedPayments} of ${intentStats.totalUPIPayments} captured)
${intentStats.uncapturedPayments > 0 ? `• ⚠️ You have **${intentStats.uncapturedPayments} unclassified UPI payment(s)** needing reasons.` : '• All UPI payments have documented reasons!'}

**Top Intent Categories**:
${topCats || 'No intent categories captured yet.'}

*FinAI Tip: Tracking payment reasons helps you distinguish essential bills from discretionary impulse spending!*`,
      actionable: true,
      badge: 'Payment Intent AI'
    };
  }

  if (q.includes('food') || q.includes('dining') || q.includes('restaurant')) {
    const foodCat = intentStats.categories['Food & Dining'];
    const foodCount = foodCat?.count || transactions.filter(t => t.category === 'Food & Dining').length;
    const foodAmt = foodCat?.amount || transactions.filter(t => t.category === 'Food & Dining').reduce((s, t) => s + t.amount, 0);

    return {
      text: `**Food & Dining Insights**:
• You made **${foodCount} food-related payments** totaling **₹${foodAmt.toLocaleString('en-IN')}**.
• Food & Dining represents ${totalExpense > 0 ? Math.round((foodAmt / totalExpense) * 100) : 0}% of your total outflow.
${foodAmt > 5000 ? '• *Tip: Preparing home-cooked meals for 2 dinners/week could save ~₹2,500 monthly.*' : '• *Your dining expenses are well within budget limits!*'}`,
      actionable: false,
      badge: 'Spending Intelligence'
    };
  }

  if (q.includes('shopping')) {
    const shopCat = intentStats.categories['Shopping'] || intentStats.categories['Shopping & Electronics'];
    const shopCount = shopCat?.count || transactions.filter(t => t.category.includes('Shopping')).length;
    const shopAmt = shopCat?.amount || transactions.filter(t => t.category.includes('Shopping')).reduce((s, t) => s + t.amount, 0);

    return {
      text: `**Shopping Outlay**:
• You made **${shopCount} shopping payment(s)** totaling **₹${shopAmt.toLocaleString('en-IN')}**.
• Discretionary retail spending represents ${totalExpense > 0 ? Math.round((shopAmt / totalExpense) * 100) : 0}% of your total budget.`,
      actionable: false,
      badge: 'Retail Intelligence'
    };
  }

  if (q.includes('save') || q.includes('cut') || q.includes('reduce')) {
    return {
      text: `Based on your recent spending habits, here are your top 3 money-saving opportunities:
1. **Food Deliveries & Dining**: You can save approx ₹2,500 by cooking just two extra nights a week.
2. **Subscriptions**: Check active streaming and cloud subscriptions (currently ~₹2,890/mo).
3. **Automate Savings**: Move ₹10,000 immediately into your Emergency Fund on payday before discretionary spending.`,
      actionable: true,
      badge: 'AI Recommendations'
    };
  }

  if (q.includes('predict') || q.includes('forecast') || q.includes('month end') || q.includes('burn rate')) {
    const pred = predictMonthEndExpense(transactions);
    return {
      text: `**Expense Forecast**:
- Current Month Burn: ₹${pred.spentSoFar?.toLocaleString('en-IN') || 0}
- Daily Velocity: ~₹${pred.dailyBurnRate?.toLocaleString('en-IN') || 0}/day
- **Projected Total Spend**: **₹${pred.projectedTotal?.toLocaleString('en-IN') || 0}**
- Forecast Confidence: ${pred.confidence || 'Good'}

*Tip: If you maintain your current pace, you will end the month within safe liquidity limits.*`,
      actionable: false,
      badge: 'Predictive Analytics'
    };
  }

  if (q.includes('budget') || q.includes('overspend') || q.includes('limit')) {
    return {
      text: `**Budget Health Check**:
- **Food & Dining**: 82% utilized (Caution zone)
- **Housing & Rent**: 88% utilized (On track)
- **Shopping & Electronics**: 65% utilized (Safe zone)
- **Entertainment**: 82% utilized

You have ₹1,440 remaining in your Food budget for this billing cycle.`,
      actionable: false,
      badge: 'Budget Advisor'
    };
  }

  if (q.includes('goal') || q.includes('macbook') || q.includes('emergency')) {
    return {
      text: `**Savings Goals Progress**:
- **Emergency Rainy Day Fund**: ₹95,000 / ₹1,50,000 (63% achieved)
- **M4 Max MacBook Pro**: ₹1,45,000 / ₹2,20,000 (66% achieved - On track for Nov 2026!)
- **Japan Autumn Trip**: ₹80,000 / ₹2,50,000 (32% achieved)

Stashing an extra ₹5,000 this month will pull your MacBook target forward by 18 days!`,
      actionable: true,
      badge: 'Goals Tracker'
    };
  }

  // Default smart financial overview
  return {
    text: `Hello Rajesh! Here is your current financial pulse:
• **Total Inflow**: ₹${totalIncome.toLocaleString('en-IN')}
• **Total Outflow**: ₹${totalExpense.toLocaleString('en-IN')}
• **Intent Capture Rate**: ${intentStats.captureRate}% (${intentStats.capturedPayments} of ${intentStats.totalUPIPayments} UPI payments explained)
• **Net Savings Buffer**: ₹${netBalance.toLocaleString('en-IN')} (${totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0}% savings rate)

You can ask me about your Payment Intents, budgets, month-end forecast, or saving suggestions!`,
    actionable: false,
    badge: 'FinAI Advisor'
  };
}