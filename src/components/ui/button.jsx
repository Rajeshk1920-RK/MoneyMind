import React from 'react';
import './button.css';

/**
 * Reusable Button Component with variant and size support
 * 
 * Variants: 'default', 'outline', 'secondary', 'ghost', 'destructive', 'dark', 'link'
 * Sizes: 'default', 'sm', 'lg', 'icon'
 */
export const Button = React.forwardRef(function Button(
  {
    className = '',
    variant = 'default',
    size = 'default',
    type = 'button',
    disabled = false,
    children,
    ...props
  },
  ref
) {
  const variantClass = `ui-btn-${variant}`;
  const sizeClass = `ui-btn-size-${size}`;
  const combinedClasses = `ui-btn ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
