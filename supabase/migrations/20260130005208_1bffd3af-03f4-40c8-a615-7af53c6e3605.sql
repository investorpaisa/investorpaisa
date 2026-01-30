-- Fix security warnings: update functions with proper search_path and fix permissive policies

-- Fix update_updated_at function with proper search_path
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON public.answers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_live_sessions_updated_at BEFORE UPDATE ON public.live_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_expert_profiles_updated_at BEFORE UPDATE ON public.expert_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Fix permissive RLS policies
-- 1. Conversations - require authenticated user to create
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Authenticated users can create conversations" ON public.conversations 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Events - require authenticated user
DROP POLICY IF EXISTS "Users can insert events" ON public.events;
CREATE POLICY "Authenticated users can insert events" ON public.events 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. AI Requests - require authenticated user
DROP POLICY IF EXISTS "System can insert ai requests" ON public.ai_requests;
CREATE POLICY "Authenticated users can insert ai requests" ON public.ai_requests 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);