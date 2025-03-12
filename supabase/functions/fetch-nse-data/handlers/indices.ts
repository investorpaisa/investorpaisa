
import { RAPIDAPI_HOST, RAPIDAPI_KEY, ALPHA_VANTAGE_API_KEY } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function getIndices(req: Request, indexName: string = 'NIFTY 50') {
  try {
    console.log(`Fetching index data for ${indexName}`);
    
    // Format symbol for API request (e.g., ^NSEI for Nifty 50)
    const symbol = indexName === 'NIFTY 50' ? '^NSEI' : 
                  indexName === 'NIFTY BANK' ? '^NSEBANK' : 
                  indexName === 'NIFTY IT' ? '^CNXIT' : indexName;
    
    // Direct Alpha Vantage API call
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log(`Requesting from URL: ${url}`);
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw Alpha Vantage response:', data);

    if (!data || !data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      throw new Error('Invalid data format received from API');
    }

    const quote = data['Global Quote'];
    
    // Format response to match our application's structure
    const result = {
      name: indexName,
      lastPrice: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      pChange: parseFloat(quote['10. change percent'].replace('%', '')),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      previousClose: parseFloat(quote['08. previous close']),
      timestamp: new Date().toISOString()
    };

    console.log('Formatted result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error in getIndices for ${indexName}:`, error);
    return new Response(
      JSON.stringify({ error: `Failed to fetch index data: ${error.message}` }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
}
