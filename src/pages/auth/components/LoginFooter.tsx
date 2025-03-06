
import React from 'react';
import { Link } from 'react-router-dom';
import { CardFooter } from '@/components/ui/card';

export const LoginFooter: React.FC = () => {
  return (
    <CardFooter className="flex flex-col items-center space-y-2 border-t border-gray-800 pb-6">
      <div className="text-sm text-gray-400">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-purple-400 hover:text-purple-300 hover:underline font-medium">
          Sign up
        </Link>
      </div>
      <Link to="#" className="text-sm text-center text-gray-500 hover:text-gray-400">
        Forgot your password?
      </Link>
    </CardFooter>
  );
};
