import React, { useState, useEffect, useCallback } from 'react';
import { getVideoCommentsApi, addCommentApi } from '../../api/comment.api';
import { CommentItem } from './CommentItem';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { MessageSquare, Send, User, Lock } from 'lucide-react';

export const CommentSection = ({ videoId, onOpenAuth }) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [comments, setComments] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async (pageNum = 1, append = false) => {
    if (!videoId) return;
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await getVideoCommentsApi(videoId, { page: pageNum, limit: 10 });
      if (response?.data) {
        const { docs = [], totalDocs: total = 0, hasNextPage: hasNext = false } = response.data;
        if (append) {
          setComments((prev) => [...prev, ...docs]);
        } else {
          setComments(docs);
        }
        setTotalDocs(total);
        setHasNextPage(hasNext);
        setPage(pageNum);
      }
    } catch (err) {
      console.warn('Failed to load comments:', err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchComments(1, false);
  }, [fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth('login');
      return;
    }

    if (!newCommentText.trim()) return;

    setSubmitting(true);
    try {
      const response = await addCommentApi(videoId, newCommentText.trim());
      addToast('Comment posted!', 'success');
      setNewCommentText('');

      // Create local comment object matching schema
      const createdComment = {
        _id: response.data?._id || `temp-${Date.now()}`,
        content: response.data?.content || newCommentText.trim(),
        createdAt: new Date().toISOString(),
        owner: {
          _id: currentUser?._id,
          username: currentUser?.username,
          avatar: currentUser?.avatar,
        },
      };

      setComments((prev) => [createdComment, ...prev]);
      setTotalDocs((prev) => prev + 1);
    } catch (err) {
      addToast(err.message || 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCommentInState = (commentId, updatedContent) => {
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, content: updatedContent } : c))
    );
  };

  const handleDeleteCommentFromState = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    setTotalDocs((prev) => Math.max(0, prev - 1));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', marginTop: '1rem' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MessageSquare size={20} color="var(--brand-cyan)" />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Comments ({totalDocs})
        </h3>
      </div>

      {/* Add Comment Input Form */}
      {isAuthenticated ? (
        <form
          onSubmit={handleAddComment}
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            padding: '1rem',
            borderRadius: '16px',
            background: 'var(--bg-dark-card)',
            border: '1px solid var(--glass-border)',
          }}
        >
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
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <User size={16} />
              </div>
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
              placeholder="Add a comment to this FoundrCast video..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'var(--bg-dark-surface)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="primary"
                isLoading={submitting}
                disabled={!newCommentText.trim()}
                style={{ padding: '6px 16px', fontSize: '13px' }}
              >
                <Send size={15} /> Comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            background: 'var(--bg-dark-card)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            <Lock size={18} color="var(--brand-cyan)" />
            <span>Sign in to participate in discussion and leave comments.</span>
          </div>
          <Button variant="primary" onClick={() => onOpenAuth && onOpenAuth('login')} style={{ padding: '6px 14px', fontSize: '12.5px' }}>
            Sign In
          </Button>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} style={{ height: '70px', borderRadius: '12px', background: 'var(--bg-dark-card)', opacity: 0.5 }} />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>
          Be the first to comment on this FoundrCast video!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onUpdateComment={handleUpdateCommentInState}
              onDeleteComment={handleDeleteCommentFromState}
              onOpenAuth={onOpenAuth}
            />
          ))}

          {/* Load More Pagination */}
          {hasNextPage && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
              <Button
                variant="secondary"
                onClick={() => fetchComments(page + 1, true)}
                isLoading={loadingMore}
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                Load More Comments
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
