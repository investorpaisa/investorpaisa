
// Handler for top gainers and losers endpoints
import { RAPIDAPI_HOST, RAPIDAPI_KEY } from "../utils/config.ts";
import { corsHeaders } from "../utils/cors.ts";
import { simulateGainersLosers } from "../utils/mockData.ts";

export async function getTopGainers(req: Request) {
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

export async function getTopLosers(req: Request) {
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
