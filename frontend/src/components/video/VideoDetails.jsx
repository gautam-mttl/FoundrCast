import React, { useState, useEffect } from 'react';
import { formatViews, formatTimeAgo } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { toggleVideoLikeApi, getLikedVideosApi } from '../../api/like.api';
import {
  toggleSubscriptionApi,
  getChannelSubscribersApi,
  getSubscribedChannelsApi,
} from '../../api/subscription.api';
import { Button } from '../common/Button';
import { Heart, Share2, User, ChevronDown, ChevronUp, Bell, BellOff } from 'lucide-react';

export const VideoDetails = ({ video, onOpenAuth }) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video?.totalLikes || 0);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loadingSub, setLoadingSub] = useState(false);

  const videoId = video?._id;
  const channel = video?.channel;
  const channelId = channel?._id;
  const channelName = channel?.username ? `@${channel.username}` : 'FoundrCast Creator';
  const avatarUrl = channel?.avatar || '';

  const isSelfChannel = currentUser?._id && channelId && currentUser._id === channelId;

  // Sync likeCount with video prop
  useEffect(() => {
    if (video?.totalLikes !== undefined) {
      setLikeCount(video.totalLikes);
    }
  }, [video?.totalLikes]);

  // Check initial video like state and subscriber count
  useEffect(() => {
    let isMounted = true;

    const checkInitialStates = async () => {
      // Check subscriber count
      if (channelId) {
        try {
          const subRes = await getChannelSubscribersApi(channelId);
          if (subRes?.data?.totalSubscribers !== undefined && isMounted) {
            setSubscriberCount(subRes.data.totalSubscribers);
          }
        } catch (err) {
          // ignore error if unauthorized or non-existent
        }
      }

      // If user authenticated, check if video is liked and channel is subscribed
      if (isAuthenticated && currentUser?._id) {
        try {
          const likedRes = await getLikedVideosApi();
          if (likedRes?.data && Array.isArray(likedRes.data) && isMounted) {
            const hasLiked = likedRes.data.some(
              (item) => item.video?._id === videoId || item.video === videoId
            );
            setIsLiked(hasLiked);
          }
        } catch (err) {}

        if (channelId && !isSelfChannel) {
          try {
            const mySubsRes = await getSubscribedChannelsApi(currentUser._id);
            if (mySubsRes?.data && Array.isArray(mySubsRes.data) && isMounted) {
              const hasSubbed = mySubsRes.data.some(
                (item) => item.channel?._id === channelId || item.channel === channelId
              );
              setIsSubscribed(hasSubbed);
            }
          } catch (err) {}
        }
      }
    };

    checkInitialStates();
    return () => {
      isMounted = false;
    };
  }, [videoId, channelId, isAuthenticated, currentUser?._id, isSelfChannel]);

  // Handle Video Like Toggle
  const handleLike = async () => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }

    const prevLiked = isLiked;
    const prevCount = likeCount;

    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const response = await toggleVideoLikeApi(videoId);
      addToast(response?.message || (prevLiked ? 'Video unliked' : 'Video liked!'), 'success');
    } catch (err) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      addToast(err.message || 'Failed to toggle like', 'error');
    }
  };

  // Handle Subscription Toggle
  const handleToggleSubscription = async () => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }

    if (isSelfChannel) {
      addToast('You cannot subscribe to your own channel', 'warning');
      return;
    }

    const prevSubbed = isSubscribed;
    const prevCount = subscriberCount;

    setIsSubscribed(!prevSubbed);
    setSubscriberCount(prevSubbed ? Math.max(0, prevCount - 1) : prevCount + 1);
    setLoadingSub(true);

    try {
      const response = await toggleSubscriptionApi(channelId);
      addToast(response?.message || (prevSubbed ? 'Unsubscribed' : 'Subscribed!'), 'success');
    } catch (err) {
      setIsSubscribed(prevSubbed);
      setSubscriberCount(prevCount);
      addToast(err.message || 'Subscription toggle failed', 'error');
    } finally {
      setLoadingSub(false);
    }
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
        {video?.title}
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
        {/* Creator Info & Subscribe Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {subscriberCount} {subscriberCount === 1 ? 'subscriber' : 'subscribers'}
            </span>
          </div>

          {/* Subscribe Action Button */}
          {!isSelfChannel && (
            <Button
              variant={isSubscribed ? 'secondary' : 'primary'}
              onClick={handleToggleSubscription}
              isLoading={loadingSub}
              style={{
                padding: '6px 16px',
                fontSize: '13px',
                borderRadius: '20px',
                marginLeft: '6px',
              }}
            >
              {isSubscribed ? (
                <>
                  <BellOff size={15} /> Subscribed
                </>
              ) : (
                <>
                  <Bell size={15} /> Subscribe
                </>
              )}
            </Button>
          )}
        </div>

        {/* Action Toolbar (Like / Share) */}
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
          <span>{formatViews(video?.views)}</span>
          <span>•</span>
          <span>{formatTimeAgo(video?.createdAt)}</span>
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
          {video?.description || 'No description provided for this video.'}
        </p>

        {video?.description && video.description.length > 120 && (
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
