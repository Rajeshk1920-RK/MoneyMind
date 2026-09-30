import React from 'react';
import './empty.css';

export function Empty({ className = '', children, ...props }) {
  return (
    <div className={`ui-empty ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function EmptyHeader({ className = '', children, ...props }) {
  return (
    <div className={`ui-empty-header ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function EmptyMedia({ variant = 'icon', className = '', children, ...props }) {
  return (
    <div className={`ui-empty-media ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function EmptyTitle({ className = '', children, ...props }) {
  return (
    <h3 className={`ui-empty-title ${className}`.trim()} {...props}>
      {children}
    </h3>
  );
}

export function EmptyDescription({ className = '', children, ...props }) {
  return (
    <p className={`ui-empty-description ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}
