import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ArrowUp,
  RotateCw,
  Plus,
  Paperclip,
  TrendingUp,
  Bot,
  User,
  Zap,
  MessageCircleDashed,
  PieChart,
  Lightbulb,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { answerFinancialQuery, generateAISavingSuggestions } from '../../utils/aiEngine';
import { AISuggestions } from './AISuggestions';
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerButton,
  MessageAnimated,
  useMessageScroller
} from '../ui/message-scroller';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';
import {
  Tooltip,
  TooltipTrigger
} from '../ui/tooltip';
import {
  Avatar,
  AvatarFallback,
  BubbleReactions
} from '../ui';
import './AIChatBot.css';

const INITIAL_MESSAGES = [
  {
    id: 'm-initial',
    sender: 'ai',
    text: `Hello Rajesh! I am your **FinAI Copilot**. 
I have real-time access to your transactions, category budgets, and savings goals.

Ask me anything about your cashflow, or choose one of the smart tools below!`,
    timestamp: 'Just now',
    badge: 'FinAI Advisor'
  }
];

const QUICK_PROMPTS = [
  'Predict my month-end expenses',
  'Where am I bleeding money & how to save?',
  'Check my budget limits',
  'How are my savings goals progressing?',
  'Audit recurring digital subscriptions'
];

