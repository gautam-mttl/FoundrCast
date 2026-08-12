import { axiosClient } from './axiosClient';

export const getHealthcheck = async () => {
  return axiosClient.get('/healthcheck/test');
};
