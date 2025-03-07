
// Main export file that puts everything together

// Export each service group
export * from './auth';
export * from './profile';
export * from './post';
export * from './circle';
export * from './engagement';
export * from './message';
export * from './market';
export * from './news';
export * from './api';

// Export types
export * from './types';

// Export individual services for backward compatibility
import { auth } from './auth';
import { profile } from './profile';
import { post } from './post';
import { circle } from './circle';
import { engagement } from './engagement';
import { message } from './message';
import { market } from './market';
import { news } from './news';

// Legacy service object
export const services = {
  auth,
  profile,
  post,
  circle,
  engagement,
  message,
  market,
  news
};
