import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'var(--brand-primary)' }) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        minWidth: '200px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </span>
        <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {value !== undefined && value !== null ? value : 0}
        </span>
      </div>

      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: 'var(--bg-dark-card)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Icon size={24} />
      </div>
    </div>
  );
};
