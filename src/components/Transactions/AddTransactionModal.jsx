import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Tag,
  CreditCard,
  Layers,
  ChevronDown,
  Utensils,
  Plane,
  Home,
  Zap,
  ShoppingBag,
  Film,
  HeartPulse,
  TrendingUp,
  Briefcase,
  Laptop,
  Coins,
  Smartphone,
  Building2,
  Banknote,
  DollarSign
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { DatePicker } from '../ui/date-picker';

const CATEGORY_ICON_MAP = {
  'Food & Dining': Utensils,
  'Travel & Transport': Plane,
  'Housing & Rent': Home,
  'Utilities & Bills': Zap,
  'Shopping & Electronics': ShoppingBag,
  'Entertainment & Subs': Film,
  'Healthcare & Wellness': HeartPulse,
  'Investments & Savings': TrendingUp,
  'Salary & Compensation': Briefcase,
  'Freelance & Side Income': Laptop,
  'Dividends & Returns': Coins
};

const PAYMENT_METHODS = [
  { id: 'UPI', name: 'UPI (GPay / PhonePe / Paytm)', icon: Smartphone, color: '#059669', bg: '#ecfdf5' },
  { id: 'Credit Card', name: 'Credit Card', icon: CreditCard, color: '#2563eb', bg: '#eff6ff' },
  { id: 'Debit Card', name: 'Debit Card', icon: CreditCard, color: '#0284c7', bg: '#f0f9ff' },
  { id: 'Net Banking', name: 'Net Banking (NEFT/IMPS)', icon: Building2, color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'Cash', name: 'Cash in Hand', icon: Banknote, color: '#10b981', bg: '#ecfdf5' }
];

