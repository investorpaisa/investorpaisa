
import React from 'react';
import { SystemCard, Typography } from '@/components/ui/design-system';
import { TrendingUp, TrendingDown } from 'lucide-react';

const marketData = [
  { symbol: 'NIFTY 50', price: '19,345.25', change: '+0.8%', isPositive: true },
  { symbol: 'SENSEX', price: '65,123.45', change: '+0.5%', isPositive: true },
  { symbol: 'BTC-USD', price: '$42,150', change: '-1.2%', isPositive: false },
  { symbol: 'GOLD', price: '₹5,850/gm', change: '+0.3%', isPositive: true },
];

export const MarketWidget: React.FC = () => {
  return (
    <SystemCard className="p-4">
      <Typography.H3 className="font-semibold text-black mb-4">
        Market Today
      </Typography.H3>
      
      <div className="space-y-3">
        {marketData.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between">
            <div>
              <Typography.Body className="font-medium text-black">
                {item.symbol}
              </Typography.Body>
              <Typography.Small className="text-gray-600">
                {item.price}
              </Typography.Small>
            </div>
            <div className={`flex items-center space-x-1 ${
              item.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{item.change}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-black font-medium hover:bg-gray-50 p-2 rounded">
        View more market data
      </button>
    </SystemCard>
  );
};
