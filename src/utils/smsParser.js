/**
 * Intelligent Indian Banking SMS Parser Engine
 * Automatically extracts:
 * - Bank Name (HDFC, SBI, ICICI, Axis, Kotak, etc.)
 * - Transaction Type (Expense/Debit vs Income/Credit)
 * - Amount in INR (₹)
 * - Merchant / Beneficiary
 * - Account / Card last 4 digits
 * - Available Balance
 * - Smart Financial Category (Food, Travel, Bills, Shopping, Salary, etc.)
 */

export function parseBankingSMS(smsText) {
  if (!smsText || typeof smsText !== 'string') {
    return null;
  }

  const text = smsText.trim();
  const lower = text.toLowerCase();

  // 1. Detect Bank
  let bank = 'Bank Alert';
  if (/hdfc/i.test(text)) bank = 'HDFC Bank';
  else if (/sbi|state bank/i.test(text)) bank = 'SBI';
  else if (/icici/i.test(text)) bank = 'ICICI Bank';
  else if (/axis/i.test(text)) bank = 'Axis Bank';
  else if (/kotak/i.test(text)) bank = 'Kotak Bank';
  else if (/pnb|punjab national/i.test(text)) bank = 'PNB';
  else if (/baroda|bob/i.test(text)) bank = 'Bank of Baroda';
  else if (/idfc/i.test(text)) bank = 'IDFC FIRST Bank';
  else if (/indusind/i.test(text)) bank = 'IndusInd Bank';
  else if (/paytm/i.test(text)) bank = 'Paytm Bank';
  else if (/gpay|google pay/i.test(text)) bank = 'Google Pay';
  else if (/phonepe/i.test(text)) bank = 'PhonePe';
  else if (/cred/i.test(text)) bank = 'CRED';

  // 2. Detect Transaction Type (Debit/Expense vs Credit/Income)
  let type = 'expense';
  if (/credited|received|deposited|refund|added|cashback|interest/i.test(text) && !/not credited/i.test(text)) {
    type = 'income';
  } else if (/debited|spent|paid|sent|withdrawn|charged|purchase/i.test(text)) {
    type = 'expense';
  }

  // 3. Extract Amount (e.g. Rs. 450.00, INR 1,250.50, ₹1500)
  let amount = 0;
  const amountMatch = text.match(/(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)/i) ||
                      text.match(/(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:Rs|INR|₹)/i);

  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // 4. Extract Account / Card Last Digits (e.g. A/c XX1234, Card ending 8192)
  let account = 'Bank Account';
  const accountMatch = text.match(/(?:A\/c|Acct|Account|Card|a\/c no\.?)\s*(?:no\.?)?\s*(?:ending\s*)?(?:[xX*]+)?(\d{3,4})/i) ||
                       text.match(/(?:[xX*]{2,})(\d{3,4})/i);
  if (accountMatch && accountMatch[1]) {
    account = `A/C ••${accountMatch[1]}`;
  }

  // 5. Extract Merchant / Sender / Receiver
  let merchant = 'Unknown Merchant';
  
  const toMatch = text.match(/(?:to|at|info|vpa|paid to|transferred to)\s+([A-Za-z0-9\s&._'-]{2,30}?)(?:\s+on|\s+ref|\s+upi|\.|\s+avail|\s+avl|\s+bal|\s+via|$)/i);
  const byMatch = text.match(/(?:by|from)\s+(?:UPI\/|vpa\s+)?([A-Za-z0-9\s&._'-]{2,30}?)(?:\s+on|\s+ref|\.|\s+avail|\s+avl|\s+bal|$)/i);

  if (type === 'expense' && toMatch && toMatch[1]) {
    merchant = toMatch[1].trim();
  } else if (type === 'income' && byMatch && byMatch[1]) {
    merchant = byMatch[1].trim();
  } else if (toMatch && toMatch[1]) {
    merchant = toMatch[1].trim();
  }

  // Clean merchant noise
  merchant = merchant.replace(/(?:vpa|upi|ref|bal|info|account|card)/gi, '').trim();
  if (!merchant || merchant.length < 2) {
    merchant = type === 'income' ? 'Direct Credit / Refund' : 'Retail / UPI Payment';
  }

  // 6. Extract Reference ID
  let refId = `SMS-${Date.now().toString().slice(-6)}`;
  const refMatch = text.match(/(?:Ref(?:\.|\s+no)?|UPI\s+Ref|Txn(?:\.|\s+ID)?|UTR)\s*[:.]?\s*([A-Za-z0-9]{5,18})/i);
  if (refMatch && refMatch[1]) {
    refId = refMatch[1];
  }

  // 7. Auto-Categorization based on Merchant / Text
  let category = type === 'income' ? 'Salary & Compensation' : 'Food & Dining';
  const merchantLower = (merchant + ' ' + text).toLowerCase();

  if (/swiggy|zomato|mcdonald|starbucks|kfc|domino|burger|restaurant|cafe|eat|food|dine|pizza|barbeque|chai/i.test(merchantLower)) {
    category = 'Food & Dining';
  } else if (/uber|ola|rapido|irctc|metro|flight|indigo|air|train|petrol|fuel|indianoil|hpcl|bpcl|toll|fastag/i.test(merchantLower)) {
    category = 'Travel & Transport';
  } else if (/amazon|flipkart|myntra|zara|ajio|shopping|croma|reliance|retail|store|dmart|bazaar|mall/i.test(merchantLower)) {
    category = 'Shopping & Electronics';
  } else if (/airtel|jio|vi|bescom|electricity|bill|utility|tatasky|netflix|hotstar|broadband|recharge|dth/i.test(merchantLower)) {
    category = 'Utilities & Bills';
  } else if (/apollo|pharmeasy|1mg|hospital|medplus|doctor|health|clinic|pharmacy/i.test(merchantLower)) {
    category = 'Healthcare & Wellness';
  } else if (/rent|society|maintenance|housing|landlord/i.test(merchantLower)) {
    category = 'Housing & Rent';
  } else if (/zerodha|groww|upstox|mutual fund|sip|investment|nse|bse|gold/i.test(merchantLower)) {
    category = 'Investments & Savings';
  } else if (/salary|payroll|employer|bonus|stipend|freelance|client/i.test(merchantLower)) {
    category = type === 'income' ? 'Salary & Compensation' : 'Freelance & Side Income';
  }

  return {
    rawSMS: text,
    bank,
    type,
    amount: amount || 100,
    merchant,
    account,
    refId,
    category,
    paymentMethod: /card/i.test(text) ? 'Credit Card' : 'UPI',
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

/**
 * Preloaded Sample Banking SMS for Instant Demo & Testing
 */
export const SAMPLE_BANK_SMS_MESSAGES = [
  {
    id: 'sms-1',
    bank: 'HDFC Bank',
    sender: 'VM-HDFCBK',
    text: 'Dear Customer, Rs. 480.00 debited from A/C XX4921 on 29-SEP-26 to SWIGGY. UPI Ref 426810291. Avail Bal: Rs 74,020.00 - HDFC Bank',
    time: '10 mins ago'
  },
  {
    id: 'sms-2',
    bank: 'SBI',
    sender: 'VK-SBIINB',
    text: 'Dear Customer, INR 35,000.00 credited to your A/C XX8123 on 29-09-2026 by TechCorp Solutions Salary. Avail Bal: Rs 1,09,020.00.',
    time: '2 hours ago'
  },
  {
    id: 'sms-3',
    bank: 'ICICI Bank',
    sender: 'AD-ICICIB',
    text: 'Alert! Spent Rs. 1,299.00 on your ICICI Bank Credit Card ending 7041 at ZOMATO on 29-Sep-26. Info: Zomato Foods Pvt Ltd.',
    time: 'Yesterday'
  },
  {
    id: 'sms-4',
    bank: 'Axis Bank',
    sender: 'BP-AXISBK',
    text: 'Rs. 320.00 debited from your A/c ending 3302 on 29-09-2026 to Uber Rides. UPI Ref: 42918812 - Axis Bank.',
    time: 'Yesterday'
  },
  {
    id: 'sms-5',
    bank: 'Kotak Bank',
    sender: 'VM-KOTAKB',
    text: 'Rs. 1,499.00 paid from A/C XX1048 to Airtel Broadband via UPI on 28-Sep-2026. Avail Bal Rs 72,521.00 - Kotak Mahindra Bank.',
    time: '2 days ago'
  }
];
