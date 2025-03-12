
import { RAPIDAPI_HOST, RAPIDAPI_KEY, ALPHA_VANTAGE_API_KEY, API_FUNCTIONS } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function getIndices(req: Request, indexName: string = 'NIFTY 50') {
  try {
    console.log(`Fetching index data for ${indexName}`);
    
    // Format symbol for API request (e.g., ^NSEI for Nifty 50)
    const symbol = indexName === 'NIFTY 50' ? '^NSEI' : 
                  indexName === 'NIFTY BANK' ? '^NSEBANK' : 
                  indexName === 'NIFTY IT' ? '^CNXIT' : indexName;
    
    // Using RapidAPI
    console.log(`Using RapidAPI to fetch data for symbol: ${symbol}`);
    
    const url = `https://alpha-vantage.p.rapidapi.com/query?function=${API_FUNCTIONS.STOCK.QUOTE}&symbol=${symbol}`;
    console.log(`Requesting from RapidAPI URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });

    if (!response.ok) {
      console.error(`RapidAPI responded with status: ${response.status}`);
      throw new Error(`RapidAPI responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw RapidAPI response:', JSON.stringify(data));

    // Check for error messages
    if (data.Note || data.Information || data.Error) {
      console.error('API error:', data.Note || data.Information || data.Error);
      throw new Error(`API error: ${data.Note || data.Information || data.Error}`);
    }

    // Basic validation of the response structure
    if (!data || !data['Global Quote']) {
      console.error('Invalid data format received, full response:', JSON.stringify(data));
      throw new Error('Invalid data format received from API');
    }
    
    const quote = data['Global Quote'];
    
    // Check if the quote object contains the expected fields
    if (!quote['05. price']) {
      console.error('Missing price data in response:', JSON.stringify(quote));
      throw new Error('Missing price data in API response');
    }
    
    // Format response to match our application's structure
    const result = {
      name: indexName,
      lastPrice: parseFloat(quote['05. price']) || 0,
      change: parseFloat(quote['09. change']) || 0,
      pChange: parseFloat(quote['10. change percent'].replace('%', '')) || 0,
      open: parseFloat(quote['02. open']) || 0,
      high: parseFloat(quote['03. high']) || 0,
      low: parseFloat(quote['04. low']) || 0,
      previousClose: parseFloat(quote['08. previous close']) || 0,
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
