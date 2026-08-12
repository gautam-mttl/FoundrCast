import React, { useState, useRef, useEffect } from 'react';
import { increaseVideoViewApi } from '../../api/video.api';
import { formatDuration } from '../../utils/formatters';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from 'lucide-react';

export const VideoPlayer = ({ videoId, videoUrl, posterUrl, title = '' }) => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const viewCountedSet = useRef(new Set());

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // View count increment trigger (Guaranteed ONCE per videoId load)
  useEffect(() => {
    if (!videoId || viewCountedSet.current.has(videoId)) return;

    viewCountedSet.current.add(videoId);
    increaseVideoViewApi(videoId).catch((err) => {
      console.warn('View count trigger notice:', err.message);
    });
  }, [videoId]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  // Handle Time Update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle Duration Loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle Timeline Scrubbing
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Handle Volume Change
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    videoRef.current.muted = nextMute;
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={playerContainerRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        borderRadius: isFullscreen ? 0 : '16px',
        overflow: 'hidden',
        background: '#000000',
        boxShadow: 'var(--shadow-card)',
        border: isFullscreen ? 'none' : '1px solid var(--glass-border)',
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(isPlaying ? false : true)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          cursor: 'pointer',
        }}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Overlay Play Icon Center when paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.35)',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--glow-primary)',
              color: '#ffffff',
            }}
          >
            <Play size={32} style={{ marginLeft: '4px' }} />
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem 1.25rem 0.75rem 1.25rem',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          opacity: showControls || !isPlaying ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      >
        {/* Progress Scrubber */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          style={{
            width: '100%',
            height: '4px',
            accentColor: 'var(--brand-primary)',
            cursor: 'pointer',
          }}
        />

        {/* Buttons Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={togglePlay}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Volume Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={toggleMute}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{ width: '60px', height: '3px', accentColor: '#fff', cursor: 'pointer' }}
              />
            </div>

            {/* Timestamp Display */}
            <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 500 }}>
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={toggleFullscreen}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
