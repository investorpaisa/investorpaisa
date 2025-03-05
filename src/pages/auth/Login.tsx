import React from 'react';
import { Link } from 'react-router-dom';
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

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormValues) {
    console.log('Form submitted:', data);
    // In a real app, you would handle the login authentication here
    // For demo purposes, we'll just log the data and keep it simple
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-ip-teal hover:bg-ip-teal-600">
              Sign in
            </Button>
          </form>
        </Form>

        <div className="mt-4">
          <div className="flex items-center mt-2">
            <Separator className="flex-1" />
            <span className="px-3 text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid gap-2 mt-4">
            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <div className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-ip-blue hover:underline">
            Sign up
          </Link>
        </div>
        <Link to="#" className="text-sm text-center text-muted-foreground hover:text-foreground">
          Forgot your password?
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Login;
