
// Re-export profile services
import { profileService } from '../profiles';

// Named export
export { profileService };

// For backward compatibility
export const profile = profileService;
