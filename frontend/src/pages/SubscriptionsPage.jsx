import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getSubscribedChannelsApi, toggleSubscriptionApi } from '../api/subscription.api';
import { getAllVideosApi } from '../api/video.api';
import { VideoCard } from '../components/video/VideoCard';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Users, BellOff, Lock, Play } from 'lucide-react';

export const SubscriptionsPage = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [subscriptions, setSubscriptions] = useState([]);
  const [channelVideos, setChannelVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionsAndFeed = async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    try {
      // 1. Fetch channels user is subscribed to
      const subRes = await getSubscribedChannelsApi(currentUser._id);
      const subs = subRes?.data || [];
      setSubscriptions(subs);

      // 2. Fetch recent videos from subscribed channels
      if (subs.length > 0) {
        const feedRes = await getAllVideosApi({ limit: 40 });
        const allVids = feedRes?.data?.docs || [];

        const subChannelIds = new Set(
          subs.map((s) => (s.channel?._id || s.channel).toString())
        );

        const filtered = allVids.filter((v) => {
          const chId = (v.channel?._id || v.owner?._id || v.owner)?.toString();
          return chId && subChannelIds.has(chId);
        });

        setChannelVideos(filtered);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load subscriptions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUser?._id) {
      fetchSubscriptionsAndFeed();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser?._id]);

  const handleUnsubscribe = async (channelId, channelName) => {
    try {
      await toggleSubscriptionApi(channelId);
      addToast(`Unsubscribed from ${channelName}`, 'info');
      setSubscriptions((prev) =>
        prev.filter((s) => (s.channel?._id || s.channel) !== channelId)
      );
      setChannelVideos((prev) =>
        prev.filter((v) => (v.channel?._id || v.owner?._id || v.owner)?.toString() !== channelId)
      );
    } catch (err) {
      addToast(err.message || 'Failed to unsubscribe', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '3rem 2rem',
          maxWidth: '520px',
          margin: '2rem auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          borderRadius: '20px',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            background: 'var(--brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glow-primary)',
          }}
        >
          <Lock size={30} color="#fff" />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Subscriptions Feed</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Sign in to subscribe to your favorite startup creators and never miss a video.
        </p>
        <Button variant="primary" onClick={() => onOpenAuth && onOpenAuth('login')} style={{ marginTop: '0.5rem' }}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Header Bar */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Subscriptions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Latest videos and streams from creators you follow
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Spinner size={36} />
        </div>
      ) : subscriptions.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            borderRadius: '20px',
          }}
        >
          <Users size={48} color="var(--brand-cyan)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>No Subscriptions Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
            Subscribe to channels from the Home Feed or Watch Page to see their content here.
          </p>
          <Button variant="primary" onClick={() => navigate('/')} style={{ marginTop: '0.5rem' }}>
            Browse Home Feed
          </Button>
        </div>
      ) : (
        <>
          {/* Subscribed Channels Avatar Carousel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Subscribed Creators ({subscriptions.length})
            </h3>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
              }}
            >
              {subscriptions.map((sub) => {
                const ch = sub.channel || {};
                const chId = ch._id || sub.channel;
                const username = ch.username ? `@${ch.username}` : 'Creator';
                const avatar = ch.avatar || '';

                return (
                  <div
                    key={sub._id || chId}
                    className="glass-panel"
                    style={{
                      padding: '1rem',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '130px',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: 'var(--brand-gradient)',
                        border: '2px solid var(--brand-primary)',
                      }}
                    >
                      {avatar ? (
                        <img src={avatar} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                          <Users size={24} />
                        </div>
                      )}
                    </div>

                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>
                      {username}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleUnsubscribe(chId, username)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '2px',
                      }}
                      title="Unsubscribe"
                    >
                      <BellOff size={12} /> Unfollow
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subscribed Videos Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent Subscribed Uploads ({channelVideos.length})
            </h3>

            {channelVideos.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>
                Subscribed creators haven't uploaded new videos recently.
              </p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem',
                  width: '100%',
                }}
              >
                {channelVideos.map((video) => (
                  <VideoCard
                    key={video._id}
                    video={video}
                    onClick={() => navigate(`/watch/${video._id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
