
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
      
      <div className="w-full pt-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-premium-dark-700/30"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-premium-dark-800 px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button className="flex items-center justify-center h-9 rounded-md border border-premium-dark-700/30 bg-premium-dark-700/10 hover:bg-premium-dark-700/20 transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.5 8.5C14.6716 8.5 14 9.17157 14 10C14 10.8284 14.6716 11.5 15.5 11.5C16.3284 11.5 17 10.8284 17 10C17 9.17157 16.3284 8.5 15.5 8.5Z" fill="currentColor"/>
              <path d="M8.5 8.5C7.67157 8.5 7 9.17157 7 10C7 10.8284 7.67157 11.5 8.5 11.5C9.32843 11.5 10 10.8284 10 10C10 9.17157 9.32843 8.5 8.5 8.5Z" fill="currentColor"/>
              <path d="M12 17C14.5 17 16.5 15.2091 16.5 13H7.5C7.5 15.2091 9.5 17 12 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="flex items-center justify-center h-9 rounded-md border border-premium-dark-700/30 bg-premium-dark-700/10 hover:bg-premium-dark-700/20 transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.9994 12C20.9994 6.48 16.5194 2 10.9994 2C5.47939 2 0.999391 6.48 0.999391 12C0.999391 16.84 4.41939 20.87 8.99939 21.8V15H6.99939V12H8.99939V9.5C8.99939 7.57 10.5694 6 12.4994 6H14.9994V9H12.9994C12.4494 9 11.9994 9.45 11.9994 10V12H14.9994V15H11.9994V21.95C16.9794 21.45 20.9994 17.19 20.9994 12Z" fill="currentColor"/>
            </svg>
          </button>
          <button className="flex items-center justify-center h-9 rounded-md border border-premium-dark-700/30 bg-premium-dark-700/10 hover:bg-premium-dark-700/20 transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 8.5C4.5 6.5 6.5 5 8.5 5C10.5 5 11.64 6 12 6.5C12.36 6 13.5 5 15.5 5C17.5 5 19.5 6.5 19.5 8.5C19.5 12.5 16.5 14.9951 14 17C13.5 17.5 13 18 12 18C11 18 10.5 17.5 10 17C7.5 14.9951 4.5 12.5 4.5 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </CardFooter>
  );
};
