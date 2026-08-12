import React from 'react';

export const Spinner = ({ size = 20, color = 'var(--brand-primary)' }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid rgba(255, 255, 255, 0.15)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
      }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
