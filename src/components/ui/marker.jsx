import React from 'react';
import './marker.css';

export function Marker({ className = '', children, ...props }) {
  return (
    <div className={`ui-marker ${className}`} {...props}>
      {children}
    </div>
  );
}

export function MarkerContent({ className = '', children, ...props }) {
  return (
    <div className={`ui-marker-content ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Marker;
