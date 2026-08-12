import React from 'react';
import { Spinner } from './Spinner';

export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--brand-gradient)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
        };
      case 'secondary':
        return {
          background: 'var(--bg-dark-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--glass-border)',
        };
      case 'danger':
        return {
          background: 'var(--state-error)',
          color: '#ffffff',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
        };
      default:
        return {};
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        padding: '10px 20px',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '14px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        opacity: disabled || isLoading ? 0.6 : 1,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {isLoading ? <Spinner size={16} color="#ffffff" /> : null}
      {children}
    </button>
  );
};
