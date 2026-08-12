import React, { useState, useEffect } from 'react';
import { updateVideoApi } from '../../api/video.api';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { FileUploadInput } from '../common/FileUploadInput';
import { Edit3, CheckCircle2 } from 'lucide-react';

export const EditVideoModal = ({ isOpen, onClose, video, onSuccess }) => {
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newThumbnail, setNewThumbnail] = useState(null);

  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (video) {
      setTitle(video.title || '');
      setDescription(video.description || '');
      setNewThumbnail(null);
    }
  }, [video]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video?._id) return;

    if (!title.trim() && !description.trim() && !newThumbnail) {
      addToast('No changes detected', 'info');
      return;
    }

    setUpdating(true);
    setProgress(0);

    try {
      let payload;
      if (newThumbnail) {
        payload = new FormData();
        if (title.trim()) payload.append('title', title.trim());
        if (description.trim()) payload.append('description', description.trim());
        payload.append('thumbnail', newThumbnail);
      } else {
        payload = {
          title: title.trim(),
          description: description.trim(),
        };
      }

      await updateVideoApi(video._id, payload, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      });

      addToast('Video details updated successfully!', 'success');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      addToast(err.message || 'Failed to update video', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Video Details" maxWidth="500px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={updating}
          required
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={updating}
            rows={3}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'var(--bg-dark-surface)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        <FileUploadInput
          label="New Thumbnail Image (Optional)"
          accept="image/*"
          onChange={(file) => setNewThumbnail(file)}
          disabled={updating}
        />

        {updating && newThumbnail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ color: 'var(--brand-cyan)' }}>Uploading thumbnail...</span>
              <span style={{ color: 'var(--text-primary)' }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', borderRadius: '4px', background: 'var(--bg-dark-surface)', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--brand-gradient)' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={updating}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={updating} disabled={updating}>
            <Edit3 size={16} /> Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
