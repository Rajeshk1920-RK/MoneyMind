import 'package:uuid/uuid.dart';

enum TransactionType { expense, income }

class TransactionModel {
  final String id;
  final String title;
  final String? merchant;
  final double amount;
  final TransactionType type;
  final String category;
  final DateTime date;
  final String paymentMethod; // UPI, Credit Card, Debit Card, Cash, Net Banking
  final String? account; // e.g. HDFC **1234
  final String? intentCategory; // Need, Want, Investment, Debt
  final bool isAiGenerated;
  final String? rawSms;
  final String? notes;

  TransactionModel({
    String? id,
    required this.title,
    this.merchant,
    required this.amount,
    required this.type,
    required this.category,
    required this.date,
    this.paymentMethod = 'UPI',
    this.account,
    this.intentCategory = 'Need',
    this.isAiGenerated = false,
    this.rawSms,
    this.notes,
  }) : id = id ?? const Uuid().v4();

  // JSON Serialization
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'merchant': merchant ?? title,
      'amount': amount,
      'type': type == TransactionType.income ? 'income' : 'expense',
      'category': category,
      'date': date.toIso8601String(),
      'paymentMethod': paymentMethod,
      'account': account,
      'intentCategory': intentCategory,
      'isAiGenerated': isAiGenerated ? 1 : 0,
      'rawSms': rawSms,
      'notes': notes,
    };
  }

  factory TransactionModel.fromMap(Map<String, dynamic> map) {
    return TransactionModel(
      id: map['id']?.toString(),
      title: map['title'] ?? 'Untitled Transaction',
      merchant: map['merchant'],
      amount: (map['amount'] is num) ? (map['amount'] as num).toDouble() : double.tryParse(map['amount']?.toString() ?? '0') ?? 0.0,
      type: map['type'] == 'income' ? TransactionType.income : TransactionType.expense,
      category: map['category'] ?? 'Other',
      date: map['date'] != null ? DateTime.tryParse(map['date'].toString()) ?? DateTime.now() : DateTime.now(),
      paymentMethod: map['paymentMethod'] ?? 'UPI',
      account: map['account'],
      intentCategory: map['intentCategory'] ?? 'Need',
      isAiGenerated: map['isAiGenerated'] == 1 || map['isAiGenerated'] == true,
      rawSms: map['rawSms'],
      notes: map['notes'],
    );
  }

  TransactionModel copyWith({
    String? title,
    String? merchant,
    double? amount,
    TransactionType? type,
    String? category,
    DateTime? date,
    String? paymentMethod,
    String? account,
    String? intentCategory,
    bool? isAiGenerated,
    String? rawSms,
    String? notes,
  }) {
    return TransactionModel(
      id: id,
      title: title ?? this.title,
      merchant: merchant ?? this.merchant,
      amount: amount ?? this.amount,
      type: type ?? this.type,
      category: category ?? this.category,
      date: date ?? this.date,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      account: account ?? this.account,
      intentCategory: intentCategory ?? this.intentCategory,
      isAiGenerated: isAiGenerated ?? this.isAiGenerated,
      rawSms: rawSms ?? this.rawSms,
      notes: notes ?? this.notes,
    );
  }
}
