
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Lock, User, Mail, Shield, Sparkles } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  function onSubmit(data: RegisterFormValues) {
    console.log('Form submitted:', data);
    // In a real app, you would handle the registration here
    // For demo purposes, we'll just log the data and keep it simple
  }

  return (
    <Card className="premium-card overflow-hidden">
      <div className="h-2 bg-gradient-gold w-full"></div>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-premium-gold">Create an account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Join the Investor Paisa community today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="John Doe" {...field} className="input-premium pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="your.email@example.com" {...field} className="input-premium pl-10" />
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
                      <Input type="password" placeholder="••••••••" {...field} className="input-premium pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="••••••••" {...field} className="input-premium pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-premium-dark-700/30">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-premium-gold/50 data-[state=checked]:bg-premium-gold data-[state=checked]:text-premium-dark-900"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-foreground/80">
                      I agree to the{' '}
                      <Link to="#" className="text-premium-gold hover:underline">
                        terms of service
                      </Link>{' '}
                      and{' '}
                      <Link to="#" className="text-premium-gold hover:underline">
                        privacy policy
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="btn-premium w-full">
              Create account
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
              Sign up with Google
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-premium-dark-700/30 pb-6">
        <div className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-premium-gold hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
      
      <div className="px-6 pb-6 pt-0">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-premium-dark-700/30 border border-premium-gold/10">
          <Sparkles className="h-5 w-5 text-premium-gold" />
          <p className="text-xs text-muted-foreground">Create an account today and get a 7-day trial of Premium features!</p>
        </div>
      </div>
    </Card>
  );
};

export default Register;
