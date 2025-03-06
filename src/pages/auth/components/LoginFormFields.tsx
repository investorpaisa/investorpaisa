
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';

interface LoginFormFieldsProps {
  control: Control<{
    email?: string;
    password?: string;
  }>;
}

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-400">Email</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="your.email@example.com" 
                  {...field} 
                  className="bg-dark-300 border-gray-700 focus-visible:border-purple-400/50 focus-visible:ring-purple-400/30 pl-10" 
                />
              </div>
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-400">Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="bg-dark-300 border-gray-700 focus-visible:border-purple-400/50 focus-visible:ring-purple-400/30 pl-10" 
                />
              </div>
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
    </>
  );
};
