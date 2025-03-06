
import { followUser, unfollowUser, getFollowers, getFollowing } from './followService';
import { getUserProfile, updateProfile } from './profileService';
import type { ProfileUpdateData, ProfileResponse } from './types';

export const profileService = {
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
};

export type { ProfileUpdateData, ProfileResponse };
