import React from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import './alert.css';

/**
 * Modern Alert Component
 * Supports variants: 'default', 'success', 'destructive', 'warning', 'info'
 */
export function Alert({
  variant = 'default',
  className = '',
  children,
  ...props
}) {
  return (
    <div
      role="alert"
      className={`ui-alert ui-alert-${variant} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertTitle({ className = '', children, ...props }) {
  return (
    <h5 className={`ui-alert-title ${className}`} {...props}>
      {children}
    </h5>
  );
}

export function AlertDescription({ className = '', children, ...props }) {
  return (
    <div className={`ui-alert-description ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * AlertDemo adhering to the user's requested snippet
 */
export function AlertDemo() {
  return (
    <div style={{ display: 'grid', width: '100%', maxWidth: '480px', gap: '1rem' }}>
      <Alert variant="success">
        <CheckCircle2 size={18} />
        <div>
          <AlertTitle>Payment successful</AlertTitle>
          <AlertDescription>
            Your payment of ₹2,499 has been processed. A receipt and intent note have been logged to your activity.
          </AlertDescription>
        </div>
      </Alert>

      <Alert variant="info">
        <Info size={18} />
        <div>
          <AlertTitle>New feature available</AlertTitle>
          <AlertDescription>
            We've added Spending Calendar & Date Intelligence support. You can inspect daily spend breakdown now.
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}

export default Alert;
