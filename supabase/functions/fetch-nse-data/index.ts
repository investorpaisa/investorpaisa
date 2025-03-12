// Follow Deno deployment best practices
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API URLs for real-time stock data
const RAPIDAPI_HOST = "real-time-stock-finance-quote.p.rapidapi.com";
const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const endpoint = body.endpoint || 'error';
    const params = body.params || {};
    
    console.log(`Processing request for endpoint: ${endpoint}`);
    console.log(`With params:`, params);
    
    // Based on the endpoint parameter, call the appropriate function
    switch (endpoint) {
      case 'marketStatus':
        return await getMarketStatus(req);
      case 'indices':
        return await getIndices(req, params.index);
      case 'stocks':
        return await getStocks(req, params.symbol);
      case 'gainers':
        return await getTopGainers(req);
      case 'losers':
        return await getTopLosers(req);
      case 'search':
        return await searchStocks(req, params.q);
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

// Get indices data using the new RapidAPI endpoint
async function getIndices(req: Request, indexName: string = 'NIFTY 50') {
  try {
    const response = await fetch(`https://${RAPIDAPI_HOST}/indices/India/${encodeURIComponent(indexName)}`, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // If no data found, return simulated data
    if (!data || !data.indices || data.indices.length === 0) {
      return simulateIndexData(indexName);
    }
    
    const indexData = data.indices[0];
    
    // Format to match our application's expected structure
    const result = {
      name: indexName,
      lastPrice: parseFloat(indexData.last || "0"),
      change: parseFloat(indexData.netChange || "0"),
      pChange: parseFloat(indexData.pChange || "0"),
      open: parseFloat(indexData.open || "0"),
      high: parseFloat(indexData.high || "0"),
      low: parseFloat(indexData.low || "0"),
      previousClose: parseFloat(indexData.previousClose || "0"),
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

// Get stock quotes using the new API
async function getStocks(req: Request, symbol: string = 'RELIANCE') {
  try {
    const response = await fetch(`https://${RAPIDAPI_HOST}/stock/India/${encodeURIComponent(symbol)}`, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || Object.keys(data).length === 0) {
      return simulateStockQuote(symbol);
    }
    
    // Format to match our application's expected structure
    const result = {
      info: {
        symbol: symbol,
        companyName: data.longName || getCompanyName(symbol),
        industry: data.sector || 'Various',
        series: 'EQ'
      },
      priceInfo: {
        lastPrice: parseFloat(data.price || "0"),
        change: parseFloat(data.netChange || "0"),
        pChange: parseFloat(data.pChange || "0"),
        open: parseFloat(data.open || "0"),
        close: parseFloat(data.previousClose || "0"),
        previousClose: parseFloat(data.previousClose || "0"),
        intraDayHighLow: {
          min: parseFloat(data.low || "0"),
          max: parseFloat(data.high || "0")
        }
      },
      securityInfo: {
        tradedVolume: parseInt(data.volume || "0")
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

// Get top gainers using the new API
async function getTopGainers(req: Request) {
  try {
    const response = await fetch(`https://${RAPIDAPI_HOST}/market/India/gainers`, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.gainers || data.gainers.length === 0) {
      return simulateGainersLosers(true);
    }
    
    // Format the gainers data
    const gainers = data.gainers.slice(0, 5).map((stock: any) => ({
      symbol: stock.ticker,
      lastPrice: parseFloat(stock.price || "0"),
      change: parseFloat(stock.change || "0"),
      pChange: parseFloat(stock.pchange.replace('%', '') || "0"),
      open: parseFloat(stock.open || "0"),
      high: parseFloat(stock.high || "0"),
      low: parseFloat(stock.low || "0"),
      previousClose: parseFloat(stock.previousClose || "0"),
      tradedQuantity: parseInt(stock.volume || "0")
    }));
    
    return new Response(
      JSON.stringify(gainers),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching top gainers:", error);
    return simulateGainersLosers(true);
  }
}

// Get top losers using the new API
async function getTopLosers(req: Request) {
  try {
    const response = await fetch(`https://${RAPIDAPI_HOST}/market/India/losers`, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.losers || data.losers.length === 0) {
      return simulateGainersLosers(false);
    }
    
    // Format the losers data
    const losers = data.losers.slice(0, 5).map((stock: any) => ({
      symbol: stock.ticker,
      lastPrice: parseFloat(stock.price || "0"),
      change: parseFloat(stock.change || "0"),
      pChange: parseFloat(stock.pchange.replace('%', '') || "0"),
      open: parseFloat(stock.open || "0"),
      high: parseFloat(stock.high || "0"),
      low: parseFloat(stock.low || "0"),
      previousClose: parseFloat(stock.previousClose || "0"),
      tradedQuantity: parseInt(stock.volume || "0")
    }));
    
    return new Response(
      JSON.stringify(losers),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching top losers:", error);
    return simulateGainersLosers(false);
  }
}

// Search stocks using the new API
async function searchStocks(req: Request, query: string = '') {
  if (!query) {
    return new Response(
      JSON.stringify([]),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  try {
    const response = await fetch(`https://${RAPIDAPI_HOST}/search/${encodeURIComponent(query)}?country=India`, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.instruments || data.instruments.length === 0) {
      return simulateSearchResults(query);
    }
    
    // Format search results
    const results = data.instruments
      .filter((item: any) => item.country === "India" && item.type === "EQUITY")
      .slice(0, 10)
      .map((item: any) => ({
        symbol: item.symbol,
        type: 'EQ',
        name: item.name
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

// Fallback simulations - keeping the existing simulation functions
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
