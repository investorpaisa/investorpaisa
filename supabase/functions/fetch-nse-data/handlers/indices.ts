
// Handler for indices endpoint
import { RAPIDAPI_HOST, RAPIDAPI_KEY } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";
import { simulateIndexData } from "../utils/mockData.ts";

export async function getIndices(req: Request, indexName: string = 'NIFTY 50') {
  try {
    // Map index names to their symbols for Alpha Vantage
    const indexMap: Record<string, string> = {
      'NIFTY 50': '^NSEI',
      'NIFTY BANK': '^NSEBANK',
      'NIFTY IT': 'NIFTYIT.NS',
      'SENSEX': '^BSESN'
    };

    const symbol = indexMap[indexName] || '^NSEI';
    
    const response = await fetch(`https://${RAPIDAPI_HOST}/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&datatype=json`, {
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
    
    if (!data || !data['Time Series (Daily)']) {
      return simulateIndexData(indexName);
    }

    // Get the latest day's data
    const dates = Object.keys(data['Time Series (Daily)']);
    const latestDate = dates[0];
    const latestData = data['Time Series (Daily)'][latestDate];
    const previousData = data['Time Series (Daily)'][dates[1]];
    
    // Format to match our application's expected structure
    const result = {
      name: indexName,
      lastPrice: parseFloat(latestData['4. close']),
      change: parseFloat(latestData['4. close']) - parseFloat(previousData['4. close']),
      pChange: ((parseFloat(latestData['4. close']) - parseFloat(previousData['4. close'])) / parseFloat(previousData['4. close']) * 100),
      open: parseFloat(latestData['1. open']),
      high: parseFloat(latestData['2. high']),
      low: parseFloat(latestData['3. low']),
      previousClose: parseFloat(previousData['4. close']),
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

