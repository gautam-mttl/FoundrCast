import React, { useState } from 'react';
import { publishVideoApi } from '../../api/video.api';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { FileUploadInput } from '../common/FileUploadInput';
import { Upload, Video, Image, FileText, CheckCircle2 } from 'lucide-react';

export const UploadVideoModal = ({ isOpen, onClose, onSuccess }) => {
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      addToast('Title and description are required', 'error');
      return;
    }
    if (!videoFile) {
      addToast('Video file is required', 'error');
      return;
    }
    if (!thumbnailFile) {
      addToast('Thumbnail image is required', 'error');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('videoFile', videoFile);
      formData.append('thumbnail', thumbnailFile);

      await publishVideoApi(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      });

      addToast('Video published successfully!', 'success');
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
      setProgress(0);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      addToast(err.message || 'Failed to publish video', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish New Video" maxWidth="520px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          label="Video Title"
          placeholder="e.g. Building an AI Startup from Scratch"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={uploading}
          required
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Description <span style={{ color: 'var(--brand-primary)' }}>*</span>
          </label>
          <textarea
            placeholder="Provide a detailed description of your video..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={uploading}
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
          label="Video File (.mp4, .webm, .mkv)"
          accept="video/*"
          onChange={(file) => setVideoFile(file)}
          disabled={uploading}
          required
        />

        <FileUploadInput
          label="Thumbnail Image (.jpg, .png, .webp)"
          accept="image/*"
          onChange={(file) => setThumbnailFile(file)}
          disabled={uploading}
          required
        />

        {/* Upload Progress Bar */}
        {uploading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ color: 'var(--brand-cyan)' }}>
                {progress < 100 ? 'Uploading to Cloudinary...' : 'Processing video stream...'}
              </span>
              <span style={{ color: 'var(--text-primary)' }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', borderRadius: '4px', background: 'var(--bg-dark-surface)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'var(--brand-gradient)',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={uploading} disabled={uploading}>
            <Upload size={16} /> Publish Video
          </Button>
        </div>
      </form>
    </Modal>
  );
};
