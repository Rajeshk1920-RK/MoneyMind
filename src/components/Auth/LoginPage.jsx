import React, { useState } from 'react';
import { User, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '@/assets/logo.png';
import confetti from 'canvas-confetti';
import './LoginPage.css';

/**
 * LoginPage Component
 * Full-screen modern mobile & web onboarding experience
 */
export function LoginPage({ onGuestAccess }) {
  const { createAccount } = useAuth();
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
        
        {/* Header & Brand */}
        <div className="login-header-section">
          <div className="login-logo-badge">
            <img
              src={logoImg}
              alt="MoneyMind Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h1 className="login-title">
            Welcome to MoneyMind
          </h1>
          <p className="login-subtitle">
            Smart, private personal finance & direct UPI tracker for your day-to-day cashflow.
          </p>
        </div>

        {/* Form Card */}
        <div className="login-form-card">
          {error && (
            <div className="login-error-banner">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

            {/* Submit Action */}
            <button
              type="submit"
              className="login-submit-btn"
            >
              <span>Get Started</span>
              <ArrowRight size={19} strokeWidth={2.5} />
            </button>
          </form>

          {/* Guest Access Option */}
          {onGuestAccess && (
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onGuestAccess}
                className="login-guest-btn"
              >
                Skip & Continue as Guest
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="login-footer-section">
          <div className="login-privacy-badge">
            <ShieldCheck size={16} color="#059669" />
            <span>100% Private • Encrypted On-Device Storage</span>
          </div>
        </div>

      </div>
    </div>
  );
}
