
-- Create a comprehensive user interactions system
-- First, let's ensure we have proper post management
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS hashtags TEXT[];
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';

-- Update likes table to ensure proper relationships
ALTER TABLE public.likes ADD COLUMN IF NOT EXISTS liked_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update comments table structure
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- Create shares/reposts table if not exists
CREATE TABLE IF NOT EXISTS public.reposts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  content TEXT, -- Optional commentary when reposting
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Enable RLS on reposts
ALTER TABLE public.reposts ENABLE ROW LEVEL SECURITY;

-- Policies for reposts
CREATE POLICY "Reposts are viewable by everyone" 
  ON public.reposts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create reposts" 
  ON public.reposts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reposts" 
  ON public.reposts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create user activity feed table to track all interactions
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL, -- 'like', 'comment', 'repost', 'post'
  target_id UUID NOT NULL, -- post_id or comment_id
  target_type TEXT NOT NULL, -- 'post' or 'comment'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user activities
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Policies for user activities
CREATE POLICY "Users can view their own activities" 
  ON public.user_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
  ON public.user_activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add search functionality for profiles
CREATE TABLE IF NOT EXISTS public.user_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  search_query TEXT NOT NULL,
  search_type TEXT DEFAULT 'general', -- 'general', 'people', 'posts', 'companies'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user searches
ALTER TABLE public.user_searches ENABLE ROW LEVEL SECURITY;

-- Policies for user searches
CREATE POLICY "Users can manage their own searches" 
  ON public.user_searches 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create functions to increment/decrement post engagement metrics
CREATE OR REPLACE FUNCTION public.increment_reposts(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts
  SET comment_count = comment_count + 1  -- We'll use comment_count field for reposts temporarily
  WHERE id = post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_reposts(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts
  SET comment_count = GREATEST(0, comment_count - 1)
  WHERE id = post_id;
END;
$$;

-- Update profiles table to include search-friendly fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- Create search index
CREATE INDEX IF NOT EXISTS profiles_search_idx ON public.profiles USING GIN(search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION public.update_profile_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.full_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.headline, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.industry, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector updates
DROP TRIGGER IF EXISTS profiles_search_vector_update ON public.profiles;
CREATE TRIGGER profiles_search_vector_update
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_search_vector();
