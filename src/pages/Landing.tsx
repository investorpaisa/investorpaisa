
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, Shield, Sparkles, Zap, Target } from 'lucide-react';

const Landing = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const ctaInView = useInView(ctaRef, { once: true });

  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Market Intelligence",
      description: "Get instant insights on market movements with AI-powered analysis and community sentiment.",
      gradient: "from-cred-purple to-cred-pink"
    },
    {
      icon: Users,
      title: "Expert Community Network",
      description: "Connect with verified financial experts and learn from experienced investors.",
      gradient: "from-cred-green to-cred-blue"
    },
    {
      icon: Shield,
      title: "Trusted Financial Advice",
      description: "Verified information from certified professionals you can trust.",
      gradient: "from-cred-orange to-cred-pink"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "₹100Cr+", label: "Assets Tracked", icon: TrendingUp },
    { value: "500+", label: "Expert Advisors", icon: Shield },
    { value: "95%", label: "Success Rate", icon: Target }
  ];

  return (
    <div className="min-h-screen bg-cred-dark overflow-hidden relative">
      {/* Animated background mesh */}
      <div className="fixed inset-0 bg-mesh-gradient opacity-30 animate-float-complex"></div>
      
      {/* Floating orbs */}
      <motion.div 
        className="fixed w-64 h-64 rounded-full bg-cred-purple/20 blur-3xl"
        style={{ x: y1, y: y2 }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
        initial={{ top: "10%", left: "10%" }}
      />
      <motion.div 
        className="fixed w-96 h-96 rounded-full bg-cred-pink/20 blur-3xl"
        style={{ x: y2, y: y1 }}
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2] 
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        initial={{ top: "60%", right: "10%" }}
      />

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 backdrop-blur-cred bg-cred-dark/80 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-cred flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold gradient-text-purple">
                InvestorPaisa
              </span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/auth/login" 
                className="text-white/80 hover:text-white transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link to="/auth/register">
                <motion.button 
                  className="cred-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="min-h-screen flex items-center justify-center px-6 relative"
        style={{ opacity }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-heading font-bold mb-8 leading-tight"
              animate={isLoaded ? { 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
              } : {}}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                background: "linear-gradient(90deg, rgb(139, 69, 255), rgb(255, 107, 158), rgb(45, 212, 191), rgb(139, 69, 255))",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Where Finance
              <br />
              Meets Community
            </motion.h1>
          </motion.div>

          <motion.p 
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Join India's most trusted financial community. Get expert insights, 
            track your portfolio, and make informed decisions with confidence.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <Link to="/auth/register">
              <motion.button 
                className="cred-button text-lg px-12 py-6 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <motion.button 
              className="px-12 py-6 rounded-2xl border-2 border-white/20 text-white font-semibold backdrop-blur-sm hover:border-white/40 transition-all duration-300"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="cred-card p-6 text-center group"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-cred-purple group-hover:text-cred-pink transition-colors duration-300" />
                <div className="text-3xl font-bold gradient-text-purple mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        ref={featuresRef}
        className="py-32 px-6 relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold gradient-text-purple mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Everything you need to make smarter financial decisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="cred-card p-8 group perspective-card"
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                whileHover={{ y: -10 }}
              >
                <div className="card-inner">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:gradient-text-purple transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <motion.div 
                    className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ArrowRight className="w-5 h-5 text-cred-purple" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        ref={ctaRef}
        className="py-32 px-6 relative"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="cred-card p-12 card-stack"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div 
              className="w-20 h-20 rounded-full bg-gradient-cred flex items-center justify-center mx-auto mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-heading font-bold gradient-text-purple mb-6">
              Ready to Transform Your Financial Future?
            </h2>
            
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Join thousands of smart investors who trust InvestorPaisa for their financial journey.
            </p>
            
            <Link to="/auth/register">
              <motion.button 
                className="cred-button text-xl px-16 py-6 pulse-glow"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Now
                <ArrowRight className="ml-3 w-6 h-6" />
              </motion.button>
            </Link>
            
            <p className="text-white/50 text-sm mt-6">
              No credit card required • Free 30-day trial
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-cred flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold gradient-text-purple">
                InvestorPaisa
              </span>
            </div>
            
            <div className="text-white/50 text-sm">
              © 2025 InvestorPaisa. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
