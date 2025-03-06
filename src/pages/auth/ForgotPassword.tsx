
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { showToast } from '@/services/auth/utils';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }
      
      setResetEmailSent(true);
      showToast(
        "Email sent",
        "If an account with this email exists, you will receive password reset instructions.",
      );
    } catch (error) {
      console.error('Password reset error:', error);
      showToast(
        "Something went wrong",
        error instanceof Error ? error.message : "Please try again later",
        "destructive"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="font-heading text-3xl font-bold mb-2 text-foreground">Forgot Password</h1>
        <p className="text-muted-foreground">Enter your email to receive reset instructions</p>
      </div>
      
      <Card className="premium-card overflow-hidden">
        <div className="h-2 bg-[#F87C00] w-full"></div>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#F87C00]">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            {resetEmailSent 
              ? "Check your email for reset instructions" 
              : "Enter your email address below to receive a password reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetEmailSent ? (
            <Alert className="mb-4 bg-[#F87C00]/10 border-[#F87C00]/20">
              <AlertDescription>
                If an account with this email exists, you'll receive an email with password reset instructions shortly.
                Please check your inbox (and spam folder) for further instructions.
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                <Button 
                  type="submit" 
                  className="btn-premium w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 border-t border-premium-dark-700/30 pb-6">
          <Button variant="ghost" className="gap-1" asChild>
            <Link to="/auth/login">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
