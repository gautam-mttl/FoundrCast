import React, { useState } from 'react';
import { formatViews, formatTimeAgo } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';
import { Button } from '../common/Button';
import { Heart, Share2, User, ChevronDown, ChevronUp, Check } from 'lucide-react';

export const VideoDetails = ({ video, onToggleLike, onToggleSubscribe }) => {
  const { addToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video?.totalLikes || 0);

  if (!video) return null;

  const {
    _id,
    title = '',
    description = '',
    views = 0,
    createdAt,
    channel,
  } = video;

  const channelName = channel?.username ? `@${channel.username}` : 'FoundrCast Creator';
  const avatarUrl = channel?.avatar || '';

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    if (onToggleLike) onToggleLike(_id);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      addToast('Video link copied to clipboard!', 'success');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Video Title */}
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
        }}
      >
        {title}
      </h1>

      {/* Creator Channel Row & Action Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        {/* Creator Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'var(--brand-gradient)',
              border: '2px solid var(--brand-primary)',
              flexShrink: 0,
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
                  color: '#fff',
                }}
              >
                <User size={22} />
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {channelName}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Creator</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Like Button */}
          <Button
            variant={isLiked ? 'primary' : 'secondary'}
            onClick={handleLike}
            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '20px' }}
          >
            <Heart size={16} fill={isLiked ? '#fff' : 'none'} color={isLiked ? '#fff' : 'var(--text-primary)'} />
            <span>{likeCount}</span>
          </Button>

          {/* Share Button */}
          <Button
            variant="secondary"
            onClick={handleShare}
            style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '20px' }}
          >
            <Share2 size={16} /> Share
          </Button>
        </div>
      </div>

      {/* Expandable Description Box */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          borderRadius: '16px',
          background: 'var(--bg-dark-card)',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          <span>{formatViews(views)}</span>
          <span>•</span>
          <span>{formatTimeAgo(createdAt)}</span>
        </div>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: isExpanded ? 'unset' : 3,
            WebkitBoxOrient: 'vertical',
            overflow: isExpanded ? 'visible' : 'hidden',
          }}
        >
          {description || 'No description provided for this video.'}
        </p>

        {description.length > 120 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '0.75rem',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--brand-cyan)',
            }}
          >
            {isExpanded ? (
              <>
                <span>Show Less</span> <ChevronUp size={14} />
              </>
            ) : (
              <>
                <span>Show More</span> <ChevronDown size={14} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
