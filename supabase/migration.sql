
-- Add news_articles table for storing financial news
CREATE TABLE IF NOT EXISTS public.news_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  thumbnail_url TEXT,
  relevance_score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS news_articles_category_idx ON public.news_articles(category);
CREATE INDEX IF NOT EXISTS news_articles_published_at_idx ON public.news_articles(published_at);
CREATE INDEX IF NOT EXISTS news_articles_relevance_score_idx ON public.news_articles(relevance_score);

-- Add RLS policies
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Everyone can read news articles
CREATE POLICY "Anyone can read news articles" 
  ON public.news_articles 
  FOR SELECT 
  USING (true);

-- Only authenticated users can insert news articles
CREATE POLICY "Authenticated users can insert news articles" 
  ON public.news_articles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);
