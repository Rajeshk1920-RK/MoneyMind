import React, { useState } from 'react';
import {
  Printer,
  Download,
  FileText,
  Calendar,
  PieChart,
  DollarSign,
  Award
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportTransactionsToCSV, triggerPrintReport } from '../../utils/exportUtils';

import { getPaymentIntentStats } from '../PaymentIntent/paymentIntentUtils';

export function ReportsView() {
  const {
    transactions,
    activeProfile,
    totalIncome,
    totalExpense,
    netBalance,
    savingsRate,
    activeCurrency,
    activeCurrencyCode
  } = useFinance();

  const [selectedPeriod, setSelectedPeriod] = useState('2026-09');

  // Category breakdown
  const categorySummary = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categorySummary[t.category] = (categorySummary[t.category] || 0) + Number(t.amount);
  });

  // Dynamic Payment Intent stats
  const intentStats = getPaymentIntentStats(transactions);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header & Print Bar */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>Financial Reports & Statements</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Official statements, category tax breakdown & printable PDF audits
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => exportTransactionsToCSV(transactions, 'full_financial_report.csv')}
          >
            <Download size={16} />
            <span>Export CSV Sheet</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={triggerPrintReport}
          >
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Statement Sheet */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}
      >
        {/* Statement Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid var(--border-medium)',
          paddingBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              FinAI Statement of Account
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Period: September 2026 • Account: {activeProfile.name} ({activeProfile.role})
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Statement Generated On
            </span>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <span className="badge badge-split" style={{ marginTop: '0.25rem' }}>
              AUDITED BY FINAI
            </span>
          </div>
        </div>

        {/* High-level Summary 4-Column Box */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          padding: '1.25rem',
          backgroundColor: 'var(--bg-input)',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Inflow</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-income)' }}>
              +{formatCurrency(totalIncome, activeCurrencyCode, activeCurrency.rate)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Outflow</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-expense)' }}>
              -{formatCurrency(totalExpense, activeCurrencyCode, activeCurrency.rate)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Net Cash Reserve</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatCurrency(netBalance, activeCurrencyCode, activeCurrency.rate)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Savings Ratio</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              {savingsRate}%
            </div>
          </div>
        </div>

        {/* Category Expense Breakdown Table */}
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Category Outlay Breakdown
          </h3>
          <div className="table-responsive-container">
            <table style={{ width: '100%', minWidth: '400px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-tertiary)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Share of Total Spend</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categorySummary).map(([cat, amount]) => {
                const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
                return (
                  <tr key={cat} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {cat}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>
                      {formatCurrency(amount, activeCurrencyCode, activeCurrency.rate)}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* Spending Intent Breakdown Table */}
        <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                Spending Intent Breakdown
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Analysis of documented UPI payments and spending purposes
              </p>
            </div>
            <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontSize: '0.74rem' }}>
              {intentStats.captureRate}% Intent Capture Rate ({intentStats.capturedPayments}/{intentStats.totalUPIPayments})
            </span>
          </div>

          <div className="table-responsive-container">
            <table style={{ width: '100%', minWidth: '400px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-tertiary)', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Intent Reason / Category</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Transactions</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Explained Amount</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Share of UPI Spend</th>
                </tr>
              </thead>
              <tbody>
                {intentStats.categoryList.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                      No payment intents recorded in this period.
                    </td>
                  </tr>
                ) : (
                  intentStats.categoryList.map(item => (
                    <tr key={item.name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        {item.count}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>
                        {formatCurrency(item.amount, activeCurrencyCode, activeCurrency.rate)}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                        {item.percentage}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem',
          fontSize: '0.72rem',
          color: 'var(--text-tertiary)',
          textAlign: 'center'
        }}>
          MoneyMind Financial Statement • Encrypted & Local-First Financial Record • Generated for personal audit purposes.
        </div>
      </div>
    </div>
  );
}