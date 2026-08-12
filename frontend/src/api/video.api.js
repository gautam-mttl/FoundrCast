import { axiosClient } from './axiosClient';

/**
 * Fetch paginated video feed from backend.
 * @param {Object} params - { page, limit, query, sortBy, sortType, userId }
 */
export const getAllVideosApi = async (params = {}) => {
  return axiosClient.get('/videos', { params });
};

/**
 * Fetch single video details by video ID.
 * Uses backend's videoUrl, views, and typo-mapped likes/comments directly.
 * @param {string} videoId
 */
export const getVideoByIdApi = async (videoId) => {
  const response = await axiosClient.get(`/videos/${videoId}`);

  if (response?.data) {
    const video = response.data;
    return {
      ...response,
      data: {
        ...video,
        videoUrl: video.videoUrl || video.videoFile || '',
        views: video.views ?? 0,
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

/**
 * Publish a new video with files (videoFile, thumbnail, title, description).
 * @param {FormData} formData
 * @param {Function} onUploadProgress
 */
export const publishVideoApi = async (formData, onUploadProgress) => {
  return axiosClient.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
};

/**
 * Update video details and/or thumbnail.
 * @param {string} videoId
 * @param {FormData|Object} payload
 * @param {Function} onUploadProgress
 */
export const updateVideoApi = async (videoId, payload, onUploadProgress) => {
  const isFormData = payload instanceof FormData;
  return axiosClient.patch(`/videos/${videoId}`, payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    onUploadProgress,
  });
};

/**
 * Toggle publish status of a video (published <-> private).
 * @param {string} videoId
 */
export const togglePublishStatusApi = async (videoId) => {
  return axiosClient.patch(`/videos/toggle/publish/${videoId}`);
};

/**
 * Delete a video by ID (Owner only).
 * @param {string} videoId
 */
export const deleteVideoApi = async (videoId) => {
  return axiosClient.delete(`/videos/${videoId}`);
};
