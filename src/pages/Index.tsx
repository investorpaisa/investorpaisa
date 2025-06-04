
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = urlParams.has('code') || urlParams.has('access_token') || urlParams.has('error');
    
    if (!loading) {
      if (user) {
        // If user is authenticated, redirect to home
        navigate('/home', { replace: true });
      } else if (hasOAuthParams) {
        // If there are OAuth params but no user, wait a bit for auth processing
        setTimeout(() => {
          if (!user) {
            navigate('/landing', { replace: true });
          }
        }, 2000);
      } else {
        // No user and no OAuth params, go to landing
        navigate('/landing', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return <PageLoader />;
};

export default Index;
