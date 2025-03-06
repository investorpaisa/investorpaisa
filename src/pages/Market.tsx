
import React from 'react';
import MarketInsights from '@/components/market/MarketInsights';
import StockSearch from '@/components/market/StockSearch';
import { Card } from '@/components/ui/card';

const MarketPage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Market Data</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketInsights />
        </div>
        
        <div className="space-y-6">
          <Card className="p-4 bg-premium-dark-800/60 backdrop-blur-md">
            <h2 className="text-xl font-semibold tracking-tight mb-4">Stock Search</h2>
            <StockSearch />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
