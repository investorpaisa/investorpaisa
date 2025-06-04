
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mail, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface EmailIntegrationStepProps {
  data: Partial<OnboardingData>;
  onComplete: (data: Partial<OnboardingData>) => void;
  onPrevious: () => void;
  showPrevious: boolean;
  isLoading: boolean;
}

export const EmailIntegrationStep: React.FC<EmailIntegrationStepProps> = ({
  data,
  onComplete,
  onPrevious,
  showPrevious,
  isLoading
}) => {
  const [enableIntegration, setEnableIntegration] = useState(data.email_integration || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ email_integration: enableIntegration });
  };

  const handleConnectGmail = async () => {
    // This would integrate with Google OAuth for Gmail access
    console.log('Connecting to Gmail...');
    // For now, just simulate the connection
    setEnableIntegration(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Mail className="h-12 w-12 text-premium-gold mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Automatic Portfolio Tracking</h3>
        <p className="text-muted-foreground">
          Connect your email to automatically import your broker transactions and keep your portfolio updated.
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-premium-gold/10 rounded-full">
                <Mail className="h-4 w-4 text-premium-gold" />
              </div>
              <div>
                <Label className="font-medium">Gmail Integration</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically parse transactions from broker emails
                </p>
              </div>
            </div>
            <Switch
              checked={enableIntegration}
              onCheckedChange={setEnableIntegration}
            />
          </div>
        </Card>

        {enableIntegration && (
          <Card className="p-4 border-premium-gold/20">
            <h4 className="font-medium mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              What we'll do with your email access:
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-premium-gold flex-shrink-0" />
                <span>Read emails from verified brokers (Zerodha, Upstox, etc.)</span>
              </li>
              <li className="flex items-start">
                <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-premium-gold flex-shrink-0" />
                <span>Extract transaction data (buy/sell orders, quantities, prices)</span>
              </li>
              <li className="flex items-start">
                <Shield className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                <span>Your emails are processed securely and never stored</span>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Privacy First</p>
                  <p>We only access broker confirmation emails. No personal emails are read or stored.</p>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleConnectGmail}
              className="w-full mt-4"
              variant="outline"
            >
              <Mail className="h-4 w-4 mr-2" />
              Connect Gmail Account
            </Button>
          </Card>
        )}

        <Card className="p-4 bg-gray-50">
          <h4 className="font-medium mb-2">Supported Brokers</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>• Zerodha</div>
            <div>• Upstox</div>
            <div>• Angel One</div>
            <div>• Groww</div>
            <div>• ICICI Direct</div>
            <div>• HDFC Securities</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            More brokers coming soon. You can also manually add transactions anytime.
          </p>
        </Card>
      </div>

      <div className="flex gap-3">
        {showPrevious && (
          <Button type="button" variant="outline" onClick={onPrevious} disabled={isLoading}>
            Previous
          </Button>
        )}
        <Button type="submit" className="btn-premium flex-1" disabled={isLoading}>
          {isLoading ? 'Setting up your profile...' : 'Complete Setup'}
        </Button>
      </div>
    </form>
  );
};
