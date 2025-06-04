
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { PageLoader } from '@/components/ui/page-loader';

const FinancialOnboarding: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  return <OnboardingFlow />;
};

export default FinancialOnboarding;
