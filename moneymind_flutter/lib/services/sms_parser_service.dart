import '../models/transaction_model.dart';

class ParsedSmsResult {
  final double amount;
  final TransactionType type;
  final String merchant;
  final String category;
  final String? account;
  final String paymentMethod;
  final String? referenceNo;
  final DateTime date;
  final bool isValid;

  ParsedSmsResult({
    required this.amount,
    required this.type,
    required this.merchant,
    required this.category,
    this.account,
    required this.paymentMethod,
    this.referenceNo,
    required this.date,
    required this.isValid,
  });
}

class SmsParserService {
  /// Automatic category predictor based on merchant name or SMS text
  static String predictCategory(String merchant, String body) {
    final text = '$merchant $body'.toLowerCase();

    if (text.contains('swiggy') ||
        text.contains('zomato') ||
        text.contains('mcdonald') ||
        text.contains('starbucks') ||
        text.contains('dominos') ||
        text.contains('kfc') ||
        text.contains('restaurant') ||
        text.contains('cafe') ||
        text.contains('food') ||
        text.contains('dhaba') ||
        text.contains('blinkit') ||
        text.contains('zepto') ||
        text.contains('instamart') ||
        text.contains('grocer')) {
      return 'Food & Dining';
    }

    if (text.contains('amazon') ||
        text.contains('flipkart') ||
        text.contains('myntra') ||
        text.contains('ajio') ||
        text.contains('zara') ||
        text.contains('h&m') ||
        text.contains('mall') ||
        text.contains('retail') ||
        text.contains('store') ||
        text.contains('shop')) {
      return 'Shopping';
    }

    if (text.contains('uber') ||
        text.contains('ola') ||
        text.contains('rapido') ||
        text.contains('petrol') ||
        text.contains('fuel') ||
        text.contains('hpcl') ||
        text.contains('bpcl') ||
        text.contains('ioc') ||
        text.contains('metro') ||
        text.contains('irctc') ||
        text.contains('flight') ||
        text.contains('indigo')) {
      return 'Transport';
    }

    if (text.contains('electricity') ||
        text.contains('bescom') ||
        text.contains('tneb') ||
        text.contains('water') ||
        text.contains('gas') ||
        text.contains('wifi') ||
        text.contains('airtel') ||
        text.contains('jio') ||
        text.contains('vi ') ||
        text.contains('broadband') ||
        text.contains('recharge') ||
        text.contains('bill')) {
      return 'Bills & Utilities';
    }

    if (text.contains('netflix') ||
        text.contains('spotify') ||
        text.contains('prime') ||
        text.contains('hotstar') ||
        text.contains('cinema') ||
        text.contains('pvr') ||
        text.contains('inox') ||
        text.contains('bookmyshow') ||
        text.contains('movie') ||
        text.contains('game') ||
        text.contains('steam')) {
      return 'Entertainment';
    }

    if (text.contains('salary') ||
        text.contains('payroll') ||
        text.contains('stipend') ||
        text.contains('dividend') ||
        text.contains('bonus') ||
        text.contains('interest')) {
      return 'Salary';
    }

    if (text.contains('zerodha') ||
        text.contains('groww') ||
        text.contains('upstox') ||
        text.contains('mf') ||
        text.contains('mutual fund') ||
        text.contains('sip') ||
        text.contains('coin') ||
        text.contains('crypto') ||
        text.contains('shares')) {
      return 'Investments';
    }

    if (text.contains('pharmacy') ||
        text.contains('apollo') ||
        text.contains('1mg') ||
        text.contains('hospital') ||
        text.contains('doctor') ||
        text.contains('clinic') ||
        text.contains('medplus') ||
        text.contains('health')) {
      return 'Health & Medical';
    }

    return 'General & Other';
  }

  /// Parse incoming SMS body text
  static ParsedSmsResult? parseSms(String body, {String? sender, DateTime? timestamp}) {
    if (body.isEmpty) return null;

    final lower = body.toLowerCase();

    // Verify financial keyword presence
    final isDebit = lower.contains('debited') ||
        lower.contains('spent') ||
        lower.contains('paid') ||
        lower.contains('sent to') ||
        lower.contains('withdrawn') ||
        lower.contains('purchase of');

    final isCredit = lower.contains('credited') ||
        lower.contains('received') ||
        lower.contains('deposited') ||
        lower.contains('refund of');

    if (!isDebit && !isCredit) {
      // Not a clear transactional SMS
      return null;
    }

    // 1. Extract Amount: e.g. Rs. 500, Rs.500.00, INR 1,200.50, INR 450
    final amountRegex = RegExp(r'(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)', caseSensitive: false);
    final amountMatch = amountRegex.firstMatch(body);

    if (amountMatch == null) return null;

    final amountStr = amountMatch.group(1)?.replaceAll(',', '') ?? '0';
    final amount = double.tryParse(amountStr);
    if (amount == null || amount <= 0) return null;

    // 2. Extract Merchant / Beneficiary
    String merchant = 'Bank Transaction';
    final merchantRegex = RegExp(
      r'(?:to|at|info\/|vpa|paid to|sent to)\s+([A-Za-z0-9\.\@\s\-\_]+?)(?:\s+(?:on|using|via|ref|bal|avl|avail|ending|a\/c|acct|\.)|$)',
      caseSensitive: false,
    );
    final merchantMatch = merchantRegex.firstMatch(body);
    if (merchantMatch != null && merchantMatch.group(1) != null) {
      merchant = merchantMatch.group(1)!.trim();
      if (merchant.length > 30) {
        merchant = merchant.substring(0, 30);
      }
    }

    // Clean merchant name
    merchant = merchant.replaceAll(RegExp(r'[\.\,\:\;]+$'), '').trim();
    if (merchant.isEmpty || merchant.toLowerCase() == 'a/c' || merchant.toLowerCase() == 'vpa') {
      merchant = isDebit ? 'Debit Expense' : 'Account Credit';
    }

    // 3. Extract Account Mask: e.g. a/c XX1234, card ending 4321
    String? account;
    final accountRegex = RegExp(r'(?:a\/c|acct|card|ending|xx)\s*[\*xX]*(\d{3,4})', caseSensitive: false);
    final accountMatch = accountRegex.firstMatch(body);
    if (accountMatch != null) {
      account = 'A/c ••${accountMatch.group(1)}';
    }

    // 4. Payment Mode
    String paymentMethod = 'UPI';
    if (lower.contains('card') || lower.contains('pos') || lower.contains('ending')) {
      paymentMethod = lower.contains('credit') ? 'Credit Card' : 'Debit Card';
    } else if (lower.contains('atm') || lower.contains('cash')) {
      paymentMethod = 'Cash / ATM';
    } else if (lower.contains('netbanking') || lower.contains('neft') || lower.contains('imps') || lower.contains('rtgs')) {
      paymentMethod = 'Net Banking';
    }

    // 5. Predict Category
    final category = isCredit ? 'Salary' : predictCategory(merchant, body);

    return ParsedSmsResult(
      amount: amount,
      type: isCredit ? TransactionType.income : TransactionType.expense,
      merchant: merchant,
      category: category,
      account: account,
      paymentMethod: paymentMethod,
      date: timestamp ?? DateTime.now(),
      isValid: true,
    );
  }
}
