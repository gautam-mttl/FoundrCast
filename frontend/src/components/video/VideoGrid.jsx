import React from 'react';
import { VideoCard } from './VideoCard';
import { SkeletonGrid } from '../common/SkeletonCard';
import { EmptyState } from '../common/EmptyState';

export const VideoGrid = ({ videos = [], loading = false, onVideoSelect, onReset }) => {
  if (loading) {
    return <SkeletonGrid count={8} />;
  }

  if (!videos || videos.length === 0) {
    return <EmptyState onReset={onReset} />;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.75rem',
        width: '100%',
      }}
    >
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} onClick={onVideoSelect} />
      ))}
    </div>
  );
};
