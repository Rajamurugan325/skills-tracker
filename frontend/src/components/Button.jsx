import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false, variant = 'primary' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`glass-button ${variant === 'secondary' ? 'secondary' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
