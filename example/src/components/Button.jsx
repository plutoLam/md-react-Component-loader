// Button.js
import React from 'react';

function Button({ onClick, children, className, disabled, type, style }) {
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      type={type}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;