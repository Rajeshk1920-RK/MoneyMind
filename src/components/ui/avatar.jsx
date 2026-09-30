import React, { useState } from 'react';
import './avatar.css';

export function Avatar({ className = '', children, size = 'default', ...props }) {
  return (
    <div className={`ui-avatar ui-avatar-${size} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt = '', className = '', ...props }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`ui-avatar-image ${className}`}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}

export function AvatarFallback({ className = '', children, ...props }) {
  return (
    <div className={`ui-avatar-fallback ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Avatar;
