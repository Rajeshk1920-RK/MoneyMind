import React from 'react';
import { Capacitor } from '@capacitor/core';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { WebLandingApp } from './web/WebLandingApp';
import { MobileFinanceApp } from './mobile/MobileFinanceApp';

/**
 * Main Application Root
 * - Web Browser: Strictly displays the Web Showcase Page (with APK Download, Features, Creator Badge)
 * - Native Android / Capacitor App (or #app preview): Displays the Mobile Finance App
 */
export default function App() {
  const isNative = Capacitor.isNativePlatform();
  const isAppUrl = typeof window !== 'undefined' && (
    window.location.search.includes('app=true') || 
    window.location.hash === '#app'
  );

  // If on Native Android Platform or explicit app hash -> Render Mobile App
  const isMobileApp = isNative || isAppUrl;

  return (
    <AuthProvider>
      <FinanceProvider>
        {isMobileApp ? <MobileFinanceApp /> : <WebLandingApp />}
      </FinanceProvider>
    </AuthProvider>
  );
}