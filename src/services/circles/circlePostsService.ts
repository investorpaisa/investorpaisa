
// This service has been deprecated as circles functionality has been removed
// in favor of professional networking connections

export const circlePosts = {
  addPostToCircle: () => Promise.reject(new Error('Circles functionality has been deprecated')),
  getCirclePosts: () => Promise.reject(new Error('Circles functionality has been deprecated')),
  togglePostPin: () => Promise.reject(new Error('Circles functionality has been deprecated')),
  removePostFromCircle: () => Promise.reject(new Error('Circles functionality has been deprecated'))
};
