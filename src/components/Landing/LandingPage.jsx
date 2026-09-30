import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  PieChart,
  Target,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
  Star,
  Search,
  Bell,
  X,
  Lock,
  Mail,
  Check,
  Globe,
  Loader2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  MessageSquare,
  Download,
  Smartphone,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '@/assets/logo.png';

const GithubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function LandingPage({ onLaunchApp, onOpenAuth }) {
  const { user, isAuthenticated, signIn, signUp, sendOtp, verifyOtp } = useAuth();
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [authStep, setAuthStep] = useState('email'); // 'email' | 'otp'
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' | 'password'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [showApkModal, setShowApkModal] = useState(false);

  const handleDownloadApk = () => {
    const releaseUrl = 'https://github.com/Rajeshk1920-RK/MoneyMind/releases/download/v1.0-latest/MoneyMind-v1.0.apk';
    const link = document.createElement('a');
    link.href = releaseUrl;
    link.download = 'MoneyMind-v1.0.apk';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowApkModal(true);
  };

  const openAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
    setAuthStep('email');
    setAuthEmail('');
    setAuthPassword('');
    setAuthFullName('');
    setAuthOtp('');
    setAuthError('');
    setAuthSuccess('');
  };

  const closeAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
    setAuthStep('email');
    setAuthOtp('');
    setAuthPassword('');
    setAuthError('');
    setAuthSuccess('');
  };

  // 1. Send OTP to user's entered email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    try {
      const res = await sendOtp(authEmail.trim(), authFullName.trim());
      setAuthStep('otp');
      setAuthSuccess(res.message || `6-digit verification code sent to ${authEmail.trim()}`);
    } catch (err) {
      setAuthError(err.message || 'Failed to send verification code. Please check your backend connection.');
    } finally {
      setAuthLoading(false);
    }
  };

  // 2. Verify 6-digit OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!authOtp.trim() || authOtp.trim().length < 6) {
      setAuthError('Please enter the complete 6-digit verification code.');
      return;
    }

    setAuthError('');
    setAuthLoading(true);

    try {
      await verifyOtp(authEmail.trim(), authOtp.trim(), authFullName.trim());
      closeAuth();
      onLaunchApp();
    } catch (err) {
      setAuthError(err.message || 'Invalid or expired verification code.');
    } finally {
      setAuthLoading(false);
    }
  };

  // 3. Optional Password Login / Register
  const handleEmailAuth = async (e) => {
    if (e) e.preventDefault();
    if (!authEmail.trim() || !authPassword) {
      setAuthError('Please provide both email and password.');
      return;
    }

    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    try {
      if (authModal.mode === 'signup') {
        await signUp(authEmail.trim(), authPassword, authFullName.trim());
      } else {
        await signIn(authEmail.trim(), authPassword);
      }
      closeAuth();
      onLaunchApp();
    } catch (err) {
      console.error('PostgreSQL Auth error:', err);
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleProtectedAction = () => {
    if (onLaunchApp) {
      onLaunchApp();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fcfdfd',
      color: '#0f172a',
      fontFamily: 'var(--font-body)',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Top Header / Navigation */}
      <header style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 50
      }}>
        {/* Left: Logo & Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(5, 150, 105, 0.2), 0 1px 3px rgba(0, 0, 0, 0.08)',
            border: '2px solid #a7f3d0',
            padding: '3px'
          }}>
            <img
              src={logoImg}
              alt="MoneyMind"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-display)', letterSpacing: '-0.025em' }}>
            MoneyMind
          </span>
        </div>

        {/* Right Actions: Download APK Only */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Download APK Button */}
          <button
            onClick={handleDownloadApk}
            style={{
              padding: '0.65rem 1.45rem',
              borderRadius: '9999px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              transition: 'all 0.16s ease'
            }}
            title="Download Android APK (v1.0)"
          >
            <Download size={16} />
            <span>Download APK</span>
          </button>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section style={{
        maxWidth: '1040px',
        margin: '0 auto',
        padding: '3rem 1.5rem 5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Floating App Icon Badge */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '20px',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(5, 150, 105, 0.15)',
          border: '1.5px solid #a7f3d0',
          marginBottom: '1.75rem',
          padding: '8px'
        }}>
          <img src={logoImg} alt="MoneyMind App" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 6vw, 4.4rem)',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.035em',
          lineHeight: 1.08,
          marginBottom: '1.25rem',
          fontFamily: 'var(--font-display)'
        }}>
          Expense tracking that works.<br />
          <span style={{ color: '#059669' }}>No cloud. No limits.</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: '#526b64',
          maxWidth: '680px',
          lineHeight: 1.6,
          fontWeight: 500,
          marginBottom: '2.5rem'
        }}>
          MoneyMind is a 100% private personal finance tracker for Android and Web with automated bank SMS detection, visual cashflow analytics, zero forced cloud lock-in, and radical privacy.
        </p>

        {/* Hero CTA Action Buttons - Download APK Only */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem'
        }}>
          {/* Download APK Primary Action */}
          <button
            onClick={handleDownloadApk}
            style={{
              padding: '0.95rem 2.5rem',
              borderRadius: '9999px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 26px rgba(15, 23, 42, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              border: 'none',
              transition: 'all 0.18s ease'
            }}
          >
            <Download size={20} />
            <span>Download APK</span>
          </button>
        </div>
      </section>

      {/* Floating Creator Widget (Bottom Right like Screenshot) */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.5rem',
        zIndex: 100
      }}>
        {/* Creator Speech Bubble */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px 16px 4px 16px',
          padding: '0.75rem 1rem',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
          border: '1.5px solid #0f172a',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: '#0f172a',
          maxWidth: '220px',
          lineHeight: 1.35
        }}>
          Hi! I'm Rajesh, creator of MoneyMind. Enjoying the app?
        </div>

        {/* Creator Badge Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: '#ffffff',
          borderRadius: '9999px',
          padding: '0.45rem 0.9rem',
          boxShadow: '0 6px 20px rgba(15, 23, 42, 0.12)',
          border: '1.5px solid #0f172a'
        }}>
          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>Rajesh</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
            <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#0f172a' }} title="GitHub">
              <GithubIcon size={15} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#0f172a' }} title="LinkedIn">
              <LinkedinIcon size={15} />
            </a>
            <button onClick={() => alert('Contact: rajesh@moneymind.app')} style={{ color: '#0f172a', padding: 0 }} title="Contact Email">
              <Mail size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* APK Download Instruction Modal */}
      {showApkModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669'
                }}>
                  <Download size={18} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Downloading APK</h3>
              </div>
              <button onClick={() => setShowApkModal(false)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#526b64', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Your download for <strong>MoneyMind-v1.0.apk</strong> has started. Follow these steps to install on Android:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  1
                </div>
                <span style={{ fontSize: '0.84rem', color: '#0f172a' }}>Tap the downloaded <strong>.apk</strong> file in your notifications or downloads folder.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  2
                </div>
                <span style={{ fontSize: '0.84rem', color: '#0f172a' }}>If prompted by Android, enable <strong>"Install unknown apps"</strong> for your browser.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  3
                </div>
                <span style={{ fontSize: '0.84rem', color: '#0f172a' }}>Tap <strong>Install</strong> and enjoy offline banking SMS tracking!</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowApkModal(false)}
                className="btn-brand-pill"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Showcase: "Built for the way you spend" (Exact match with reference image) */}
      <section id="features" style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '5rem 1.5rem 4.5rem',
        overflow: 'hidden'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#059669',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '0.75rem',
            display: 'inline-block'
          }}>
            FEATURES & APPS
          </span>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            color: '#0f172a',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '0.85rem'
          }}>
            Built for the way you spend
          </h2>
          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.12rem)',
            color: '#52695c',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.55
          }}>
            Experience personal finance reimagined with automated offline detection, intuitive category budgets, and real-time visual insights.
          </p>
        </div>

        {/* Infinite Rotating Multi-Phone Showcase Marquee */}
        <div className="phone-showcase-marquee-wrapper">
          <div className="phone-showcase-marquee-track">
            {[0, 1].map((setIdx) => (
              <React.Fragment key={setIdx}>
                {/* Phone 1: Daily Expenses */}
                <div className="phone-showcase-item">
                  <div className="phone-showcase-card">
                    {/* iPhone Top Notch */}
                    <div className="phone-notch">
                      <div className="phone-notch-speaker" />
                      <div className="phone-notch-camera" />
                    </div>

                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem' }}>
                      Good Morning,
                    </span>
                    
                    {/* Today's Expense Card */}
                    <div style={{ backgroundColor: '#f5f2eb', borderRadius: '18px', padding: '0.85rem 1rem', marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Today's Expense</span>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '2px' }}>₹1,749.00</div>
                    </div>

                    {/* Daily Expense List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '14px',
                        border: '1px solid #f1f5f9',
                        backgroundColor: '#ffffff'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, color: '#334155' }}>
                            FB
                          </div>
                          <div>
                            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f172a' }}>Starbucks</div>
                            <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Food</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>-₹250</span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '14px',
                        border: '1px solid #f1f5f9',
                        backgroundColor: '#ffffff'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, color: '#334155' }}>
                            TR
                          </div>
                          <div>
                            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f172a' }}>Uber Trip</div>
                            <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Transport</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>-₹200</span>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>✓ Offline Synced</span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Real-time</span>
                    </div>
                  </div>
                  <span className="phone-showcase-caption">Daily Expenses</span>
                </div>

                {/* Phone 2: Visual Analytics */}
                <div className="phone-showcase-item">
                  <div className="phone-showcase-card">
                    {/* iPhone Top Notch */}
                    <div className="phone-notch">
                      <div className="phone-notch-speaker" />
                      <div className="phone-notch-camera" />
                    </div>

                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                      Analytics
                    </span>

                    {/* Total Spent Box */}
                    <div style={{ backgroundColor: '#f5f2eb', borderRadius: '18px', padding: '0.85rem 1rem', marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Total Spent this Month</span>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '2px' }}>₹24,850</div>
                    </div>

                    {/* 4-Bar Dynamic Graphic Chart */}
                    <div style={{
                      backgroundColor: '#f5f2eb',
                      borderRadius: '18px',
                      padding: '0.85rem',
                      height: '130px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-around',
                      gap: '0.4rem',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ width: '22px', height: '55%', backgroundColor: '#10b981', borderRadius: '6px' }} />
                        <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>W1</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ width: '22px', height: '85%', backgroundColor: '#3b82f6', borderRadius: '6px' }} />
                        <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>W2</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ width: '22px', height: '40%', backgroundColor: '#f59e0b', borderRadius: '6px' }} />
                        <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>W3</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ width: '22px', height: '95%', backgroundColor: '#8b5cf6', borderRadius: '6px' }} />
                        <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>W4</span>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>↑ +12.4% vs last mo</span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Live</span>
                    </div>
                  </div>
                  <span className="phone-showcase-caption">Visual Analytics</span>
                </div>

                {/* Phone 3: Smart Budgets */}
                <div className="phone-showcase-item">
                  <div className="phone-showcase-card">
                    {/* iPhone Top Notch */}
                    <div className="phone-notch">
                      <div className="phone-notch-speaker" />
                      <div className="phone-notch-camera" />
                    </div>

                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                      Budgets
                    </span>

                    {/* Food & Dining Progress */}
                    <div style={{ backgroundColor: '#f5f2eb', borderRadius: '18px', padding: '0.85rem 1rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                        <span>Food & Dining</span>
                        <span>₹4,200 / ₹6,000</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: '70%', height: '100%', backgroundColor: '#10b981', borderRadius: '99px' }} />
                      </div>
                    </div>

                    {/* Groceries & Shopping */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '0.75rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                          <span>Groceries</span>
                          <span>₹3,100 / ₹4,000</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: '77%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '99px' }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                          <span>Shopping</span>
                          <span style={{ color: '#ef4444' }}>₹6,800 / ₹7,000</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: '97%', height: '100%', backgroundColor: '#ef4444', borderRadius: '99px' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#ecfdf5', borderRadius: '12px', padding: '0.65rem', border: '1px solid #a7f3d0', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', display: 'block' }}>💡 AI Budget Alert</span>
                      <span style={{ fontSize: '0.68rem', color: '#065f46', lineHeight: 1.3 }}>₹200 safe velocity left today.</span>
                    </div>
                  </div>
                  <span className="phone-showcase-caption">Smart Budgets</span>
                </div>

                {/* Phone 4: Privacy & Isolation */}
                <div className="phone-showcase-item">
                  <div className="phone-showcase-card">
                    {/* iPhone Top Notch */}
                    <div className="phone-notch">
                      <div className="phone-notch-speaker" />
                      <div className="phone-notch-camera" />
                    </div>

                    {/* Shield Icon */}
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: '#ecfdf5',
                      border: '2px solid #a7f3d0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669',
                      margin: '0.25rem auto 0.5rem'
                    }}>
                      <ShieldCheck size={24} />
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', textAlign: 'center', margin: '0 0 0.15rem' }}>Local Isolation</h4>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center', margin: '0 0 0.75rem' }}>Network Permissions: 0</p>

                    {/* Security Rules */}
                    <div style={{ backgroundColor: '#f5f2eb', borderRadius: '16px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.65rem' }}>
                      <div style={{ fontSize: '0.72rem', color: '#0f172a', fontWeight: 700 }}>✓ 100% Offline Database</div>
                      <div style={{ fontSize: '0.72rem', color: '#0f172a', fontWeight: 700 }}>✓ Bank SMS Parser on Device</div>
                      <div style={{ fontSize: '0.72rem', color: '#0f172a', fontWeight: 700 }}>✓ Zero Telemetry / Tracking</div>
                    </div>

                    <div style={{ marginTop: 'auto', backgroundColor: '#ecfdf5', borderRadius: '12px', padding: '0.5rem', textAlign: 'center', border: '1px solid #a7f3d0' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669' }}>🔒 Encrypted Local Vault</span>
                    </div>
                  </div>
                  <span className="phone-showcase-caption">Privacy & Vault</span>
                </div>

                {/* Phone 5: Group Splits */}
                <div className="phone-showcase-item">
                  <div className="phone-showcase-card">
                    {/* iPhone Top Notch */}
                    <div className="phone-notch">
                      <div className="phone-notch-speaker" />
                      <div className="phone-notch-camera" />
                    </div>

                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                      SplitSmart Group
                    </span>

                    <div style={{ backgroundColor: '#f5f2eb', borderRadius: '16px', padding: '0.75rem 0.9rem', marginBottom: '0.65rem' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Goa Trip 2026</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>5 Members • ₹38,400 Total</div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #f1f5f9', borderRadius: '14px', padding: '0.65rem 0.75rem', marginBottom: '0.65rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>Rajesh owes Arun</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669', margin: '2px 0' }}>₹1,250.00</div>
                      <div style={{ fontSize: '0.66rem', color: '#64748b' }}>Optimized minimal transaction</div>
                    </div>

                    <button
                      onClick={handleDownloadApk}
                      style={{
                        marginTop: 'auto',
                        padding: '0.65rem',
                        borderRadius: '12px',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span>Settle via UPI</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                  <span className="phone-showcase-caption">Group Settlement</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '4rem 2rem 5rem',
        borderTop: '1px solid #e3ebe5'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1b4332', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: '#eaf3ed', padding: '0.3rem 0.85rem', borderRadius: '99px' }}>
            Complete Financial Suite
          </span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#16382b', marginTop: '1rem', marginBottom: '0.65rem' }}>
            Intelligent Services for Modern Wealth
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#52695c', maxWidth: '640px', margin: '0 auto' }}>
            Engineered to streamline your daily expenses, group vacations, and long-term financial growth in one cohesive experience.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e3ebe5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eaf3ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16382b' }}>
                <Zap size={20} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Real-Time Expense Ledger</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#52695c', lineHeight: 1.55, marginBottom: '1.25rem' }}>
              Multi-facet tagging, payment method tracking, and instant search across all personal and household cashflows.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-income">Income Inflow</span>
              <span className="badge badge-expense">Auto Categorized</span>
              <span className="badge badge-split">CSV Export</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e3ebe5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eaf3ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16382b' }}>
                <Globe size={20} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Global Multi-Currency</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#52695c', lineHeight: 1.55, marginBottom: '1.25rem' }}>
              Instant switching between INR (₹), USD ($), EUR (€), and GBP (£) with live conversion rates.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ backgroundColor: '#f2f7f4', color: '#16382b' }}>₹ INR</span>
              <span className="badge" style={{ backgroundColor: '#f2f7f4', color: '#16382b' }}>$ USD</span>
              <span className="badge" style={{ backgroundColor: '#f2f7f4', color: '#16382b' }}>€ EUR</span>
              <span className="badge" style={{ backgroundColor: '#f2f7f4', color: '#16382b' }}>£ GBP</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '2rem', border: '1px solid #e3ebe5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eaf3ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16382b' }}>
                <ShieldCheck size={20} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Bank-Grade Privacy</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#52695c', lineHeight: 1.55, marginBottom: '1.25rem' }}>
              Client-side financial processing ensures your statements and personal balances never leak to third-party ad networks.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-income">256-Bit Encrypted</span>
              <span className="badge" style={{ backgroundColor: '#eaf3ed', color: '#16382b' }}>Zero Data Mining</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '5rem 2rem',
        borderTop: '1px solid #e3ebe5'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1b4332', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: '#eaf3ed', padding: '0.3rem 0.85rem', borderRadius: '99px' }}>
              About MoneyMind
            </span>
            <h2 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#16382b', marginTop: '1rem', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Building the Future of Stress-Free Wealth
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#52695c', lineHeight: 1.65, marginBottom: '1.5rem' }}>
              MoneyMind was created with a straightforward mission: eliminate the mental friction of managing personal spending, group vacation debts, and long-term savings goals.
            </p>
            <p style={{ fontSize: '0.95rem', color: '#52695c', lineHeight: 1.65, marginBottom: '2rem' }}>
              By merging local intelligence algorithms with a world-class light design system, we provide clarity without overwhelming users with clunky spreadsheets.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#16382b' }}>99.98%</div>
                <div style={{ fontSize: '0.82rem', color: '#657e70' }}>Uptime & Reliability</div>
              </div>
              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#16382b' }}>$42M+</div>
                <div style={{ fontSize: '0.82rem', color: '#657e70' }}>Expenses Optimized</div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            padding: '2.5rem',
            border: '1px solid #e3ebe5',
            boxShadow: '0 15px 40px rgba(22, 56, 43, 0.06)'
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', color: '#16382b' }}>
              Our Security Standards
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#eaf3ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16382b', flexShrink: 0 }}>
                  <Lock size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#16382b' }}>Local & Private by Design</div>
                  <div style={{ fontSize: '0.84rem', color: '#52695c' }}>Your detailed financial calculations remain strictly on your device.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#eaf3ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16382b', flexShrink: 0 }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#16382b' }}>Mathematical Debt Precision</div>
                  <div style={{ fontSize: '0.84rem', color: '#52695c' }}>SplitSmart uses proven bipartite graph solvers to guarantee zero calculation error.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#eaf3ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16382b', flexShrink: 0 }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#16382b' }}>Continuous Innovation</div>
                  <div style={{ fontSize: '0.84rem', color: '#52695c' }}>Always-evolving AI advisor models tailored to your recurring billing cycles.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto 4rem',
        padding: '0 2rem'
      }}>
        <div style={{
          backgroundColor: '#1b4332',
          borderRadius: '32px',
          padding: '4rem 3rem',
          textAlign: 'center',
          color: '#ffffff',
          boxShadow: '0 20px 50px -10px rgba(27, 67, 50, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>
            Ready to Take Control of Your Financial Future?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#a3c2b1', maxWidth: '580px', margin: '0 auto 2.5rem' }}>
            Join thousands of smart spenders using MoneyMind for personal budgeting and seamless friend group bill splitting.
          </p>
          <button
            onClick={handleDownloadApk}
            style={{
              padding: '1rem 2.75rem',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              color: '#1b4332',
              fontSize: '1.05rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              border: 'none',
              transition: 'transform 0.15s ease'
            }}
          >
            <Download size={18} />
            <span>Download APK (v1.0)</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #e3ebe5',
        padding: '2.5rem 2rem 5.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.88rem',
        color: '#657e70',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          © 2026 MoneyMind Financial Platform. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="#services" style={{ color: '#657e70', textDecoration: 'none' }}>Services</a>
          <a href="#features" style={{ color: '#657e70', textDecoration: 'none' }}>Features</a>
          <button
            onClick={handleDownloadApk}
            style={{
              color: '#059669',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Download size={15} />
            <span>Download APK</span>
          </button>
        </div>
      </footer>

      {/* Auth Modal (Login / Sign Up) - After completing, transitions directly to Main Dashboard */}
      {authModal.isOpen && (
        <div className="modal-overlay" onClick={closeAuth}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '2.25rem', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e3ebe5', boxShadow: '0 20px 60px rgba(22, 56, 43, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid #cfded4',
                  padding: '2px'
                }}>
                  <img
                    src={logoImg}
                    alt="MoneyMind"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16382b', fontFamily: 'var(--font-display)' }}>MoneyMind</span>
              </div>
              <button onClick={closeAuth} className="btn-icon" style={{ width: '32px', height: '32px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Navigation Header / Back Button */}
            {authStep === 'otp' ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.85rem',
                backgroundColor: '#eaf3ed',
                borderRadius: '12px',
                marginBottom: '1.25rem'
              }}>
                <button
                  type="button"
                  onClick={() => { setAuthStep('email'); setAuthOtp(''); setAuthError(''); setAuthSuccess(''); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#16382b',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <ArrowLeft size={15} />
                  <span>Change Email</span>
                </button>
                <span style={{ fontSize: '0.82rem', color: '#52695c', fontWeight: 600 }}>
                  {authEmail}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', backgroundColor: '#f2f5f1', borderRadius: '12px', padding: '4px', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => { setAuthModal({ ...authModal, mode: 'login' }); setAuthError(''); }}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '9px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    backgroundColor: authModal.mode === 'login' ? '#ffffff' : 'transparent',
                    color: authModal.mode === 'login' ? '#16382b' : '#657e70',
                    boxShadow: authModal.mode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthModal({ ...authModal, mode: 'signup' }); setAuthError(''); }}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '9px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    backgroundColor: authModal.mode === 'signup' ? '#ffffff' : 'transparent',
                    color: authModal.mode === 'signup' ? '#16382b' : '#657e70',
                    boxShadow: authModal.mode === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Feedback Alerts */}
            {authError && (
              <div style={{
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div style={{
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Check size={16} />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* STEP 1: Enter Email & Full Name (OTP Mode) */}
            {authStep === 'email' && authMethod === 'otp' && (
              <form onSubmit={handleSendOtp}>
                {authModal.mode === 'signup' && (
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#16382b', fontWeight: 700 }}>Full Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      style={{
                        color: '#16382b',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #cfded4',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        padding: '0.85rem 1rem'
                      }}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" style={{ color: '#16382b', fontWeight: 700 }}>Email Address</label>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="name@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    style={{
                      color: '#16382b',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #cfded4',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      padding: '0.85rem 1rem'
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    backgroundColor: '#1b4332',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    marginTop: '0.75rem',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    opacity: authLoading ? 0.7 : 1,
                    boxShadow: '0 6px 18px rgba(27, 67, 50, 0.3)',
                    transition: 'background-color 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => !authLoading && (e.currentTarget.style.backgroundColor = '#122f23')}
                  onMouseLeave={(e) => !authLoading && (e.currentTarget.style.backgroundColor = '#1b4332')}
                >
                  {authLoading && <Loader2 size={18} className="animate-spin" />}
                  <span>
                    {authLoading
                      ? 'Sending Verification Code...'
                      : 'Send 6-Digit Verification Code'}
                  </span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('password'); setAuthError(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1b4332',
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
                <div className="form-group">
                  <label className="form-label" style={{ color: '#16382b', fontWeight: 700, textAlign: 'center', display: 'block' }}>
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="••••••"
                    maxLength={6}
                    value={authOtp}
                    onChange={(e) => setAuthOtp(e.target.value.replace(/\D/g, ''))}
                    style={{
                      color: '#16382b',
                      backgroundColor: '#ffffff',
                      border: '2px solid #1b4332',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      letterSpacing: '0.35em',
                      textAlign: 'center',
                      padding: '0.85rem 1rem'
                    }}
                    autoFocus
                    required
                  />
                  <p style={{ fontSize: '0.78rem', color: '#52695c', textAlign: 'center', marginTop: '0.35rem' }}>
                    Enter the code sent to your email inbox
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={authLoading || authOtp.length < 6}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    backgroundColor: '#1b4332',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    marginTop: '0.75rem',
                    cursor: (authLoading || authOtp.length < 6) ? 'not-allowed' : 'pointer',
                    opacity: (authLoading || authOtp.length < 6) ? 0.7 : 1,
                    boxShadow: '0 6px 18px rgba(27, 67, 50, 0.3)',
                    transition: 'background-color 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => !authLoading && (e.currentTarget.style.backgroundColor = '#122f23')}
                  onMouseLeave={(e) => !authLoading && (e.currentTarget.style.backgroundColor = '#1b4332')}
                >
                  {authLoading && <Loader2 size={18} className="animate-spin" />}
                  <span>
                    {authLoading ? 'Verifying Code...' : 'Verify Code & Open Dashboard'}
                  </span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={handleSendOtp}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1b4332',
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
              <form onSubmit={handleEmailAuth}>
                {authModal.mode === 'signup' && (
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#16382b', fontWeight: 700 }}>Full Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      style={{
                        color: '#16382b',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #cfded4',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        padding: '0.85rem 1rem'
                      }}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" style={{ color: '#16382b', fontWeight: 700 }}>Email Address</label>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="name@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    style={{
                      color: '#16382b',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #cfded4',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      padding: '0.85rem 1rem'
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#16382b', fontWeight: 700 }}>Password</label>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="••••••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    style={{
                      color: '#16382b',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #cfded4',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      padding: '0.85rem 1rem'
                    }}
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    backgroundColor: '#1b4332',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    marginTop: '0.75rem',
                    cursor: authLoading ? 'not-allowed' : 'pointer',
                    opacity: authLoading ? 0.7 : 1,
                    boxShadow: '0 6px 18px rgba(27, 67, 50, 0.3)',
                    transition: 'background-color 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => !authLoading && (e.currentTarget.style.backgroundColor = '#122f23')}
                  onMouseLeave={(e) => !authLoading && (e.currentTarget.style.backgroundColor = '#1b4332')}
                >
                  {authLoading && <Loader2 size={18} className="animate-spin" />}
                  <span>
                    {authLoading
                      ? 'Authenticating...'
                      : authModal.mode === 'login'
                      ? 'Sign In to MoneyMind'
                      : 'Create Free Account'}
                  </span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('otp'); setAuthError(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1b4332',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Or Send 6-Digit Code to Email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}