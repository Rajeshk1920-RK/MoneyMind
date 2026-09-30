import React, { useState } from 'react';
import {
  Send,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export function LoginPage({ onGuestAccess }) {
  const { signIn, signUp, sendOtp, verifyOtp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [authStep, setAuthStep] = useState('email'); // 'email' | 'otp'
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' | 'password'
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Send OTP via Resend
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await sendOtp(email.trim(), fullName.trim());
      setAuthStep('otp');
      setSuccess(res.message || `6-digit verification code sent to ${email.trim()}`);
    } catch (err) {
      setError(err.message || 'Failed to send verification code. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify 6-digit OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp.trim() || otp.trim().length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await verifyOtp(email.trim(), otp.trim(), fullName.trim());
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login
  const handlePasswordAuth = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email.trim(), password, fullName.trim());
      } else {
        await signIn(email.trim(), password);
      }
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      backgroundColor: '#dce4f2',
      background: 'radial-gradient(circle at 10% 15%, #ecf2fc 0%, #d8e3f2 90%)',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient background blur orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '15%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '10%',
        width: '460px',
        height: '460px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(41, 81, 234, 0.12) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* Main Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#ffffff',
        borderRadius: '28px',
        padding: '2.5rem 2.25rem',
        boxShadow: '0 20px 60px rgba(110, 130, 160, 0.14)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Header with Origami 'M' Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: '#141720',
            boxShadow: '0 8px 24px rgba(20, 23, 32, 0.2)',
            marginBottom: '0.85rem'
          }}>
            <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
              <path d="M4 27L4 7L13 18L13 27L4 27Z" fill="#ffffff" />
              <path d="M13 18L21 8L21 27L13 27L13 18Z" fill="#9aa8bc" />
              <path d="M21 8L30 18L30 27L21 27L21 8Z" fill="#ffffff" />
            </svg>
          </div>

          <h1 style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            color: '#131826',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Money Mind
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: '#748296',
            marginTop: '4px',
            fontWeight: 500
          }}>
            Start managing your finances
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        {authStep === 'email' && (
          <div style={{
            display: 'flex',
            backgroundColor: '#edf2fa',
            borderRadius: '14px',
            padding: '4px',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 700,
                backgroundColor: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? '#131826' : '#748296',
                boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.16s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 700,
                backgroundColor: mode === 'signup' ? '#ffffff' : 'transparent',
                color: mode === 'signup' ? '#131826' : '#748296',
                boxShadow: mode === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.16s ease'
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Step indicator when in OTP mode */}
        {authStep === 'otp' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 0.95rem',
            backgroundColor: '#eff4fc',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => { setAuthStep('email'); setOtp(''); setError(''); setSuccess(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#2563eb',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={15} />
              <span>Change Email</span>
            </button>
            <span style={{ fontSize: '0.82rem', color: '#55657a', fontWeight: 600 }}>
              {email}
            </span>
          </div>
        )}

        {/* Feedback Alerts */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={16} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* STEP 1: Enter Email & Full Name (OTP Mode) */}
        {authStep === 'email' && authMethod === 'otp' && (
          <form onSubmit={handleSendOtp}>
            {mode === 'signup' && (
              <div style={{ marginBottom: '1.15rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#131826', marginBottom: '0.4rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9aa8bc' }} />
                  <input
                    type="text"
                    placeholder="Rajesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem 0.85rem 2.65rem',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      border: '1px solid #d4e0f0',
                      backgroundColor: '#ffffff'
                    }}
                    required
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.35rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#131826', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9aa8bc' }} />
                <input
                  type="email"
                  placeholder="rajeshrajeshk1920@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.65rem',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: '1px solid #d4e0f0',
                    backgroundColor: '#ffffff'
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-dark-pill"
              style={{
                width: '100%',
                padding: '0.95rem',
                justifyContent: 'center',
                borderRadius: '14px',
                fontSize: '0.95rem',
                backgroundColor: '#141720',
                boxShadow: '0 6px 20px rgba(20, 23, 32, 0.25)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <Send size={16} style={{ transform: 'rotate(-25deg)' }} />
                  <span>Send 6-Digit Verification Code</span>
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => { setAuthMethod('password'); setError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Or Sign In with Password instead
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Enter 6-Digit OTP */}
        {authStep === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#131826', marginBottom: '0.65rem' }}>
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                placeholder="••••••"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.35em',
                  textAlign: 'center',
                  borderRadius: '14px',
                  border: '2px solid #2563eb',
                  backgroundColor: '#ffffff',
                  color: '#131826'
                }}
                autoFocus
                required
              />
              <p style={{ fontSize: '0.78rem', color: '#748296', marginTop: '0.5rem' }}>
                We sent a 6-digit code to your email inbox
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="btn-dark-pill"
              style={{
                width: '100%',
                padding: '0.95rem',
                justifyContent: 'center',
                borderRadius: '14px',
                fontSize: '0.95rem',
                backgroundColor: '#141720',
                boxShadow: '0 6px 20px rgba(20, 23, 32, 0.25)',
                opacity: (loading || otp.length < 6) ? 0.7 : 1,
                cursor: (loading || otp.length < 6) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Verify Code & Open Dashboard</span>
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.15rem' }}>
              <button
                type="button"
                disabled={loading}
                onClick={handleSendOtp}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Didn't receive the code? Resend Code
              </button>
            </div>
          </form>
        )}

        {/* Alternative: Password Login */}
        {authStep === 'email' && authMethod === 'password' && (
          <form onSubmit={handlePasswordAuth}>
            {mode === 'signup' && (
              <div style={{ marginBottom: '1.15rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#131826', marginBottom: '0.4rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9aa8bc' }} />
                  <input
                    type="text"
                    placeholder="Rajesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem 0.85rem 2.65rem',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      borderRadius: '12px',
                      border: '1px solid #d4e0f0',
                      backgroundColor: '#ffffff'
                    }}
                    required
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.15rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#131826', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9aa8bc' }} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.65rem',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: '1px solid #d4e0f0',
                    backgroundColor: '#ffffff'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.35rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#131826', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9aa8bc' }} />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.65rem',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: '1px solid #d4e0f0',
                    backgroundColor: '#ffffff'
                  }}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-dark-pill"
              style={{
                width: '100%',
                padding: '0.95rem',
                justifyContent: 'center',
                borderRadius: '14px',
                fontSize: '0.95rem',
                backgroundColor: '#141720',
                boxShadow: '0 6px 20px rgba(20, 23, 32, 0.25)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Sign In to Money Mind' : 'Create Free Account'}</span>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => { setAuthMethod('otp'); setError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Or Send 6-Digit Verification Code to Email
              </button>
            </div>
          </form>
        )}

        {/* Guest Demo Preview Link */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #eef2f8',
          textAlign: 'center'
        }}>
          <button
            type="button"
            onClick={onGuestAccess}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.82rem',
              color: '#748296',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Just exploring? <span style={{ color: '#131826', fontWeight: 700, textDecoration: 'underline' }}>Continue as Guest</span>
          </button>
        </div>
      </div>
    </div>
  );
}
