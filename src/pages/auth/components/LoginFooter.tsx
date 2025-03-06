
import React from 'react';
import { Link } from 'react-router-dom';
import { CardFooter } from '@/components/ui/card';

export const LoginFooter: React.FC = () => {
  return (
    <CardFooter className="flex flex-col items-center space-y-2 border-t border-premium-dark-700/30 pb-6">
      <div className="text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-premium-gold hover:underline font-medium">
          Sign up
        </Link>
      </div>
      <Link to="#" className="text-sm text-center text-muted-foreground hover:text-foreground">
        Forgot your password?
      </Link>
    </CardFooter>
  );
};
