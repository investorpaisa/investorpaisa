
// Re-export auth services
import { authService } from '../auth';

// Named export for the auth service
export { authService };

// For backward compatibility
export const auth = authService;
