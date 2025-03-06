
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PremiumButton } from '../ui/premium/button';

const HeroSection = () => {
  return (
    <section className="py-6 px-4 bg-premium-dark-800/60 backdrop-blur-sm border border-premium-dark-700/30 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-gold bg-clip-text text-transparent">Join the community</span> of 
            <br />financial experts & enthusiasts
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Get reliable financial insights, advice, and connect with like-minded individuals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <PremiumButton asChild size="sm">
              <Link to="/auth/register">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </PremiumButton>
          </div>
        </div>
        <div className="flex-1 relative max-w-[200px] mx-auto md:max-w-none">
          <div className="aspect-square rounded-lg overflow-hidden">
            <img 
              src="/placeholder.svg"
              alt="Community discussion" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
