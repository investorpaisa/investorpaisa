
// Handler for stock quotes endpoint
import { RAPIDAPI_HOST, RAPIDAPI_KEY, API_FUNCTIONS } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";
import { getCompanyName } from "../utils/helpers.ts";
import { simulateStockQuote } from "../utils/mockData.ts";

export async function getStocks(req: Request, symbol: string = 'RELIANCE') {
  try {
    console.log(`Fetching stock data for ${symbol}`);
    
    // First fetch the quote data
    const quoteUrl = `https://${RAPIDAPI_HOST}/query?function=${API_FUNCTIONS.STOCK.QUOTE}&symbol=${encodeURIComponent(symbol)}`;
    
    const quoteResponse = await fetch(quoteUrl, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    
    if (!quoteResponse.ok) {
      console.error(`API responded with status: ${quoteResponse.status}`);
      throw new Error(`API responded with status: ${quoteResponse.status}`);
    }
    
    const quoteData = await quoteResponse.json();
    console.log('Quote data response:', JSON.stringify(quoteData));
    
    if (!quoteData || !quoteData['Global Quote']) {
      console.error('Invalid quote data format received');
      return simulateStockQuote(symbol);
    }
    
    const quote = quoteData['Global Quote'];
    
    // Then fetch daily time series data for more historical context
    const dailyUrl = `https://${RAPIDAPI_HOST}/query?function=${API_FUNCTIONS.STOCK.DAILY}&symbol=${encodeURIComponent(symbol)}&outputsize=compact&datatype=json`;
    
    const dailyResponse = await fetch(dailyUrl, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });
    
    let historicalData = null;
    
    if (dailyResponse.ok) {
      const dailyData = await dailyResponse.json();
      console.log('Daily time series data received');
      
      if (dailyData && dailyData['Time Series (Daily)']) {
        historicalData = dailyData['Time Series (Daily)'];
      }
    } else {
      console.warn(`Could not fetch historical data, status: ${dailyResponse.status}`);
    }
    
    // Calculate trading volume from historical data if available
    let tradedVolume = 0;
    if (historicalData) {
      const dates = Object.keys(historicalData);
      if (dates.length > 0) {
        const latestDate = dates[0];
        tradedVolume = parseInt(historicalData[latestDate]['5. volume']) || 0;
      }
    }
    
    // Format to match our application's expected structure
    const result = {
      info: {
        symbol: symbol,
        companyName: getCompanyName(symbol),
        industry: 'Various',
        series: 'EQ'
      },
      priceInfo: {
        lastPrice: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0, 
        pChange: parseFloat(quote['10. change percent'].replace('%', '')) || 0,
        open: parseFloat(quote['02. open']) || 0,
        close: parseFloat(quote['05. price']) || 0, // Using current price as close
        previousClose: parseFloat(quote['08. previous close']) || 0,
        intraDayHighLow: {
          min: parseFloat(quote['04. low']) || 0,
          max: parseFloat(quote['03. high']) || 0
        }
      },
      securityInfo: {
        tradedVolume: parseInt(quote['06. volume']) || tradedVolume || 0
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
