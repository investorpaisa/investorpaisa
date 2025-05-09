
import React from 'react';
import { Link } from 'react-router-dom';
import { CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export const LoginFooter: React.FC = () => {
  return (
    <CardFooter className="flex flex-col items-center space-y-3 border-t border-premium-dark-700/30 pt-4 pb-6">
      <div className="text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link 
          to="/auth/register" 
          className="text-premium-gold hover:text-premium-gold-light font-medium transition-colors relative group"
        >
          Sign up
          <span className="absolute bottom-0 left-0 w-full h-px bg-premium-gold/30 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </Link>
      </div>
      <Link 
        to="#" 
        className="flex items-center text-sm text-center text-muted-foreground hover:text-premium-gold transition-colors group"
      >
        Forgot your password?
        <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </Link>
    </CardFooter>
  );
};
