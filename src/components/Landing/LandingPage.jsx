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
  Globe
} from 'lucide-react';

export function LandingPage({ onLaunchApp, onOpenAuth }) {
  const [pricingCycle, setPricingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const openAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleAuthSubmit = (e) => {
    if (e) e.preventDefault();
    closeAuth();
    onLaunchApp();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f0',
      color: '#16382b',
      fontFamily: 'var(--font-body)',
      overflowX: 'hidden'
    }}>
      {/* Top Header / Navigation - Exact to Screenshot */}
      <header style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 50
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #16382b 0%, #2d6a4f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(22, 56, 43, 0.25)'
          }}>
            <Sparkles size={20} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16382b', fontFamily: 'var(--font-display)', letterSpacing: '-0.025em' }}>
            MoneyMind
          </span>
        </div>

        {/* Menu Links - Exact to Screenshot */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.25rem', fontSize: '0.95rem', fontWeight: 500, color: '#445b4e' }}>
          <a href="#home" style={{ color: '#16382b', fontWeight: 600, textDecoration: 'none' }}>Home</a>
          <a href="#services" style={{ color: '#445b4e', textDecoration: 'none', transition: 'color 0.15s' }}>Services</a>
          <a href="#features" style={{ color: '#445b4e', textDecoration: 'none', transition: 'color 0.15s' }}>Features</a>
          <a href="#pricing" style={{ color: '#445b4e', textDecoration: 'none', transition: 'color 0.15s' }}>Pricing</a>
          <a href="#about" style={{ color: '#445b4e', textDecoration: 'none', transition: 'color 0.15s' }}>About us</a>
        </nav>

        {/* Auth / Launch Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={() => openAuth('login')}
            style={{
              padding: '0.55rem 1.35rem',
              borderRadius: '9999px',
              border: '1.5px solid #cfded4',
              backgroundColor: '#ffffff',
              color: '#16382b',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#16382b'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cfded4'}
          >
            Login
          </button>
          <button
            onClick={() => openAuth('signup')}
            style={{
              padding: '0.55rem 1.5rem',
              borderRadius: '9999px',
              backgroundColor: '#1b4332',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(27, 67, 50, 0.3)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#122f23'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1b4332'}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Hero Section - Exact Match to Screenshot */}
      <section id="home" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2.5rem 2rem 5rem',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '3.5rem',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Left Hero Content */}
        <div>
          <h1 style={{
            fontSize: '4.5rem',
            lineHeight: 1.1,
            fontWeight: 800,
            color: '#16382b',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.035em',
            marginBottom: '1.6rem'
          }}>
            Smarter Finance<br />
            Better Future
          </h1>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            color: '#52695c',
            maxWidth: '470px',
            marginBottom: '2.5rem'
          }}>
            Simplify tracking, saving, and growing your wealth with our all-in-one finance platform.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={onLaunchApp}
              style={{
                padding: '0.95rem 2.25rem',
                borderRadius: '12px',
                backgroundColor: '#1b4332',
                color: '#ffffff',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(27, 67, 50, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#122f23'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1b4332'}
            >
              <span>Get Started</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onLaunchApp}
              style={{
                padding: '0.95rem 1.85rem',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #d4dfd8',
                color: '#1b4332',
                fontSize: '1.05rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7faf7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <span>Explore Live Demo</span>
            </button>
          </div>
        </div>

        {/* Right Hero: Mobile Mockup with schematic diagrams */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          {/* Top Schematic Badge (Magnifying glass + Finance) */}
          <div style={{
            position: 'absolute',
            top: '-15px',
            left: '10px',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '1rem 1.4rem',
            boxShadow: '0 14px 35px rgba(22, 56, 43, 0.09)',
            border: '1px solid #e3ebe5',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7'
              }}>
                <Search size={18} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16382b', letterSpacing: '0.08em' }}>FINANCE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '24px', marginTop: '4px' }}>
              {[12, 18, 14, 24, 16, 22].map((h, i) => (
                <div key={i} style={{ width: '6px', height: `${h}px`, backgroundColor: '#0284c7', borderRadius: '3px' }} />
              ))}
            </div>
          </div>

          {/* Schematic SVG connecting lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
            <path d="M 120 45 L 180 45 L 180 135 L 240 135" stroke="#b9ccbf" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
            <path d="M 140 430 L 190 430 L 190 350 L 240 350" stroke="#b9ccbf" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
          </svg>

          {/* Bottom Schematic Badge (Team discussing charts) */}
          <div style={{
            position: 'absolute',
            bottom: '35px',
            left: '-15px',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '1rem 1.4rem',
            boxShadow: '0 14px 35px rgba(22, 56, 43, 0.09)',
            border: '1px solid #e3ebe5',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '0.9rem'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #eaf3ed 0%, #d5e6db 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              color: '#16382b'
            }}>
              
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#16382b' }}>AI Debt Settlement</div>
              <div style={{ fontSize: '0.74rem', color: '#52695c' }}>SplitSmart Active</div>
            </div>
          </div>

          {/* Smartphone Frame */}
          <div style={{
            width: '325px',
            backgroundColor: '#ffffff',
            borderRadius: '46px',
            padding: '12px',
            boxShadow: '0 25px 65px -12px rgba(22, 56, 43, 0.25), 0 0 0 10px #1e293b, 0 0 0 12px #334155',
            position: 'relative',
            zIndex: 8
          }}>
            {/* Screen Content */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '36px',
              padding: '1.25rem 1.15rem',
              minHeight: '580px',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'var(--font-body)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Dynamic Island / Notch */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '92px',
                height: '24px',
                backgroundColor: '#0f172a',
                borderRadius: '99px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1e293b' }} />
              </div>

              {/* Status Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.3rem', paddingTop: '2px' }}>
                <span>9:41</span>
                <span>5G 100%</span>
              </div>

              {/* In-app Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Analytics</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Search size={14} color="#64748b" />
                  </button>
                  <button style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={14} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Sales Curve Card */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '18px',
                padding: '1rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Sales</span>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>+18.4%</span>
                </div>

                {/* SVG Area Chart (Smooth cyan/blue wave) */}
                <div style={{ height: '85px', width: '100%' }}>
                  <svg width="100%" height="85" viewBox="0 0 240 85" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 70 Q 40 45 80 52 T 160 22 T 240 12 L 240 85 L 0 85 Z"
                      fill="url(#phoneGrad)"
                    />
                    <path
                      d="M 0 70 Q 40 45 80 52 T 160 22 T 240 12"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="3.5"
                    />
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
              </div>

              {/* Mini Stats 2-col (Revenue $26,300 + Orders 2,465) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>Revenue</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>$26,300</div>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>↑ 5.14%</span>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>Orders</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>2,465</div>
                  <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700 }}>↑ 3.2%</span>
                </div>
              </div>

              {/* Revenue Growth Bar Chart */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
                  Revenue Growth
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '48px', padding: '0 4px' }}>
                  {[22, 30, 38, 52, 65, 80, 95].map((val, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '18px',
                        height: `${val}%`,
                        borderRadius: '4px',
                        background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* User Activity / Launch Button */}
              <button
                onClick={onLaunchApp}
                style={{
                  marginTop: 'auto',
                  padding: '0.8rem',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #16382b 0%, #2d6a4f 100%)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(22, 56, 43, 0.35)'
                }}
              >
                <span>Launch Live Dashboard</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip: Trusted by 150+ companies (Exact match with authentic colors) */}
      <section style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5ede7',
        borderBottom: '1px solid #e5ede7',
        padding: '3rem 2rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#657e70',
            letterSpacing: '0.04em',
            marginBottom: '2rem'
          }}>
            Trusted by 150+ companies
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4.5rem',
            flexWrap: 'wrap'
          }}>
            {/* INTERCOM */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 800, color: '#111827', letterSpacing: '0.04em' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem' }}>
                ▥
              </div>
              <span>INTERCOM</span>
            </div>

            {/* Notion */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>
                N
              </div>
              <span>Notion</span>
            </div>

            {/* Webflow - Signature Blue */}
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#146ef5', letterSpacing: '-0.04em' }}>
              webflow
            </div>

            {/* HubSpot - Signature Orange */}
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.35rem', fontWeight: 800, color: '#ff7a59' }}>
              HubSpot
            </div>

            {/* Zendesk - Signature Dark Teal */}
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#03363d', letterSpacing: '-0.02em' }}>
              zendesk
            </div>

            {/* Google - Iconic Multi-Color */}
            <div style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              <span style={{ color: '#4285f4' }}>G</span>
              <span style={{ color: '#ea4335' }}>o</span>
              <span style={{ color: '#fbbc05' }}>o</span>
              <span style={{ color: '#4285f4' }}>g</span>
              <span style={{ color: '#34a853' }}>l</span>
              <span style={{ color: '#ea4335' }}>e</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid: "Tools to Power Your Financial Journey" - Exact Headline */}
      <section id="features" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '5.5rem 2rem 4rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{
            fontSize: '2.85rem',
            fontWeight: 800,
            color: '#16382b',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.025em',
            marginBottom: '0.85rem'
          }}>
            Tools to Power Your Financial Journey
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#52695c' }}>
            Simplify budgeting, planning, and investments with our smart features.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.85rem'
        }}>
          {/* Card 1 */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.25rem 2rem',
            border: '1px solid #e3ebe5',
            boxShadow: '0 10px 30px rgba(22, 56, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#eaf3ed',
                color: '#16382b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.35rem'
              }}>
                <TrendingUp size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#16382b', marginBottom: '0.65rem', fontWeight: 700 }}>
                AI Expense Forecasting
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#52695c', lineHeight: 1.6 }}>
                Predictive linear burn-rate model forecasts your month-end spend based on daily velocity before limits are breached.
              </p>
            </div>
            <button
              onClick={onLaunchApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#1b4332',
                cursor: 'pointer'
              }}
            >
              <span>Explore Analytics</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Card 2: SplitSmart Group Trips */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.25rem 2rem',
            border: '1px solid #e3ebe5',
            boxShadow: '0 10px 30px rgba(22, 56, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#eaf3ed',
                color: '#16382b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.35rem'
              }}>
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#16382b', marginBottom: '0.65rem', fontWeight: 700 }}>
                SplitSmart Group Trips
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#52695c', lineHeight: 1.6 }}>
                Splitwise-style bipartite graph algorithm resolves multi-person bills into the absolute minimum required debt transactions.
              </p>
            </div>
            <button
              onClick={onLaunchApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#1b4332',
                cursor: 'pointer'
              }}
            >
              <span>View Group Trips</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Card 3: Proactive Budget Alerts */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.25rem 2rem',
            border: '1px solid #e3ebe5',
            boxShadow: '0 10px 30px rgba(22, 56, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#eaf3ed',
                color: '#16382b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.35rem'
              }}>
                <PieChart size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#16382b', marginBottom: '0.65rem', fontWeight: 700 }}>
                Proactive Budget Alerts
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#52695c', lineHeight: 1.6 }}>
                Category caps with safety thresholds (Safe, Caution, or Overspent) keep your daily discretionary spending in check.
              </p>
            </div>
            <button
              onClick={onLaunchApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#1b4332',
                cursor: 'pointer'
              }}
            >
              <span>Set Category Caps</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Card 4: Savings Milestones */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.25rem 2rem',
            border: '1px solid #e3ebe5',
            boxShadow: '0 10px 30px rgba(22, 56, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#eaf3ed',
                color: '#16382b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.35rem'
              }}>
                <Target size={26} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#16382b', marginBottom: '0.65rem', fontWeight: 700 }}>
                Savings Milestones
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#52695c', lineHeight: 1.6 }}>
                Target savings goals for emergency funds, travel, and investments with milestone tracking and celebration confetti.
              </p>
            </div>
            <button
              onClick={onLaunchApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#1b4332',
                cursor: 'pointer'
              }}
            >
              <span>Track Savings Goals</span>
              <ChevronRight size={16} />
            </button>
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

      {/* Pricing Section */}
      <section id="pricing" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '5rem 2rem',
        borderTop: '1px solid #e3ebe5'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1b4332', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: '#eaf3ed', padding: '0.3rem 0.85rem', borderRadius: '99px' }}>
            Transparent Pricing
          </span>
          <h2 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#16382b', marginTop: '1rem', marginBottom: '0.75rem' }}>
            Simple Plans for Every Stage
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#52695c', marginBottom: '2rem' }}>
            Start for free and unlock advanced AI recommendations as you scale.
          </p>

          {/* Billing Cycle Toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '99px',
            padding: '4px',
            border: '1px solid #d4dfd8'
          }}>
            <button
              onClick={() => setPricingCycle('monthly')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '99px',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: pricingCycle === 'monthly' ? '#1b4332' : 'transparent',
                color: pricingCycle === 'monthly' ? '#ffffff' : '#52695c',
                cursor: 'pointer'
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setPricingCycle('annual')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '99px',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: pricingCycle === 'annual' ? '#1b4332' : 'transparent',
                color: pricingCycle === 'annual' ? '#ffffff' : '#52695c',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>Annual Billing</span>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#10b981', color: '#fff', padding: '0.1rem 0.45rem', borderRadius: '99px' }}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch'
        }}>
          {/* Free Tier */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            border: '1px solid #e3ebe5',
            boxShadow: '0 8px 24px rgba(22, 56, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16382b', marginBottom: '0.5rem' }}>Starter</div>
              <p style={{ fontSize: '0.88rem', color: '#52695c', marginBottom: '1.5rem' }}>Essential personal budgeting & bill tracking.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: '#16382b' }}>$0</span>
                <span style={{ fontSize: '0.9rem', color: '#7e9788' }}>/ forever</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#52695c' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Unlimited transactions</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Up to 3 SplitSmart groups</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Standard monthly charts</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> CSV statement export</li>
              </ul>
            </div>
            <button
              onClick={onLaunchApp}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                border: '1.5px solid #d4dfd8',
                backgroundColor: '#ffffff',
                color: '#16382b',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Tier (Featured) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            border: '2px solid #1b4332',
            boxShadow: '0 16px 40px rgba(27, 67, 50, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#1b4332',
              color: '#ffffff',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '0.25rem 0.9rem',
              borderRadius: '99px',
              letterSpacing: '0.04em'
            }}>
              MOST POPULAR
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16382b', marginBottom: '0.5rem' }}>Pro Wealth</div>
              <p style={{ fontSize: '0.88rem', color: '#52695c', marginBottom: '1.5rem' }}>Full AI autonomous insights & group debt engines.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: '#16382b' }}>
                  {pricingCycle === 'monthly' ? '$12' : '$9'}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#7e9788' }}>/ month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#52695c' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> <strong>All Starter features</strong></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Predictive linear AI burn-rate</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Unlimited SplitSmart trip groups</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> AI savings advice & waste audit</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Printable executive PDF reports</li>
              </ul>
            </div>
            <button
              onClick={onLaunchApp}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                backgroundColor: '#1b4332',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(27, 67, 50, 0.35)'
              }}
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Enterprise Tier */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            border: '1px solid #e3ebe5',
            boxShadow: '0 8px 24px rgba(22, 56, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16382b', marginBottom: '0.5rem' }}>Enterprise Team</div>
              <p style={{ fontSize: '0.88rem', color: '#52695c', marginBottom: '1.5rem' }}>For startups, roommate pods & co-living groups.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: '#16382b' }}>
                  {pricingCycle === 'monthly' ? '$49' : '$39'}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#7e9788' }}>/ month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#52695c' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Multi-account team seats</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Shared billing & unified reconciliation</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Dedicated VIP financial support</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} color="#10b981" /> Custom accounting exports</li>
              </ul>
            </div>
            <button
              onClick={onLaunchApp}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                border: '1.5px solid #d4dfd8',
                backgroundColor: '#ffffff',
                color: '#16382b',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Contact Team Sales
            </button>
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
            onClick={onLaunchApp}
            style={{
              padding: '1rem 2.75rem',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              color: '#1b4332',
              fontSize: '1.05rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <span>Open Application Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #e3ebe5',
        padding: '2.5rem 2rem',
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.88rem',
        color: '#657e70'
      }}>
        <div>
          © 2026 MoneyMind Financial Platform. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#services" style={{ color: '#657e70', textDecoration: 'none' }}>Services</a>
          <a href="#features" style={{ color: '#657e70', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ color: '#657e70', textDecoration: 'none' }}>Pricing</a>
          <a href="#about" style={{ color: '#657e70', textDecoration: 'none' }}>About us</a>
          <button onClick={onLaunchApp} style={{ color: '#1b4332', fontWeight: 700, cursor: 'pointer' }}>Launch App</button>
        </div>
      </footer>

      {/* Auth Modal (Login / Sign Up) - After completing, transitions directly to Main Dashboard */}
      {authModal.isOpen && (
        <div className="modal-overlay" onClick={closeAuth}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '2.25rem', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e3ebe5', boxShadow: '0 20px 60px rgba(22, 56, 43, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #16382b 0%, #2d6a4f 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  <Sparkles size={18} />
                </div>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16382b', fontFamily: 'var(--font-display)' }}>MoneyMind</span>
              </div>
              <button onClick={closeAuth} className="btn-icon" style={{ width: '32px', height: '32px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Tab switch */}
            <div style={{ display: 'flex', backgroundColor: '#f2f5f1', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setAuthModal({ ...authModal, mode: 'login' })}
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
                onClick={() => setAuthModal({ ...authModal, mode: 'signup' })}
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

            {/* Form Fields */}
            <form onSubmit={handleAuthSubmit}>
              {authModal.mode === 'signup' && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" type="text" placeholder="Rajesh Kumar" defaultValue="Rajesh Kumar" required />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-control" type="email" placeholder="rajesh@moneymind.io" defaultValue="rajesh@moneymind.io" required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-control" type="password" placeholder="••••••••••••" defaultValue="password123" required />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '12px',
                  backgroundColor: '#1b4332',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  marginTop: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(27, 67, 50, 0.3)',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#122f23'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1b4332'}
              >
                {authModal.mode === 'login' ? 'Sign In to Dashboard' : 'Create Account & Open Dashboard'}
              </button>

              <div style={{ textAlign: 'center', margin: '1rem 0', fontSize: '0.8rem', color: '#7e9788' }}>
                — OR —
              </div>

              <button
                type="button"
                onClick={() => { closeAuth(); onLaunchApp(); }}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  backgroundColor: '#eaf3ed',
                  color: '#16382b',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: '1.5px solid #c8ded0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbece0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eaf3ed'}
              >
                Instant Guest Demo Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}