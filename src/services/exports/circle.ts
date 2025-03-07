
// Re-export circle services
import { circleService } from '../circles';

// Named export
export { circleService };

// For backward compatibility
export const circle = circleService;
