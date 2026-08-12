import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getChannelStatsApi, getChannelVideosApi } from '../api/dashboard.api';
import { togglePublishStatusApi, deleteVideoApi } from '../api/video.api';
import { StatCard } from '../components/studio/StatCard';
import { UploadVideoModal } from '../components/studio/UploadVideoModal';
import { EditVideoModal } from '../components/studio/EditVideoModal';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { formatDuration, formatViews, formatTimeAgo } from '../utils/formatters';
import {
  Video,
  Eye,
  Users,
  Heart,
  Upload,
  Edit,
  Trash2,
  Globe,
  Lock,
  ChevronLeft,
  ChevronRight,
  Play,
} from 'lucide-react';

export const StudioPage = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalSubscribers: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loadingVideos, setLoadingVideos] = useState(true);

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!currentUser?._id) return;
    setLoadingStats(true);
    try {
      const response = await getChannelStatsApi();
      if (response?.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.warn('Failed to fetch channel stats:', err.message);
    } finally {
      setLoadingStats(false);
    }
  }, [currentUser?._id]);

  const fetchVideos = useCallback(
    async (pageNum = 1) => {
      if (!currentUser?._id) return;
      setLoadingVideos(true);
      try {
        const response = await getChannelVideosApi({ page: pageNum, limit: pagination.limit });
        if (response?.data) {
          setVideos(response.data.docs || []);
          setPagination((prev) => ({
            ...prev,
            page: response.data.page || pageNum,
            totalPages: response.data.totalPages || 1,
            totalDocs: response.data.totalDocs || 0,
            hasNextPage: !!response.data.hasNextPage,
            hasPrevPage: !!response.data.hasPrevPage,
          }));
        }
      } catch (err) {
        addToast(err.message || 'Failed to fetch studio videos', 'error');
      } finally {
        setLoadingVideos(false);
      }
    },
    [currentUser?._id, pagination.limit, addToast]
  );

  useEffect(() => {
    if (isAuthenticated && currentUser?._id) {
      fetchStats();
      fetchVideos(1);
    }
  }, [isAuthenticated, currentUser?._id, fetchStats, fetchVideos]);

  const handleTogglePublish = async (video) => {
    const prevStatus = video.isPublished;

    // Optimistic toggle
    setVideos((prev) =>
      prev.map((v) => (v._id === video._id ? { ...v, isPublished: !prevStatus } : v))
    );

    try {
      const res = await togglePublishStatusApi(video._id);
      addToast(
        res?.message || (prevStatus ? 'Video set to Private' : 'Video Published!'),
        'success'
      );
    } catch (err) {
      setVideos((prev) =>
        prev.map((v) => (v._id === video._id ? { ...v, isPublished: prevStatus } : v))
      );
      addToast(err.message || 'Failed to toggle publish status', 'error');
    }
  };

  const handleDeleteVideo = async (video) => {
    if (!window.confirm(`Are you sure you want to delete video "${video.title}"?`)) return;

    try {
      await deleteVideoApi(video._id);
      addToast('Video deleted successfully', 'success');
      fetchStats();
      fetchVideos(pagination.page);
    } catch (err) {
      addToast(err.message || 'Failed to delete video', 'error');
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
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Creator Studio Access</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Sign in to access your Creator Studio, upload videos, track analytics, and manage channel content.
        </p>
        <Button variant="primary" onClick={() => onOpenAuth && onOpenAuth('login')} style={{ marginTop: '0.5rem' }}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Top Banner & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Creator Studio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage your channel streams, analytics, and video library
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsUploadOpen(true)} style={{ padding: '8px 18px', fontSize: '13.5px' }}>
          <Upload size={18} /> Upload Video
        </Button>
      </div>

      {/* Analytics Overview Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', width: '100%' }}>
        <StatCard title="Total Views" value={stats.totalViews} icon={Eye} color="var(--brand-cyan)" />
        <StatCard title="Subscribers" value={stats.totalSubscribers} icon={Users} color="var(--brand-primary)" />
        <StatCard title="Total Likes" value={stats.totalLikes} icon={Heart} color="var(--state-error)" />
        <StatCard title="Total Videos" value={stats.totalVideos} icon={Video} color="var(--brand-accent)" />
      </div>

      {/* Creator Videos Management Table */}
      <div className="glass-panel" style={{ borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Channel Videos ({pagination.totalDocs})
          </h3>
        </div>

        {loadingVideos ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner size={32} />
          </div>
        ) : videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Video size={40} color="var(--brand-cyan)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>No Videos Uploaded Yet</h4>
            <p style={{ fontSize: '13px', marginTop: '4px', maxWidth: '360px', margin: '4px auto 1rem auto' }}>
              Start sharing your startup talks and tech tutorials on FoundrCast!
            </p>
            <Button variant="primary" onClick={() => setIsUploadOpen(true)}>
              <Upload size={16} /> Upload First Video
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {videos.map((v) => (
              <div
                key={v._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'var(--bg-dark-surface)',
                  border: '1px solid var(--glass-border)',
                  flexWrap: 'wrap',
                }}
              >
                {/* Thumbnail & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '240px' }}>
                  <div
                    onClick={() => navigate(`/watch/${v._id}`)}
                    style={{
                      position: 'relative',
                      width: '100px',
                      aspectRatio: '16 / 9',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      background: '#000',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {v.thumbnail ? (
                      <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-gradient)', color: '#fff' }}>
                        <Play size={20} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                    <h4
                      onClick={() => navigate(`/watch/${v._id}`)}
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {v.title}
                    </h4>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Uploaded {formatTimeAgo(v.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Metadata & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Views */}
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={14} color="var(--brand-cyan)" />
                    <span>{formatViews(v.views)}</span>
                  </div>

                  {/* Status Toggle Badge */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(v)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: v.isPublished ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: v.isPublished ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                      color: v.isPublished ? 'var(--state-success)' : '#fca5a5',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {v.isPublished ? <Globe size={12} /> : <Lock size={12} />}
                    <span>{v.isPublished ? 'Public' : 'Private'}</span>
                  </button>

                  {/* Edit Action */}
                  <Button
                    variant="secondary"
                    onClick={() => setEditingVideo(v)}
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                  >
                    <Edit size={14} /> Edit
                  </Button>

                  {/* Delete Action */}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteVideo(v)}
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="secondary" onClick={() => fetchVideos(pagination.page - 1)} disabled={!pagination.hasPrevPage} style={{ padding: '4px 10px', fontSize: '12px' }}>
                    <ChevronLeft size={14} /> Prev
                  </Button>
                  <Button variant="secondary" onClick={() => fetchVideos(pagination.page + 1)} disabled={!pagination.hasNextPage} style={{ padding: '4px 10px', fontSize: '12px' }}>
                    Next <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Video Modal */}
      <UploadVideoModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          fetchStats();
          fetchVideos(1);
        }}
      />

      {/* Edit Video Modal */}
      <EditVideoModal
        isOpen={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        video={editingVideo}
        onSuccess={() => {
          fetchVideos(pagination.page);
        }}
      />
    </div>
  );
};
