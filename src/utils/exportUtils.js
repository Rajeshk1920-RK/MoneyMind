/**
 * Export Utilities: CSV Data Sheet & Formatted Printable PDF Reports
 */

export function exportTransactionsToCSV(transactions, filename = 'transactions_statement.csv') {
  if (!transactions || transactions.length === 0) {
    alert('No transactions to export!');
    return;
  }

  const headers = ['ID', 'Date', 'Type', 'Title', 'Merchant', 'Category', 'Amount (INR)', 'Payment Method', 'Intent Category', 'Intent Note', 'Intent For', 'Intent Captured', 'Source', 'Tags', 'Note'];
  
  const rows = transactions.map(t => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.type.toUpperCase()}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${(t.merchant || t.title || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.amount,
    `"${(t.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(t.intentCategory || '').replace(/"/g, '""')}"`,
    `"${(t.intentNote || '').replace(/"/g, '""')}"`,
    `"${(t.intentFor || '').replace(/"/g, '""')}"`,
    `"${Boolean(t.intentCaptured)}"`,
    `"${(t.source || 'manual')}"`,
    `"${(t.tags || []).join(', ')}"`,
    `"${(t.note || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportSplitSummaryToCSV(group) {
  if (!group) return;

  const headers = ['Expense ID', 'Date', 'Title', 'Category', 'Amount (INR)', 'Paid By'];
  const memberMap = new Map(group.members.map(m => [m.id, m.name]));

  const rows = group.expenses.map(e => [
    `"${e.id}"`,
    `"${e.date}"`,
    `"${(e.title || '').replace(/"/g, '""')}"`,
    `"${e.category || ''}"`,
    e.amount,
    `"${memberMap.get(e.paidBy) || e.paidBy}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [
    `"Group: ${group.name}"`,
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${group.name.replace(/\s+/g, '_')}_expenses.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function triggerPrintReport() {
  window.print();
}