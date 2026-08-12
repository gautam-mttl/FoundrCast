import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

export const FileUploadInput = ({
  label,
  accept = 'image/*',
  onChange,
  currentUrl = '',
  required = false,
  progress = 0,
}) => {
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (onChange) onChange(file);
    }
  };

  const handleClear = () => {
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onChange) onChange(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label} {required && <span style={{ color: 'var(--state-error)' }}>*</span>}
        </label>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--glass-border)',
          borderRadius: '12px',
          padding: '1.25rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'var(--bg-dark-surface)',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--brand-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {previewUrl ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxHeight: '120px',
                maxWidth: '100%',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '1px solid var(--glass-border)',
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--state-error)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <UploadCloud size={28} color="var(--brand-primary)" />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Click or drag image file here
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              JPG, PNG, WEBP supported
            </span>
          </div>
        )}

        {/* Progress Bar Indicator */}
        {progress > 0 && progress < 100 && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'var(--bg-dark-base)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'var(--brand-gradient)',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
