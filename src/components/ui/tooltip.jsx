import React from 'react';
import './tooltip.css';

export function TooltipTrigger({ children }) {
  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray[0];
  const tooltip = childrenArray[1];

  return (
    <div className="ui-tooltip-wrapper">
      {trigger}
      {tooltip}
    </div>
  );
}

export function Tooltip({ className = '', children, ...props }) {
  return (
    <div className={`ui-tooltip ${className}`.trim()} role="tooltip" {...props}>
      {children}
    </div>
  );
}
