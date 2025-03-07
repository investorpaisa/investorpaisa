
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getStockQuote, searchStocks, StockQuote } from '@/services/market';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockSearchProps {
  // No props needed
}

const StockSearch: React.FC<StockSearchProps> = () => {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState<StockQuote | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchStocks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetQuote = async () => {
    setLoading(true);
    try {
      const data = await getStockQuote(symbol);
      setStockData(data);

      // Mock historical data for the chart
      const mockChartData = Array.from({ length: 20 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toLocaleDateString(),
          price: data?.lastPrice ? data.lastPrice + (Math.random() - 0.5) * 20 : 0,
        };
      }).reverse();

      setChartData(mockChartData);
    } catch (error) {
      console.error("Failed to fetch stock quote:", error);
      setStockData(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL)"
            value={symbol}
            onChange={handleSymbolChange}
          />
          <Button onClick={handleGetQuote} className="mt-2" disabled={loading}>
            {loading ? "Loading..." : "Get Quote"}
          </Button>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search for stocks"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
          <Button onClick={handleSearch} className="mt-2" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
          {searchResults.length > 0 && (
            <ul className="mt-2">
              {searchResults.map((result: any) => (
                <li key={result.symbol}>
                  {result.companyName} ({result.symbol})
                </li>
              ))}
            </ul>
          )}
        </div>

        {stockData && (
          <div className="mt-4">
            <h3>{stockData.companyName} ({stockData.symbol})</h3>
            <p>Current Price: ${stockData.lastPrice}</p>
            <p>High: ${stockData.high}</p>
            <p>Low: ${stockData.low}</p>
            <p>Open: ${stockData.open}</p>
            <p>Previous Close: ${stockData.previousClose}</p>
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { StockSearch };
