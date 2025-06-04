
// Re-export email services
import { EmailParsingService } from '../email/emailParsingService';

// Export the service class
export { EmailParsingService };

// For backward compatibility
export const emailParsing = EmailParsingService;
