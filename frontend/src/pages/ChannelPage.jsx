import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getChannelProfileApi } from '../api/auth.api';
import { toggleSubscriptionApi } from '../api/subscription.api';
import { getAllVideosApi } from '../api/video.api';
import { VideoCard } from '../components/video/VideoCard';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { normalizeMediaUrl } from '../utils/formatters';
import { User, Bell, BellOff, Lock, Video, ArrowLeft } from 'lucide-react';

export const ChannelPage = ({ onOpenAuth }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subLoading, setSubLoading] = useState(false);

  const fetchChannelData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch channel profile metadata
      const profileRes = await getChannelProfileApi(username);
      const chData = profileRes?.data;
      if (!chData) {
        throw new Error('Channel profile not found');
      }

      setChannel(chData);

      // 2. Fetch creator's published videos using userId filter
      if (chData._id) {
        const videoRes = await getAllVideosApi({ userId: chData._id, limit: 30 });
        if (videoRes?.data?.docs) {
          setVideos(videoRes.data.docs);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load creator channel profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && username) {
      fetchChannelData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, username]);

  const isSelf =
    currentUser?._id &&
    channel?._id &&
    (currentUser._id === channel._id || currentUser.username === channel.username);

  const handleToggleSubscription = async () => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }

    if (isSelf) {
      addToast('You cannot subscribe to your own channel', 'warning');
      return;
    }

    const prevSubbed = channel.isSubscribed;
    const prevCount = channel.subscribersCount;

    setChannel((prev) => ({
      ...prev,
      isSubscribed: !prevSubbed,
      subscribersCount: prevSubbed ? Math.max(0, prevCount - 1) : prevCount + 1,
    }));
    setSubLoading(true);

    try {
      const res = await toggleSubscriptionApi(channel._id);
      addToast(
        res?.message || (prevSubbed ? 'Unsubscribed' : `Subscribed to @${channel.username}!`),
        'success'
      );
    } catch (err) {
      setChannel((prev) => ({
        ...prev,
        isSubscribed: prevSubbed,
        subscribersCount: prevCount,
      }));
      addToast(err.message || 'Subscription toggle failed', 'error');
    } finally {
      setSubLoading(false);
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
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Creator Channel Profile</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Sign in to view creator channels, follow streams, and browse published content.
        </p>
        <Button variant="primary" onClick={() => onOpenAuth && onOpenAuth('login')} style={{ marginTop: '0.5rem' }}>
          Sign In
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Spinner size={36} />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '3rem 2rem',
          maxWidth: '520px',
          margin: '2rem auto',
          textAlign: 'center',
          borderRadius: '20px',
        }}
      >
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Channel Unavailable</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {error || 'The requested creator channel profile does not exist.'}
        </p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Home Feed
        </Button>
      </div>
    );
  }

  const coverUrl = normalizeMediaUrl(channel.coverImage || '');
  const avatarUrl = normalizeMediaUrl(channel.avatar || '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      {/* Cover / Banner Header */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '180px',
          borderRadius: '20px',
          overflow: 'hidden',
          background: coverUrl ? '#000' : 'var(--brand-gradient)',
          border: '1px solid var(--glass-border)',
        }}
      >
        {coverUrl && (
          <img src={coverUrl} alt={channel.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>

      {/* Profile Details & Subscribe Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem 2rem',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginTop: '-40px',
          zIndex: 2,
        }}
      >
        {/* Avatar & Channel Names */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'var(--brand-gradient)',
              border: '3px solid var(--brand-primary)',
              boxShadow: 'var(--glow-primary)',
              flexShrink: 0,
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={channel.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <User size={36} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {channel.fullName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 600, color: 'var(--brand-cyan)' }}>@{channel.username}</span>
              <span>•</span>
              <span>
                {channel.subscribersCount} {channel.subscribersCount === 1 ? 'subscriber' : 'subscribers'}
              </span>
            </div>
          </div>
        </div>

        {/* Subscribe Action Button */}
        {!isSelf && (
          <Button
            variant={channel.isSubscribed ? 'secondary' : 'primary'}
            onClick={handleToggleSubscription}
            isLoading={subLoading}
            style={{ padding: '8px 20px', fontSize: '13.5px', borderRadius: '20px' }}
          >
            {channel.isSubscribed ? (
              <>
                <BellOff size={16} /> Subscribed
              </>
            ) : (
              <>
                <Bell size={16} /> Subscribe
              </>
            )}
          </Button>
        )}
      </div>

      {/* Published Videos Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Published Videos ({videos.length})
        </h3>

        {videos.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              borderRadius: '20px',
              color: 'var(--text-muted)',
            }}
          >
            <Video size={40} color="var(--brand-cyan)" style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>No Videos Published</h4>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>
              This creator hasn't published any public videos yet.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
              width: '100%',
            }}
          >
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onClick={() => navigate(`/watch/${video._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
