import { axiosClient } from './axiosClient';

/**
 * Register a new user with avatar and optional cover image.
 * @param {FormData} formData - Multipart form-data containing fullName, email, username, password, avatar, coverImage
 */
export const registerUserApi = async (formData) => {
  return axiosClient.post('/users/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Log in an existing user with username/email and password.
 * @param {Object} credentials - { username, email, password }
 */
export const loginUserApi = async (credentials) => {
  return axiosClient.post('/users/login', credentials);
};

/**
 * Log out the currently authenticated user.
 */
export const logoutUserApi = async () => {
  return axiosClient.post('/users/logout');
};

/**
 * Refresh access token using refresh token cookie or payload.
 */
export const refreshTokenApi = async () => {
  return axiosClient.post('/users/refresh-token');
};

/**
 * Fetch profile details of currently logged-in user.
 */
export const getCurrentUserApi = async () => {
  return axiosClient.get('/users/current-user');
};

/**
 * Update account details (fullName, email).
 * @param {Object} data - { fullName, email }
 */
export const updateAccountDetailsApi = async (data) => {
  return axiosClient.patch('/users/update-account', data);
};

/**
 * Update user avatar image.
 * @param {FormData} formData - Multipart form-data containing avatar file
 * @param {Function} [onProgress] - Optional upload progress callback
 */
export const updateUserAvatarApi = async (formData, onProgress) => {
  return axiosClient.patch('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
};

/**
 * Update user cover image.
 * @param {FormData} formData - Multipart form-data containing coverImage file
 * @param {Function} [onProgress] - Optional upload progress callback
 */
export const updateUserCoverImageApi = async (formData, onProgress) => {
  return axiosClient.patch('/users/cover-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
};

/**
 * Change current password.
 * @param {Object} passwords - { oldPassword, newPassword }
 */
export const changeCurrentPasswordApi = async (passwords) => {
  return axiosClient.post('/users/change-password', passwords);
};

/**
 * Fetch current user's watch history.
 */
export const getWatchHistoryApi = async () => {
  return axiosClient.get('/users/history');
};

/**
 * Fetch channel profile of a user by username.
 * @param {string} username
 */
export const getChannelProfileApi = async (username) => {
  return axiosClient.get(`/users/c/${username}`);
};
