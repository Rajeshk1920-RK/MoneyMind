import React, { useState, useEffect } from 'react';
import { LandingPage } from '../components/Landing/LandingPage';
import { WebMainApp } from './WebMainApp';

/**
 * WebLandingApp
 * Orchestrates the Web Experience:
 * - Public Showcase Landing Page (with interactive feature tours, direct APK downloads, & demo previews)
 * - Complete Desktop Web Application (Navbar, Sidebar, full financial tracking & settlements)
 */
export function WebLandingApp() {
  const [webMode, setWebMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const validAppTabs = ['#dashboard', '#transactions', '#splitwise', '#budgets', '#goals', '#intelligence', '#reports', '#app'];
      if (validAppTabs.some(t => hash.startsWith(t))) {
        return 'app';
      }
    }
    return 'landing';
  });

  const [initialAppTab, setInitialAppTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['dashboard', 'transactions', 'splitwise', 'budgets', 'goals', 'intelligence', 'reports'];
      if (validTabs.includes(hash)) return hash;
    }
    return 'dashboard';
  });

  // Keep state synced with browser history/hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#landing' || hash === '' || hash === '#features' || hash === '#showcase' || hash === '#services' || hash === '#about' || hash === '#faq') {
        if (hash === '#landing') {
          setWebMode('landing');
          localStorage.setItem('moneymind_web_mode', 'landing');
        }
      } else {
        const validAppTabs = ['#dashboard', '#transactions', '#splitwise', '#budgets', '#goals', '#intelligence', '#reports', '#app'];
        if (validAppTabs.some(t => hash.startsWith(t))) {
          const tab = hash.replace('#', '');
          if (tab !== 'app') setInitialAppTab(tab);
          setWebMode('app');
          localStorage.setItem('moneymind_web_mode', 'app');
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleLaunchApp = (targetTab = 'dashboard') => {
    setInitialAppTab(targetTab);
    setWebMode('app');
    localStorage.setItem('moneymind_web_mode', 'app');
    if (typeof window !== 'undefined') {
      window.location.hash = `#${targetTab}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToLanding = () => {
    setWebMode('landing');
    localStorage.setItem('moneymind_web_mode', 'landing');
    if (typeof window !== 'undefined') {
      window.location.hash = '#landing';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (webMode === 'app') {
    return (
      <WebMainApp
        onBackToLanding={handleBackToLanding}
        initialTab={initialAppTab}
      />
    );
  }

  return (
    <LandingPage
      onLaunchApp={handleLaunchApp}
    />
  );
}
