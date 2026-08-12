import { axiosClient } from './axiosClient';

/**
 * Toggle subscription status for a creator channel.
 * @param {string} channelId
 */
export const toggleSubscriptionApi = async (channelId) => {
  return axiosClient.post(`/subscriptions/c/${channelId}`);
};

/**
 * Fetch subscribers list and total subscriber count for a channel.
 * @param {string} channelId
 */
export const getChannelSubscribersApi = async (channelId) => {
  return axiosClient.get(`/subscriptions/c/${channelId}`);
};

/**
 * Fetch channels subscribed to by a specific user/subscriber.
 * @param {string} subscriberId
 */
export const getSubscribedChannelsApi = async (subscriberId) => {
  return axiosClient.get(`/subscriptions/u/${subscriberId}`);
};
