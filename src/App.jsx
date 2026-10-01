import React, { Suspense, lazy } from 'react';
import { Capacitor } from '@capacitor/core';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';

const WebLandingApp = lazy(() => import('./web/WebLandingApp').then(m => ({ default: m.WebLandingApp })));
const MobileFinanceApp = lazy(() => import('./mobile/MobileFinanceApp').then(m => ({ default: m.MobileFinanceApp })));

/**
 * MoneyMind Router (High-performance code-split entry)
 */
export default function App() {
  const isNative = Capacitor.isNativePlatform();
  const isAppUrl = typeof window !== 'undefined' && (
    window.location.search.includes('app=true') || 
    window.location.hash === '#app'
  );

  const isMobileApp = isNative || isAppUrl;

  return (
    <AuthProvider>
      <FinanceProvider>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#ffffff' }} />}>
          {isMobileApp ? <MobileFinanceApp /> : <WebLandingApp />}
        </Suspense>
      </FinanceProvider>
    </AuthProvider>
  );
}