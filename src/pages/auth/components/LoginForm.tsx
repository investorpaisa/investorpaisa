
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';
import { LoginFormFields } from './LoginFormFields';
import { LoginFooter } from './LoginFooter';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    
    try {
      const user = await authService.login(data.email, data.password);
      if (user) {
        // Successful login
        setTimeout(() => {
          navigate('/feed');
        }, 500);
      } else {
        // Login failed but no error was thrown
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled in authService
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="premium-card overflow-hidden">
      <div className="h-2 bg-gradient-gold w-full"></div>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-premium-gold">Sign in</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <LoginFormFields control={form.control} />
            <Button 
              type="submit" 
              className="btn-premium w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4">
          <div className="flex items-center mt-2">
            <Separator className="flex-1 bg-premium-dark-700/50" />
            <span className="px-3 text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1 bg-premium-dark-700/50" />
          </div>

          <div className="grid gap-2 mt-4">
            <Button variant="outline" className="w-full btn-outline">
              Continue with Google
            </Button>
          </div>
        </div>
      </CardContent>
      <LoginFooter />
    </Card>
  );
};
