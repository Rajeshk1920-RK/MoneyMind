import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Zap, PieChart, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '@/assets/logo.png';
import confetti from 'canvas-confetti';
import './LoginPage.css';

/**
 * LoginPage Component
 * Full-screen Onboarding & Welcome experience with "Get Started" entry & Password field
 */
export function LoginPage({ onGuestAccess }) {
  const { createAccount, signIn } = useAuth();
  const [step, setStep] = useState('welcome'); // 'welcome' | 'form'
  const [authMode, setAuthMode] = useState('signup'); // 'signin' | 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (authMode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!confirmPassword) {
        setError('Please confirm your password.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please make sure both passwords match.');
        return;
      }

      setLoading(true);
      try {
        await createAccount(fullName.trim(), email.trim(), password);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      } catch (err) {
        setError(err.message || 'Failed to create account.');
      } finally {
        setLoading(false);
      }
    } else {
      // Sign In mode
      setLoading(true);
      try {
        const u = await signIn(email.trim(), password);
        if (!u) {
          setError('Invalid email or password.');
        } else {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch {}
        }
      } catch (err) {
        setError(err.message || 'Invalid email or password.');
      } finally {
        setLoading(false);
      }
    }
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
          /* STEP 2: Compact Login & Account Setup Form with Password */
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
                {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="welcome-brand-tagline">
                {authMode === 'signup' 
                  ? 'Enter your details & password to secure your wallet'
                  : 'Sign in to access your wallet & cloud data'
                }
              </p>
            </div>

            {/* Form Fields Card */}
            <div className="login-form-card">
              {/* Segmented Switcher Tabs */}
              <div className="login-mode-tabs">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(''); }}
                  className={`login-mode-tab ${authMode === 'signup' ? 'active' : ''}`}
                >
                  <User size={15} />
                  <span>Sign Up</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(''); }}
                  className={`login-mode-tab ${authMode === 'signin' ? 'active' : ''}`}
                >
                  <Lock size={15} />
                  <span>Sign In</span>
                </button>
              </div>

              {error && (
                <div className="login-error-banner">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Full Name (Sign Up only) */}
                {authMode === 'signup' && (
                  <div className="login-field-group">
                    <label className="login-field-label">
                      Your Full Name
                    </label>
                    <div className="login-input-wrap">
                      <User size={18} className="login-input-icon" />
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
                )}

                {/* Email Address */}
                <div className="login-field-group">
                  <label className="login-field-label">
                    Email Address
                  </label>
                  <div className="login-input-wrap">
                    <Mail size={18} className="login-input-icon" />
                    <input
                      type="email"
                      placeholder="e.g. rajesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-text-input"
                      autoFocus={authMode === 'signin'}
                      required
                    />
                  </div>
                </div>

                {/* Password Section */}
                <div className="login-field-group">
                  <label className="login-field-label">
                    Password
                  </label>
                  <div className="login-input-wrap">
                    <Lock size={18} className="login-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password (min. 6 chars)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-text-input login-password-input"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="login-password-toggle-btn"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Section (Sign Up only) */}
                {authMode === 'signup' && (
                  <div className="login-field-group">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <label className="login-field-label" style={{ marginBottom: 0 }}>
                        Confirm Password
                      </label>
                      {confirmPassword && password && (
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: password === confirmPassword ? '#059669' : '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {password === confirmPassword ? (
                            <>
                              <CheckCircle2 size={12} />
                              <span>Passwords Match</span>
                            </>
                          ) : (
                            <span>Does not match</span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="login-input-wrap">
                      <Lock size={18} className="login-input-icon" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password to confirm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="login-text-input login-password-input"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="login-password-toggle-btn"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Launch Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="login-submit-btn"
                >
                  <span>{loading ? 'Verifying...' : authMode === 'signup' ? 'Create Account' : 'Sign In to Account'}</span>
                  <ArrowRight size={19} strokeWidth={2.5} />
                </button>
              </form>

              {/* Mode Toggle Link */}
              <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'signup' ? 'signin' : 'signup');
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#059669',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  {authMode === 'signup' 
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Sign Up"
                  }
                </button>
              </div>

              {/* Action Links */}
              <div className="login-action-links-row" style={{ marginTop: '0.5rem' }}>
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
