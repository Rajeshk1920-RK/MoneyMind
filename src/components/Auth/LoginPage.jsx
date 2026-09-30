import React, { useState } from 'react';
import { User, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '@/assets/logo.png';
import confetti from 'canvas-confetti';

/**
 * Create Account Screen
 * Simple & direct onboarding: Ask for Name and Email to immediately initialize the user's private wallet.
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
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#ffffff',
        borderRadius: '28px',
        padding: '2.25rem 1.75rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: '#ecfdf5',
            border: '2px solid #a7f3d0',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            padding: '6px',
            boxShadow: '0 8px 20px rgba(5, 150, 105, 0.15)'
          }}>
            <img
              src={logoImg}
              alt="MoneyMind"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#0f172a',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.025em',
            margin: '0 0 0.4rem 0'
          }}>
            Create Your Account
          </h1>
          <p style={{
            fontSize: '0.88rem',
            color: '#64748b',
            margin: 0,
            lineHeight: 1.45
          }}>
            Enter your name & email to set up your private MoneyMind cashflow wallet.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            borderRadius: '14px',
            padding: '0.75rem 1rem',
            fontSize: '0.84rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Form: Name & Email only */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Full Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '0.45rem'
            }}>
              Your Name
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }}
              />
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.65rem',
                  borderRadius: '14px',
                  border: '1.5px solid #e2e8f0',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  boxSizing: 'border-box'
                }}
                autoFocus
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '0.45rem'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }}
              />
              <input
                type="email"
                placeholder="e.g. rajesh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.65rem',
                  borderRadius: '14px',
                  border: '1.5px solid #e2e8f0',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            style={{
              marginTop: '0.75rem',
              width: '100%',
              padding: '0.95rem',
              borderRadius: '9999px',
              backgroundColor: '#059669',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.3)',
              transition: 'transform 0.15s ease'
            }}
          >
            <span>Create Account</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Privacy Note */}
        <div style={{
          marginTop: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          color: '#059669',
          fontSize: '0.76rem',
          fontWeight: 700
        }}>
          <ShieldCheck size={16} />
          <span>100% Private • Local Storage Encryption</span>
        </div>
      </div>
    </div>
  );
}
