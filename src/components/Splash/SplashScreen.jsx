import React, { useState, useEffect } from 'react';
import logoImg from '@/assets/logo.png';
import { ShieldCheck } from 'lucide-react';
import './SplashScreen.css';

export function SplashScreen({ onFinish, duration = 1800 }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Determine elapsed time since early boot
    const startTime = (typeof window !== 'undefined' && window.__app_start_time) 
      ? window.__app_start_time 
      : Date.now();
    
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(400, duration - elapsed);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 250); // Fast smooth fade transition
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div className={`splash-screen-fullscreen ${isFadingOut ? 'splash-fade-out' : ''}`}>
      {/* Background Radial Glow */}
      <div className="splash-ambient-glow" />

      {/* Main Center Content */}
      <div className="splash-center-content">
        {/* Animated Brand Logo Badge */}
        <div className="splash-logo-container">
          <div className="splash-logo-ring" />
          <div className="splash-logo-badge">
            <img
              src={logoImg}
              alt="MoneyMind Logo"
              className="splash-logo-img"
            />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="splash-brand-text">
          <h1 className="splash-brand-title">MoneyMind</h1>
          <p className="splash-brand-tagline">Smart Personal Finance & Direct UPI</p>
        </div>
      </div>

      {/* Bottom Loading Bar Section (Pure GPU CSS Animated - 0 Lag) */}
      <div className="splash-bottom-section">
        <div className="splash-status-row">
          <span className="splash-status-text">Securing wallet & ledger...</span>
          <span className="splash-percent-text">Quick Start</span>
        </div>

        {/* Progress Track & Animated Bar */}
        <div className="splash-progress-track">
          <div className="splash-progress-bar-gpu" />
        </div>

        {/* Encrypted On-Device Note */}
        <div className="splash-security-tag">
          <ShieldCheck size={14} color="#10b981" />
          <span>100% Private On-Device Encrypted</span>
        </div>
      </div>
    </div>
  );
}
