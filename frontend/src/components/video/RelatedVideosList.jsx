import React, { useState, useEffect } from 'react';
import { getAllVideosApi } from '../../api/video.api';
import { formatDuration, formatViews } from '../../utils/formatters';
import { Play } from 'lucide-react';

export const RelatedVideosList = ({ currentVideoId, onSelectVideo }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRelated = async () => {
      setLoading(true);
      try {
        const response = await getAllVideosApi({ page: 1, limit: 10 });
        if (response?.data?.docs && isMounted) {
          const docs = response.data.docs.filter((v) => v._id !== currentVideoId);
          setRelatedVideos(docs);
        }
      } catch (err) {
        console.warn('Failed to load related videos:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRelated();
    return () => {
      isMounted = false;
    };
  }, [currentVideoId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Related FoundrCasts</h3>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              height: '80px',
              borderRadius: '12px',
              background: 'var(--bg-dark-card)',
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    );
  }

  if (relatedVideos.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        Related FoundrCasts
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {relatedVideos.map((video) => {
          const { _id, title, thumbnail, duration, views, channel } = video;
          const channelName = channel?.username ? `@${channel.username}` : 'Creator';

          return (
            <div
              key={_id}
              onClick={() => onSelectVideo && onSelectVideo(video)}
              style={{
                display: 'flex',
                gap: '12px',
                cursor: 'pointer',
                borderRadius: '12px',
                padding: '6px',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-dark-card)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Compact Thumbnail */}
              <div
                style={{
                  position: 'relative',
                  width: '120px',
                  aspectRatio: '16 / 9',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: '#000',
                  border: '1px solid var(--glass-border)',
                }}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={title}
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
                      background: 'var(--brand-gradient)',
                      color: '#fff',
                    }}
                  >
                    <Play size={16} />
                  </div>
                )}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    background: 'rgba(0,0,0,0.8)',
                    fontSize: '10px',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  {formatDuration(duration)}
                </span>
              </div>

              {/* Title & Creator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {title}
                </h4>
                <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{channelName}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatViews(views)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
