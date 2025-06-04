
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowLeft, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  
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
      const user = await signIn(data.email, data.password);
      if (user) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      if (!isSuccess) {
        setIsLoading(false);
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-cred-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-20"></div>
      
      {/* Floating elements */}
      <motion.div 
        className="absolute w-64 h-64 rounded-full bg-cred-purple/10 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ top: "10%", left: "10%" }}
      />
      
      <motion.div 
        className="absolute w-96 h-96 rounded-full bg-cred-pink/10 blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 40, 0] 
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        style={{ bottom: "10%", right: "10%" }}
      />

      {/* Back button */}
      <motion.div 
        className="absolute top-8 left-8 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link to="/">
          <motion.button 
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-300"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="w-16 h-16 rounded-2xl bg-gradient-cred flex items-center justify-center mx-auto mb-4"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-heading font-bold gradient-text-purple mb-2">
            Welcome Back
          </h1>
          <p className="text-white/60">Continue your financial journey</p>
        </motion.div>

        {/* Main card */}
        <motion.div 
          className="cred-card p-8 backdrop-blur-cred"
          variants={itemVariants}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isSuccess ? (
            <motion.div 
              className="text-center py-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-green flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1 }}
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
              <p className="text-white/60">Redirecting to your dashboard...</p>
            </motion.div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-cred-purple transition-colors duration-300" />
                            <Input 
                              placeholder="Enter your email" 
                              {...field} 
                              className="cred-input pl-12 group-focus-within:border-cred-purple" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-cred-purple transition-colors duration-300" />
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password" 
                              {...field} 
                              className="cred-input pl-12 pr-12 group-focus-within:border-cred-purple" 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-300"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div 
                  className="flex justify-end"
                  variants={itemVariants}
                >
                  <Link to="#" className="text-cred-purple hover:text-cred-pink transition-colors duration-300 text-sm">
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    className="w-full cred-button text-lg py-4 relative overflow-hidden"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </motion.button>
                </motion.div>

                <motion.div 
                  className="relative my-6"
                  variants={itemVariants}
                >
                  <Separator className="bg-white/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-cred-dark px-4 text-white/60 text-sm">or continue with</span>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl border-2 border-white/20 text-white font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    )}
                    <span>{isGoogleLoading ? "Connecting..." : "Continue with Google"}</span>
                  </motion.button>
                </motion.div>
              </form>
            </Form>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8"
          variants={itemVariants}
        >
          <p className="text-white/60">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-cred-purple hover:text-cred-pink transition-colors duration-300 font-medium">
              Sign up here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
