import 'package:flutter/material.dart';

class AppColors {
  // Brand Colors
  static const Color primary = Color(0xFF059669); // Emerald 600
  static const Color primaryDark = Color(0xFF047857);
  static const Color primaryLight = Color(0xFF10B981);
  static const Color primarySurface = Color(0xFFECFDF5);

  static const Color secondary = Color(0xFF2563EB); // Royal Blue
  static const Color secondarySurface = Color(0xFFEFF6FF);

  // Financial Status Colors
  static const Color expense = Color(0xFFDC2626); // Red 600
  static const Color expenseSurface = Color(0xFFFEF2F2);
  static const Color income = Color(0xFF059669); // Green 600
  static const Color incomeSurface = Color(0xFFECFDF5);
  static const Color warning = Color(0xFFD97706); // Amber 600
  static const Color warningSurface = Color(0xFFFFFBEB);

  // Background & Surfaces (Light)
  static const Color background = Color(0xFFF8FAFC);
  static const Color card = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFE2E8F0);
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textMuted = Color(0xFF94A3B8);

  // Dark Mode Colors
  static const Color darkBackground = Color(0xFF0B1120);
  static const Color darkCard = Color(0xFF1E293B);
  static const Color darkBorder = Color(0xFF334155);
  static const Color darkTextPrimary = Color(0xFFF8FAFC);
  static const Color darkTextSecondary = Color(0xFF94A3B8);

  // Category Accent Colors
  static const Color food = Color(0xFFF97316);
  static const Color shopping = Color(0xFF8B5CF6);
  static const Color bills = Color(0xFFEF4444);
  static const Color transport = Color(0xFF3B82F6);
  static const Color entertainment = Color(0xFFEC4899);
  static const Color salary = Color(0xFF10B981);
  static const Color investment = Color(0xFF06B6D4);
  static const Color health = Color(0xFF14B8A6);
  static const Color other = Color(0xFF64748B);

  static Color getCategoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'food & dining':
      case 'food':
        return food;
      case 'shopping':
        return shopping;
      case 'bills & utilities':
      case 'utilities':
        return bills;
      case 'transport':
      case 'fuel':
        return transport;
      case 'entertainment':
      case 'leisure':
        return entertainment;
      case 'salary':
      case 'freelance':
        return salary;
      case 'investment':
      case 'investments':
        return investment;
      case 'health & medical':
      case 'medical':
        return health;
      default:
        return other;
    }
  }
}
