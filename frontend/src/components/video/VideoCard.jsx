import React from 'react';
import { formatDuration, formatViews, formatTimeAgo } from '../../utils/formatters';
import { User, Play } from 'lucide-react';

export const VideoCard = ({ video, onClick }) => {
  if (!video) return null;

  const {
    _id,
    title = 'Untitled FoundrCast',
    thumbnail = '',
    duration = 0,
    views = 0,
    createdAt,
    channel,
  } = video;

  const channelName = channel?.username ? `@${channel.username}` : 'FoundrCast Creator';
  const avatarUrl = channel?.avatar || '';

  return (
    <div
      onClick={() => onClick && onClick(video)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'pointer',
        width: '100%',
        borderRadius: '16px',
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Thumbnail Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: '14px',
          overflow: 'hidden',
          background: 'var(--bg-dark-card)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--glass-border)',
        }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--brand-gradient)',
              color: '#ffffff',
            }}
          >
            <Play size={32} />
          </div>
        )}

        {/* Duration Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            padding: '3px 8px',
            borderRadius: '6px',
            background: 'rgba(9, 10, 15, 0.85)',
            backdropFilter: 'blur(4px)',
            color: 'var(--text-primary)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {formatDuration(duration)}
        </div>
      </div>

      {/* Video Details Row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '0 2px' }}>
        {/* Creator Avatar */}
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-dark-card)',
            border: '1.5px solid var(--brand-primary)',
          }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={channelName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--brand-gradient)',
                color: '#fff',
              }}
            >
              <User size={18} />
            </div>
          )}
        </div>

        {/* Title & Metadata */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '4px',
            }}
          >
            {title}
          </h4>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {channelName}
          </div>

          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '2px',
            }}
          >
            <span>{formatViews(views)}</span>
            <span>•</span>
            <span>{formatTimeAgo(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
