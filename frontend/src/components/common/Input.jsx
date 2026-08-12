import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  style = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label} {required && <span style={{ color: 'var(--state-error)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '12px 14px',
            paddingLeft: Icon ? '40px' : '14px',
            paddingRight: isPassword ? '40px' : '14px',
            borderRadius: '10px',
            background: 'var(--bg-dark-surface)',
            border: error ? '1px solid var(--state-error)' : '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            ...style,
          }}
          onFocus={(e) => {
            if (!error) e.target.style.borderColor = 'var(--brand-primary)';
            e.target.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.2)';
          }}
          onBlur={(e) => {
            if (!error) e.target.style.borderColor = 'var(--glass-border)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span style={{ fontSize: '12px', color: 'var(--state-error)' }}>{error}</span>}
    </div>
  );
};
