import React from 'react';

export const SkeletonCard = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
      }}
    >
      {/* Thumbnail Skeleton */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: '14px',
          background: 'linear-gradient(90deg, var(--bg-dark-card) 25%, var(--bg-dark-hover) 50%, var(--bg-dark-card) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear',
        }}
      />

      {/* Info Row Skeleton */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {/* Avatar Circle */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-dark-card)',
            flexShrink: 0,
          }}
        />

        {/* Text Lines Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <div
            style={{
              height: '16px',
              width: '90%',
              borderRadius: '4px',
              background: 'var(--bg-dark-card)',
            }}
          />
          <div
            style={{
              height: '14px',
              width: '60%',
              borderRadius: '4px',
              background: 'var(--bg-dark-card)',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.75rem',
        width: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};
