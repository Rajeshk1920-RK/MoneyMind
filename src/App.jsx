import React, { Suspense, lazy } from 'react';
import { Capacitor } from '@capacitor/core';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { MobileFinanceApp } from './mobile/MobileFinanceApp';

const WebLandingApp = lazy(() => import('./web/WebLandingApp').then(m => ({ default: m.WebLandingApp })));

/**
 * MoneyMind Router
 * - Mobile App: Synchronous 0ms immediate render with zero white-screen flash
 * - Web Landing App: Lazy loaded for browser visitors
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
        {isMobileApp ? (
          <MobileFinanceApp />
        ) : (
          <Suspense fallback={<div style={{ minHeight: '100vh', background: '#ffffff' }} />}>
            <WebLandingApp />
          </Suspense>
        )}
      </FinanceProvider>
    </AuthProvider>
  );
}