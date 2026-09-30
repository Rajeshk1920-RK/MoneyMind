import React from 'react';
import { Capacitor } from '@capacitor/core';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { WebLandingApp } from './web/WebLandingApp';
import { MobileFinanceApp } from './mobile/MobileFinanceApp';

/**
 * MoneyMind Router
 * - Web Page (Browser / GitHub Pages): Serves the official MoneyMind Website with direct APK Download
 * - Android App (Capacitor Native / APK): Runs the Mobile Finance Application directly
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
        {isMobileApp ? <MobileFinanceApp /> : <WebLandingApp />}
      </FinanceProvider>
    </AuthProvider>
  );
}