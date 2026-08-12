import { axiosClient } from './axiosClient';

// Cache video metadata from list endpoints to resolve missing fields in single-video projections
const videoCache = new Map();

/**
 * Fetch paginated video feed from backend.
 * @param {Object} params - { page, limit, query, sortBy, sortType, userId }
 */
export const getAllVideosApi = async (params = {}) => {
  const response = await axiosClient.get('/videos', { params });

  // Store docs in videoCache for videoFile lookup
  if (response?.data?.docs && Array.isArray(response.data.docs)) {
    response.data.docs.forEach((doc) => {
      if (doc?._id && (doc.videoFile || doc.videoUrl)) {
        videoCache.set(doc._id, doc);
      }
    });
  }

  return response;
};

/**
 * Fetch single video details by video ID with URL resolution adapter.
 * @param {string} videoId
 */
export const getVideoByIdApi = async (videoId) => {
  const response = await axiosClient.get(`/videos/${videoId}`);

  if (response?.data) {
    const video = response.data;
    let cached = videoCache.get(videoId);

    // If cache missed (e.g., direct URL load), fetch video list to resolve videoFile URL
    if (!cached || (!cached.videoFile && !cached.videoUrl)) {
      try {
        const feedResponse = await axiosClient.get('/videos', { params: { limit: 50 } });
        if (feedResponse?.data?.docs) {
          feedResponse.data.docs.forEach((doc) => {
            if (doc?._id && (doc.videoFile || doc.videoUrl)) {
              videoCache.set(doc._id, doc);
            }
          });
          cached = videoCache.get(videoId);
        }
      } catch (err) {
        console.warn('Video cache resolve notice:', err.message);
      }
    }

    // Resolve exact streaming video URL
    const videoUrl =
      video.videoFile ||
      video.videoUrl ||
      cached?.videoFile ||
      cached?.videoUrl ||
      '';

    return {
      ...response,
      data: {
        ...video,
        videoUrl,
        videoFile: videoUrl, // Ensure both keys hold valid streaming URL
        totalLikes: video.totalLikes ?? video.tottalLikes ?? 0,
        totalComments: video.totalComments ?? 0,
      },
    };
  }

  return response;
};

/**
 * Increment video view count on playback.
 * @param {string} videoId
 */
export const increaseVideoViewApi = async (videoId) => {
  return axiosClient.post(`/videos/view/${videoId}`);
};
