
import { RAPIDAPI_HOST, RAPIDAPI_KEY } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function getIndices(req: Request, indexName: string = 'NIFTY 50') {
  try {
    console.log(`Fetching index data for ${indexName}`);
    
    // Alpha Vantage API endpoint for real-time quote
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!apiKey) {
      throw new Error('ALPHA_VANTAGE_API_KEY not configured');
    }

    // Format symbol for API request (e.g., ^NSEI for Nifty 50)
    const symbol = indexName === 'NIFTY 50' ? '^NSEI' : indexName;
    
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw Alpha Vantage response:', data);

    if (!data || !data['Global Quote']) {
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
