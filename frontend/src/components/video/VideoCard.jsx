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
    owner,
  } = video;

  const channelObj = channel || (typeof owner === 'object' ? owner : null);
  const channelName = channelObj?.username ? `@${channelObj.username}` : 'FoundrCast Creator';
  const avatarUrl = channelObj?.avatar || '';

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
        {duration > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.85)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
            }}
          >
            {formatDuration(duration)}
          </div>
        )}
      </div>

      {/* Video Info Container */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {/* Creator Avatar */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'var(--brand-gradient)',
            border: '1px solid var(--glass-border)',
            flexShrink: 0,
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={channelName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <User size={18} />
            </div>
          )}
        </div>

        {/* Text Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 }}>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </h3>

          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {channelName}
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11.5px',
              color: 'var(--text-muted)',
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
