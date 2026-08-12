import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllVideosApi } from '../api/video.api';
import { VideoGrid } from '../components/video/VideoGrid';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Lock, LogIn } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

const CATEGORY_CHIPS = ['All', 'Startups', 'AI & Code', 'Founders', 'Tech News', 'Design'];

export const HomePage = ({ searchQuery = '', onOpenAuth, onVideoSelect }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const urlQuery = searchParams.get('q') || searchQuery;
  const debouncedSearchQuery = useDebounce(urlQuery, 550);

  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortType, setSortType] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);

  const fetchVideos = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      setAuthError(false);
      try {
        const queryTerm = debouncedSearchQuery.trim()
          ? debouncedSearchQuery.trim()
          : selectedCategory !== 'All'
          ? selectedCategory
          : '';

        const params = {
          page: pageNum,
          limit: pagination.limit,
          sortBy,
          sortType,
        };

        if (queryTerm) {
          params.query = queryTerm;
        }

        const response = await getAllVideosApi(params);
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
        if (err.message?.toLowerCase().includes('unauthorized') || !isAuthenticated) {
          setAuthError(true);
        } else {
          addToast(err.message || 'Failed to load videos', 'error');
        }
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchQuery, selectedCategory, sortBy, sortType, pagination.limit, isAuthenticated, addToast]
  );

  useEffect(() => {
    fetchVideos(1);
  }, [fetchVideos]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchVideos(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (chip) => {
    setSelectedCategory(chip);
    if (chip === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', chip);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSortBy('createdAt');
    setSortType('desc');
    setSearchParams({}, { replace: true });
  };

  const handleVideoCardClick = (video) => {
    if (onVideoSelect) onVideoSelect(video);
    navigate(`/watch/${video._id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top Filter Bar: Category Chips & Sort Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Category Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip;
            return (
              <button
                key={chip}
                onClick={() => handleCategorySelect(chip)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: isSelected ? 'var(--brand-gradient)' : 'var(--bg-dark-card)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  border: isSelected ? 'none' : '1px solid var(--glass-border)',
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? 'var(--glow-primary)' : 'none',
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={16} color="var(--text-muted)" />
          <select
            value={`${sortBy}:${sortType}`}
            onChange={(e) => {
              const [sb, st] = e.target.value.split(':');
              setSortBy(sb);
              setSortType(st);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'var(--bg-dark-card)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="views:desc">Most Viewed</option>
            <option value="createdAt:asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Unauthenticated Auth Guard Prompt Banner */}
      {authError && !isAuthenticated ? (
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2rem',
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
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Sign in to Watch FoundrCast Videos</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', fontSize: '0.9rem' }}>
            The backend API requires an authenticated session (`verifyJWT`) to access video streams. Sign in or register your creator channel to browse the video feed!
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Button variant="primary" onClick={() => onOpenAuth && onOpenAuth('login')}>
              <LogIn size={16} /> Sign In
            </Button>
            <Button variant="secondary" onClick={() => onOpenAuth && onOpenAuth('register')}>
              Create Channel
            </Button>
          </div>
        </div>
      ) : (
        /* Video Feed Grid */
        <>
          <VideoGrid
            videos={videos}
            loading={loading}
            onVideoSelect={handleVideoCardClick}
            onReset={handleResetFilters}
          />

          {/* Pagination Footer Controls */}
          {!loading && videos.length > 0 && pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--glass-border)',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Page <strong style={{ color: 'var(--text-primary)' }}>{pagination.page}</strong> of{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{pagination.totalPages}</strong> ({pagination.totalDocs} total videos)
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                  <ChevronLeft size={16} /> Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
