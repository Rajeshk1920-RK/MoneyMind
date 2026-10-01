import React, { useState, useEffect } from 'react';
import logoImg from '@/assets/logo.png';
import { ShieldCheck, Sparkles } from 'lucide-react';
import './SplashScreen.css';

export function SplashScreen({ onFinish, duration = 2500 }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing private storage...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start progress animation synced with early app start time
    const startTime = (typeof window !== 'undefined' && window.__app_start_time) 
      ? window.__app_start_time 
      : Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 40) {
        setStatusText('Initializing secure wallet...');
      } else if (pct < 75) {
        setStatusText('Preparing on-device ledger...');
      } else if (pct < 98) {
        setStatusText('Securing transactions...');
      } else {
        setStatusText('Ready');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 350); // wait for fade out animation
      }
    }, 25);

    return () => clearInterval(interval);
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

      {/* Bottom Loading Bar Section */}
      <div className="splash-bottom-section">
        {/* Status text */}
        <div className="splash-status-row">
          <span className="splash-status-text">{statusText}</span>
          <span className="splash-percent-text">{progress}%</span>
        </div>

        {/* Progress Bar Track & Fill */}
        <div className="splash-progress-track">
          <div
            className="splash-progress-bar"
            style={{ width: `${progress}%` }}
          />
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
