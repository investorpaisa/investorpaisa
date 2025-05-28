
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Cost optimization: Check for recent articles to avoid duplicates
const checkRecentArticles = async (category: string, hoursBack = 6) => {
  const cutoffTime = new Date(Date.now() - (hoursBack * 60 * 60 * 1000)).toISOString();
  
  const { data, error } = await supabase
    .from('news_articles')
    .select('title')
    .eq('category', category)
    .gte('published_at', cutoffTime);
    
  return data?.map(article => article.title.toLowerCase()) || [];
};

// Generate multiple articles in one API call to reduce costs
const generateBatchArticles = async (topic: string, category: string, count: number) => {
  const prompt = `Generate ${count} distinct and realistic financial news articles about "${topic}". 

For each article, provide the following format:
---ARTICLE START---
TITLE: [Compelling news headline]
SUMMARY: [2-3 sentence summary]
CONTENT: [3-4 paragraph detailed article with current insights]
SOURCE: [Realistic financial news source like Reuters, Bloomberg, Financial Times, etc.]
---ARTICLE END---

Make each article unique and focused on different aspects of ${topic}. Include current market trends, expert opinions, and relevant data points. Ensure professional journalistic tone.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topP: 0.9,
          maxOutputTokens: 4000
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

// Parse batch response into individual articles
const parseBatchArticles = (batchContent: string, category: string) => {
  const articles = [];
  const articleBlocks = batchContent.split('---ARTICLE START---').slice(1);
  
  for (let i = 0; i < articleBlocks.length; i++) {
    const block = articleBlocks[i].split('---ARTICLE END---')[0];
    if (!block.trim()) continue;
    
    const lines = block.split('\n').filter(line => line.trim());
    let title = '', summary = '', content = '', source = '';
    let currentSection = '';
    
    for (const line of lines) {
      if (line.startsWith('TITLE:')) {
        title = line.replace('TITLE:', '').trim();
        currentSection = 'title';
      } else if (line.startsWith('SUMMARY:')) {
        summary = line.replace('SUMMARY:', '').trim();
        currentSection = 'summary';
      } else if (line.startsWith('CONTENT:')) {
        content = line.replace('CONTENT:', '').trim();
        currentSection = 'content';
      } else if (line.startsWith('SOURCE:')) {
        source = line.replace('SOURCE:', '').trim();
        currentSection = 'source';
      } else if (line.trim() && currentSection) {
        if (currentSection === 'summary' && summary) {
          summary += ' ' + line.trim();
        } else if (currentSection === 'content' && content) {
          content += ' ' + line.trim();
        }
      }
    }
    
    if (title && summary && source) {
      articles.push({
        id: `gemini-batch-${Date.now()}-${i}`,
        title: title,
        summary: summary,
        content: content || summary,
        url: `https://example.com/article/${Date.now()}-${i}`,
        source: source,
        category: category,
        published_at: new Date().toISOString(),
        thumbnail_url: `https://placehold.co/600x400?text=${encodeURIComponent(category)}+News`,
        relevance_score: 80 + Math.floor(Math.random() * 15)
      });
    }
  }
  
  return articles;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic = 'financial news', limit = 5, category = 'Business' } = await req.json();

    console.log(`Cost-optimized crawling for topic: ${topic}, limit: ${limit}, category: ${category}`);

    // Check for recent articles to avoid duplicates (cost optimization)
    const recentTitles = await checkRecentArticles(category);
    console.log(`Found ${recentTitles.length} recent articles in ${category}`);

    // Limit the actual generation based on recent content
    const maxGenerate = Math.min(limit, 8); // Cap at 8 to control costs
    const actualLimit = recentTitles.length > 5 ? Math.max(1, Math.floor(maxGenerate / 2)) : maxGenerate;

    console.log(`Generating ${actualLimit} articles to optimize costs`);

    // Single API call to generate multiple articles
    const batchContent = await generateBatchArticles(topic, category, actualLimit);
    const articles = parseBatchArticles(batchContent, category);

    console.log(`Parsed ${articles.length} articles from batch response`);

    // Filter out potential duplicates based on title similarity
    const filteredArticles = articles.filter(article => {
      const titleLower = article.title.toLowerCase();
      return !recentTitles.some(recentTitle => 
        titleLower.includes(recentTitle) || recentTitle.includes(titleLower)
      );
    });

    console.log(`${filteredArticles.length} articles after duplicate filtering`);

    // Batch insert to database for efficiency
    if (filteredArticles.length > 0) {
      const { error: insertError } = await supabase
        .from('news_articles')
        .insert(filteredArticles);

      if (insertError) {
        console.error('Error batch inserting articles:', insertError);
      } else {
        console.log(`Successfully batch inserted ${filteredArticles.length} articles`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      articles: filteredArticles,
      message: `Successfully generated ${filteredArticles.length} articles with cost optimization`,
      costOptimizations: {
        apiCallsUsed: 1,
        duplicatesFiltered: articles.length - filteredArticles.length,
        recentArticlesFound: recentTitles.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in cost-optimized gemini-article-crawler:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
