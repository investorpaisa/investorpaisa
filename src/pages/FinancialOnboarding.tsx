
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { PageLoader } from '@/components/ui/page-loader';

const FinancialOnboarding: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth/login');
      } else if (profile?.onboarding_completed) {
        // If onboarding is already completed, redirect to home
        navigate('/home');
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (profile?.onboarding_completed) {
    return null; // Will redirect to home
  }

  return <OnboardingFlow />;
};

export default FinancialOnboarding;
