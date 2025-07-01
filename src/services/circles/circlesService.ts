
// This service has been deprecated as circles functionality has been removed
// in favor of professional networking connections

export const circles = {
  createCircle: () => Promise.reject(new Error('Circles functionality has been deprecated')),
  updateCircle: () => Promise.reject(new Error('Circles functionality has been deprecated')),
  getCircleById: () => Promise.reject(new Error('Circles functionality has been deprecated')),
  getCircles: () => Promise.reject(new Error('Circles functionality has been deprecated')),
  getUserCircles: () => Promise.reject(new Error('Circles functionality has been deprecated')),
  getPublicCircles: () => Promise.reject(new Error('Circles functionality has been deprecated')),
  getTrendingCircles: () => Promise.reject(new Error('Circles functionality has been deprecated')),
  searchCircles: () => Promise.reject(new Error('Circles functionality has been deprecated'))
};