export function AddTransactionModal({ isOpen = true, onClose, initialType = 'expense' }) {
  const { categories, addTransaction, activeCurrencyCode } = useFinance();

  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(initialType === 'income' ? 'Salary & Compensation' : 'Food & Dining');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState('');
  const [note, setNote] = useState('');

  // Custom Dropdown Open States
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const categoryRef = useRef(null);
  const paymentRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
      if (paymentRef.current && !paymentRef.current.contains(e.target)) {
        setIsPaymentOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) {
      alert('Please provide a title and amount!');
      return;
    }

    addTransaction({
      type,
      title,
      amount: parseFloat(amount),
      category,
      paymentMethod,
      date,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      note
    });

    // Reset form & close
    setTitle('');
    setAmount('');
    setNote('');
    setTags('');
    onClose();
  };

  const filteredCategories = categories.filter(c => c.type === type);
  const selectedCatObj = categories.find(c => c.name === category) || categories[0];
  const SelectedCatIcon = CATEGORY_ICON_MAP[category] || Layers;

  const selectedPayObj = PAYMENT_METHODS.find(p => p.id === paymentMethod) || PAYMENT_METHODS[0];
  const SelectedPayIcon = selectedPayObj.icon;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '0.75rem', alignItems: 'center' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          maxHeight: '92vh',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22)',
          border: '1px solid #e2ede8',
          overflow: 'hidden'
        }}
      >
        {/* Fixed Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2ede8',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          flexShrink: 0
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Record New Transaction
            </h3>
            <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0', fontWeight: 600 }}>
              Log an income or expense into your personal cashflow
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable Form Body with generous bottom room */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem 3.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.15rem',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          
          {/* 1. Segmented Expense / Income Switcher */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            padding: '4px',
            backgroundColor: '#f1f5f9',
            borderRadius: '14px'
          }}>
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('Food & Dining');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: type === 'expense' ? '#ef4444' : 'transparent',
                color: type === 'expense' ? '#ffffff' : '#64748b',
                boxShadow: type === 'expense' ? '0 2px 8px rgba(239, 68, 68, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <ArrowDownLeft size={16} />
              <span>Expense (-)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Salary & Compensation');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.65rem',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: type === 'income' ? '#059669' : 'transparent',
                color: type === 'income' ? '#ffffff' : '#64748b',
                boxShadow: type === 'income' ? '0 2px 8px rgba(5, 150, 105, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <ArrowUpRight size={16} />
              <span>Income (+)</span>
            </button>
          </div>

          {/* 2. Amount Input Section */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Amount ({activeCurrencyCode})</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{
                position: 'absolute',
                left: '14px',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: type === 'expense' ? '#ef4444' : '#059669',
                pointerEvents: 'none'
              }}>
                ₹
              </span>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
                style={{
                  paddingLeft: '34px',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  height: '50px'
                }}
                autoFocus
              />
            </div>
          </div>

          {/* 3. Title / Merchant Field */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Title / Merchant Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Swiggy, Groceries, Client Project"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>

          {/* 4. MODERN CUSTOM CATEGORY & PAYMENT METHOD SELECTORS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
            
            {/* Custom Category Picker */}
            <div className="form-group" style={{ margin: 0, position: 'relative' }} ref={categoryRef}>
              <label className="form-label">Category</label>
              
              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsPaymentOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#ffffff',
                  border: isCategoryOpen ? '1.5px solid #059669' : '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: isCategoryOpen ? '0 0 0 3px rgba(5, 150, 105, 0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    backgroundColor: selectedCatObj?.color ? `${selectedCatObj.color}18` : '#ecfdf5',
                    color: selectedCatObj?.color || '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SelectedCatIcon size={14} />
                  </div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                    {category}
                  </span>
                </div>
                <ChevronDown size={15} color="#64748b" style={{ transform: isCategoryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
              </button>

              {/* Modern Category Dropdown Menu */}
              {isCategoryOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '6px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2ede8',
                  boxShadow: '0 16px 36px rgba(15, 23, 42, 0.18)',
                  padding: '0.45rem',
                  zIndex: 99,
                  maxHeight: '220px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  animation: 'bubbleFadeIn 0.15s ease'
                }}>
                  {filteredCategories.map(cat => {
                    const CatIcon = CATEGORY_ICON_MAP[cat.name] || Layers;
                    const isSelected = cat.name === category;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setCategory(cat.name);
                          setIsCategoryOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? '#ecfdf5' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.1s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '8px',
                            backgroundColor: cat.color ? `${cat.color}20` : '#ecfdf5',
                            color: cat.color || '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <CatIcon size={14} />
                          </div>
                          <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#065f46' : '#1e293b' }}>
                            {cat.name}
                          </span>
                        </div>
                        {isSelected && <Check size={14} color="#059669" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Custom Payment Method Picker */}
            <div className="form-group" style={{ margin: 0, position: 'relative' }} ref={paymentRef}>
              <label className="form-label">Payment Method</label>

              <button
                type="button"
                onClick={() => {
                  setIsPaymentOpen(!isPaymentOpen);
                  setIsCategoryOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#ffffff',
                  border: isPaymentOpen ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: isPaymentOpen ? '0 0 0 3px rgba(37, 99, 235, 0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    backgroundColor: selectedPayObj.bg,
                    color: selectedPayObj.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SelectedPayIcon size={14} />
                  </div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                    {selectedPayObj.name.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown size={15} color="#64748b" style={{ transform: isPaymentOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
              </button>

              {/* Modern Payment Dropdown Menu */}
              {isPaymentOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '6px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2ede8',
                  boxShadow: '0 16px 36px rgba(15, 23, 42, 0.18)',
                  padding: '0.45rem',
                  zIndex: 99,
                  maxHeight: '220px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  animation: 'bubbleFadeIn 0.15s ease'
                }}>
                  {PAYMENT_METHODS.map(pay => {
                    const PayIcon = pay.icon;
                    const isSelected = pay.id === paymentMethod;

                    return (
                      <div
                        key={pay.id}
                        onClick={() => {
                          setPaymentMethod(pay.id);
                          setIsPaymentOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.1s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '8px',
                            backgroundColor: pay.bg,
                            color: pay.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <PayIcon size={14} />
                          </div>
                          <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#1e40af' : '#1e293b' }}>
                            {pay.name}
                          </span>
                        </div>
                        {isSelected && <Check size={14} color="#2563eb" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* 5. Date & Tags 2-Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Transaction Date</label>
              <DatePicker
                value={date}
                onChange={(newDate) => setDate(newDate)}
                placeholder="Select date"
                captionLayout="dropdown"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tags (Optional)</label>
              <input
                type="text"
                placeholder="e.g. food, trip, office"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* 6. Notes Field */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Notes / Bill Reference (Optional)</label>
            <input
              type="text"
              placeholder="Add details, UPI transaction ref ID, or location..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-control"
            />
          </div>

          {/* 7. Action Button Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#64748b',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.4rem',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: type === 'expense' ? '#ef4444' : '#059669',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: type === 'expense'
                  ? '0 4px 14px rgba(239, 68, 68, 0.3)'
                  : '0 4px 14px rgba(5, 150, 105, 0.3)'
              }}
            >
              <Check size={16} />
              <span>Save {type === 'expense' ? 'Expense' : 'Income'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;