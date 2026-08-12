import { axiosClient } from './axiosClient';

/**
 * Fetch creator channel statistics (totalVideos, totalViews, totalLikes, totalSubscribers).
 */
export const getChannelStatsApi = async () => {
  return axiosClient.get('/dashboard/stats');
};

/**
 * Fetch all videos owned by the creator (both published & unpublished).
 * @param {Object} params - { page, limit }
 */
export const getChannelVideosApi = async (params = {}) => {
  return axiosClient.get('/dashboard/videos', { params });
};
