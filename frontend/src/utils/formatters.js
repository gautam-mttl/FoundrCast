/**
 * Format video duration in seconds to mm:ss or hh:mm:ss
 * @param {number} seconds
 * @returns {string}
 */
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00';
  const sec = Math.floor(seconds);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  const pad = (num) => String(num).padStart(2, '0');

  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
};

/**
 * Format view counts to human readable strings (e.g. 1.2k, 3.4M)
 * @param {number} views
 * @returns {string}
 */
export const formatViews = (views) => {
  if (views === undefined || views === null || isNaN(views)) return '0 views';
  const num = Number(views);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k views`;
  }
  return `${num} ${num === 1 ? 'view' : 'views'}`;
};

/**
 * Format timestamp to relative time ago (e.g. "2 days ago")
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Recently';
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};