function formatAiText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'inherit', fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function WelcomeScreen({ onStartChat }) {
  const { transactions, budgets } = useFinance();

  return (
    <div className="ai-chat-card">
      <div className="ai-welcome-card">
        {/* Badge */}
        <div className="ai-welcome-badge">
          <ShieldCheck size={14} />
          <span>100% Private Offline Intelligence</span>
        </div>

        {/* Glowing Bot Avatar */}
        <div className="ai-welcome-avatar-wrap">
          <div className="ai-welcome-pulse" />
          <div className="ai-welcome-avatar">
            <Bot size={32} />
          </div>
        </div>

        {/* Headings */}
        <h2 className="ai-welcome-title">FinAI Financial Copilot</h2>
        <p className="ai-welcome-subtitle">
          Your autonomous personal finance advisor. Ask anything about your expenses, forecast your month-end cashflow, or audit budgets instantly.
        </p>

        {/* Key Features Grid */}
        <div className="ai-welcome-features">
          <div className="ai-welcome-feature-card">
            <div className="ai-welcome-feature-icon">
              <TrendingUp size={16} />
            </div>
            <div>
              <div className="ai-welcome-feature-title">Expense Forecast</div>
              <div className="ai-welcome-feature-desc">Burn rate projection & safe spending limit</div>
            </div>
          </div>

          <div className="ai-welcome-feature-card">
            <div className="ai-welcome-feature-icon">
              <Lightbulb size={16} />
            </div>
            <div>
              <div className="ai-welcome-feature-title">Savings Audit</div>
              <div className="ai-welcome-feature-desc">Detect high spending & recurring OTT subs</div>
            </div>
          </div>

          <div className="ai-welcome-feature-card">
            <div className="ai-welcome-feature-icon">
              <Zap size={16} />
            </div>
            <div>
              <div className="ai-welcome-feature-title">Debt Settlement</div>
              <div className="ai-welcome-feature-desc">SplitSmart group balance resolution</div>
            </div>
          </div>
        </div>

        {/* Primary Start Chat CTA Button */}
        <button
          type="button"
          onClick={() => onStartChat()}
          className="ai-start-chat-btn"
        >
          <Sparkles size={18} />
          <span>Start Conversation</span>
          <ArrowRight size={18} />
        </button>

        {/* Quick Prompts Options */}
        <div className="ai-welcome-prompt-label">Or start directly with a question:</div>
        <div className="ai-welcome-prompts-grid">
          {QUICK_PROMPTS.slice(0, 4).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onStartChat(prompt)}
              className="ai-prompt-chip"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatBody({
  messages,
  setMessages,
  inputValue,
  setInputValue,
  isBusy,
  setIsBusy,
  onReset
}) {
  const { transactions, budgets, goals, activeCurrencyCode } = useFinance();
  const { notifyNewMessage } = useMessageScroller();
  const typingTimerRef = useRef(null);

  const sendMessage = useCallback((queryText) => {
    const textToSend = queryText || inputValue;
    if (!textToSend || !textToSend.trim() || isBusy) return;

    const userMsg = {
      id: `m-user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsBusy(true);
    notifyNewMessage();

    // Answer via local intelligence engine
    setTimeout(() => {
      const response = answerFinancialQuery(textToSend.trim(), {
        transactions,
        budgets,
        goals,
        activeCurrency: activeCurrencyCode
      });

      const aiMsgId = `m-ai-${Date.now()}`;
      const fullText = response.text;
      
      const initialAiMsg = {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        timestamp: 'Just now',
        badge: response.badge,
        reaction: null
      };

      setMessages(prev => [...prev, initialAiMsg]);
      notifyNewMessage();

      // Progressive token streaming effect
      let charIndex = 0;
      const stepSize = Math.max(3, Math.floor(fullText.length / 28));

      if (typingTimerRef.current) clearInterval(typingTimerRef.current);

      typingTimerRef.current = setInterval(() => {
        charIndex += stepSize;
        if (charIndex >= fullText.length) {
          charIndex = fullText.length;
          clearInterval(typingTimerRef.current);
          setIsBusy(false);
        }

        const currentSlice = fullText.slice(0, charIndex);
        setMessages(prev =>
          prev.map(m => (m.id === aiMsgId ? { ...m, text: currentSlice } : m))
        );
        notifyNewMessage();
      }, 20);
    }, 400);
  }, [inputValue, isBusy, transactions, budgets, goals, activeCurrencyCode, notifyNewMessage, setMessages, setInputValue, setIsBusy]);

  return (
    <div className="ai-chat-card">
      {/* Header */}
      <div className="ai-chat-header">
        <div className="ai-header-left">
          <div className="ai-bot-icon-badge">
            <Bot size={20} />
          </div>
          <div className="ai-header-text">
            <div className="ai-header-title-row">
              <h3 className="ai-header-title">FinAI Financial Copilot</h3>
              <span className="ai-header-badge">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
                Live Context
              </span>
            </div>
            <p className="ai-header-desc">
              {transactions?.length || 0} transactions &bull; {budgets?.length || 0} active budgets &bull; 100% private offline engine
            </p>
          </div>
        </div>

        <TooltipTrigger>
          <button
            type="button"
            aria-label="New chat session"
            onClick={onReset}
            disabled={isBusy}
            className="ai-reset-btn"
          >
            <RotateCw size={15} />
          </button>
          <Tooltip>
            <p>New Chat Session</p>
          </Tooltip>
        </TooltipTrigger>
      </div>

      {/* Scroller Content Area */}
      <div className="ai-chat-body">
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent aria-busy={isBusy} className="ai-chat-messages-container">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <MessageAnimated
                    key={msg.id}
                    message={msg}
                    scrollAnchor={isUser}
                  >
                    <div className={`ai-message-turn ${isUser ? 'ai-message-turn-end' : 'ai-message-turn-start'}`}>
                      <div className="ai-message-avatar-wrap">
                        <Avatar>
                          {isUser ? (
                            <AvatarFallback style={{ backgroundColor: '#0f172a', color: '#fff', fontSize: '0.78rem', fontWeight: 800 }}>
                              RK
                            </AvatarFallback>
                          ) : (
                            <AvatarFallback style={{ backgroundColor: '#059669', color: '#fff' }}>
                              <Bot size={17} />
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>

                      <div className="ai-message-bubble-wrap">
                        <div className={`ai-bubble-box ${isUser ? 'ai-bubble-user' : 'ai-bubble-bot'}`}>
                          {msg.badge && (
                            <div className="ai-bubble-badge" style={{ color: isUser ? '#d1fae5' : '#059669' }}>
                              <Sparkles size={11} />
                              <span>{msg.badge}</span>
                            </div>
                          )}

                          <div className="ai-bubble-text">
                            {msg.text ? (
                              formatAiText(msg.text)
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                              </span>
                            )}
                          </div>

                          {msg.reaction && !isUser && (
                            <BubbleReactions
                              role="img"
                              aria-label={`Reaction: ${msg.reaction}`}
                              onClick={() => {
                                const reactions = ['👍', '💡', '🔥', '❤️', '👏'];
                                const nextReaction = reactions[(reactions.indexOf(msg.reaction) + 1) % reactions.length];
                                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, reaction: nextReaction } : m));
                              }}
                              title="Click to change reaction"
                            >
                              <span>{msg.reaction}</span>
                            </BubbleReactions>
                          )}
                        </div>

                        <div className="ai-bubble-footer">
                          <span>{msg.timestamp}</span>
                          {isUser && <span>&bull; Delivered</span>}
                        </div>
                      </div>
                    </div>
                  </MessageAnimated>
                );
              })}

              {isBusy && messages[messages.length - 1]?.sender === 'user' && (
                <div className="ai-typing-marker">
                  <Sparkles size={14} color="#059669" />
                  <span><strong>FinAI</strong> is analyzing your bank trends & cashflow...</span>
                </div>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </div>

      {/* Quick Prompts Carousel Bar */}
      <div className="ai-quick-prompts-bar">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessage(prompt)}
            disabled={isBusy}
            className="ai-prompt-chip"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form Footer */}
      <div className="ai-input-footer">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          style={{ width: '100%', margin: 0 }}
        >
          <div className="ai-input-container">
            <div className="ai-input-textarea-wrap">
              <textarea
                placeholder="Ask FinAI about your spendings, savings, budgets or debt..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                disabled={isBusy}
                className="ai-input-textarea"
              />
            </div>

            <div className="ai-input-action-bar">
              <DropdownMenuTrigger>
                <button
                  type="button"
                  aria-label="Add financial resources"
                  className="ai-action-btn-circle ai-action-btn-outline"
                  title="Financial Analysis Tools"
                >
                  <Plus size={16} />
                </button>

                <DropdownMenu className="w-56">
                  <DropdownMenuItem onClick={() => sendMessage('Audit my recent high transactions and unusual spends')}>
                    <Paperclip size={15} />
                    Audit Recent SMS Spends
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => sendMessage('Give me a detailed 50-30-20 budget recommendation')}>
                    <PieChart size={15} />
                    50-30-20 Budget Optimizer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => sendMessage('Predict my month-end expenses based on current burn rate')}>
                    <TrendingUp size={15} />
                    Deep Expense Projection
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => sendMessage('What is the best strategy to settle group debts fast with SplitSmart?')}>
                    <Zap size={15} />
                    Debt Settlement Strategy
                  </DropdownMenuItem>
                </DropdownMenu>
              </DropdownMenuTrigger>

              <button
                type="submit"
                disabled={!inputValue.trim() || isBusy}
                className="ai-action-btn-circle ai-action-btn-send"
                title="Send query"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AIChatBot() {
  const { transactions, budgets, goals, activeCurrencyCode } = useFinance();
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const handleStartChat = (initialPrompt) => {
    setHasStartedChat(true);

    if (initialPrompt && initialPrompt.trim()) {
      const userMsg = {
        id: `m-user-${Date.now()}`,
        sender: 'user',
        text: initialPrompt.trim(),
        timestamp: 'Just now'
      };

      setMessages([INITIAL_MESSAGES[0], userMsg]);
      setIsBusy(true);

      setTimeout(() => {
        const response = answerFinancialQuery(initialPrompt.trim(), {
          transactions,
          budgets,
          goals,
          activeCurrency: activeCurrencyCode
        });

        const aiMsgId = `m-ai-${Date.now()}`;
        const initialAiMsg = {
          id: aiMsgId,
          sender: 'ai',
          text: '',
          timestamp: 'Just now',
          badge: response.badge,
          reaction: null
        };

        setMessages(prev => [...prev, initialAiMsg]);

        let charIndex = 0;
        const fullText = response.text;
        const stepSize = Math.max(3, Math.floor(fullText.length / 28));

        const timer = setInterval(() => {
          charIndex += stepSize;
          if (charIndex >= fullText.length) {
            charIndex = fullText.length;
            clearInterval(timer);
            setIsBusy(false);
          }

          const currentSlice = fullText.slice(0, charIndex);
          setMessages(prev =>
            prev.map(m => (m.id === aiMsgId ? { ...m, text: currentSlice } : m))
          );
        }, 20);
      }, 400);
    }
  };

  const handleReset = () => {
    setHasStartedChat(false);
    setMessages(INITIAL_MESSAGES);
    setInputValue('');
    setIsBusy(false);
  };

  return (
    <div className="ai-chatbot-wrapper">
      {!hasStartedChat ? (
        <WelcomeScreen onStartChat={handleStartChat} />
      ) : (
        <MessageScrollerProvider>
          <ChatBody
            messages={messages}
            setMessages={setMessages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isBusy={isBusy}
            setIsBusy={setIsBusy}
            onReset={handleReset}
          />
        </MessageScrollerProvider>
      )}
    </div>
  );
}

export default AIChatBot;