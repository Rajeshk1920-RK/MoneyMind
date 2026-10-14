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
  const isMobileApp = isNative || (
    typeof window !== 'undefined' && (
      window.location.search.includes('platform=mobile') ||
      window.location.search.includes('mobile=true')
    )
  );

  return (
    <FinanceProvider>
      <SplitProvider>
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