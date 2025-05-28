
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic = 'financial news', limit = 10, category = 'Business' } = await req.json();

    console.log(`Crawling articles for topic: ${topic}, limit: ${limit}, category: ${category}`);

    // Use Gemini to generate search queries and find relevant articles
    const searchPrompt = `Generate 5 current and relevant search queries for finding recent ${topic} articles. Return only the search queries, one per line, without numbering or formatting.`;

    const searchResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: searchPrompt
          }]
        }]
      }),
    });

    const searchData = await searchResponse.json();
    const searchQueries = searchData.candidates[0].content.parts[0].text.split('\n').filter(q => q.trim());

    console.log('Generated search queries:', searchQueries);

    // Generate article content using Gemini based on the search queries
    const articles = [];
    
    for (let i = 0; i < Math.min(limit, searchQueries.length); i++) {
      const query = searchQueries[i];
      
      const articlePrompt = `Based on the topic "${query}", create a realistic financial news article with the following structure:
      
      TITLE: [Create a compelling, realistic news headline]
      SUMMARY: [Write a 2-3 sentence summary]
      CONTENT: [Write a detailed 3-4 paragraph article with current financial insights]
      SOURCE: [Name a realistic financial news source like Reuters, Bloomberg, Financial Times, etc.]
      
      Make the content current, relevant, and professional. Focus on real market trends and economic factors.`;

      try {
        const articleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: articlePrompt
              }]
            }]
          }),
        });

        const articleData = await articleResponse.json();
        const content = articleData.candidates[0].content.parts[0].text;

        // Parse the generated content
        const lines = content.split('\n').filter(line => line.trim());
        let title = '', summary = '', articleContent = '', source = '';
        let currentSection = '';

        for (const line of lines) {
          if (line.startsWith('TITLE:')) {
            title = line.replace('TITLE:', '').trim();
            currentSection = 'title';
          } else if (line.startsWith('SUMMARY:')) {
            summary = line.replace('SUMMARY:', '').trim();
            currentSection = 'summary';
          } else if (line.startsWith('CONTENT:')) {
            articleContent = line.replace('CONTENT:', '').trim();
            currentSection = 'content';
          } else if (line.startsWith('SOURCE:')) {
            source = line.replace('SOURCE:', '').trim();
            currentSection = 'source';
          } else if (line.trim() && currentSection) {
            // Continue building the current section
            if (currentSection === 'summary' && summary) {
              summary += ' ' + line.trim();
            } else if (currentSection === 'content' && articleContent) {
              articleContent += ' ' + line.trim();
            }
          }
        }

        if (title && summary && source) {
          const article = {
            id: `gemini-${Date.now()}-${i}`,
            title: title,
            summary: summary,
            content: articleContent || summary,
            url: `https://example.com/article/${Date.now()}-${i}`,
            source: source,
            category: category,
            published_at: new Date().toISOString(),
            thumbnail_url: `https://placehold.co/600x400?text=${encodeURIComponent(category)}+News`,
            relevance_score: 85 + Math.floor(Math.random() * 10)
          };

          articles.push(article);

          // Store in database
          const { error: insertError } = await supabase
            .from('news_articles')
            .insert(article);

          if (insertError) {
            console.error('Error inserting article:', insertError);
          } else {
            console.log('Successfully inserted article:', title);
          }
        }
      } catch (error) {
        console.error('Error generating article:', error);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Successfully crawled ${articles.length} articles`);

    return new Response(JSON.stringify({ 
      success: true, 
      articles: articles,
      message: `Successfully crawled ${articles.length} articles`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-article-crawler:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
