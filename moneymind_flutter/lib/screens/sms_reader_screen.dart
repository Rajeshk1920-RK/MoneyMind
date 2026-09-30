import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../providers/finance_provider.dart';
import '../constants/app_colors.dart';
import '../services/sms_parser_service.dart';
import '../utils/formatters.dart';

class SmsReaderScreen extends StatefulWidget {
  const SmsReaderScreen({super.key});

  @override
  State<SmsReaderScreen> createState() => _SmsReaderScreenState();
}

class _SmsReaderScreenState extends State<SmsReaderScreen> {
  bool _isListening = true;
  final TextEditingController _testSmsController = TextEditingController();
  ParsedSmsResult? _previewResult;

  final List<String> _sampleSms = [
    'Sent Rs.450.00 from HDFC Bank A/C **8842 to SWIGGY on 30-SEP-26 via UPI Ref 6294029482. Avail Bal: Rs.14,200',
    'A/C **1234 Credited by Rs.85,000.00 on 30-SEP-26 by TECH CORP Salary transfer. Avail Bal: Rs.99,200',
    'Your SBI Card ending 4920 was used for purchase of Rs.1,499.00 at AMAZON RETAIL on 29-SEP-26. Avail Limit Rs.85,000',
    'Paid Rs.850 to HPCL AUTO CARE on 28-SEP-26 using Paytm UPI. UPI Ref: 394829104',
  ];

  @override
  void dispose() {
    _testSmsController.dispose();
    super.dispose();
  }

  void _parseManual() {
    final text = _testSmsController.text.trim();
    if (text.isEmpty) return;

    final parsed = SmsParserService.parseSms(text);
    setState(() {
      _previewResult = parsed;
    });
  }

  void _importPreviewed() {
    if (_previewResult == null) return;
    context.read<FinanceProvider>().importFromSms(_testSmsController.text);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Successfully imported ${_previewResult!.merchant} (${Formatters.formatCurrency(_previewResult!.amount)})'),
        backgroundColor: AppColors.primary,
      ),
    );
    _testSmsController.clear();
    setState(() {
      _previewResult = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final finance = context.watch<FinanceProvider>();
    final smsImportedTxs = finance.transactions.where((t) => t.isAiGenerated).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'SMS Expense Reader',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: AppColors.textPrimary,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: _isListening ? AppColors.primarySurface : AppColors.expenseSurface,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Icon(
                      _isListening ? LucideIcons.radio : LucideIcons.bellOff,
                      color: _isListening ? AppColors.primary : AppColors.expense,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _isListening ? 'Auto-Sync Active' : 'Auto-Sync Paused',
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          _isListening ? 'Listening for bank & UPI SMS alerts' : 'SMS listening is disabled',
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Switch(
                    value: _isListening,
                    activeColor: AppColors.primary,
                    onChanged: (val) {
                      setState(() => _isListening = val);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // SMS Simulator & Test Tool
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Bank SMS AI Parser Tester',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Paste any bank SMS or tap a sample to test instant parsing:',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 12),

                  // Sample chips
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _sampleSms.map((s) {
                        final preview = s.length > 20 ? '${s.substring(0, 20)}...' : s;
                        return Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: ActionChip(
                            label: Text(preview, style: const TextStyle(fontSize: 11)),
                            backgroundColor: AppColors.background,
                            onPressed: () {
                              _testSmsController.text = s;
                              _parseManual();
                            },
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 12),

                  TextField(
                    controller: _testSmsController,
                    maxLines: 3,
                    onChanged: (_) => _parseManual(),
                    decoration: InputDecoration(
                      hintText: 'Paste raw bank SMS message here...',
                      hintStyle: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                      filled: true,
                      fillColor: AppColors.background,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.all(12),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Parsed Output Box
                  if (_previewResult != null) ...[
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: _previewResult!.isValid ? AppColors.primarySurface : AppColors.expenseSurface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: _previewResult!.isValid ? AppColors.primary.withOpacity(0.3) : AppColors.expense.withOpacity(0.3),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                _previewResult!.merchant,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                              ),
                              Text(
                                '${_previewResult!.type == TransactionType.income ? '+' : '-'}${Formatters.formatCurrency(_previewResult!.amount)}',
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w900,
                                  color: _previewResult!.type == TransactionType.income ? AppColors.income : AppColors.expense,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              Text(
                                'Category: ${_previewResult!.category}',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                '• Mode: ${_previewResult!.paymentMethod}',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          ElevatedButton.icon(
                            onPressed: _importPreviewed,
                            icon: const Icon(LucideIcons.check, size: 15),
                            label: const Text('Add to Ledger'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Imported History
            Text(
              'Auto-Imported from SMS (${smsImportedTxs.length})',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 10),

            if (smsImportedTxs.isEmpty) ...[
              Container(
                padding: const EdgeInsets.all(24),
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.border),
                ),
                child: const Text(
                  'No SMS transactions auto-imported yet.',
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                ),
              ),
            ] else ...[
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: smsImportedTxs.length,
                itemBuilder: (context, index) {
                  final tx = smsImportedTxs[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.card,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              tx.merchant ?? tx.title,
                              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                            ),
                            Text(
                              '${tx.category} • ${Formatters.formatDate(tx.date)}',
                              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                        Text(
                          '${tx.type == TransactionType.income ? '+' : '-'}${Formatters.formatCurrency(tx.amount)}',
                          style: TextStyle(
                            fontWeight: FontWeight.w800,
                            color: tx.type == TransactionType.income ? AppColors.income : AppColors.expense,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}
