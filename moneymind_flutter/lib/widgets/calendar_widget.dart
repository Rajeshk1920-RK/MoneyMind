import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../providers/finance_provider.dart';
import '../constants/app_colors.dart';
import '../utils/formatters.dart';
import 'transaction_tile.dart';

class CalendarWidget extends StatefulWidget {
  final VoidCallback? onAddTransaction;

  const CalendarWidget({super.key, this.onAddTransaction});

  @override
  State<CalendarWidget> createState() => _CalendarWidgetState();
}

class _CalendarWidgetState extends State<CalendarWidget> {
  DateTime _currentMonth = DateTime.now();

  final List<String> _weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  void _previousMonth() {
    setState(() {
      _currentMonth = DateTime(_currentMonth.year, _currentMonth.month - 1, 1);
    });
  }

  void _nextMonth() {
    setState(() {
      _currentMonth = DateTime(_currentMonth.year, _currentMonth.month + 1, 1);
    });
  }

  @override
  Widget build(BuildContext context) {
    final finance = context.watch<FinanceProvider>();
    final dailyMap = finance.dailyTotalsMap;

    // Calculate month totals
    double monthExpense = 0;
    double monthIncome = 0;

    dailyMap.forEach((dateStr, data) {
      final parts = dateStr.split('-');
      if (parts.length == 3) {
        final yr = int.tryParse(parts[0]) ?? 0;
        final mo = int.tryParse(parts[1]) ?? 0;
        if (yr == _currentMonth.year && mo == _currentMonth.month) {
          monthExpense += (data['expense'] ?? 0);
          monthIncome += (data['income'] ?? 0);
        }
      }
    });

    final firstDayOfMonth = DateTime(_currentMonth.year, _currentMonth.month, 1);
    final daysInMonth = DateTime(_currentMonth.year, _currentMonth.month + 1, 0).day;
    final firstWeekday = firstDayOfMonth.weekday % 7; // Sunday = 0

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Calendar Main Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppColors.border, width: 1),
          ),
          child: Column(
            children: [
              // Header: Month & Navigation
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(LucideIcons.calendar, size: 18, color: AppColors.primary),
                      const SizedBox(width: 8),
                      Text(
                        '${_getMonthName(_currentMonth.month)} ${_currentMonth.year}',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      IconButton(
                        onPressed: _previousMonth,
                        icon: const Icon(LucideIcons.chevronLeft, size: 18),
                        style: IconButton.styleFrom(
                          backgroundColor: AppColors.background,
                          padding: const EdgeInsets.all(8),
                          minimumSize: const Size(32, 32),
                        ),
                      ),
                      const SizedBox(width: 4),
                      IconButton(
                        onPressed: _nextMonth,
                        icon: const Icon(LucideIcons.chevronRight, size: 18),
                        style: IconButton.styleFrom(
                          backgroundColor: AppColors.background,
                          padding: const EdgeInsets.all(8),
                          minimumSize: const Size(32, 32),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Monthly Strip Summary
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.border, width: 1),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Column(
                      children: [
                        const Text(
                          'SPENT THIS MONTH',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textSecondary,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '-${Formatters.formatCurrency(monthExpense)}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: AppColors.expense,
                          ),
                        ),
                      ],
                    ),
                    Container(height: 24, width: 1, color: AppColors.border),
                    Column(
                      children: [
                        const Text(
                          'RECEIVED THIS MONTH',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textSecondary,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '+${Formatters.formatCurrency(monthIncome)}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: AppColors.income,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // Weekdays Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: _weekdays.map((day) {
                  return Expanded(
                    child: Center(
                      child: Text(
                        day,
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 8),

              // Calendar Days Grid with Readout Badges
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 7,
                  crossAxisSpacing: 4,
                  mainAxisSpacing: 6,
                  childAspectRatio: 0.82,
                ),
                itemCount: firstWeekday + daysInMonth,
                itemBuilder: (context, index) {
                  if (index < firstWeekday) {
                    return const SizedBox.shrink();
                  }

                  final dayNum = index - firstWeekday + 1;
                  final cellDate = DateTime(_currentMonth.year, _currentMonth.month, dayNum);
                  final dateKey = '${cellDate.year}-${cellDate.month.toString().padLeft(2, '0')}-${cellDate.day.toString().padLeft(2, '0')}';

                  final dayData = dailyMap[dateKey];
                  final dayExpense = dayData?['expense'] ?? 0.0;
                  final dayIncome = dayData?['income'] ?? 0.0;

                  final isSelected = finance.selectedCalendarDate.year == cellDate.year &&
                      finance.selectedCalendarDate.month == cellDate.month &&
                      finance.selectedCalendarDate.day == cellDate.day;

                  return InkWell(
                    onTap: () {
                      finance.setSelectedCalendarDate(cellDate);
                    },
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.secondary : Colors.transparent,
                        borderRadius: BorderRadius.circular(10),
                        border: isSelected
                            ? Border.all(color: AppColors.secondary, width: 1.5)
                            : null,
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            '$dayNum',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: isSelected ? Colors.white : AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 2),

                          // Readout Amount Badge
                          if (dayExpense > 0) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 1),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? Colors.white.withOpacity(0.2)
                                    : AppColors.expenseSurface,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                '-${Formatters.formatCompactCurrency(dayExpense)}',
                                style: TextStyle(
                                  fontSize: 8.5,
                                  fontWeight: FontWeight.w800,
                                  color: isSelected ? Colors.white : AppColors.expense,
                                ),
                                maxLines: 1,
                                overflow: TextEscape.ellipsis,
                              ),
                            ),
                          ] else if (dayIncome > 0) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 1),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? Colors.white.withOpacity(0.2)
                                    : AppColors.incomeSurface,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                '+${Formatters.formatCompactCurrency(dayIncome)}',
                                style: TextStyle(
                                  fontSize: 8.5,
                                  fontWeight: FontWeight.w800,
                                  color: isSelected ? Colors.white : AppColors.income,
                                ),
                                maxLines: 1,
                                overflow: TextEscape.ellipsis,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Selected Date Details & Transaction Drill Down
        _buildDateDrillDown(context, finance),
      ],
    );
  }

  Widget _buildDateDrillDown(BuildContext context, FinanceProvider finance) {
    final selDate = finance.selectedCalendarDate;
    final dayTxs = finance.transactionsForSelectedDate;
    final totalSpent = dayTxs
        .where((t) => t.type == TransactionType.expense)
        .fold(0.0, (sum, t) => sum + t.amount);
    final totalReceived = dayTxs
        .where((t) => t.type == TransactionType.income)
        .fold(0.0, (sum, t) => sum + t.amount);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    Formatters.formatDate(selDate),
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  if (totalSpent > 0) ...[
                    Text(
                      '-${Formatters.formatCurrency(totalSpent)} Spent',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: AppColors.expense,
                      ),
                    ),
                  ] else if (totalReceived > 0) ...[
                    Text(
                      '+${Formatters.formatCurrency(totalReceived)} Received',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: AppColors.income,
                      ),
                    ),
                  ] else ...[
                    const Row(
                      children: [
                        Text('🍃 ', style: TextStyle(fontSize: 14)),
                        Text(
                          'Zero Spending Day',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
              if (widget.onAddTransaction != null)
                ElevatedButton.icon(
                  onPressed: widget.onAddTransaction,
                  icon: const Icon(LucideIcons.plus, size: 14),
                  label: const Text('Add'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),

          // Transactions on that day
          if (dayTxs.isEmpty) ...[
            Container(
              padding: const EdgeInsets.symmetric(vertical: 20),
              alignment: Alignment.center,
              child: const Text(
                'No transactions logged on this day.',
                style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ] else ...[
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: dayTxs.length,
              itemBuilder: (context, index) {
                final tx = dayTxs[index];
                return TransactionTile(
                  transaction: tx,
                  onDelete: () => finance.deleteTransaction(tx.id),
                );
              },
            ),
          ],
        ],
      ),
    );
  }

  String _getMonthName(int month) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  }
}
