# 📱 MoneyMind Flutter Mobile App

**MoneyMind Flutter** is a modern, high-performance cross-platform financial tracking app built with **Flutter & Dart**, featuring real-time offline SQLite storage, bank SMS automatic parsing, and an interactive daily calendar readout.

---

## 🚀 Features

- **📊 Dynamic Dashboard**: Real-time Net Balance, Monthly Inflow/Outflow summary cards, and quick spend logger.
- **📅 Calendar View with Daily Badges**: Real-time readout badges showing daily spent amounts (`-₹...` in red) and received credits (`+₹...` in green), plus monthly overview totals.
- **💬 Auto Bank SMS Reader**: Parses Indian bank SMS messages (HDFC, SBI, ICICI, Axis, Paytm, PhonePe, GooglePay) extracting amount, merchant, and payment mode with zero internet needed.
- **🎯 Category Envelopes & Budgets**: Progress bars, monthly limits, and warning indicators.
- **⚡ Local SQLite Storage**: Fast offline-first architecture with `sqflite`.

---

## 📁 Directory Structure

```
moneymind_flutter/
├── pubspec.yaml
├── lib/
│   ├── main.dart                      # Application entry point
│   ├── constants/
│   │   ├── app_colors.dart            # Emerald & Slate color system
│   │   └── app_theme.dart             # Google Fonts Inter theme
│   ├── models/
│   │   ├── transaction_model.dart     # SQLite Transaction schema
│   │   └── budget_model.dart          # Budget envelope schema
│   ├── services/
│   │   ├── database_service.dart      # SQLite persistent storage
│   │   └── sms_parser_service.dart    # Regex Bank SMS parser
│   ├── providers/
│   │   └── finance_provider.dart      # ChangeNotifier State Management
│   ├── utils/
│   │   └── formatters.dart            # Indian currency & date formatters
│   ├── widgets/
│   │   ├── calendar_widget.dart       # Interactive Calendar with daily spend badges
│   │   ├── transaction_tile.dart      # Swipe-to-delete transaction row
│   │   ├── stat_card.dart             # Metric cards
│   │   └── add_transaction_sheet.dart # Modal bottom sheet
│   └── screens/
│       ├── main_navigation_screen.dart# Immovable bottom navigation
│       ├── dashboard_screen.dart      # Home analytics
│       ├── activity_screen.dart       # List & Calendar view tabs
│       ├── budget_screen.dart         # Category budget envelopes
│       └── sms_reader_screen.dart     # Live SMS parser & test simulator
```

---

## 🛠️ How to Run

1. **Install Flutter SDK**: [flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install)
2. **Navigate into Flutter directory**:
   ```bash
   cd moneymind_flutter
   ```
3. **Get dependencies**:
   ```bash
   flutter pub get
   ```
4. **Run on connected device or emulator**:
   ```bash
   flutter run
   ```
