import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback
} from 'react';
import { ArrowDown } from 'lucide-react';
import './message-scroller.css';

const MessageScrollerContext = createContext(null);

export function useMessageScroller() {
  const context = useContext(MessageScrollerContext);
  if (!context) {
    throw new Error('useMessageScroller must be used within a MessageScrollerProvider');
  }
  return context;
}

export function MessageScrollerProvider({ children }) {
  const viewportRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  const checkIfAtBottom = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return true;
    const threshold = 40; // px threshold
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    return atBottom;
  }, []);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior
    });
    setIsAtBottom(true);
    setUnreadCount(0);
    setAutoScroll(true);
  }, []);

  const handleScroll = useCallback(() => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);
    if (atBottom) {
      setUnreadCount(0);
      setAutoScroll(true);
    } else {
      setAutoScroll(false);
    }
  }, [checkIfAtBottom]);

  const notifyNewMessage = useCallback(() => {
    const atBottom = checkIfAtBottom();
    if (atBottom || autoScroll) {
      // User is at bottom, auto-scroll smoothly
      requestAnimationFrame(() => {
        scrollToBottom('smooth');
      });
    } else {
      // User has scrolled up, preserve position and bump counter
      setUnreadCount(prev => prev + 1);
    }
  }, [checkIfAtBottom, autoScroll, scrollToBottom]);

  return (
    <MessageScrollerContext.Provider
      value={{
        viewportRef,
        isAtBottom,
        unreadCount,
        autoScroll,
        setAutoScroll,
        scrollToBottom,
        handleScroll,
        notifyNewMessage
      }}
    >
      {children}
    </MessageScrollerContext.Provider>
  );
}

export function MessageScroller({ className = '', children, ...props }) {
  return (
    <div className={`message-scroller-container ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function MessageScrollerViewport({ className = '', children, ...props }) {
  const { viewportRef, handleScroll } = useMessageScroller();

  return (
    <div
      ref={viewportRef}
      onScroll={handleScroll}
      className={`message-scroller-viewport ${className}`.trim()}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
}

export function MessageScrollerContent({
  className = '',
  'aria-busy': ariaBusy,
  children,
  ...props
}) {
  return (
    <div
      role="log"
      aria-relevant="additions"
      aria-busy={ariaBusy}
      className={`message-scroller-content ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function MessageScrollerButton({
  className = '',
  label = 'Scroll to latest',
  ...props
}) {
  const { isAtBottom, unreadCount, scrollToBottom } = useMessageScroller();

  if (isAtBottom && unreadCount === 0) {
    return null;
  }

  return (
    <div className="message-scroller-btn-container">
      <button
        type="button"
        onClick={() => scrollToBottom('smooth')}
        className={`message-scroller-btn ${className}`.trim()}
        aria-label={label}
        {...props}
      >
        <ArrowDown size={14} strokeWidth={2.5} />
        <span>{unreadCount > 0 ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}` : 'Latest'}</span>
        {unreadCount > 0 && (
          <span className="message-scroller-badge">{unreadCount}</span>
        )}
      </button>
    </div>
  );
}

export function MessageAnimated({
  message,
  scrollAnchor = false,
  className = '',
  children,
  ...props
}) {
  const itemRef = useRef(null);

  useEffect(() => {
    if (scrollAnchor && itemRef.current) {
      // If turn anchor is set, ensure it lands naturally in view
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [scrollAnchor]);

  return (
    <div
      ref={itemRef}
      className={`message-animated ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
