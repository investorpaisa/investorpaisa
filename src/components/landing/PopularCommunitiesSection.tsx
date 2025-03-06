
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
    <Card className="border border-premium-gold/20 bg-premium-dark-800/90 overflow-hidden shadow-premium">
      <CardHeader className="pb-2 border-b border-premium-gold/10">
        <CardTitle className="text-lg font-medium text-premium-gold">Popular Communities</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          {communities.map((community) => (
            <div 
              key={community.id} 
              className="flex items-center p-2 hover:bg-premium-dark-700/80 rounded-md transition-colors border border-transparent hover:border-premium-gold/20"
            >
              <div className="h-8 w-8 rounded-full bg-premium-dark-600 flex items-center justify-center mr-3 border border-premium-gold/30">
                {community.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-premium-gold">p/{community.name}</h3>
                  <span className="text-xs text-premium-gold-light">{community.members}</span>
                </div>
                <p className="text-xs text-white/80">{community.description}</p>
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
