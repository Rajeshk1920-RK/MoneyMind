import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Smartphone,
  Plus,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import './calendar.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Calendar UI Component with Real-Time Daily Spending & Income Intelligence
 * Directly displays on every calendar cell how much was spent vs received.
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
    return isNaN(d.getFullYear()) ? today.getFullYear() : d.getFullYear();
  });

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = value ? new Date(selectedDateStr) : today;
    return isNaN(d.getMonth()) ? today.getMonth() : d.getMonth();
  });

  // Calculate day-by-day spending & income map from transactions
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

  // Monthly totals for current viewed month
  const monthlyStats = useMemo(() => {
    let monthExpense = 0;
    let monthIncome = 0;
    let activeDaysCount = 0;

    Object.keys(dailySpendingMap).forEach(dateStr => {
      const d = new Date(dateStr);
      if (!isNaN(d) && d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const dayData = dailySpendingMap[dateStr];
        monthExpense += dayData.expense;
        monthIncome += dayData.income;
        if (dayData.expense > 0 || dayData.income > 0) {
          activeDaysCount++;
        }
      }
    });

    return {
      expense: monthExpense,
      income: monthIncome,
      net: monthIncome - monthExpense,
      activeDays: activeDaysCount
    };
  }, [dailySpendingMap, currentYear, currentMonth]);

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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [selectedDateStr]);

  return (
    <div className={`ui-calendar-wrapper ${className}`} {...props}>
      {/* Calendar Header Navigation */}
      <div className="ui-cal-header">
        <div className="ui-cal-title-wrap">
          <CalendarIcon size={18} color="#059669" />
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

      {/* Monthly Outflow / Inflow Summary Strip */}
      <div className="ui-cal-monthly-strip">
        <div className="ui-cal-strip-col">
          <span className="ui-cal-strip-label">Spent This Month</span>
          <span className="ui-cal-strip-val expense">
            -{formatCurrency(monthlyStats.expense, 'INR', 1)}
          </span>
        </div>
        <div className="ui-cal-strip-divider" />
        <div className="ui-cal-strip-col">
          <span className="ui-cal-strip-label">Received This Month</span>
          <span className="ui-cal-strip-val income">
            +{formatCurrency(monthlyStats.income, 'INR', 1)}
          </span>
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

      {/* Days Grid with Readout Badges */}
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

              {/* Readout of Spent & Received Amount on Calendar Cell */}
              <div className="ui-cal-cell-amount-wrap">
                {hasSpend && (
                  <span
                    className="ui-cal-cell-badge expense"
                    title={`Spent: ${formatCurrency(item.spending.expense, 'INR', 1)}`}
                  >
                    -{item.spending.expense >= 1000 ? `${(item.spending.expense / 1000).toFixed(1)}k` : `₹${item.spending.expense}`}
                  </span>
                )}
                {hasIncome && !hasSpend && (
                  <span
                    className="ui-cal-cell-badge income"
                    title={`Received: ${formatCurrency(item.spending.income, 'INR', 1)}`}
                  >
                    +{item.spending.income >= 1000 ? `${(item.spending.income / 1000).toFixed(1)}k` : `₹${item.spending.income}`}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Spending & Inflow Intelligence Card */}
      <div className="ui-cal-day-details-panel">
        <div className="ui-cal-details-header">
          <div>
            <span className="ui-cal-details-date-label">{selectedDateFormatted}</span>
            <div className="ui-cal-details-summary">
              {selectedDayData.expense > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>
                    -{formatCurrency(selectedDayData.expense, 'INR', 1)} Spent
                  </span>
                  {selectedDayData.income > 0 && (
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#059669' }}>
                      (+{formatCurrency(selectedDayData.income, 'INR', 1)} Received)
                    </span>
                  )}
                </div>
              ) : selectedDayData.income > 0 ? (
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                  +{formatCurrency(selectedDayData.income, 'INR', 1)} Received
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontSize: '0.86rem', fontWeight: 700 }}>
                  <span>🍃</span>
                  <span>Zero Spending Day (No Outflow Recorded)</span>
                </div>
              )}
            </div>
          </div>

          {onOpenAddTx && (
            <button
              type="button"
              onClick={() => onOpenAddTx('expense')}
              className="btn-brand-pill"
              style={{ fontSize: '0.74rem', padding: '0.4rem 0.85rem' }}
            >
              <Plus size={13} />
              <span>Add Spend</span>
            </button>
          )}
        </div>

        {/* List of Specific Transactions for Selected Date */}
        {selectedDayData.transactions.length > 0 ? (
          <div className="ui-cal-tx-list">
            {selectedDayData.transactions.map(t => {
              const isIncome = t.type === 'income';

              return (
                <div key={t.id} className="ui-cal-tx-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isIncome ? '#ecfdf5' : '#fef2f2',
                      color: isIncome ? '#059669' : '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isIncome ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        {t.merchant || t.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{t.category}</span>
                        {t.paymentMethod && (
                          <>
                            <span>•</span>
                            <span style={{ fontWeight: 600 }}>{t.paymentMethod}</span>
                          </>
                        )}
                        {t.intentCategory && (
                          <>
                            <span>•</span>
                            <span style={{ color: '#2563eb', fontWeight: 600 }}>{t.intentCategory}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: isIncome ? '#059669' : '#dc2626'
                  }}>
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount, 'INR', 1)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            padding: '1rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px dashed #e2ede8',
            color: '#64748b',
            fontSize: '0.78rem'
          }}>
            No debit or credit transactions on this day.
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
