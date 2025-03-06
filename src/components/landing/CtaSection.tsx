
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  return (
    <section className="py-20 px-4 bg-premium-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-premium-gold/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-premium-gold/20 via-transparent to-transparent"></div>
      </div>
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center rounded-full border border-premium-gold/30 px-4 py-1.5 text-sm font-medium mb-6">
          <span className="block h-2 w-2 rounded-full bg-premium-gold mr-2"></span>
          <span>Join Our Community</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-gold bg-clip-text text-transparent">Ready to make better financial decisions?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
          Join our community today and connect with thousands of users and experts who are on the same financial journey as you.
        </p>
        <Button asChild className="btn-premium px-8 py-6 rounded-lg animate-hover-rise">
          <Link to="/auth/register">
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
