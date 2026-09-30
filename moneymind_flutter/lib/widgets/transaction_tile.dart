import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/transaction_model.dart';
import '../constants/app_colors.dart';
import '../utils/formatters.dart';

class TransactionTile extends StatelessWidget {
  final TransactionModel transaction;
  final VoidCallback? onDelete;
  final VoidCallback? onTap;

  const TransactionTile({
    super.key,
    required this.transaction,
    this.onDelete,
    this.onTap,
  });

  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'food & dining':
      case 'food':
        return LucideIcons.utensils;
      case 'shopping':
        return LucideIcons.shoppingBag;
      case 'transport':
      case 'fuel':
        return LucideIcons.car;
      case 'bills & utilities':
        return LucideIcons.zap;
      case 'entertainment':
        return LucideIcons.film;
      case 'salary':
        return LucideIcons.wallet;
      case 'investments':
      case 'investment':
        return LucideIcons.trendingUp;
      case 'health & medical':
        return LucideIcons.activity;
      default:
        return LucideIcons.creditCard;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isIncome = transaction.type == TransactionType.income;
    final catColor = AppColors.getCategoryColor(transaction.category);

    return Dismissible(
      key: Key(transaction.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: Colors.red.shade400,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Icon(LucideIcons.trash2, color: Colors.white, size: 22),
      ),
      onDismissed: (_) {
        onDelete?.call();
      },
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          margin: const EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border, width: 1),
          ),
          child: Row(
            children: [
              // Category Icon Avatar
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: catColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  _getCategoryIcon(transaction.category),
                  color: catColor,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),

              // Title, Category & Payment Mode
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      transaction.merchant ?? transaction.title,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                        color: AppColors.textPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextEscape.ellipsis,
                    ),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        Text(
                          transaction.category,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        if (transaction.paymentMethod.isNotEmpty) ...[
                          const SizedBox(width: 4),
                          const Text('•', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
                          const SizedBox(width: 4),
                          Text(
                            transaction.paymentMethod,
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                        if (transaction.isAiGenerated) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                            decoration: BoxDecoration(
                              color: AppColors.secondarySurface,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'SMS AI',
                              style: TextStyle(
                                fontSize: 9,
                                color: AppColors.secondary,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),

              // Amount & Date
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '${isIncome ? '+' : '-'}${Formatters.formatCurrency(transaction.amount)}',
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 15,
                      color: isIncome ? AppColors.income : AppColors.expense,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    Formatters.formatDate(transaction.date),
                    style: const TextStyle(
                      fontSize: 11,
                      color: AppColors.textMuted,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
