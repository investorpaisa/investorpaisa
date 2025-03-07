import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { StockQuote } from '@/services/market/quotes/stockSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  getMarketStatus,
  searchStocks,
  getStockQuote,
  getMarketIndices,
  getTopPerformers
} from '@/services/market';
import { ArrowUpIcon, ArrowDownIcon, RefreshCw } from 'lucide-react';

interface MarketStatusData {
  market: string;
  isMarketOpen: boolean;
  nextMarketEvent: string;
}

interface IndexData {
  name: string;
  last: number;
  netChange: number;
  netChangePercent: number;
}

interface TopPerformer {
  ticker: string;
  companyName: string;
  price: number;
  change: number;
  percentChange: number;
}

const MarketInsights: React.FC = () => {
  const [marketStatus, setMarketStatus] = useState<MarketStatusData | null>(null);
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [topGainers, setTopGainers] = useState<TopPerformer[]>([]);
  const [topLosers, setTopLosers] = useState<TopPerformer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const status = await getMarketStatus();
        setMarketStatus(status);

        const indicesData = await getMarketIndices();
        setIndices(indicesData);

        const topPerformers = await getTopPerformers('gainers');
        setTopGainers(topPerformers);

        const topLosers = await getTopPerformers('losers');
        setTopLosers(topLosers);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch market data.');
        console.error("Error fetching market data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 300000);

    return () => clearInterval(intervalId);
  }, []);

  const getArrowIcon = (change: number) => {
    if (change > 0) {
      return <ArrowUpIcon className="inline-block w-4 h-4 ml-1 text-green-500" />;
    } else if (change < 0) {
      return <ArrowDownIcon className="inline-block w-4 h-4 ml-1 text-red-500" />;
    } else {
      return null;
    }
  };

  if (isLoading) {
    return <Card><CardContent>Loading market data...</CardContent></Card>;
  }

  if (error) {
    return <Card><CardContent>Error: {error}</CardContent></Card>;
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="top-gainers">Top Gainers</TabsTrigger>
        <TabsTrigger value="top-losers">Top Losers</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Market Status</CardTitle>
            <CardDescription>
              {marketStatus?.isMarketOpen ? (
                <Badge variant="outline">Open</Badge>
              ) : (
                <Badge variant="destructive">Closed</Badge>
              )}
              <p className="text-sm mt-1">Next Event: {marketStatus?.nextMarketEvent}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {indices.map((index) => (
                <div key={index.name} className="p-4 border rounded-md">
                  <h3 className="text-lg font-semibold">{index.name}</h3>
                  <p className="text-gray-500">Last: {index.last}</p>
                  <p className="text-gray-500">
                    Change: {index.netChange} ({index.netChangePercent}%)
                    {getArrowIcon(index.netChange)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="top-gainers" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Gainers</CardTitle>
            <CardDescription>Stocks with the highest gains today.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topGainers.map((stock) => (
                    <tr key={stock.ticker}>
                      <td className="px-6 py-4 whitespace-nowrap">{stock.ticker}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{stock.companyName}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">{stock.price}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">{stock.change}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {stock.percentChange}%
                        {getArrowIcon(stock.change)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="top-losers" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Losers</CardTitle>
            <CardDescription>Stocks with the highest losses today.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topLosers.map((stock) => (
                    <tr key={stock.ticker}>
                      <td className="px-6 py-4 whitespace-nowrap">{stock.ticker}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{stock.companyName}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">{stock.price}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">{stock.change}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {stock.percentChange}%
                        {getArrowIcon(stock.change)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default MarketInsights;
