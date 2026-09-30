import React from 'react';
import './bubble.css';

export function BubbleGroup({ className = '', children, ...props }) {
  return (
    <div className={`ui-bubble-group ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Bubble({
  align = 'start',
  variant = 'default',
  className = '',
  children,
  ...props
}) {
  return (
    <div
      className={`ui-bubble ui-bubble-align-${align} ui-bubble-variant-${variant} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function BubbleContent({ className = '', children, ...props }) {
  return (
    <div className={`ui-bubble-content ${className}`} {...props}>
      {children}
    </div>
  );
}

export function BubbleReactions({ className = '', children, ...props }) {
  return (
    <div className={`ui-bubble-reactions ${className}`} {...props}>
      {children}
    </div>
  );
}

export function BubbleDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12" style={{ display: 'flex', width: '100%', maxWidth: '380px', flexDirection: 'column', gap: '1.5rem', padding: '2rem 0' }}>
      <Bubble align="end">
        <BubbleContent>Hey there! what's up?</BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>Hey! Want to see chat bubbles?</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>
            I can group messages, switch sides, and keep the whole thread easy
            to scan.
          </BubbleContent>
          <BubbleReactions role="img" aria-label="Reaction: thumbs up">
            <span>👍</span>
          </BubbleReactions>
        </Bubble>
      </BubbleGroup>
      <Bubble align="end">
        <BubbleContent>Sure. Hit me with your best demo.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          Yes. You are reading a demo that is demoing itself. Very meta. Very
          on-brand.
        </BubbleContent>
      </Bubble>
    </div>
  );
}

export default Bubble;
