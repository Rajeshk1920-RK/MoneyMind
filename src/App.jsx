import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { MobileFinanceApp } from './mobile/MobileFinanceApp';

/**
 * MoneyMind Mobile App
 * Direct Mobile Application (No web landing page)
 */
export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <MobileFinanceApp />
      </FinanceProvider>
    </AuthProvider>
  );
}