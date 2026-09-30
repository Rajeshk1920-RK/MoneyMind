import React, { useState, useRef, useEffect } from 'react';
import './dropdown-menu.css';

export function DropdownMenuTrigger({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Find trigger child and menu child
  const childrenArray = React.Children.toArray(children);
  const triggerButton = childrenArray[0];
  const menuContent = childrenArray[1];

  return (
    <div ref={containerRef} className="ui-dropdown-wrapper">
      {React.cloneElement(triggerButton, {
        onClick: (e) => {
          if (triggerButton.props.onClick) triggerButton.props.onClick(e);
          setIsOpen(prev => !prev);
        },
        'aria-expanded': isOpen
      })}
      {isOpen && React.cloneElement(menuContent, {
        onClose: () => setIsOpen(false)
      })}
    </div>
  );
}

export function DropdownMenu({ className = '', children, onClose, ...props }) {
  return (
    <div className={`ui-dropdown-menu ${className}`.trim()} role="menu" {...props}>
      {React.Children.map(children, child => {
        if (!child) return null;
        if (child.type === DropdownMenuItem) {
          return React.cloneElement(child, {
            onClick: (e) => {
              if (child.props.onClick) child.props.onClick(e);
              if (onClose) onClose();
            }
          });
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuItem({ className = '', children, onClick, ...props }) {
  return (
    <button
      type="button"
      className={`ui-dropdown-item ${className}`.trim()}
      role="menuitem"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className = '', ...props }) {
  return <div className={`ui-dropdown-separator ${className}`.trim()} {...props} />;
}
