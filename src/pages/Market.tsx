
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/MainLayout';
import { StockSearch } from '@/components/market/StockSearch';
import MarketInsights from '@/components/market/MarketInsights';

const Market = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <MarketInsights />
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Stock Search</CardTitle>
          </CardHeader>
          <CardContent>
            <StockSearch />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Market;
