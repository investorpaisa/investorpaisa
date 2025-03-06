
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PremiumButton } from '../ui/premium/button';

const CtaSection = () => {
  return (
    <Card className="border-none bg-premium-dark-800/60 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Join Investor Paisa</CardTitle>
        <CardDescription>Community-driven financial wisdom</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Connect with thousands of users and experts on the same financial journey.
          </p>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-premium-dark-700 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-premium-gold">1</span>
              </div>
              <span>Get personalized financial advice</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-premium-dark-700 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-premium-gold">2</span>
              </div>
              <span>Connect with certified experts</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-premium-dark-700 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs text-premium-gold">3</span>
              </div>
              <span>Learn from community experiences</span>
            </li>
          </ul>
          
          <div className="pt-2 space-y-2">
            <PremiumButton asChild size="sm" className="w-full">
              <Link to="/auth/register">
                Create Account
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </PremiumButton>
            <p className="text-xs text-center text-muted-foreground">
              Already a member? <Link to="/auth/login" className="text-premium-gold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CtaSection;
