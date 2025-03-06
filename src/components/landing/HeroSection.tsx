
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-12 md:pt-20 pb-16 md:pb-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-premium-gold/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-premium-gold/20 via-transparent to-transparent"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border border-premium-gold/30 px-4 py-1.5 text-sm font-medium mb-6">
              <span className="block h-2 w-2 rounded-full bg-premium-gold mr-2"></span>
              <span>Smart Financial Decisions</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-gold bg-clip-text text-transparent">Community</span> Driven <br />
              Financial Platform
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Join a community of financial experts and enthusiasts to make better financial decisions and grow your wealth together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/auth/register" className="btn-premium px-8 py-4 rounded-lg animate-hover-rise">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="#vision" className="btn-outline px-8 py-4 rounded-lg">
                Learn More
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-premium-gold" />
                <span className="text-sm">Expert Community</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-premium-gold" />
                <span className="text-sm">Smart Financial Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-premium-gold" />
                <span className="text-sm">Personalized Insights</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative max-w-md mx-auto lg:mx-0">
            <div className="aspect-[4/3] bg-premium-dark-800/60 backdrop-blur-lg border border-premium-gold/10 rounded-xl overflow-hidden shadow-premium relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium mb-4">Community Dashboard</p>
                  <p className="text-sm text-muted-foreground">Join 10,000+ financial enthusiasts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
