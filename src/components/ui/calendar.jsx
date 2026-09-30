import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Smartphone,
  Plus
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import './calendar.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Calendar UI Component with Daily Spending Intelligence
 * When a date is clicked, it calculates and displays day-specific spend & income breakdown.
 */
export function Calendar({
  value,
  onChange,
  transactions = [],
  className = '',
  captionLayout = 'dropdown',
  onOpenAddTx,
  ...props
}) {
  const today = useMemo(() => new Date(), []);

  // Parse initial selected date
  const selectedDateStr = useMemo(() => {
    if (!value) return today.toISOString().split('T')[0];
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString().split('T')[0];
    if (value.year && value.month && value.day) {
      const m = String(value.month).padStart(2, '0');
      const d = String(value.day).padStart(2, '0');
      return `${value.year}-${m}-${d}`;
    }
    return today.toISOString().split('T')[0];
  }, [value, today]);

  const [currentYear, setCurrentYear] = useState(() => {
    const d = value ? new Date(selectedDateStr) : today;
    return isNaN(d.getFullYear()) ? 2026 : d.getFullYear();
  });

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = value ? new Date(selectedDateStr) : today;
    return isNaN(d.getMonth()) ? 8 : d.getMonth(); // 0-indexed, default Sep
  });

  // Calculate day-by-day spending map from transactions
  const dailySpendingMap = useMemo(() => {
    const map = {};
    if (!Array.isArray(transactions)) return map;

    transactions.forEach(tx => {
      if (!tx.date) return;
      const dateKey = tx.date.split('T')[0];
      if (!map[dateKey]) {
        map[dateKey] = {
          expense: 0,
          income: 0,
          transactions: []
        };
      }
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        map[dateKey].income += amt;
      } else {
        map[dateKey].expense += amt;
      }
      map[dateKey].transactions.push(tx);
    });
    return map;
  }, [transactions]);

  // Calendar Grid Generation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevDate).padStart(2, '0')}`;
      days.push({
        dayNumber: prevDate,
        dateStr,
        isCurrentMonth: false,
        spending: dailySpendingMap[dateStr] || null
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: true,
        spending: dailySpendingMap[dateStr] || null
      });
    }

    // Next month leading days to complete grid
    const totalSlots = Math.ceil(days.length / 7) * 7;
    const nextDaysCount = totalSlots - days.length;
    for (let i = 1; i <= nextDaysCount; i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false,
        spending: dailySpendingMap[dateStr] || null
      });
    }

    return days;
  }, [currentYear, currentMonth, dailySpendingMap]);

  // Handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectDate = (dateStr) => {
    if (onChange) {
      onChange(dateStr);
    }
  };

  // Selected Date Stats
  const selectedDayData = dailySpendingMap[selectedDateStr] || {
    expense: 0,
    income: 0,
    transactions: []
  };

  const selectedDateFormatted = useMemo(() => {
    const d = new Date(selectedDateStr);
    if (isNaN(d.getTime())) return selectedDateStr;
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [selectedDateStr]);

  return (
    <div className={`ui-calendar-wrapper ${className}`} {...props}>
      {/* Calendar Header Navigation */}
      <div className="ui-cal-header">
        <div className="ui-cal-title-wrap">
          <CalendarIcon size={18} color="#2563eb" />
          {captionLayout === 'dropdown' ? (
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="ui-cal-select"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>{name}</option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="ui-cal-select"
              >
                {[2024, 2025, 2026, 2027].map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          ) : (
            <span className="ui-cal-month-title">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
          )}
        </div>

        <div className="ui-cal-nav-buttons">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="ui-cal-nav-btn"
            aria-label="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="ui-cal-nav-btn"
            aria-label="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="ui-cal-weekdays">
        {WEEKDAYS.map(day => (
          <div key={day} className="ui-cal-weekday-label">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="ui-cal-days-grid">
        {calendarDays.map((item, index) => {
          const isSelected = item.dateStr === selectedDateStr;
          const hasSpend = item.spending && item.spending.expense > 0;
          const hasIncome = item.spending && item.spending.income > 0;

          return (
            <button
              key={`${item.dateStr}-${index}`}
              type="button"
              onClick={() => handleSelectDate(item.dateStr)}
              className={`ui-cal-day-cell ${!item.isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''}`}
            >
              <span className="ui-cal-day-number">{item.dayNumber}</span>

              {/* Spending Dots / Indicators */}
              <div className="ui-cal-indicator-row">
                {hasSpend && (
                  <span
                    className="ui-cal-dot expense"
                    title={`Spent: ${formatCurrency(item.spending.expense, 'INR', 1)}`}
                  />
                )}
                {hasIncome && (
                  <span
                    className="ui-cal-dot income"
                    title={`Inflow: ${formatCurrency(item.spending.income, 'INR', 1)}`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Spending Intelligence Box */}
      <div className="ui-cal-day-details-panel">
        <div className="ui-cal-details-header">
          <div>
            <span className="ui-cal-details-date-label">{selectedDateFormatted}</span>
            <div className="ui-cal-details-summary">
              {selectedDayData.expense > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626' }}>
                    -{formatCurrency(selectedDayData.expense, 'INR', 1)}
                  </span>
                  {selectedDayData.income > 0 && (
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16a34a' }}>
                      (+{formatCurrency(selectedDayData.income, 'INR', 1)} earned)
                    </span>
                  )}
                </div>
              ) : selectedDayData.income > 0 ? (
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>
                  +{formatCurrency(selectedDayData.income, 'INR', 1)}
                </span>
              ) : (
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                  No spending recorded on this date.
                </span>
              )}
            </div>
          </div>

          {onOpenAddTx && (
            <button
              type="button"
              onClick={() => onOpenAddTx('expense')}
              className="btn-light-pill"
              style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={13} />
              <span>Add spend</span>
            </button>
          )}
        </div>

        {/* List of Transactions for Selected Date */}
        {selectedDayData.transactions.length > 0 && (
          <div className="ui-cal-tx-list">
            {selectedDayData.transactions.map(t => {
              const isIncome = t.type === 'income';

              return (
                <div key={t.id} className="ui-cal-tx-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      backgroundColor: isIncome ? '#dcfce7' : '#fee2e2',
                      color: isIncome ? '#16a34a' : '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isIncome ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                        {t.merchant || t.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{t.category}</span>
                        {t.intentCategory && (
                          <>
                            <span>•</span>
                            <span style={{ color: '#2563eb', fontWeight: 600 }}>{t.intentCategory}</span>
                          </>
                        )}
                        {t.intentNote && (
                          <span style={{ fontStyle: 'italic' }}>("{t.intentNote}")</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    color: isIncome ? '#16a34a' : '#0f172a'
                  }}>
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount, 'INR', 1)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
