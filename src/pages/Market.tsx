
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockSearch } from '@/components/market/StockSearch';
import MarketInsights from '@/components/market/MarketInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Market = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Market Research</h1>
        <p className="text-muted-foreground">Research stocks, mutual funds, cryptocurrencies, bonds, and commodities</p>
      </div>
      
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
          <CardTitle>Investment Research</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stocks" className="w-full">
            <TabsList className="grid grid-cols-5 h-auto mb-4">
              <TabsTrigger value="stocks" className="py-2">Stocks</TabsTrigger>
              <TabsTrigger value="mutual-funds" className="py-2">Mutual Funds</TabsTrigger>
              <TabsTrigger value="crypto" className="py-2">Cryptocurrency</TabsTrigger>
              <TabsTrigger value="bonds" className="py-2">Bonds</TabsTrigger>
              <TabsTrigger value="commodities" className="py-2">Commodities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stocks" className="mt-4">
              <StockSearch />
            </TabsContent>
            
            <TabsContent value="mutual-funds" className="mt-4">
              <div className="p-4 border rounded-md text-center">
                <p className="text-muted-foreground">Mutual fund research is coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="crypto" className="mt-4">
              <div className="p-4 border rounded-md text-center">
                <p className="text-muted-foreground">Cryptocurrency research is coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="bonds" className="mt-4">
              <div className="p-4 border rounded-md text-center">
                <p className="text-muted-foreground">Bond research is coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="commodities" className="mt-4">
              <div className="p-4 border rounded-md text-center">
                <p className="text-muted-foreground">Commodities research is coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Market;
