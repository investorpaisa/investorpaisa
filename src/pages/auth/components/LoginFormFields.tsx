
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
            <FormLabel className="text-black/80">Email</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                <Input 
                  placeholder="your.email@example.com" 
                  {...field} 
                  className="input-premium pl-10" 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black/80">Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="input-premium pl-10" 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
