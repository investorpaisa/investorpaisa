
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, XAxis, YAxis } from 'recharts';
import type { MarketData } from '@/services/market';

const timeRanges = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'MAX'];

interface StockDetailsProps {
  stockData: MarketData;
  chartData: any[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export const StockDetails: React.FC<StockDetailsProps> = ({
  stockData,
  chartData,
  timeRange,
  onTimeRangeChange
}) => {
  const calculateCAGR = () => {
    if (chartData.length < 2) return 'N/A';
    
    const initialPrice = parseFloat(chartData[0].price);
    const finalPrice = parseFloat(chartData[chartData.length - 1].price);
    
    // Time periods in years for different ranges
    const periods = {
      '1D': 1/365,
      '1W': 7/365,
      '1M': 1/12,
      '3M': 3/12,
      '6M': 6/12,
      '1Y': 1,
      '5Y': 5,
      'MAX': 10
    }[timeRange] || 1;
    
    const cagr = (Math.pow(finalPrice / initialPrice, 1 / periods) - 1) * 100;
    return cagr.toFixed(2) + '%';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{stockData.companyName}</CardTitle>
            <p className="text-sm text-muted-foreground">{stockData.symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${stockData.lastPrice.toFixed(2)}</p>
            <div className={`flex items-center justify-end text-sm ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stockData.change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              <span>{stockData.change.toFixed(2)}</span>
              <span className="ml-1">({stockData.pChange.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Time range selector for chart */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <Tabs value={timeRange} onValueChange={onTimeRangeChange}>
              <TabsList className="gap-1">
                {timeRanges.map(range => (
                  <TabsTrigger key={range} value={range} className="text-xs px-2">
                    {range}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">CAGR: <span className="font-medium">{calculateCAGR()}</span></p>
          </div>
        </div>
        
        {/* Stock Chart */}
        {chartData.length > 0 && (
          <div className="h-60 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    if (timeRange === '1D') return value.split(',')[1]?.trim().substring(0, 5) || value;
                    if (['1W', '1M'].includes(timeRange)) return value.split('/')[1] || value;
                    return value;
                  }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Price']}
                  labelFormatter={(label) => timeRange === '1D' ? `${label}` : `Date: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#10b981" 
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Stock Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Open</p>
            <p className="font-medium">${stockData.open.toFixed(2)}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Prev Close</p>
            <p className="font-medium">${stockData.previousClose.toFixed(2)}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">High</p>
            <p className="font-medium">${stockData.high.toFixed(2)}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Low</p>
            <p className="font-medium">${stockData.low.toFixed(2)}</p>
          </div>
        </div>
        
        {/* News and Related Stocks would go here */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Related News</h3>
          <p className="text-sm text-muted-foreground">News integration coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
