
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Shield, TrendingUp, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-premium-dark-800/30 backdrop-blur-[100px] z-0"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="inline-flex items-center rounded-full border border-premium-gold/30 px-4 py-1.5 text-sm font-medium">
              <span className="block h-2 w-2 rounded-full bg-premium-gold mr-2"></span>
              <span>Financial decisions simplified</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-gold bg-clip-text text-transparent">Facebook</span> for your everyday <span className="bg-gradient-gold bg-clip-text text-transparent">financial decisions</span>
            </h1>
            <p className="text-lg text-muted-foreground md:pr-10">
              A community platform empowering users on their financial journeys, from taxation to investments, personal finance to debt management.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button asChild className="btn-premium px-6 py-6 rounded-lg animate-hover-rise">
                <Link to="/auth/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="btn-outline px-6 py-6 rounded-lg animate-hover-rise">
                <Link to="#vision">
                  Learn More
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="glass-accent rounded-2xl p-6 shadow-premium transform translate-x-8 animate-fade-in">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-3 w-3 rounded-full bg-premium-gold"></div>
                <div className="text-sm font-medium">Financial Intelligence</div>
              </div>
              <div className="space-y-3">
                <div className="glass rounded-lg p-3 animate-hover-rise">
                  <div className="text-xs text-premium-gold mb-1">Trending Insight</div>
                  <div className="text-sm font-medium mb-1">Best tax saving options for young professionals in 2023</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <users className="h-3 w-3 mr-1" />
                    <span>2.3k people discussing</span>
                  </div>
                </div>
                <div className="glass rounded-lg p-3 animate-hover-rise">
                  <div className="text-xs text-premium-gold mb-1">Market Update</div>
                  <div className="text-sm font-medium mb-1">SIP returns outperform fixed deposits by 3x this quarter</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>Rising trend in mutual funds</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-accent rounded-2xl p-6 shadow-premium transform -translate-x-8 translate-y-4 animate-fade-in delay-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-3 w-3 rounded-full bg-premium-gold"></div>
                <div className="text-sm font-medium">Community Experts</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 glass rounded-lg p-3 animate-hover-rise">
                  <div className="h-10 w-10 rounded-full bg-premium-dark-700 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-premium-gold" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">SEBI Certified Advisor</div>
                    <div className="text-xs text-muted-foreground">Specializes in equity markets</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 glass rounded-lg p-3 animate-hover-rise">
                  <div className="h-10 w-10 rounded-full bg-premium-dark-700 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-premium-gold" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Tax Consultant</div>
                    <div className="text-xs text-muted-foreground">Expert in personal taxation</div>
                  </div>
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
