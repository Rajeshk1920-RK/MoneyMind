import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import './popover.css';

const PopoverContext = createContext(null);

export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
  className = '',
  placement = 'bottom start',
  ...props
}) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setIsOpen = (nextState) => {
    if (!isControlled) {
      setUncontrolledOpen(nextState);
    }
    if (onOpenChange) {
      onOpenChange(nextState);
    }
  };

  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const placementClass = `placement-${placement.replace(/\s+/g, '-')}`;

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen, placementClass }}>
      <div ref={containerRef} className={`ui-popover-root ${className}`} {...props}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children, asChild, className = '', ...props }) {
  const context = useContext(PopoverContext);
  
  // If PopoverTrigger is used outside Popover, wrap with an internal Popover
  if (!context) {
    return (
      <Popover placement="bottom start">
        <InternalPopoverTriggerWithChildren {...props}>
          {children}
        </InternalPopoverTriggerWithChildren>
      </Popover>
    );
  }

  const { isOpen, setIsOpen } = context;

  const handleClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div
      onClick={handleClick}
      className={`ui-popover-trigger-wrapper ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function InternalPopoverTriggerWithChildren({ children, ...props }) {
  const context = useContext(PopoverContext);
  const { isOpen, setIsOpen, placementClass } = context;

  const childrenArray = React.Children.toArray(children);
  const triggerEl = childrenArray[0];
  const popoverEl = childrenArray.slice(1);

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="ui-popover-trigger-wrapper"
        {...props}
      >
        {triggerEl}
      </div>

      {isOpen && (
        <div
          className={`ui-popover-content ${placementClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          {popoverEl}
        </div>
      )}
    </>
  );
}

export function PopoverContent({ children, className = '', ...props }) {
  const context = useContext(PopoverContext);
  if (!context) return null;

  const { isOpen, placementClass } = context;
  if (!isOpen) return null;

  return (
    <div
      className={`ui-popover-content ${placementClass} ${className}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

export default Popover;
