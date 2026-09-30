import 'package:flutter/foundation.dart';
import '../models/transaction_model.dart';
import '../models/budget_model.dart';
import '../services/database_service.dart';
import '../services/sms_parser_service.dart';

class FinanceProvider with ChangeNotifier {
  final DatabaseService _db = DatabaseService.instance;

  List<TransactionModel> _transactions = [];
  List<BudgetModel> _budgets = [];
  bool _isLoading = true;
  String _selectedPeriod = 'This Month';
  DateTime _selectedCalendarDate = DateTime.now();

  List<TransactionModel> get transactions => _transactions;
  List<BudgetModel> get budgets => _budgets;
  bool get isLoading => _isLoading;
  String get selectedPeriod => _selectedPeriod;
  DateTime get selectedCalendarDate => _selectedCalendarDate;

  FinanceProvider() {
    loadInitialData();
  }

  // --- Financial Calculations ---

  double get totalBalance {
    return totalIncome - totalExpense;
  }

  double get totalIncome {
    return _transactions
        .where((t) => t.type == TransactionType.income)
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  double get totalExpense {
    return _transactions
        .where((t) => t.type == TransactionType.expense)
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  double get monthlyExpense {
    final now = DateTime.now();
    return _transactions
        .where((t) =>
            t.type == TransactionType.expense &&
            t.date.year == now.year &&
            t.date.month == now.month)
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  double get monthlyIncome {
    final now = DateTime.now();
    return _transactions
        .where((t) =>
            t.type == TransactionType.income &&
            t.date.year == now.year &&
            t.date.month == now.month)
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  Map<String, double> get categoryBreakdown {
    final Map<String, double> map = {};
    final now = DateTime.now();

    for (var tx in _transactions) {
      if (tx.type == TransactionType.expense &&
          tx.date.year == now.year &&
          tx.date.month == now.month) {
        map[tx.category] = (map[tx.category] ?? 0) + tx.amount;
      }
    }
    return map;
  }

  // Daily aggregate map for calendar day badges: 'YYYY-MM-DD' -> { 'expense': double, 'income': double }
  Map<String, Map<String, double>> get dailyTotalsMap {
    final Map<String, Map<String, double>> map = {};
    for (var tx in _transactions) {
      final key = '${tx.date.year}-${tx.date.month.toString().padLeft(2, '0')}-${tx.date.day.toString().padLeft(2, '0')}';
      if (!map.containsKey(key)) {
        map[key] = {'expense': 0.0, 'income': 0.0};
      }
      if (tx.type == TransactionType.expense) {
        map[key]!['expense'] = map[key]!['expense']! + tx.amount;
      } else {
        map[key]!['income'] = map[key]!['income']! + tx.amount;
      }
    }
    return map;
  }

  List<TransactionModel> get transactionsForSelectedDate {
    final sel = _selectedCalendarDate;
    return _transactions.where((t) {
      return t.date.year == sel.year &&
          t.date.month == sel.month &&
          t.date.day == sel.day;
    }).toList();
  }

  void setSelectedCalendarDate(DateTime date) {
    _selectedCalendarDate = date;
    notifyListeners();
  }

  void setSelectedPeriod(String period) {
    _selectedPeriod = period;
    notifyListeners();
  }

  // --- CRUD Operations ---

  Future<void> loadInitialData() async {
    _isLoading = true;
    notifyListeners();

    try {
      _transactions = await _db.getAllTransactions();

      // If empty, insert realistic initial starter records for demo
      if (_transactions.isEmpty) {
        await _seedDefaultData();
      }

      final now = DateTime.now();
      _budgets = await _db.getBudgetsForMonth(now.month, now.year);
      if (_budgets.isEmpty) {
        await _seedDefaultBudgets();
      }
    } catch (e) {
      debugPrint('Error loading initial data: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addTransaction(TransactionModel tx) async {
    await _db.insertTransaction(tx);
    _transactions.insert(0, tx);
    notifyListeners();
  }

  Future<void> deleteTransaction(String id) async {
    await _db.deleteTransaction(id);
    _transactions.removeWhere((t) => t.id == id);
    notifyListeners();
  }

  Future<void> clearAllData() async {
    await _db.clearAllTransactions();
    _transactions.clear();
    _budgets.clear();
    notifyListeners();
  }

  /// Process incoming raw SMS text and automatically record transaction
  Future<TransactionModel?> importFromSms(String smsBody, {String? sender}) async {
    final parsed = SmsParserService.parseSms(smsBody, sender: sender);
    if (parsed != null && parsed.isValid) {
      final tx = TransactionModel(
        title: parsed.merchant,
        merchant: parsed.merchant,
        amount: parsed.amount,
        type: parsed.type,
        category: parsed.category,
        date: parsed.date,
        paymentMethod: parsed.paymentMethod,
        account: parsed.account,
        isAiGenerated: true,
        rawSms: smsBody,
      );

      await addTransaction(tx);
      return tx;
    }
    return null;
  }

  // --- Seed Demo Data ---
  Future<void> _seedDefaultData() async {
    final now = DateTime.now();
    final seeds = [
      TransactionModel(
        title: 'Monthly Salary Credit',
        merchant: 'Tech Innovations Corp',
        amount: 85000,
        type: TransactionType.income,
        category: 'Salary',
        date: DateTime(now.year, now.month, 1, 9, 30),
        paymentMethod: 'Net Banking',
        account: 'A/c ••8842',
      ),
      TransactionModel(
        title: 'Swiggy Food Delivery',
        merchant: 'Swiggy',
        amount: 420,
        type: TransactionType.expense,
        category: 'Food & Dining',
        date: DateTime(now.year, now.month, now.day, 13, 15),
        paymentMethod: 'UPI',
        account: 'HDFC Bank',
      ),
      TransactionModel(
        title: 'Amazon Online Order',
        merchant: 'Amazon Retail India',
        amount: 1499,
        type: TransactionType.expense,
        category: 'Shopping',
        date: DateTime(now.year, now.month, now.day - 1, 16, 45),
        paymentMethod: 'Credit Card',
        account: 'Card ••4920',
      ),
      TransactionModel(
        title: 'HPCL Fuel Station',
        merchant: 'HPCL Auto Care',
        amount: 850,
        type: TransactionType.expense,
        category: 'Transport',
        date: DateTime(now.year, now.month, now.day - 2, 18, 00),
        paymentMethod: 'UPI',
      ),
      TransactionModel(
        title: 'Electricity Bill',
        merchant: 'State Electricity Board',
        amount: 1850,
        type: TransactionType.expense,
        category: 'Bills & Utilities',
        date: DateTime(now.year, now.month, 5, 11, 20),
        paymentMethod: 'UPI',
      ),
    ];

    for (var tx in seeds) {
      await _db.insertTransaction(tx);
    }
    _transactions = await _db.getAllTransactions();
  }

  Future<void> _seedDefaultBudgets() async {
    final now = DateTime.now();
    final defaultBudgets = [
      BudgetModel(category: 'Food & Dining', limit: 10000, spent: 420, month: now.month, year: now.year),
      BudgetModel(category: 'Shopping', limit: 15000, spent: 1499, month: now.month, year: now.year),
      BudgetModel(category: 'Bills & Utilities', limit: 6000, spent: 1850, month: now.month, year: now.year),
      BudgetModel(category: 'Transport', limit: 5000, spent: 850, month: now.month, year: now.year),
    ];

    for (var b in defaultBudgets) {
      await _db.insertOrUpdateBudget(b);
    }
    _budgets = await _db.getBudgetsForMonth(now.month, now.year);
  }
}
