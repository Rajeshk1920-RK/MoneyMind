import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/transaction_model.dart';
import '../models/budget_model.dart';

class DatabaseService {
  static final DatabaseService instance = DatabaseService._init();
  static Database? _database;

  DatabaseService._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('moneymind_local.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future<void> _createDB(Database db, int version) async {
    // 1. Transactions Table
    await db.execute('''
      CREATE TABLE transactions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        merchant TEXT,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        paymentMethod TEXT,
        account TEXT,
        intentCategory TEXT,
        isAiGenerated INTEGER DEFAULT 0,
        rawSms TEXT,
        notes TEXT
      )
    ''');

    // 2. Budgets Table
    await db.execute('''
      CREATE TABLE budgets (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        limit_amount REAL NOT NULL,
        spent REAL DEFAULT 0,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        colorHex TEXT
      )
    ''');

    // 3. SMS Log Table
    await db.execute('''
      CREATE TABLE sms_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT,
        body TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        isParsed INTEGER DEFAULT 0,
        transactionId TEXT
      )
    ''');
  }

  // --- Transactions Operations ---

  Future<int> insertTransaction(TransactionModel tx) async {
    final db = await instance.database;
    return await db.insert(
      'transactions',
      tx.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<TransactionModel>> getAllTransactions() async {
    final db = await instance.database;
    final result = await db.query('transactions', orderBy: 'date DESC');
    return result.map((json) => TransactionModel.fromMap(json)).toList();
  }

  Future<int> deleteTransaction(String id) async {
    final db = await instance.database;
    return await db.delete('transactions', where: 'id = ?', whereArgs: [id]);
  }

  Future<int> clearAllTransactions() async {
    final db = await instance.database;
    return await db.delete('transactions');
  }

  // --- Budgets Operations ---

  Future<int> insertOrUpdateBudget(BudgetModel budget) async {
    final db = await instance.database;
    return await db.insert(
      'budgets',
      budget.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<BudgetModel>> getBudgetsForMonth(int month, int year) async {
    final db = await instance.database;
    final result = await db.query(
      'budgets',
      where: 'month = ? AND year = ?',
      whereArgs: [month, year],
    );
    return result.map((json) => BudgetModel.fromMap(json)).toList();
  }

  Future<void> close() async {
    final db = await instance.database;
    db.close();
  }
}
