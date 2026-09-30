import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/transaction_model.dart';
import '../providers/finance_provider.dart';
import '../constants/app_colors.dart';
import '../utils/formatters.dart';

enum UpiPaymentMode { bankTransfer, payByUpiId, scanAndPay, payAnyone }

class UpiPaySheet extends StatefulWidget {
  final double initialAmount;

  const UpiPaySheet({super.key, this.initialAmount = 350.0});

  @override
  State<UpiPaySheet> createState() => _UpiPaySheetState();
}

class _UpiPaySheetState extends State<UpiPaySheet> {
  UpiPaymentMode _mode = UpiPaymentMode.payByUpiId;
  late TextEditingController _amountController;

  // Mode 1: Bank Transfer
  final TextEditingController _accController = TextEditingController();
  final TextEditingController _ifscController = TextEditingController(text: 'HDFC0001234');
  final TextEditingController _beneficiaryController = TextEditingController();

  // Mode 2: Pay by UPI ID
  final TextEditingController _vpaController = TextEditingController(text: 'swiggy@okhdfcbank');
  final TextEditingController _merchantController = TextEditingController(text: 'Swiggy');

  // Mode 4: Pay Anyone
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _contactController = TextEditingController(text: 'Aman Sharma');

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

  final List<Map<String, String>> _popularContacts = [
    {'name': 'Aman Sharma', 'phone': '9876543210'},
    {'name': 'Priya Patel', 'phone': '9845012345'},
    {'name': 'Rohan Verma', 'phone': '9123456780'},
  ];

  @override
  void initState() {
    super.initState();
    _amountController = TextEditingController(text: widget.initialAmount.toStringAsFixed(0));
  }

  @override
  void dispose() {
    _amountController.dispose();
    _accController.dispose();
    _ifscController.dispose();
    _beneficiaryController.dispose();
    _vpaController.dispose();
    _merchantController.dispose();
    _phoneController.dispose();
    _contactController.dispose();
    super.dispose();
  }

