
// Handler for top gainers and losers endpoints
import { RAPIDAPI_HOST, RAPIDAPI_KEY } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";
import { simulateGainersLosers } from "../utils/mockData.ts";

// Top stocks to track for market performance
const TRACKED_STOCKS = [
  'RELIANCE.BSE', 'TCS.BSE', 'HDFCBANK.BSE', 'INFY.BSE', 'ICICIBANK.BSE',
  'ITC.BSE', 'KOTAKBANK.BSE', 'LT.BSE', 'AXISBANK.BSE', 'WIPRO.BSE'
];

async function fetchStockData(symbol: string) {
  const response = await fetch(`https://${RAPIDAPI_HOST}/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&datatype=json`, {
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST
    }
  });
  
  if (!response.ok) return null;
  
  const data = await response.json();
  if (!data || !data['Time Series (Daily)']) return null;
  
  const dates = Object.keys(data['Time Series (Daily)']);
  const latestDate = dates[0];
  const latestData = data['Time Series (Daily)'][latestDate];
  const previousData = data['Time Series (Daily)'][dates[1]];
  
  const close = parseFloat(latestData['4. close']);
  const prevClose = parseFloat(previousData['4. close']);
  const change = close - prevClose;
  const pChange = (change / prevClose) * 100;
  
  return {
    symbol: symbol.replace('.BSE', ''),
    lastPrice: close,
    change: change,
    pChange: pChange,
    open: parseFloat(latestData['1. open']),
    high: parseFloat(latestData['2. high']),
    low: parseFloat(latestData['3. low']),
    previousClose: prevClose,
    tradedQuantity: parseInt(latestData['6. volume'])
  };
}

export async function getTopGainers(req: Request) {
  try {
    const stocksData = await Promise.all(
      TRACKED_STOCKS.map(symbol => fetchStockData(symbol))
    );
    
    const validData = stocksData.filter(data => data !== null);
    if (validData.length === 0) {
      return simulateGainersLosers(true);
    }
    
    // Sort by percentage change to get top gainers
    const gainers = validData
      .filter(stock => stock.pChange > 0)
      .sort((a, b) => b.pChange - a.pChange)
      .slice(0, 5);
    
    return new Response(
      JSON.stringify(gainers),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching top gainers:", error);
    return simulateGainersLosers(true);
  }
}

export async function getTopLosers(req: Request) {
  try {
    const stocksData = await Promise.all(
      TRACKED_STOCKS.map(symbol => fetchStockData(symbol))
    );
    
    const validData = stocksData.filter(data => data !== null);
    if (validData.length === 0) {
      return simulateGainersLosers(false);
    }
    
    // Sort by percentage change to get top losers
    const losers = validData
      .filter(stock => stock.pChange < 0)
      .sort((a, b) => a.pChange - b.pChange)
      .slice(0, 5);
    
    return new Response(
      JSON.stringify(losers),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching top losers:", error);
    return simulateGainersLosers(false);
  }
}

