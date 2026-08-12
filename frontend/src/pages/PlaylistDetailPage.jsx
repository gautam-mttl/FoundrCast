import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  getPlaylistByIdApi,
  updatePlaylistApi,
  deletePlaylistApi,
  removeVideoFromPlaylistApi,
} from '../api/playlist.api';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { formatDuration } from '../utils/formatters';
import { ArrowLeft, Edit3, Trash2, Play, Video, X, Lock } from 'lucide-react';

export const PlaylistDetailPage = ({ onOpenAuth }) => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchPlaylist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPlaylistByIdApi(playlistId);
      if (response?.data) {
        setPlaylist(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId]);

  const isOwner =
    isAuthenticated &&
    currentUser?._id &&
    playlist?.owner &&
    (playlist.owner === currentUser._id || playlist.owner._id === currentUser._id);

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    if (!editName.trim() && !editDescription.trim()) return;

    setUpdating(true);
    try {
      const response = await updatePlaylistApi(playlistId, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      addToast('Playlist updated', 'success');
      setIsEditOpen(false);
      fetchPlaylist();
    } catch (err) {
      addToast(err.message || 'Failed to update playlist', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm(`Are you sure you want to delete playlist "${playlist?.name}"?`)) return;

    try {
      await deletePlaylistApi(playlistId);
      addToast('Playlist deleted', 'success');
      navigate('/playlists');
    } catch (err) {
      addToast(err.message || 'Failed to delete playlist', 'error');
    }
  };

  const handleRemoveVideo = async (e, videoId, videoTitle) => {
    e.stopPropagation(); // prevent navigating to watch page
    try {
      await removeVideoFromPlaylistApi(videoId, playlistId);
      addToast(`Removed "${videoTitle}" from playlist`, 'info');
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => (v._id || v) !== videoId),
      }));
    } catch (err) {
      addToast(err.message || 'Failed to remove video', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Spinner size={36} />
      </div>
    );
  }

  if (error) {
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
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Playlist Unavailable</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</p>
        <Button variant="secondary" onClick={() => navigate('/playlists')}>
          <ArrowLeft size={16} /> Back to Playlists
        </Button>
      </div>
    );
  }

  if (!playlist) return null;

  const videosList = Array.isArray(playlist.videos) ? playlist.videos : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      {/* Breadcrumb Navigation */}
      <div>
        <Button variant="secondary" onClick={() => navigate('/playlists')} style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '20px' }}>
          <ArrowLeft size={15} /> Back to Playlists
        </Button>
      </div>

      {/* Playlist Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {playlist.name}
            </h1>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                background: 'var(--bg-dark-card)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--brand-cyan)',
                border: '1px solid var(--glass-border)',
              }}
            >
              {videosList.length} {videosList.length === 1 ? 'video' : 'videos'}
            </span>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {playlist.description || 'No description provided.'}
          </p>
        </div>

        {/* Owner Controls */}
        {isOwner && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="secondary"
              onClick={() => {
                setEditName(playlist.name);
                setEditDescription(playlist.description);
                setIsEditOpen(true);
              }}
              style={{ padding: '8px 14px', fontSize: '13px' }}
            >
              <Edit3 size={16} /> Edit
            </Button>
            <Button variant="danger" onClick={handleDeletePlaylist} style={{ padding: '8px 14px', fontSize: '13px' }}>
              <Trash2 size={16} /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Playlist Videos Grid */}
      {videosList.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: '20px',
            color: 'var(--text-muted)',
          }}
        >
          <Video size={42} color="var(--brand-cyan)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>This playlist is empty</h3>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>
            Browse FoundrCast videos and click "+ Save" to add videos to this playlist.
          </p>
          <Button variant="primary" onClick={() => navigate('/')} style={{ marginTop: '1.25rem' }}>
            Browse Videos
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
          {videosList.map((videoItem) => {
            const vId = videoItem._id || videoItem;
            const vTitle = videoItem.title || 'FoundrCast Video';
            const vThumb = videoItem.thumbnail || '';
            const vDuration = videoItem.duration || 0;

            return (
              <div
                key={vId}
                onClick={() => navigate(`/watch/${vId}`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  cursor: 'pointer',
                  borderRadius: '16px',
                  position: 'relative',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 9',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: 'var(--bg-dark-card)',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  {vThumb ? (
                    <img src={vThumb} alt={vTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-gradient)', color: '#fff' }}>
                      <Play size={28} />
                    </div>
                  )}

                  {/* Duration Badge */}
                  <span style={{ position: 'absolute', bottom: '8px', right: '8px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.85)', fontSize: '11px', color: '#fff', fontWeight: 600 }}>
                    {formatDuration(vDuration)}
                  </span>

                  {/* Owner Remove Video Button Overlay */}
                  {isOwner && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveVideo(e, vId, vTitle)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(239, 68, 68, 0.85)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '26px',
                        height: '26px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      title="Remove from playlist"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                  {vTitle}
                </h4>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Playlist Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Playlist" maxWidth="460px">
        <form onSubmit={handleUpdatePlaylist} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Playlist Title"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />
          <Input
            label="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            required
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={updating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
