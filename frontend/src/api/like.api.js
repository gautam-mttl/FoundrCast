import { axiosClient } from './axiosClient';

/**
 * Toggle like status for a video.
 * @param {string} videoId
 */
export const toggleVideoLikeApi = async (videoId) => {
  return axiosClient.post(`/likes/toggle/v/${videoId}`);
};

/**
 * Toggle like status for a comment.
 * @param {string} commentId
 */
export const toggleCommentLikeApi = async (commentId) => {
  return axiosClient.post(`/likes/toggle/c/${commentId}`);
};

/**
 * Fetch all liked videos for the current authenticated user.
 */
export const getLikedVideosApi = async () => {
  return axiosClient.get('/likes/videos');
};
