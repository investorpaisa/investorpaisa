
import { RAPIDAPI_HOST, RAPIDAPI_KEY } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function getIndices(req: Request, indexName: string = 'NIFTY 50') {
  try {
    console.log(`Fetching index data for ${indexName}`);
    
    // Format index name for API request
    const symbol = indexName.replace(' ', '%20');
    
    const response = await fetch(`https://${RAPIDAPI_HOST}/query?function=GLOBAL_QUOTE&symbol=${symbol}`, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);

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

    console.log('Formatted response:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error in getIndices for ${indexName}:`, error);
    // Return error response
    return new Response(
      JSON.stringify({ error: `Failed to fetch index data: ${error.message}` }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
}
