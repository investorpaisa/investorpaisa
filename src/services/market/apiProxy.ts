
// This is a placeholder for a proxy service that would handle CORS issues with NSE APIs
// In a production environment, you would implement a server-side proxy or use a service like Supabase Edge Functions

import { toast } from 'sonner';

// Since we can't directly access NSE APIs from the browser due to CORS,
// this mock implementation simulates API responses for demonstration purposes
export const fetchProxyData = async (endpoint: string, params: Record<string, string> = {}) => {
  // In a real implementation, this would make a request to your backend proxy
  // which would then forward the request to the NSE API
  
  // For now, we'll just simulate a successful response with mock data
  console.log(`[MOCK] Fetching ${endpoint} with params:`, params);
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data based on the endpoint
  switch (endpoint) {
    case '/marketStatus':
      return mockMarketStatus();
    case '/quote':
      return mockStockQuote(params.symbol);
    case '/indexData':
      return mockIndexData(params.index);
    case '/marketData/topGainers':
      return mockTopGainers();
    case '/marketData/topLosers':
      return mockTopLosers();
    case '/search':
      return mockSearchResults(params.q);
    default:
      toast.error(`Unsupported endpoint: ${endpoint}`);
      throw new Error(`Unsupported endpoint: ${endpoint}`);
  }
};

// Mock data generators
function mockMarketStatus() {
  const now = new Date();
  const marketOpen = now.getHours() >= 9 && now.getHours() < 16;
  
  return {
    marketState: marketOpen ? 'open' : 'closed',
    marketStatus: marketOpen ? 'The market is currently open' : 'The market is currently closed'
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

function mockIndexData(indexName: string = 'NIFTY 50') {
  const baseValue = indexName === 'NIFTY 50' ? 22500 : 
                  indexName === 'NIFTY BANK' ? 48000 : 
                  indexName === 'NIFTY IT' ? 33500 : 
                  indexName === 'NIFTY PHARMA' ? 17800 : 
                  Math.random() * 20000 + 15000;
  
  const change = (Math.random() * 400) - 200;
  const percentChange = (change / baseValue) * 100;
  
  return {
    indexInfo: {
      name: indexName
    },
    last: baseValue,
    open: baseValue - (Math.random() * 100),
    high: baseValue + (Math.random() * 200),
    low: baseValue - (Math.random() * 200),
    previousClose: baseValue - change,
    change: change,
    percentChange: percentChange
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
