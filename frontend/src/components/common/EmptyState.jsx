import React from 'react';
import { VideoOff, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  title = 'No Videos Found',
  description = 'There are no videos matching your search query or filter selection.',
  onReset,
  icon: Icon = VideoOff,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        width: '100%',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '24px',
          background: 'var(--bg-dark-card)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          color: 'var(--brand-primary)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Icon size={36} />
      </div>

      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', marginBottom: '1.5rem' }}>
        {description}
      </p>

      {onReset && (
        <Button variant="secondary" onClick={onReset} style={{ fontSize: '13px', padding: '8px 16px' }}>
          <RefreshCw size={15} /> Clear Search & Filters
        </Button>
      )}
    </div>
  );
};
