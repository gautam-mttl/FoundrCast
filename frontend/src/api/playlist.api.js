import { axiosClient } from './axiosClient';

/**
 * Create a new playlist.
 * @param {Object} payload - { name, description }
 */
export const createPlaylistApi = async (payload) => {
  return axiosClient.post('/playlist', payload);
};

/**
 * Fetch all playlists owned by a user.
 * @param {string} userId
 */
export const getUserPlaylistsApi = async (userId) => {
  return axiosClient.get(`/playlist/user/${userId}`);
};

/**
 * Fetch playlist details by ID (with populated videos).
 * @param {string} playlistId
 */
export const getPlaylistByIdApi = async (playlistId) => {
  return axiosClient.get(`/playlist/${playlistId}`);
};

/**
 * Update playlist details (name / description).
 * @param {string} playlistId
 * @param {Object} payload - { name, description }
 */
export const updatePlaylistApi = async (playlistId, payload) => {
  return axiosClient.patch(`/playlist/${playlistId}`, payload);
};

/**
 * Delete a playlist.
 * @param {string} playlistId
 */
export const deletePlaylistApi = async (playlistId) => {
  return axiosClient.delete(`/playlist/${playlistId}`);
};

/**
 * Add a video to a playlist.
 * @param {string} videoId
 * @param {string} playlistId
 */
export const addVideoToPlaylistApi = async (videoId, playlistId) => {
  return axiosClient.patch(`/playlist/add/${videoId}/${playlistId}`);
};

/**
 * Remove a video from a playlist.
 * @param {string} videoId
 * @param {string} playlistId
 */
export const removeVideoFromPlaylistApi = async (videoId, playlistId) => {
  return axiosClient.patch(`/playlist/remove/${videoId}/${playlistId}`);
};
