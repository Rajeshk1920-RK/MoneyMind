import React, { Suspense, lazy } from 'react';
import { Capacitor } from '@capacitor/core';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { SplitProvider } from './context/SplitContext';
import { MobileFinanceApp } from './mobile/MobileFinanceApp';

const WebLandingApp = lazy(() => import('./web/WebLandingApp').then(m => ({ default: m.WebLandingApp })));

function MainAppRouter() {
  const { user } = useAuth();
  const isNative = Capacitor.isNativePlatform();
  const isAppUrl = typeof window !== 'undefined' && (
    window.location.search.includes('app=true') || 
    window.location.hash === '#app'
  );
  const isMobileApp = isNative || isAppUrl;

  // Keying FinanceProvider by user.id guarantees fresh, isolated state per account
  const accountKey = user?.id || 'guest';

  return (
    <FinanceProvider key={accountKey}>
      <SplitProvider key={accountKey}>
        {isMobileApp ? (
          <MobileFinanceApp />
        ) : (
          <Suspense fallback={<div style={{ minHeight: '100vh', background: '#ffffff' }} />}>
            <WebLandingApp />
          </Suspense>
        )}
      </SplitProvider>
    </FinanceProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppRouter />
    </AuthProvider>
  );
}