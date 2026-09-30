import 'package:intl/intl.dart';

class Formatters {
  static final NumberFormat _currencyFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  static final NumberFormat _decimalCurrencyFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 2,
  );

  static String formatCurrency(dynamic amount, {bool showDecimals = false}) {
    if (amount == null) return '₹0';
    final num val = amount is num ? amount : double.tryParse(amount.toString()) ?? 0;
    return showDecimals ? _decimalCurrencyFormat.format(val) : _currencyFormat.format(val);
  }

  static String formatCompactCurrency(dynamic amount) {
    if (amount == null) return '₹0';
    final num val = amount is num ? amount : double.tryParse(amount.toString()) ?? 0;
    if (val.abs() >= 10000000) {
      return '₹${(val / 10000000).toStringAsFixed(1)}Cr';
    } else if (val.abs() >= 100000) {
      return '₹${(val / 100000).toStringAsFixed(1)}L';
    } else if (val.abs() >= 1000) {
      return '₹${(val / 1000).toStringAsFixed(1)}k';
    }
    return '₹${val.toStringAsFixed(0)}';
  }

  static String formatDate(DateTime date) {
    return DateFormat('dd MMM yyyy').format(date);
  }

  static String formatDateTime(DateTime date) {
    return DateFormat('dd MMM yyyy, hh:mm a').format(date);
  }

  static String formatDayHeader(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final checkDate = DateTime(date.year, date.month, date.day);

    if (checkDate == today) {
      return 'Today';
    } else if (checkDate == yesterday) {
      return 'Yesterday';
    } else {
      return DateFormat('EEEE, dd MMMM').format(date);
    }
  }
}
