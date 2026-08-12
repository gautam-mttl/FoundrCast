import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getUserPlaylistsApi, createPlaylistApi } from '../api/playlist.api';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { FolderHeart, Plus, Play, Lock, ListVideo } from 'lucide-react';

export const PlaylistsPage = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchPlaylists = async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    try {
      const response = await getUserPlaylistsApi(currentUser._id);
      if (response?.data) {
        setPlaylists(response.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load playlists', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUser?._id) {
      fetchPlaylists();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser?._id]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      addToast('Name and description are required', 'error');
      return;
    }

    setCreating(true);
    try {
      await createPlaylistApi({ name: name.trim(), description: description.trim() });
      addToast(`Playlist "${name}" created!`, 'success');
      setName('');
      setDescription('');
      setIsModalOpen(false);
      fetchPlaylists();
    } catch (err) {
      addToast(err.message || 'Failed to create playlist', 'error');
    } finally {
      setCreating(false);
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
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Playlists & Library</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Sign in to create, organize, and view your custom FoundrCast playlists.
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Playlists & Library
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage and curate your custom video collections
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)} style={{ padding: '8px 18px', fontSize: '13.5px' }}>
          <Plus size={18} /> Create Playlist
        </Button>
      </div>

      {/* Grid of Playlists */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Spinner size={36} />
        </div>
      ) : playlists.length === 0 ? (
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
          <FolderHeart size={48} color="var(--brand-cyan)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>No Playlists Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
            Create playlists to organize your favorite startup talks, code tutorials, and interviews.
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: '0.5rem' }}>
            <Plus size={16} /> Create Your First Playlist
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
          {playlists.map((playlist) => {
            const videoCount = Array.isArray(playlist.videos) ? playlist.videos.length : 0;

            return (
              <div
                key={playlist._id}
                onClick={() => navigate(`/playlist/${playlist._id}`)}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--brand-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'var(--brand-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: 'var(--glow-primary)',
                    }}
                  >
                    <ListVideo size={22} />
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: 'var(--bg-dark-surface)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--brand-cyan)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    {videoCount} {videoCount === 1 ? 'video' : 'videos'}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {playlist.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4, height: '36px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {playlist.description || 'No description'}
                  </p>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: 'var(--brand-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Collection →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Playlist Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Playlist" maxWidth="460px">
        <form onSubmit={handleCreatePlaylist} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Playlist Title"
            placeholder="e.g. Founder Masterclasses"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Description"
            placeholder="e.g. Essential startup lessons"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={creating}>
              Create Playlist
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
