
// Re-export financial services
import { FinancialProfileService } from '../financial/profileService';

// Export the service class
export { FinancialProfileService };

// For backward compatibility
export const financialProfile = FinancialProfileService;
