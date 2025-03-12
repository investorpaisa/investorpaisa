
// Follow Deno deployment best practices
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API URLs for free NSE data
const API_BASE_URL = "https://latest-stock-price.p.rapidapi.com";
const INDICES_URL = "https://api.niftyindices.com/eq_indices";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint') || 'error';
    
    console.log(`Processing request for endpoint: ${endpoint}`);
    
    // Based on the endpoint parameter, call the appropriate function
    switch (endpoint) {
      case 'marketStatus':
        return await getMarketStatus(req);
      case 'indices':
        return await getIndices(req);
      case 'stocks':
        return await getStocks(req);
      case 'gainers':
        return await getTopGainers(req);
      case 'losers':
        return await getTopLosers(req);
      case 'search':
        return await searchStocks(req);
      default:
        return new Response(
          JSON.stringify({ error: "Invalid endpoint specified" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400 
          }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

// Free API for market status
async function getMarketStatus(req: Request) {
  // For demo purposes, we'll check current time (IST) to determine if market is open
  // NSE market hours: 9:15 AM - 3:30 PM IST, Monday-Friday
  const now = new Date();
  const istOptions = { timeZone: 'Asia/Kolkata' };
  const istTimeStr = now.toLocaleString('en-US', istOptions);
  const ist = new Date(istTimeStr);
  
  const hour = ist.getHours();
  const minute = ist.getMinutes();
  const day = ist.getDay();
  
  // Check if within market hours (9:15 AM - 3:30 PM IST) and weekday (1-5)
  const isWeekday = day >= 1 && day <= 5;
  const isMarketHours = (hour > 9 || (hour === 9 && minute >= 15)) && (hour < 15 || (hour === 15 && minute <= 30));
  const isOpen = isWeekday && isMarketHours;

  const status = {
    status: isOpen ? "The market is currently open" : "The market is currently closed",
    timestamp: new Date().toISOString()
  };

  return new Response(
    JSON.stringify(status),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Get NSE indices using rapidapi
async function getIndices(req: Request) {
  const url = new URL(req.url);
  const indexName = url.searchParams.get('index') || 'NIFTY 50';
  
  try {
    // Using RapidAPI for free NSE data
    const response = await fetch(`${API_BASE_URL}/price?Indices=${encodeURIComponent(indexName)}`, {
      headers: {
        'X-RapidAPI-Key': 'demo-key-please-use-free-tier', // Users should replace with their own key
        'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // If no data found, return simulated data
    if (!data || data.length === 0) {
      return simulateIndexData(indexName);
    }
    
    const indexData = data[0];
    
    // Format to match our application's expected structure
    const result = {
      name: indexData.indexName || indexName,
      lastPrice: indexData.lastPrice || 0,
      change: indexData.change || 0,
      pChange: indexData.pChange || 0,
      open: indexData.open || 0,
      high: indexData.dayHigh || 0,
      low: indexData.dayLow || 0,
      previousClose: indexData.previousClose || 0,
      timestamp: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error fetching index data for ${indexName}:`, error);
    return simulateIndexData(indexName);
  }
}

// Get stock quotes
async function getStocks(req: Request) {
  const url = new URL(req.url);
  const symbol = url.searchParams.get('symbol') || 'RELIANCE';
  
  try {
    const response = await fetch(`${API_BASE_URL}/price?Indices=${encodeURIComponent(symbol)}`, {
      headers: {
        'X-RapidAPI-Key': 'demo-key-please-use-free-tier',
        'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return simulateStockQuote(symbol);
    }
    
    const stockData = data[0];
    
    // Format to match our application's expected structure
    const result = {
      info: {
        symbol: stockData.symbol || symbol,
        companyName: getCompanyName(stockData.symbol || symbol),
        industry: 'Various',
        series: stockData.series || 'EQ'
      },
      priceInfo: {
        lastPrice: stockData.lastPrice || 0,
        change: stockData.change || 0,
        pChange: stockData.pChange || 0,
        open: stockData.open || 0,
        close: stockData.close || 0,
        previousClose: stockData.previousClose || 0,
        intraDayHighLow: {
          min: stockData.dayLow || 0,
          max: stockData.dayHigh || 0
        }
      },
      securityInfo: {
        tradedVolume: stockData.totalTradedVolume || 0
      }
    };
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return simulateStockQuote(symbol);
  }
}

// Get top gainers
async function getTopGainers(req: Request) {
  try {
    const response = await fetch(`${API_BASE_URL}/price?Indices=NIFTY%20NEXT%2050`, {
      headers: {
        'X-RapidAPI-Key': 'demo-key-please-use-free-tier',
        'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return simulateGainersLosers(true);
    }
    
    // Sort by percent change to get top gainers
    const gainers = data
      .filter((stock: any) => stock.pChange > 0)
      .sort((a: any, b: any) => b.pChange - a.pChange)
      .slice(0, 5)
      .map((stock: any) => ({
        symbol: stock.symbol,
        lastPrice: stock.lastPrice,
        change: stock.change,
        pChange: stock.pChange,
        open: stock.open,
        high: stock.dayHigh,
        low: stock.dayLow,
        previousClose: stock.previousClose,
        tradedQuantity: stock.totalTradedVolume
      }));
    
    return new Response(
      JSON.stringify(gainers.length > 0 ? gainers : simulateGainersLosers(true)),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching top gainers:", error);
    return simulateGainersLosers(true);
  }
}

// Get top losers
async function getTopLosers(req: Request) {
  try {
    const response = await fetch(`${API_BASE_URL}/price?Indices=NIFTY%20NEXT%2050`, {
      headers: {
        'X-RapidAPI-Key': 'demo-key-please-use-free-tier',
        'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return simulateGainersLosers(false);
    }
    
    // Sort by percent change to get top losers
    const losers = data
      .filter((stock: any) => stock.pChange < 0)
      .sort((a: any, b: any) => a.pChange - b.pChange)
      .slice(0, 5)
      .map((stock: any) => ({
        symbol: stock.symbol,
        lastPrice: stock.lastPrice,
        change: stock.change,
        pChange: stock.pChange,
        open: stock.open,
        high: stock.dayHigh,
        low: stock.dayLow,
        previousClose: stock.previousClose,
        tradedQuantity: stock.totalTradedVolume
      }));
    
    return new Response(
      JSON.stringify(losers.length > 0 ? losers : simulateGainersLosers(false)),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching top losers:", error);
    return simulateGainersLosers(false);
  }
}

// Search stocks
async function searchStocks(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get('q') || '';
  
  try {
    const response = await fetch(`${API_BASE_URL}/price?Indices=NIFTY%20500`, {
      headers: {
        'X-RapidAPI-Key': 'demo-key-please-use-free-tier',
        'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return simulateSearchResults(query);
    }
    
    // Filter stocks based on query
    const results = data
      .filter((stock: any) => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
        getCompanyName(stock.symbol).toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10)
      .map((stock: any) => ({
        symbol: stock.symbol,
        type: stock.series || 'EQ',
        name: getCompanyName(stock.symbol)
      }));
    
    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error searching stocks for "${query}":`, error);
    return simulateSearchResults(query);
  }
}

// Fallback simulations when API fails
function simulateIndexData(indexName: string) {
  const baseValue = indexName === 'NIFTY 50' ? 22500 : 
                  indexName === 'NIFTY BANK' ? 48000 : 
                  indexName === 'NIFTY IT' ? 33500 : 
                  indexName === 'NIFTY PHARMA' ? 17800 : 
                  Math.random() * 20000 + 15000;
  
  const change = (Math.random() * 400) - 200;
  const percentChange = (change / baseValue) * 100;
  
  const mockData = {
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
  
  console.log(`Returning simulated data for index: ${indexName}`);
  
  return new Response(
    JSON.stringify(mockData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function simulateStockQuote(symbol: string) {
  const basePrice = symbol === 'RELIANCE' ? 2540.75 : 
                  symbol === 'TCS' ? 3456.80 : 
                  symbol === 'HDFCBANK' ? 1678.25 : 
                  symbol === 'INFY' ? 1540.65 : 
                  Math.random() * 2000 + 500;
  
  const priceChange = (Math.random() * 40) - 20;
  const percentChange = (priceChange / basePrice) * 100;
  
  const mockData = {
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
  
  console.log(`Returning simulated data for stock: ${symbol}`);
  
  return new Response(
    JSON.stringify(mockData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function simulateGainersLosers(gainers: boolean) {
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
  
  return new Response(
    JSON.stringify(mockStocks.slice(0, 5).map(stock => {
      const price = Math.random() * 2000 + 500;
      const change = gainers ? Math.random() * 50 : -Math.random() * 50;
      const pChange = (change / price) * 100;
      
      return {
        symbol: stock.symbol,
        lastPrice: price,
        change: change,
        pChange: pChange,
        open: price - (Math.random() * 10),
        high: price + (Math.random() * 20),
        low: price - (Math.random() * 20),
        previousClose: price - change,
        tradedQuantity: Math.floor(Math.random() * 1000000)
      };
    })),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function simulateSearchResults(query: string) {
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
  
  const filteredStocks = !query 
    ? [] 
    : mockStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
        stock.name.toLowerCase().includes(query.toLowerCase())
      );
  
  return new Response(
    JSON.stringify(filteredStocks.map(stock => ({
      symbol: stock.symbol,
      type: 'EQ',
      name: stock.name
    }))),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Helper to get company names
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
