import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import {
  getUserPlaylistsApi,
  createPlaylistApi,
  addVideoToPlaylistApi,
  removeVideoFromPlaylistApi,
} from '../../api/playlist.api';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';
import { FolderPlus, Plus, Check, ListVideo } from 'lucide-react';

export const AddToPlaylistModal = ({ isOpen, onClose, videoId }) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // New playlist form state
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creatingLoading, setCreatingLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchPlaylists = async () => {
      if (!currentUser?._id) return;
      setLoading(true);
      try {
        const response = await getUserPlaylistsApi(currentUser._id);
        if (response?.data && isMounted) {
          setPlaylists(response.data);
        }
      } catch (err) {
        console.warn('Failed to load playlists:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (isOpen && isAuthenticated && currentUser?._id) {
      fetchPlaylists();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, isAuthenticated, currentUser?._id]);

  const handleTogglePlaylist = async (playlist) => {
    const isAlreadyIn = Array.isArray(playlist.videos) && playlist.videos.includes(videoId);

    // Optimistic toggle
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p._id === playlist._id) {
          const currentVids = Array.isArray(p.videos) ? p.videos : [];
          const nextVids = isAlreadyIn
            ? currentVids.filter((id) => id !== videoId)
            : [...currentVids, videoId];
          return { ...p, videos: nextVids };
        }
        return p;
      })
    );

    try {
      if (isAlreadyIn) {
        await removeVideoFromPlaylistApi(videoId, playlist._id);
        addToast(`Removed from "${playlist.name}"`, 'info');
      } else {
        await addVideoToPlaylistApi(videoId, playlist._id);
        addToast(`Saved to "${playlist.name}"`, 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update playlist', 'error');
      fetchPlaylists(); // rollback
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      addToast('Playlist name and description are required', 'error');
      return;
    }

    setCreatingLoading(true);
    try {
      const createRes = await createPlaylistApi({ name: name.trim(), description: description.trim() });
      const newPlaylist = createRes?.data;

      if (newPlaylist?._id && videoId) {
        await addVideoToPlaylistApi(videoId, newPlaylist._id);
        addToast(`Playlist "${name}" created and video saved!`, 'success');
      }

      setName('');
      setDescription('');
      setIsCreating(false);
      fetchPlaylists();
    } catch (err) {
      addToast(err.message || 'Failed to create playlist', 'error');
    } finally {
      setCreatingLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save Video to Playlist" maxWidth="440px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Spinner size={28} />
          </div>
        ) : playlists.length === 0 && !isCreating ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-secondary)' }}>
            <ListVideo size={36} color="var(--brand-cyan)" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '14px', fontWeight: 600 }}>No playlists found</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Create your first playlist to save FoundrCast videos.
            </p>
            <Button variant="primary" onClick={() => setIsCreating(true)} style={{ padding: '8px 16px', fontSize: '13px' }}>
              <Plus size={16} /> Create Playlist
            </Button>
          </div>
        ) : (
          <>
            {/* Playlists List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {playlists.map((playlist) => {
                const hasVideo = Array.isArray(playlist.videos) && playlist.videos.includes(videoId);

                return (
                  <label
                    key={playlist._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'var(--bg-dark-surface)',
                      border: '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {playlist.name}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {Array.isArray(playlist.videos) ? playlist.videos.length : 0} videos
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={hasVideo}
                      onChange={() => handleTogglePlaylist(playlist)}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--brand-primary)',
                        cursor: 'pointer',
                      }}
                    />
                  </label>
                );
              })}
            </div>

            {/* Create New Playlist Form Toggle */}
            {!isCreating ? (
              <Button
                variant="secondary"
                onClick={() => setIsCreating(true)}
                style={{ width: '100%', padding: '10px', fontSize: '13px' }}
              >
                <Plus size={16} /> Create New Playlist
              </Button>
            ) : (
              <form onSubmit={handleCreateAndAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>New Playlist</h4>
                <Input
                  placeholder="Playlist title (e.g. AI Founder Talks)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Description (e.g. Best startup interviews)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <Button variant="secondary" onClick={() => setIsCreating(false)} style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={creatingLoading} style={{ padding: '6px 14px', fontSize: '12px' }}>
                    Create & Save
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
