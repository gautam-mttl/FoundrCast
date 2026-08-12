import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllVideosApi } from '../api/video.api';
import { VideoCard } from '../components/video/VideoCard';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Compass, Flame, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Streams' },
  { id: 'trending', label: 'Trending 🔥', sortBy: 'views' },
  { id: 'ai', label: 'AI & Startups', query: 'AI' },
  { id: 'tech', label: 'Tech & Dev', query: 'code' },
  { id: 'masterclass', label: 'Masterclasses', query: 'founder' },
];

export const ExplorePage = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchExploreVideos = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      try {
        const catObj = CATEGORIES.find((c) => c.id === currentCategory);
        const params = {
          page: pageNum,
          limit: pagination.limit,
          query: catObj?.query || '',
          sortBy: catObj?.sortBy || 'createdAt',
          sortType: 'desc',
        };

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
        console.warn('Explore feed notice:', err.message);
      } finally {
        setLoading(false);
      }
    },
    [currentCategory, pagination.limit]
  );

  useEffect(() => {
    fetchExploreVideos(1);
  }, [fetchExploreVideos]);

  const handleSelectCategory = (catId) => {
    if (catId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Explore FoundrCast
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Discover top startup interviews, tech live streams, and founder insights
        </p>
      </div>

      {/* Category Pills Bar */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                background: isActive ? 'var(--brand-gradient)' : 'var(--bg-dark-card)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: isActive ? 'none' : '1px solid var(--glass-border)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? 'var(--glow-primary)' : 'none',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Spinner size={36} />
        </div>
      ) : videos.length === 0 ? (
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
          <Compass size={48} color="var(--brand-cyan)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>No Videos Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
            No streams match this category currently. Try exploring other topics!
          </p>
          <Button variant="primary" onClick={() => handleSelectCategory('all')}>
            View All Streams
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
              width: '100%',
            }}
          >
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onClick={() => navigate(`/watch/${video._id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid var(--glass-border)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="secondary"
                  onClick={() => fetchExploreVideos(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  style={{ padding: '6px 12px', fontSize: '12.5px' }}
                >
                  <ChevronLeft size={14} /> Prev
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => fetchExploreVideos(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  style={{ padding: '6px 12px', fontSize: '12.5px' }}
                >
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
