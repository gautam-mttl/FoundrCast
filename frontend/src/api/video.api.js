import { axiosClient } from './axiosClient';

/**
 * Fetch paginated video feed from backend.
 * @param {Object} params - { page, limit, query, sortBy, sortType, userId }
 */
export const getAllVideosApi = async (params = {}) => {
  return axiosClient.get('/videos', { params });
};
