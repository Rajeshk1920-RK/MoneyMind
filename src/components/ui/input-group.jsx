import React from 'react';
import './input-group.css';

export function InputGroup({ className = '', children, ...props }) {
  return (
    <div className={`ui-input-group ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function InputGroupAddon({ align = 'block-end', className = '', children, ...props }) {
  return (
    <div className={`ui-input-group-addon align-${align} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function InputGroupButton({
  variant = 'default',
  size = 'icon-sm',
  type = 'button',
  isDisabled = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const isButtonDisabled = isDisabled || disabled;
  const variantClass = `ui-input-group-btn-${variant}`;
  const sizeClass = `ui-input-group-btn-${size}`;

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      className={`ui-input-group-btn ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
