import { axiosClient } from './axiosClient';

/**
 * Fetch paginated comments for a video.
 * @param {string} videoId
 * @param {Object} params - { page, limit }
 */
export const getVideoCommentsApi = async (videoId, params = {}) => {
  return axiosClient.get(`/comments/${videoId}`, { params });
};

/**
 * Add a new comment to a video.
 * @param {string} videoId
 * @param {string} content
 */
export const addCommentApi = async (videoId, content) => {
  return axiosClient.post(`/comments/${videoId}`, { content });
};

/**
 * Update an existing comment (Owner only).
 * @param {string} commentId
 * @param {string} content
 */
export const updateCommentApi = async (commentId, content) => {
  return axiosClient.patch(`/comments/c/${commentId}`, { content });
};

/**
 * Delete a comment (Owner only).
 * @param {string} commentId
 */
export const deleteCommentApi = async (commentId) => {
  return axiosClient.delete(`/comments/c/${commentId}`);
};
