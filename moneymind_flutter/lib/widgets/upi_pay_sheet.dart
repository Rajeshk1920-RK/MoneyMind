import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/transaction_model.dart';
import '../providers/finance_provider.dart';
import '../constants/app_colors.dart';
import '../utils/formatters.dart';

class UpiPaySheet extends StatefulWidget {
  final double initialAmount;

  const UpiPaySheet({super.key, this.initialAmount = 350.0});

  @override
  State<UpiPaySheet> createState() => _UpiPaySheetState();
}

class _UpiPaySheetState extends State<UpiPaySheet> {
  late TextEditingController _amountController;
  final TextEditingController _payeeController = TextEditingController(text: 'Swiggy');
  final TextEditingController _vpaController = TextEditingController(text: 'swiggy@okhdfcbank');
  String _selectedCategory = 'Food & Dining';
  bool _isSuccess = false;
  TransactionModel? _recordedTx;

  final List<Map<String, String>> _popularPayees = [
    {'name': 'Swiggy', 'vpa': 'swiggy@okhdfcbank', 'category': 'Food & Dining'},
    {'name': 'Zomato', 'vpa': 'zomato@icici', 'category': 'Food & Dining'},
    {'name': 'Amazon Pay', 'vpa': 'amazonpay@apl', 'category': 'Shopping'},
    {'name': 'Uber Rides', 'vpa': 'uber@icici', 'category': 'Transport'},
    {'name': 'Airtel Bill', 'vpa': 'airtel@paytm', 'category': 'Bills & Utilities'},
  ];

  @override
  void initState() {
    super.initState();
    _amountController = TextEditingController(text: widget.initialAmount.toStringAsFixed(0));
  }

  @override
  void dispose() {
    _amountController.dispose();
    _payeeController.dispose();
    _vpaController.dispose();
    super.dispose();
  }

  void _confirmAndCalculate() {
    final amount = double.tryParse(_amountController.text.trim()) ?? 0.0;
    if (amount <= 0) return;

    final tx = TransactionModel(
      title: _payeeController.text.trim().isNotEmpty ? _payeeController.text.trim() : 'UPI Payment',
      merchant: _payeeController.text.trim().isNotEmpty ? _payeeController.text.trim() : 'UPI Merchant',
      amount: amount,
      type: TransactionType.expense,
      category: _selectedCategory,
      date: DateTime.now(),
      paymentMethod: 'UPI',
      notes: 'Paid via UPI to ${_vpaController.text.trim()}',
    );

    context.read<FinanceProvider>().addTransaction(tx);

    setState(() {
      _recordedTx = tx;
      _isSuccess = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isSuccess && _recordedTx != null) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(LucideIcons.checkCircle2, color: AppColors.primary, size: 56),
            const SizedBox(height: 12),
            const Text(
              'Payment Recorded & Calculated!',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 6),
            Text(
              'Deducted ${Formatters.formatCurrency(_recordedTx!.amount)} from balance and updated your budget & calendar readout.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text('Done & Return to Dashboard', style: TextStyle(fontWeight: FontWeight.w800)),
            ),
          ],
        ),
      );
    }

    final numAmount = double.tryParse(_amountController.text.trim()) ?? 0.0;

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
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(2)),
              ),
            ),
            const SizedBox(height: 16),

            // Title
            const Row(
              children: [
                Icon(LucideIcons.zap, color: AppColors.primary, size: 20),
                SizedBox(width: 8),
                Text(
                  'UPI Instant Pay & Auto-Log',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Amount Input
            TextField(
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: AppColors.expense),
              decoration: InputDecoration(
                prefixText: '₹ ',
                prefixStyle: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: AppColors.expense),
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 12),

            // Preset Payees Chips
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _popularPayees.map((p) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: ActionChip(
                      label: Text(p['name']!, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                      backgroundColor: AppColors.background,
                      onPressed: () {
                        setState(() {
                          _payeeController.text = p['name']!;
                          _vpaController.text = p['vpa']!;
                          _selectedCategory = p['category']!;
                        });
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 12),

            // Payee Name & VPA
            TextField(
              controller: _payeeController,
              decoration: InputDecoration(
                labelText: 'Payee / Merchant Name',
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 10),

            TextField(
              controller: _vpaController,
              decoration: InputDecoration(
                labelText: 'UPI ID (VPA)',
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 16),

            // Platform Launch Buttons
            const Text(
              'Launch UPI App',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 8),

            Row(
              children: [
                _buildPlatformBtn('PhonePe', const Color(0xFF5F259F)),
                const SizedBox(width: 8),
                _buildPlatformBtn('Google Pay', const Color(0xFF1A73E8)),
                const SizedBox(width: 8),
                _buildPlatformBtn('Paytm', const Color(0xFF00BAF2)),
              ],
            ),
            const SizedBox(height: 16),

            // Confirm Button
            ElevatedButton.icon(
              onPressed: _confirmAndCalculate,
              icon: const Icon(LucideIcons.checkCircle2, size: 18),
              label: Text('Confirm & Calculate ₹$numAmount Expense'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 0,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlatformBtn(String name, Color color) {
    return Expanded(
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Opening $name... Complete payment and tap Confirm!')),
          );
        },
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.12),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: color.withOpacity(0.3)),
          ),
          alignment: Alignment.center,
          child: Text(
            name,
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: color),
          ),
        ),
      ),
    );
  }
}
