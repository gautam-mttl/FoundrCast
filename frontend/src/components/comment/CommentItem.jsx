import React, { useState } from 'react';
import { formatTimeAgo } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { toggleCommentLikeApi } from '../../api/like.api';
import { updateCommentApi, deleteCommentApi } from '../../api/comment.api';
import { Button } from '../common/Button';
import { Heart, Edit2, Trash2, User, Check, X } from 'lucide-react';

export const CommentItem = ({ comment, onUpdateComment, onDeleteComment, onOpenAuth }) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const { _id, content = '', createdAt, owner } = comment || {};
  const isOwner = isAuthenticated && currentUser?._id && owner?._id === currentUser._id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }

    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      await toggleCommentLikeApi(_id);
    } catch (err) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      addToast(err.message || 'Failed to toggle comment like', 'error');
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      addToast('Comment content cannot be empty', 'error');
      return;
    }

    setLoadingUpdate(true);
    try {
      const response = await updateCommentApi(_id, editContent.trim());
      addToast('Comment updated', 'success');
      setIsEditing(false);
      if (onUpdateComment) {
        onUpdateComment(_id, response.data?.content || editContent.trim());
      }
    } catch (err) {
      addToast(err.message || 'Failed to update comment', 'error');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setLoadingDelete(true);
    try {
      await deleteCommentApi(_id);
      addToast('Comment deleted', 'success');
      if (onDeleteComment) {
        onDeleteComment(_id);
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete comment', 'error');
    } finally {
      setLoadingDelete(false);
    }
  };

  const username = owner?.username ? `@${owner.username}` : 'FoundrCast User';
  const avatarUrl = owner?.avatar || '';

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        padding: '1rem',
        borderRadius: '12px',
        background: 'var(--bg-dark-card)',
        border: '1px solid var(--glass-border)',
        width: '100%',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'var(--brand-gradient)',
          border: '1px solid var(--brand-primary)',
          flexShrink: 0,
        }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <User size={16} />
          </div>
        )}
      </div>

      {/* Content Body */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Header line: Username & time ago */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{username}</span>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{formatTimeAgo(createdAt)}</span>
          </div>

          {/* Owner Action Buttons (Edit / Delete) */}
          {isOwner && !isEditing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={() => {
                  setEditContent(content);
                  setIsEditing(true);
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                title="Edit Comment"
              >
                <Edit2 size={14} />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loadingDelete}
                style={{ background: 'none', border: 'none', color: 'var(--state-error)', cursor: 'pointer', padding: '4px' }}
                title="Delete Comment"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Comment Text or Inline Edit Form */}
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--bg-dark-surface)',
                border: '1px solid var(--brand-primary)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setIsEditing(false)} style={{ padding: '4px 10px', fontSize: '12px' }}>
                <X size={14} /> Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdit} isLoading={loadingUpdate} style={{ padding: '4px 10px', fontSize: '12px' }}>
                <Check size={14} /> Save
              </Button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {content}
          </p>
        )}

        {/* Footer: Like Action */}
        {!isEditing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={handleToggleLike}
              style={{
                background: 'none',
                border: 'none',
                color: isLiked ? 'var(--brand-cyan)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              <Heart size={14} fill={isLiked ? 'var(--brand-cyan)' : 'none'} />
              <span>{likeCount > 0 ? likeCount : 'Like'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
