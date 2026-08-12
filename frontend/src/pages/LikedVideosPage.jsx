import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getLikedVideosApi } from '../api/like.api';
import { VideoCard } from '../components/video/VideoCard';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { ThumbsUp, Lock } from 'lucide-react';

export const LikedVideosPage = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLikedVideos = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await getLikedVideosApi();
        if (response?.data && isMounted) {
          const videos = response.data
            .map((item) => item.video)
            .filter((v) => v && v._id);
          setLikedVideos(videos);
        }
      } catch (err) {
        if (isMounted) addToast(err.message || 'Failed to fetch liked videos', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLikedVideos();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, addToast]);

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
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Liked Videos</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Sign in to save and revisit your favorite FoundrCast videos.
        </p>
        <Button variant="primary" onClick={() => onOpenAuth && onOpenAuth('login')} style={{ marginTop: '0.5rem' }}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      {/* Header Bar */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Liked Videos
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Collection of videos you've liked on FoundrCast
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Spinner size={36} />
        </div>
      ) : likedVideos.length === 0 ? (
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
          <ThumbsUp size={48} color="var(--brand-cyan)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>No Liked Videos</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
            Click the heart icon on any video to add it to your Liked collection.
          </p>
          <Button variant="primary" onClick={() => navigate('/')} style={{ marginTop: '0.5rem' }}>
            Browse Feed
          </Button>
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
          {likedVideos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onClick={() => navigate(`/watch/${video._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
