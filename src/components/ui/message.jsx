import React from 'react';
import './message.css';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from './bubble';
import { Marker, MarkerContent } from './marker';

export function Message({ align = 'start', className = '', children, ...props }) {
  return (
    <div
      className={`ui-message ui-message-align-${align} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function MessageAvatar({ className = '', children, ...props }) {
  return (
    <div className={`ui-message-avatar ${className}`} {...props}>
      {children}
    </div>
  );
}

export function MessageContent({ className = '', children, ...props }) {
  return (
    <div className={`ui-message-content ${className}`} {...props}>
      {children}
    </div>
  );
}

export function MessageFooter({ className = '', children, ...props }) {
  return (
    <div className={`ui-message-footer ${className}`} {...props}>
      {children}
    </div>
  );
}

export function MessageDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 py-12" style={{ display: 'flex', width: '100%', maxWidth: '380px', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarImage src="/avatars/10.png" alt="@me" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>Deploying to prod real quick.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarImage src="/avatars/02.png" alt="@rabbit" />
            <AvatarFallback>R</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>It's 4:55 PM. On a Friday.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarImage src="/avatars/10.png" alt="@me" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>It's a one-line change.</BubbleContent>
          </Bubble>
          <MessageFooter>Delivered</MessageFooter>
        </MessageContent>
      </Message>

      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarImage src="/avatars/02.png" alt="@rabbit" />
            <AvatarFallback>R</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <BubbleGroup>
            <Bubble variant="muted">
              <BubbleContent>
                It's always a one-line change 😭.
              </BubbleContent>
            </Bubble>
            <Bubble variant="muted">
              <BubbleContent>Alright, let me take a look.</BubbleContent>
              <BubbleReactions aria-label="Reactions: thumbs up">
                <span>👍</span>
              </BubbleReactions>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>

      <Marker role="status">
        <MarkerContent className="shimmer">
          <span style={{ fontWeight: 600 }}>Oliver</span> is typing...
        </MarkerContent>
      </Marker>
    </div>
  );
}

export default Message;