  void _confirmAndCalculate() {
    final amount = double.tryParse(_amountController.text.trim()) ?? 0.0;
    if (amount <= 0) return;

    String title = 'UPI Payment';
    String notes = 'Direct UPI Pay';

    switch (_mode) {
      case UpiPaymentMode.bankTransfer:
        title = _beneficiaryController.text.trim().isNotEmpty ? _beneficiaryController.text.trim() : 'Bank Transfer';
        notes = 'Bank Transfer A/c ••${_accController.text.trim().isNotEmpty ? _accController.text.trim().substring(_accController.text.trim().length - 4) : '****'}';
        break;
      case UpiPaymentMode.payByUpiId:
        title = _merchantController.text.trim().isNotEmpty ? _merchantController.text.trim() : 'UPI Merchant';
        notes = 'Paid to UPI ID ${_vpaController.text.trim()}';
        break;
      case UpiPaymentMode.scanAndPay:
        title = 'Store QR Payment';
        notes = 'Scanned Store QR code';
        break;
      case UpiPaymentMode.payAnyone:
        title = _contactController.text.trim().isNotEmpty ? _contactController.text.trim() : 'Mobile Transfer';
        notes = 'Paid to Mobile +91 ${_phoneController.text.trim()}';
        break;
    }

    final tx = TransactionModel(
      title: title,
      merchant: title,
      amount: amount,
      type: TransactionType.expense,
      category: _selectedCategory,
      date: DateTime.now(),
      paymentMethod: 'UPI',
      notes: notes,
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
            const SizedBox(height: 14),

            // Title
            const Row(
              children: [
                Icon(LucideIcons.zap, color: AppColors.primary, size: 20),
                SizedBox(width: 8),
                Text(
                  'Direct UPI Pay & Auto-Log',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // 4 Mode Selection Tabs
            Row(
              children: [
                _buildModeTab('Bank Transfer', LucideIcons.building2, UpiPaymentMode.bankTransfer),
                _buildModeTab('UPI ID', LucideIcons.atSign, UpiPaymentMode.payByUpiId),
                _buildModeTab('Scan & Pay', LucideIcons.scanLine, UpiPaymentMode.scanAndPay),
                _buildModeTab('Pay Anyone', LucideIcons.users, UpiPaymentMode.payAnyone),
              ],
            ),
            const SizedBox(height: 14),

            // Amount Input
            TextField(
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.expense),
              decoration: InputDecoration(
                prefixText: '₹ ',
                prefixStyle: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.expense),
                filled: true,
                fillColor: AppColors.background,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 12),

            // Mode 1: Bank Transfer Fields
            if (_mode == UpiPaymentMode.bankTransfer) ...[
              TextField(
                controller: _beneficiaryController,
                decoration: InputDecoration(
                  labelText: 'Beneficiary Name',
                  filled: true,
                  fillColor: AppColors.background,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _accController,
                decoration: InputDecoration(
                  labelText: 'Bank Account Number',
                  filled: true,
                  fillColor: AppColors.background,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _ifscController,
                decoration: InputDecoration(
                  labelText: 'IFSC Code (e.g. HDFC0001234)',
                  filled: true,
                  fillColor: AppColors.background,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
            ],

            // Mode 2: Pay by UPI ID Fields
            if (_mode == UpiPaymentMode.payByUpiId) ...[
              TextField(
                controller: _merchantController,
                decoration: InputDecoration(
                  labelText: 'Payee Name',
                  filled: true,
                  fillColor: AppColors.background,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _vpaController,
                decoration: InputDecoration(
                  labelText: 'UPI ID (VPA)',
                  filled: true,
                  fillColor: AppColors.background,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 8),
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
                            _merchantController.text = p['name']!;
                            _vpaController.text = p['vpa']!;
                            _selectedCategory = p['category']!;
                          });
                        },
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],

            // Mode 3: Scan & Pay
            if (_mode == UpiPaymentMode.scanAndPay) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: const Column(
                  children: [
                    Icon(LucideIcons.camera, size: 40, color: AppColors.primary),
                    SizedBox(height: 8),
                    Text('Scan Merchant UPI QR Code', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                  ],
                ),
              ),
            ],

            // Mode 4: Pay Anyone (Phone)
            if (_mode == UpiPaymentMode.payAnyone) ...[
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  prefixText: '+91 ',
                  labelText: 'Mobile Number',
                  filled: true,
                  fillColor: AppColors.background,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _popularContacts.map((c) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ActionChip(
                        label: Text(c['name']!, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                        backgroundColor: AppColors.background,
                        onPressed: () {
                          setState(() {
                            _contactController.text = c['name']!;
                            _phoneController.text = c['phone']!;
                          });
                        },
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],

            const SizedBox(height: 16),

            // Launch Platform Buttons
            Row(
              children: [
                _buildPlatformBtn('PhonePe', const Color(0xFF5F259F)),
                const SizedBox(width: 8),
                _buildPlatformBtn('Google Pay', const Color(0xFF1A73E8)),
                const SizedBox(width: 8),
                _buildPlatformBtn('Paytm', const Color(0xFF00BAF2)),
              ],
            ),
            const SizedBox(height: 14),

            // Confirm Button
            ElevatedButton.icon(
              onPressed: _confirmAndCalculate,
              icon: const Icon(LucideIcons.checkCircle2, size: 18),
              label: Text('Confirm ₹$numAmount & Calculate Expense'),
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

  Widget _buildModeTab(String label, IconData icon, UpiPaymentMode mode) {
    final isSel = _mode == mode;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _mode = mode),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 2),
          decoration: BoxDecoration(
            color: isSel ? AppColors.primarySurface : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            border: isSel ? Border.all(color: AppColors.primary, width: 1.5) : null,
          ),
          child: Column(
            children: [
              Icon(icon, size: 16, color: isSel ? AppColors.primary : AppColors.textMuted),
              const SizedBox(height: 2),
              Text(
                label,
                style: TextStyle(
                  fontSize: 9.5,
                  fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
                  color: isSel ? AppColors.primary : AppColors.textSecondary,
                ),
                textAlign: TextAlign.center,
                maxLines: 1,
              ),
            ],
          ),
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
            style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: color),
          ),
        ),
      ),
    );
  }
}
