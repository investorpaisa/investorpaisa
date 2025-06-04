
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BasicInfoStep } from './BasicInfoStep';
import { RiskAssessmentStep } from './RiskAssessmentStep';
import { FinancialGoalsStep } from './FinancialGoalsStep';
import { EmailIntegrationStep } from './EmailIntegrationStep';
import { useAuth } from '@/contexts/AuthContext';
import { FinancialProfileService } from '@/services/financial/profileService';
import { toast } from '@/hooks/use-toast';

export interface OnboardingData {
  full_name: string;
  location: string;
  profession: string;
  risk_profile: 'conservative' | 'moderate' | 'aggressive';
  financial_goals: Record<string, any>;
  email_integration: boolean;
}

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({
    financial_goals: {},
    email_integration: false
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const steps = [
    { id: 'basic-info', title: 'Basic Information', description: 'Tell us about yourself' },
    { id: 'risk-assessment', title: 'Risk Assessment', description: 'Understand your investment style' },
    { id: 'financial-goals', title: 'Financial Goals', description: 'Set your investment objectives' },
    { id: 'email-integration', title: 'Email Integration', description: 'Connect your broker emails (optional)' }
  ];

  const handleStepComplete = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleOnboardingComplete();
    }
  };

  const handleOnboardingComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await FinancialProfileService.createUserExtended({
        id: user.id,
        full_name: onboardingData.full_name!,
        email: user.email!,
        location: onboardingData.location,
        profession: onboardingData.profession,
        risk_profile: onboardingData.risk_profile,
        financial_goals: onboardingData.financial_goals || {},
        onboarding_completed: true
      });

      // Create default public profile
      await FinancialProfileService.createPublicProfile({
        user_id: user.id,
        is_public: false,
        visible_sections: ['achievements', 'portfolio_size'],
        showcase_metrics: {},
        profile_url: onboardingData.full_name?.toLowerCase().replace(/\s+/g, '') || user.id
      });

      toast({
        title: "Welcome to Investor Paisa!",
        description: "Your financial profile has been created successfully.",
      });

      navigate('/home');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: "Onboarding Failed",
        description: "There was an error creating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-gold/5 to-premium-dark-900/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl premium-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Complete Your Financial Profile
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {steps[currentStep].description}
          </p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {currentStep === 0 && (
            <BasicInfoStep
              data={onboardingData}
              onComplete={handleStepComplete}
              onPrevious={handlePrevious}
              showPrevious={false}
            />
          )}
          
          {currentStep === 1 && (
            <RiskAssessmentStep
              data={onboardingData}
              onComplete={handleStepComplete}
              onPrevious={handlePrevious}
              showPrevious={true}
            />
          )}
          
          {currentStep === 2 && (
            <FinancialGoalsStep
              data={onboardingData}
              onComplete={handleStepComplete}
              onPrevious={handlePrevious}
              showPrevious={true}
            />
          )}
          
          {currentStep === 3 && (
            <EmailIntegrationStep
              data={onboardingData}
              onComplete={handleStepComplete}
              onPrevious={handlePrevious}
              showPrevious={true}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
