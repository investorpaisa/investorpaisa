
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Shield } from 'lucide-react';
import { PremiumButton } from '../ui/premium/button';

const communities = [
  {
    id: 1,
    name: 'StockMarket',
    members: '124.5k',
    description: 'Stock market analysis and discussions',
    icon: <TrendingUp className="h-6 w-6 text-premium-gold" />
  },
  {
    id: 2,
    name: 'PersonalFinance',
    members: '389.2k',
    description: 'Learn how to manage your finances better',
    icon: <Users className="h-6 w-6 text-premium-gold" />
  },
  {
    id: 3,
    name: 'TaxAdvice',
    members: '42.8k',
    description: 'Tax strategies and compliance discussions',
    icon: <Shield className="h-6 w-6 text-premium-gold" />
  }
];

const PopularCommunitiesSection = () => {
  return (
    <Card className="border-none bg-premium-dark-800/80 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-foreground">Popular Communities</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          {communities.map((community) => (
            <div key={community.id} className="flex items-center p-2 hover:bg-premium-dark-600/50 rounded-md transition-colors">
              <div className="h-8 w-8 rounded-full bg-premium-dark-600 flex items-center justify-center mr-3">
                {community.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">p/{community.name}</h3>
                  <span className="text-xs text-foreground/70">{community.members}</span>
                </div>
                <p className="text-xs text-foreground/70">{community.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <PremiumButton variant="outline" size="sm" className="w-full">
            View All Communities
          </PremiumButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularCommunitiesSection;
