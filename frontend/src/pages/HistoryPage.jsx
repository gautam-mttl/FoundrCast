import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getWatchHistoryApi } from '../api/auth.api';
import { VideoCard } from '../components/video/VideoCard';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { History, Lock } from 'lucide-react';

export const HistoryPage = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [historyVideos, setHistoryVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await getWatchHistoryApi();
        if (response?.data && isMounted) {
          setHistoryVideos(response.data);
        }
      } catch (err) {
        if (isMounted) addToast(err.message || 'Failed to fetch watch history', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();
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
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Watch History</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Sign in to keep track of videos and streams you've watched.
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
          Watch History
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Videos you've previously viewed on FoundrCast
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Spinner size={36} />
        </div>
      ) : historyVideos.length === 0 ? (
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
          <History size={48} color="var(--brand-cyan)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Your Watch History is Empty</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
            Videos you watch on FoundrCast will show up here for easy rewatching.
          </p>
          <Button variant="primary" onClick={() => navigate('/')} style={{ marginTop: '0.5rem' }}>
            Explore Home Feed
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
          {historyVideos.map((video) => (
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
