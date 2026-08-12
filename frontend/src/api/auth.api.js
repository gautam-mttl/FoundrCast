import { axiosClient } from './axiosClient';

export const getCurrentUserApi = async () => {
  return axiosClient.get('/users/current-user');
};

export const refreshTokenApi = async () => {
  return axiosClient.post('/users/refresh-token');
};

export const logoutUserApi = async () => {
  return axiosClient.post('/users/logout');
};
