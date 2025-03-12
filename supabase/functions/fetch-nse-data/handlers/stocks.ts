
// Handler for stock quotes endpoint
import { RAPIDAPI_HOST, RAPIDAPI_KEY } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";
import { getCompanyName } from "../utils/helpers.ts";
import { simulateStockQuote } from "../utils/mockData.ts";

export async function getStocks(req: Request, symbol: string = 'RELIANCE') {
  try {
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
      return simulateStockQuote(symbol);
    }

    // Get the latest day's data
    const dates = Object.keys(data['Time Series (Daily)']);
    const latestDate = dates[0];
    const latestData = data['Time Series (Daily)'][latestDate];
    
    // Format to match our application's expected structure
    const result = {
      info: {
        symbol: symbol,
        companyName: getCompanyName(symbol),
        industry: 'Various',
        series: 'EQ'
      },
      priceInfo: {
        lastPrice: parseFloat(latestData['4. close']),
        change: parseFloat(latestData['4. close']) - parseFloat(latestData['1. open']),
        pChange: ((parseFloat(latestData['4. close']) - parseFloat(latestData['1. open'])) / parseFloat(latestData['1. open']) * 100),
        open: parseFloat(latestData['1. open']),
        close: parseFloat(latestData['4. close']),
        previousClose: parseFloat(data['Time Series (Daily)'][dates[1]]['4. close']),
        intraDayHighLow: {
          min: parseFloat(latestData['3. low']),
          max: parseFloat(latestData['2. high'])
        }
      },
      securityInfo: {
        tradedVolume: parseInt(latestData['6. volume'])
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

