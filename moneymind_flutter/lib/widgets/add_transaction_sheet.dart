import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/transaction_model.dart';
import '../providers/finance_provider.dart';
import '../constants/app_colors.dart';

class AddTransactionSheet extends StatefulWidget {
  final TransactionType initialType;

  const AddTransactionSheet({
    super.key,
    this.initialType = TransactionType.expense,
  });

  @override
  State<AddTransactionSheet> createState() => _AddTransactionSheetState();
}

class _AddTransactionSheetState extends State<AddTransactionSheet> {
  final _titleController = TextEditingController();
  final _amountController = TextEditingController();
  final _notesController = TextEditingController();

  late TransactionType _type;
  String _selectedCategory = 'Food & Dining';
  String _selectedPaymentMethod = 'UPI';
  DateTime _selectedDate = DateTime.now();

  final List<String> _expenseCategories = [
    'Food & Dining',
    'Shopping',
    'Transport',
    'Bills & Utilities',
    'Entertainment',
    'Health & Medical',
    'General & Other'
  ];

  final List<String> _incomeCategories = [
    'Salary',
    'Freelance',
    'Investments',
    'Rental',
    'Other'
  ];

  final List<String> _paymentMethods = [
    'UPI',
    'Credit Card',
    'Debit Card',
    'Cash',
    'Net Banking'
  ];

  @override
  void initState() {
    super.initState();
    _type = widget.initialType;
    _selectedCategory = _type == TransactionType.expense ? 'Food & Dining' : 'Salary';
  }

  @override
  void dispose() {
    _titleController.dispose();
    _amountController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _submit() {
    final amount = double.tryParse(_amountController.text.trim());
    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid amount')),
      );
      return;
    }

    final title = _titleController.text.trim();
    final finalTitle = title.isEmpty ? _selectedCategory : title;

    final tx = TransactionModel(
      title: finalTitle,
      merchant: finalTitle,
      amount: amount,
      type: _type,
      category: _selectedCategory,
      date: _selectedDate,
      paymentMethod: _selectedPaymentMethod,
      notes: _notesController.text.trim().isNotEmpty ? _notesController.text.trim() : null,
    );

    context.read<FinanceProvider>().addTransaction(tx);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final categories = _type == TransactionType.expense ? _expenseCategories : _incomeCategories;

    return Container(
      padding: EdgeInsets.only(
        top: 20,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      decoration: const BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Drag handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Header & Type Switcher
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Add Transaction',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(3),
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      _buildTypeTab('Expense', TransactionType.expense, AppColors.expense),
                      _buildTypeTab('Income', TransactionType.income, AppColors.income),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Amount Input
            TextField(
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              autofocus: true,
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: _type == TransactionType.expense ? AppColors.expense : AppColors.income,
              ),
              decoration: InputDecoration(
                prefixText: '₹ ',
                prefixStyle: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: _type == TransactionType.expense ? AppColors.expense : AppColors.income,
                ),
                hintText: '0.00',
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
            ),
            const SizedBox(height: 14),

            // Merchant / Title Input
            TextField(
              controller: _titleController,
              decoration: InputDecoration(
                hintText: 'Merchant / Description (e.g. Starbucks)',
                prefixIcon: const Icon(LucideIcons.tag, size: 18, color: AppColors.textMuted),
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
            const SizedBox(height: 14),

            // Category Selector Chips
            const Text(
              'Category',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: categories.map((cat) {
                final isSelected = _selectedCategory == cat;
                return ChoiceChip(
                  label: Text(cat),
                  selected: isSelected,
                  selectedColor: AppColors.primary,
                  labelStyle: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: isSelected ? Colors.white : AppColors.textPrimary,
                  ),
                  backgroundColor: AppColors.background,
                  onSelected: (val) {
                    if (val) setState(() => _selectedCategory = cat);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 14),

            // Payment Mode Selector
            const Text(
              'Payment Mode',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: _paymentMethods.map((pm) {
                final isSelected = _selectedPaymentMethod == pm;
                return ChoiceChip(
                  label: Text(pm),
                  selected: isSelected,
                  selectedColor: AppColors.secondary,
                  labelStyle: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: isSelected ? Colors.white : AppColors.textPrimary,
                  ),
                  backgroundColor: AppColors.background,
                  onSelected: (val) {
                    if (val) setState(() => _selectedPaymentMethod = pm);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            // Submit Button
            ElevatedButton(
              onPressed: _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
              ),
              child: const Text(
                'Save Transaction',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypeTab(String label, TransactionType type, Color activeColor) {
    final isSelected = _type == type;
    return GestureDetector(
      onTap: () {
        setState(() {
          _type = type;
          _selectedCategory = type == TransactionType.expense ? 'Food & Dining' : 'Salary';
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? activeColor : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: isSelected ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
