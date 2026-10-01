import React, { useState } from 'react';
import { User, Mail, ArrowRight, ShieldCheck, Zap, PieChart, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '@/assets/logo.png';
import confetti from 'canvas-confetti';
import './LoginPage.css';

/**
 * LoginPage Component
 * Full-screen Onboarding & Welcome experience with "Get Started" entry
 */
export function LoginPage({ onGuestAccess }) {
  const { createAccount } = useAuth();
  const [step, setStep] = useState('welcome'); // 'welcome' | 'form'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    createAccount(fullName.trim(), email.trim());

    // Celebration Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div className="login-page-fullscreen-wrapper">
      <div className="login-page-container">
        
        {step === 'welcome' ? (
          /* STEP 1: Welcome / Entry Screen with "Get Started" Button */
          <div className="welcome-screen-content">
            <div className="welcome-brand-section">
              <div className="welcome-logo-badge">
                <img
                  src={logoImg}
                  alt="MoneyMind Logo"
                  className="welcome-logo-img"
                />
              </div>

              <h1 className="welcome-brand-title">
                MoneyMind
              </h1>
              <p className="welcome-brand-tagline">
                Smarter Personal Finance & Direct UPI
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="welcome-features-list">
              <div className="welcome-feature-card">
                <div className="feature-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <Zap size={20} />
                </div>
                <div className="feature-text-wrap">
                  <h3 className="feature-card-title">Instant UPI & SMS Auto-Track</h3>
                  <p className="feature-card-desc">Scan, pay and auto-log banking alerts in real-time</p>
                </div>
              </div>

              <div className="welcome-feature-card">
                <div className="feature-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <PieChart size={20} />
                </div>
                <div className="feature-text-wrap">
                  <h3 className="feature-card-title">Smart Budgets & AI Insights</h3>
                  <p className="feature-card-desc">Personalized monthly budgets & wealth recommendations</p>
                </div>
              </div>

              <div className="welcome-feature-card">
                <div className="feature-icon-wrap" style={{ background: '#f8fafc', color: '#10b981' }}>
                  <ShieldCheck size={20} />
                </div>
                <div className="feature-text-wrap">
                  <h3 className="feature-card-title">100% Private On-Device</h3>
                  <p className="feature-card-desc">Your financial data stays securely encrypted with you</p>
                </div>
              </div>
            </div>

            {/* Primary Get Started Action */}
            <div className="welcome-action-section">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="welcome-get-started-btn"
              >
                <span>Get Started</span>
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>

              {onGuestAccess && (
                <button
                  type="button"
                  onClick={onGuestAccess}
                  className="welcome-guest-btn"
                >
                  Continue as Guest
                </button>
              )}
            </div>
          </div>
        ) : (
          /* STEP 2: Compact Login & Account Setup Form (Centered Logo & Balanced Spacing) */
          <div className="login-form-screen-content">
            
            {/* Centered Brand Header */}
            <div className="login-header-section">
              <div className="welcome-logo-badge">
                <img
                  src={logoImg}
                  alt="MoneyMind Logo"
                  className="welcome-logo-img"
                />
              </div>

              <h1 className="welcome-brand-title" style={{ fontSize: '1.95rem' }}>
                Setup Profile
              </h1>
              <p className="welcome-brand-tagline">
                Enter your details to initialize your private wallet
              </p>
            </div>

            {/* Form Fields Card */}
            <div className="login-form-card">
              {error && (
                <div className="login-error-banner">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Full Name */}
                <div className="login-field-group">
                  <label className="login-field-label">
                    Your Full Name
                  </label>
                  <div className="login-input-wrap">
                    <User size={19} className="login-input-icon" />
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="login-text-input"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="login-field-group">
                  <label className="login-field-label">
                    Email Address
                  </label>
                  <div className="login-input-wrap">
                    <Mail size={19} className="login-input-icon" />
                    <input
                      type="email"
                      placeholder="e.g. rajesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-text-input"
                      required
                    />
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  type="submit"
                  className="login-submit-btn"
                >
                  <span>Launch Wallet</span>
                  <ArrowRight size={19} strokeWidth={2.5} />
                </button>
              </form>

              {/* Action Links */}
              <div className="login-action-links-row">
                <button
                  type="button"
                  onClick={() => setStep('welcome')}
                  className="login-back-link"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Overview</span>
                </button>

                {onGuestAccess && (
                  <button
                    type="button"
                    onClick={onGuestAccess}
                    className="login-guest-btn"
                  >
                    Continue as Guest
                  </button>
                )}
              </div>
            </div>

            {/* Privacy Badge */}
            <div className="login-footer-section">
              <div className="login-privacy-badge">
                <ShieldCheck size={16} color="#059669" />
                <span>100% Private • On-Device Encrypted</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
