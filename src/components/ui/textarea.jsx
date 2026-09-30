import * as React from 'react';
import './textarea.css';

const Textarea = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <textarea
      className={`ui-textarea ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export function TextareaDemo() {
  return <Textarea placeholder="Type your message here." />;
}

export { Textarea };
export default Textarea;
