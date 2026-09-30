import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverTrigger, PopoverContent } from './popover';

/**
 * Modern DatePicker Component
 * Supports Date objects, string dates (YYYY-MM-DD), and internationalized date formats.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className = '',
  disabled = false,
  captionLayout = 'dropdown'
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Format date display string
  const formattedDate = React.useMemo(() => {
    if (!value) return null;
    
    // Handle @internationalized/date or custom objects
    if (typeof value === 'object' && value.toDate) {
      try {
        return value.toDate('Asia/Kolkata').toLocaleDateString('en-IN', {
          dateStyle: 'long'
        });
      } catch (err) {
        // Fallback
      }
    }

    // Handle standard Date object or string
    const d = new Date(value);
    if (isNaN(d.getTime())) return typeof value === 'string' ? value : null;

    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [value]);

  const handleSelectDate = (newDate) => {
    if (onChange) {
      onChange(newDate);
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} className={className}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          data-empty={!value}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            minHeight: '42px',
            padding: '0.6rem 0.95rem',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: value ? '#0f172a' : '#94a3b8',
            fontSize: '0.88rem',
            fontWeight: value ? 600 : 500,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <CalendarIcon size={16} color={value ? '#2563eb' : '#94a3b8'} />
            <span>{formattedDate || placeholder}</span>
          </div>
          <ChevronDown size={15} color="#94a3b8" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0" style={{ width: 'auto', minWidth: '320px', maxWidth: '360px', padding: 0 }}>
        <Calendar
          value={value}
          onChange={handleSelectDate}
          captionLayout={captionLayout}
          style={{ border: 'none', boxShadow: 'none', padding: '1rem' }}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * DatePickerDemo adhering directly to the user's snippet
 */
export function DatePickerDemo() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  return (
    <div style={{ width: '240px' }}>
      <DatePicker
        value={date}
        onChange={setDate}
        placeholder="Pick a date"
        captionLayout="dropdown"
      />
    </div>
  );
}

export default DatePicker;
