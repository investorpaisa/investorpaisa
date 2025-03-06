
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { Loader2, Lock, Mail, Sparkles } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="font-heading text-3xl font-bold mb-2 bg-gradient-gold bg-clip-text text-transparent">Welcome Back</h1>
        <p className="text-muted-foreground">Continue your financial journey with Investor Paisa</p>
      </div>
      
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
      </Card>

      <div className="bg-premium-dark-800/60 rounded-xl p-4 border border-premium-dark-700/30 flex items-center gap-3">
        <div className="shrink-0">
          <Sparkles className="h-5 w-5 text-premium-gold" />
        </div>
        <div className="text-xs text-muted-foreground">
          <p>Join Investor Paisa Premium for exclusive finance insights and expert advice.</p>
        </div>
      </div>

      <LegalDisclaimer />
    </div>
  );
};

export default Login;
