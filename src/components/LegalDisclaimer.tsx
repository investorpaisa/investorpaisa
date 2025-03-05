
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const LegalDisclaimer: React.FC = () => {
  return (
    <Alert variant="destructive" className="bg-slate-900 text-white border-none mt-4">
      <AlertTriangle className="h-4 w-4 mr-2" />
      <AlertDescription className="text-xs">
        The information provided on this platform is for general informational purposes only. 
        All information is provided in good faith, however we make no representation or warranty of any kind, 
        express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness 
        of any information. Under no circumstance shall we have any liability to you for any loss or damage incurred 
        as a result of the use of the platform or reliance on any information provided.
      </AlertDescription>
    </Alert>
  );
};

export const CookieConsent: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md p-4 z-50 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/80 text-sm">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm">
            Privacy Policy
          </button>
          <button className="px-4 py-1 bg-ip-teal text-white rounded-md text-sm">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
