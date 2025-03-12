
// This service handles proxying data from our Supabase Edge Function to fetch NSE market data

import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Use the Supabase Edge Function to fetch market data
export const fetchProxyData = async (endpoint: string, params: Record<string, string> = {}) => {
  try {
    console.log(`Fetching ${endpoint} with params:`, params);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('endpoint', endpoint);
    
    // Add any additional parameters
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('fetch-nse-data', {
      body: { endpoint, params },
    });
    
    if (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      toast.error(`Failed to fetch market data: ${error.message}`);
      return fallbackData(endpoint, params);
    }
    
    if (!data) {
      console.warn(`No data returned for ${endpoint}`);
      return fallbackData(endpoint, params);
    }
    
    return data;
  } catch (error) {
    console.error(`Exception fetching ${endpoint}:`, error);
    toast.error(`Failed to fetch market data: ${error.message}`);
    return fallbackData(endpoint, params);
  }
};

// Fallback data when the API fails
function fallbackData(endpoint: string, params: Record<string, string> = {}) {
  console.log(`Using fallback data for ${endpoint}`);
  
  switch (endpoint) {
    case 'marketStatus':
      return mockMarketStatus();
    case 'indices':
      return mockIndexData(params.index);
    case 'stocks':
      return mockStockQuote(params.symbol);
    case 'gainers':
      return mockTopGainers();
    case 'losers':
      return mockTopLosers();
    case 'search':
      return mockSearchResults(params.q);
    default:
      return { error: "Unsupported endpoint" };
  }
}

// Mock data generators for fallback
function mockMarketStatus() {
  const now = new Date();
  const marketOpen = now.getHours() >= 9 && now.getHours() < 16;
  
  return {
    status: marketOpen ? "The market is currently open" : "The market is currently closed",
    timestamp: new Date().toISOString()
  };
}

function mockIndexData(indexName: string = 'NIFTY 50') {
  const baseValue = indexName === 'NIFTY 50' ? 22500 : 
                  indexName === 'NIFTY BANK' ? 48000 : 
                  indexName === 'NIFTY IT' ? 33500 : 
                  indexName === 'NIFTY PHARMA' ? 17800 : 
                  Math.random() * 20000 + 15000;
  
  const change = (Math.random() * 400) - 200;
  const percentChange = (change / baseValue) * 100;
  
  return {
    name: indexName,
    lastPrice: baseValue,
    open: baseValue - (Math.random() * 100),
    high: baseValue + (Math.random() * 200),
    low: baseValue - (Math.random() * 200),
    previousClose: baseValue - change,
    change: change,
    pChange: percentChange,
    timestamp: new Date().toISOString()
  };
}

function mockStockQuote(symbol: string = 'RELIANCE') {
  const basePrice = symbol === 'RELIANCE' ? 2540.75 : 
                  symbol === 'TCS' ? 3456.80 : 
                  symbol === 'HDFCBANK' ? 1678.25 : 
                  symbol === 'INFY' ? 1540.65 : 
                  Math.random() * 2000 + 500;
  
  const priceChange = (Math.random() * 40) - 20;
  const percentChange = (priceChange / basePrice) * 100;
  
  return {
    info: {
      symbol: symbol,
      companyName: getCompanyName(symbol),
      industry: 'Various',
      series: 'EQ'
    },
    priceInfo: {
      lastPrice: basePrice,
      change: priceChange,
      pChange: percentChange,
      open: basePrice - (Math.random() * 10),
      close: basePrice - priceChange,
      previousClose: basePrice - priceChange,
      intraDayHighLow: {
        min: basePrice - (Math.random() * 30),
        max: basePrice + (Math.random() * 30)
      }
    },
    securityInfo: {
      tradedVolume: Math.floor(Math.random() * 1000000)
    }
  };
}

function mockTopGainers() {
  return [
    createMockStock('RELIANCE', 2540.75, 45.30),
    createMockStock('TCS', 3456.80, 78.25),
    createMockStock('HDFCBANK', 1678.25, 32.45),
    createMockStock('INFY', 1540.65, 28.75),
    createMockStock('ITC', 450.20, 8.50)
  ];
}

function mockTopLosers() {
  return [
    createMockStock('ADANIPORTS', 985.35, -32.65),
    createMockStock('TATASTEEL', 147.80, -5.20),
    createMockStock('ICICIBANK', 1054.55, -25.45),
    createMockStock('AXISBANK', 1078.90, -21.10),
    createMockStock('WIPRO', 478.35, -7.65)
  ];
}

function mockSearchResults(query: string = '') {
  const mockStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
    { symbol: 'INFY', name: 'Infosys Ltd.' },
    { symbol: 'ITC', name: 'ITC Ltd.' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
    { symbol: 'WIPRO', name: 'Wipro Ltd.' },
    { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.' },
    { symbol: 'AXISBANK', name: 'Axis Bank Ltd.' },
    { symbol: 'SBIN', name: 'State Bank of India' }
  ];
  
  if (!query) return [];
  
  const filteredStocks = mockStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
    stock.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return filteredStocks.map(stock => ({
    symbol: stock.symbol,
    type: 'EQ',
    name: stock.name
  }));
}

// Helper functions
function createMockStock(symbol: string, price: number, change: number) {
  const percentChange = (change / price) * 100;
  
  return {
    symbol: symbol,
    lastPrice: price,
    change: change,
    pChange: percentChange,
    open: price - (Math.random() * 10),
    high: price + (Math.random() * 20),
    low: price - (Math.random() * 20),
    previousClose: price - change,
    tradedQuantity: Math.floor(Math.random() * 1000000)
  };
}

function getCompanyName(symbol: string) {
  const companies: Record<string, string> = {
    'RELIANCE': 'Reliance Industries Ltd.',
    'TCS': 'Tata Consultancy Services Ltd.',
    'HDFCBANK': 'HDFC Bank Ltd.',
    'INFY': 'Infosys Ltd.',
    'ITC': 'ITC Ltd.',
    'ICICIBANK': 'ICICI Bank Ltd.',
    'WIPRO': 'Wipro Ltd.',
    'TATASTEEL': 'Tata Steel Ltd.',
    'AXISBANK': 'Axis Bank Ltd.',
    'SBIN': 'State Bank of India'
  };
  
  return companies[symbol] || `${symbol} Ltd.`;
}
