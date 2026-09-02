import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useSplit } from '../../context/SplitContext';
import { answerFinancialQuery } from '../../utils/aiEngine';
import { AISuggestions } from './AISuggestions';

export function AIChatBot() {
  const { transactions, budgets, goals, activeCurrencyCode } = useFinance();
  const { groups } = useSplit();

  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello Rajesh! I am your **FinAI Copilot**. 
I have real-time access to your transactions, monthly category budgets, savings goals, and SplitSmart trip expenses.

Ask me anything, or tap one of the smart shortcuts below!`,
      timestamp: 'Just now',
      badge: 'FinAI Advisor'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = {
      id: `m-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = answerFinancialQuery(query, {
        transactions,
        budgets,
        goals,
        splitGroups: groups,
        activeCurrency: activeCurrencyCode
      });

      const aiMsg = {
        id: `m-ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: 'Just now',
        badge: response.badge
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const quickPrompts = [
    'Predict my month-end expenses',
    'Where am I bleeding money & how to save?',
    'Who owes who in my Goa Trip?',
    'Check my budget limits'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>FinAI Financial Advisor</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Autonomous financial analysis, expense forecasting & debt resolution assistant
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div
        className="glass-panel"
        style={{
          height: '540px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Chat Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {messages.map(msg => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {!isUser && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'var(--primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    <Bot size={18} />
                  </div>
                )}

                <div style={{
                  backgroundColor: isUser ? 'var(--accent-primary)' : 'var(--bg-input)',
                  color: isUser ? '#ffffff' : 'var(--text-primary)',
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  borderTopRightRadius: isUser ? '4px' : '16px',
                  borderTopLeftRadius: isUser ? '16px' : '4px',
                  boxShadow: 'var(--shadow-sm)',
                  border: isUser ? 'none' : '1px solid var(--border-subtle)'
                }}>
                  {msg.badge && (
                    <span className="badge badge-split" style={{ fontSize: '0.66rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                      {msg.badge}
                    </span>
                  )}

                  <div style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.text}
                  </div>

                  <div style={{
                    fontSize: '0.68rem',
                    color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)',
                    marginTop: '0.4rem',
                    textAlign: 'right'
                  }}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    User
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Sparkles size={16} />
              </div>
              <span>FinAI is analyzing your balance & calculating trends...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div style={{
          padding: '0.65rem 1.25rem',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto'
        }}>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '99px',
                fontSize: '0.74rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '0.75rem'
          }}
        >
          <input
            type="text"
            placeholder="Ask FinAI about your spend, Goa trip debts, or budget tips..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="form-control"
            style={{ fontSize: '0.9rem' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0 1.25rem' }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* AISuggestions list below chat */}
      <AISuggestions onAction={(sug) => handleSend(`Tell me more about how to ${sug.title}`)} />
    </div>
  );
}