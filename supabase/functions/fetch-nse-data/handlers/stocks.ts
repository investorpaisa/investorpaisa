
// Handler for stock quotes endpoint
import { RAPIDAPI_HOST, RAPIDAPI_KEY } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";
import { getCompanyName } from "../utils/helpers.ts";
import { simulateStockQuote } from "../utils/mockData.ts";

export async function getStocks(req: Request, symbol: string = 'RELIANCE') {
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
