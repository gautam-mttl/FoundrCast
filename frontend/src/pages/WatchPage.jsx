import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVideoByIdApi } from '../api/video.api';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { VideoDetails } from '../components/video/VideoDetails';
import { CommentSection } from '../components/comment/CommentSection';
import { RelatedVideosList } from '../components/video/RelatedVideosList';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ArrowLeft, AlertCircle, Lock } from 'lucide-react';

export const WatchPage = ({ onOpenAuth }) => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Logout handling: Immediately redirect if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      if (onOpenAuth) onOpenAuth('login');
    }
  }, [isAuthenticated, navigate, onOpenAuth]);

  // Fetch video details by URL videoId parameter
  useEffect(() => {
    let isMounted = true;
    if (!videoId) return;

    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getVideoByIdApi(videoId);
        if (response?.data && isMounted) {
          setVideo(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load video details');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVideo();
    return () => {
      isMounted = false;
    };
  }, [videoId]);

  const handleSelectRelatedVideo = (relatedVideo) => {
    if (relatedVideo?._id) {
      navigate(`/watch/${relatedVideo._id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: '1rem',
          color: 'var(--text-secondary)',
        }}
      >
        <Spinner size={36} />
        <span>Loading FoundrCast stream...</span>
      </div>
    );
  }

  if (error) {
    const isPrivate = error.toLowerCase().includes('private');
    const isUnauth = error.toLowerCase().includes('unauthorized') || !isAuthenticated;

    return (
      <div
        className="glass-panel"
        style={{
          padding: '3rem 2rem',
          maxWidth: '560px',
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
          {isUnauth ? <Lock size={30} color="#fff" /> : <AlertCircle size={30} color="#fff" />}
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
          {isPrivate ? 'Video is Private' : isUnauth ? 'Authentication Required' : 'Video Unavailable'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{error}</p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <Button variant="secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Back to Home Feed
          </Button>
          {isUnauth && (
            <Button variant="primary" onClick={() => onOpenAuth && onOpenAuth('login')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!video) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Breadcrumb Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '20px' }}
        >
          <ArrowLeft size={15} /> Back to Home Feed
        </Button>
      </div>

      {/* Main Watch Layout (2 Columns on Desktop) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '2rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column: Video Player, Details & Comment Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          <VideoPlayer
            videoId={video._id}
            videoUrl={video.videoUrl}
            posterUrl={video.thumbnail}
            title={video.title}
          />
          <VideoDetails video={video} onOpenAuth={onOpenAuth} />
          <CommentSection videoId={video._id} onOpenAuth={onOpenAuth} />
        </div>

        {/* Right Column: Related Videos List */}
        <div style={{ minWidth: 0 }}>
          <RelatedVideosList currentVideoId={video._id} onSelectVideo={handleSelectRelatedVideo} />
        </div>
      </div>
    </div>
  );
};
