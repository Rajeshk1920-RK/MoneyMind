import 'package:uuid/uuid.dart';

class BudgetModel {
  final String id;
  final String category;
  final double limit;
  final double spent;
  final int month;
  final int year;
  final String? colorHex;

  BudgetModel({
    String? id,
    required this.category,
    required this.limit,
    this.spent = 0.0,
    required this.month,
    required this.year,
    this.colorHex,
  }) : id = id ?? const Uuid().v4();

  double get remaining => (limit - spent) > 0 ? (limit - spent) : 0;
  double get percentage => limit > 0 ? ((spent / limit) * 100).clamp(0.0, 100.0) : 0.0;
  bool get isOverBudget => spent > limit;

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'category': category,
      'limit_amount': limit,
      'spent': spent,
      'month': month,
      'year': year,
      'colorHex': colorHex,
    };
  }

  factory BudgetModel.fromMap(Map<String, dynamic> map) {
    return BudgetModel(
      id: map['id']?.toString(),
      category: map['category'] ?? 'Other',
      limit: (map['limit_amount'] ?? map['limit'] is num) ? (map['limit_amount'] ?? map['limit'] as num).toDouble() : 0.0,
      spent: (map['spent'] is num) ? (map['spent'] as num).toDouble() : 0.0,
      month: map['month'] ?? DateTime.now().month,
      year: map['year'] ?? DateTime.now().year,
      colorHex: map['colorHex'],
    );
  }

  BudgetModel copyWith({
    double? limit,
    double? spent,
    int? month,
    int? year,
    String? colorHex,
  }) {
    return BudgetModel(
      id: id,
      category: category,
      limit: limit ?? this.limit,
      spent: spent ?? this.spent,
      month: month ?? this.month,
      year: year ?? this.year,
      colorHex: colorHex ?? this.colorHex,
    );
  }
}
