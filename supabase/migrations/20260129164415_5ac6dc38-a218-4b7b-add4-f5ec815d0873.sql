-- =============================================
-- INVESTORPAISA COMPLETE DATABASE SCHEMA
-- Greenfield rebuild with all 20+ domains
-- =============================================

-- ===================
-- 1. ENUMS
-- ===================
CREATE TYPE public.user_role AS ENUM ('learner', 'creator', 'expert', 'admin');
CREATE TYPE public.trust_level AS ENUM ('newbie', 'member', 'trusted', 'expert', 'legend');
CREATE TYPE public.verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE public.post_type AS ENUM ('question', 'tip', 'thread', 'video', 'poll', 'link_converted', 'insight');
CREATE TYPE public.reaction_type AS ENUM ('like', 'upvote', 'downvote', 'save');
CREATE TYPE public.notification_type AS ENUM ('like', 'comment', 'follow', 'mention', 'answer', 'system', 'live_session', 'badge');
CREATE TYPE public.session_status AS ENUM ('scheduled', 'live', 'ended', 'cancelled');
CREATE TYPE public.message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE public.trust_event_type AS ENUM ('post_created', 'answer_accepted', 'upvote_received', 'downvote_received', 'report_received', 'verified', 'badge_earned');
CREATE TYPE public.moderation_status AS ENUM ('pending', 'approved', 'quarantined', 'rejected');

-- ===================
-- 2. USER ROLES TABLE (Secure role management)
-- ===================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'learner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ===================
-- 3. PROFILES TABLE
-- ===================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  bio TEXT,
  headline TEXT,
  language TEXT DEFAULT 'en',
  location TEXT,
  website TEXT,
  goals TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  trust_level trust_level DEFAULT 'newbie',
  trust_score INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  is_expert BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  portfolio_value DECIMAL(15,2),
  portfolio_change DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===================
-- 4. AUTH PROVIDERS TABLE (For multiple auth methods)
-- ===================
CREATE TABLE public.auth_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'google', 'email', 'phone', 'guest'
  provider_id TEXT,
  email TEXT,
  phone TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_id)
);
ALTER TABLE public.auth_providers ENABLE ROW LEVEL SECURITY;

-- ===================
-- 5. DEVICE SESSIONS TABLE
-- ===================
CREATE TABLE public.device_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_name TEXT,
  device_type TEXT,
  ip_address INET,
  user_agent TEXT,
  refresh_token_hash TEXT,
  last_active_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;

-- ===================
-- 6. TOPICS TABLE
-- ===================
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  post_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  is_trending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- ===================
-- 7. TAGS TABLE
-- ===================
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 0,
  is_trending BOOLEAN DEFAULT FALSE,
  weekly_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- ===================
-- 8. POSTS TABLE
-- ===================
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type post_type NOT NULL DEFAULT 'insight',
  title TEXT,
  body TEXT,
  body_html TEXT,
  media_urls TEXT[] DEFAULT '{}',
  link_url TEXT,
  link_preview JSONB,
  poll_data JSONB,
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_rewritten BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  upvote_count INTEGER DEFAULT 0,
  downvote_count INTEGER DEFAULT 0,
  moderation_status moderation_status DEFAULT 'approved',
  moderation_score DECIMAL(3,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- ===================
-- 9. POST TOPICS (Many-to-Many)
-- ===================
CREATE TABLE public.post_topics (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, topic_id)
);
ALTER TABLE public.post_topics ENABLE ROW LEVEL SECURITY;

-- ===================
-- 10. POST TAGS (Many-to-Many)
-- ===================
CREATE TABLE public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- ===================
-- 11. ANSWERS TABLE
-- ===================
CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body_simple TEXT,
  body_detailed TEXT,
  body_steps JSONB,
  ai_generated BOOLEAN DEFAULT FALSE,
  upvote_count INTEGER DEFAULT 0,
  downvote_count INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  moderation_status moderation_status DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- ===================
-- 12. COMMENTS TABLE (Nested 1 level)
-- ===================
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'post', 'answer'
  entity_id UUID NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  moderation_status moderation_status DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ===================
-- 13. REACTIONS TABLE (Generic)
-- ===================
CREATE TABLE public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'post', 'answer', 'comment'
  entity_id UUID NOT NULL,
  reaction_type reaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id, reaction_type)
);
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- ===================
-- 14. BOOKMARKS TABLE
-- ===================
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'post', 'answer'
  entity_id UUID NOT NULL,
  collection_name TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- ===================
-- 15. FOLLOWS TABLE (Social Graph)
-- ===================
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- ===================
-- 16. TOPIC FOLLOWS
-- ===================
CREATE TABLE public.topic_follows (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, topic_id)
);
ALTER TABLE public.topic_follows ENABLE ROW LEVEL SECURITY;

-- ===================
-- 17. TRUST EVENTS TABLE
-- ===================
CREATE TABLE public.trust_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type trust_event_type NOT NULL,
  delta INTEGER NOT NULL,
  reason TEXT,
  reference_id UUID,
  reference_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trust_events ENABLE ROW LEVEL SECURITY;

-- ===================
-- 18. EXPERT PROFILES TABLE
-- ===================
CREATE TABLE public.expert_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  credentials TEXT,
  license_id TEXT,
  license_verified BOOLEAN DEFAULT FALSE,
  verification_status verification_status DEFAULT 'unverified',
  specializations TEXT[] DEFAULT '{}',
  years_experience INTEGER,
  firm_name TEXT,
  sebi_registered BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2,1) DEFAULT 0,
  session_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;

-- ===================
-- 19. LIVE SESSIONS TABLE
-- ===================
CREATE TABLE public.live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status session_status DEFAULT 'scheduled',
  max_participants INTEGER DEFAULT 100,
  participant_count INTEGER DEFAULT 0,
  topics TEXT[] DEFAULT '{}',
  is_free BOOLEAN DEFAULT TRUE,
  price DECIMAL(10,2),
  recording_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

-- ===================
-- 20. SESSION PARTICIPANTS
-- ===================
CREATE TABLE public.session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  left_at TIMESTAMPTZ,
  UNIQUE(session_id, user_id)
);
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;

-- ===================
-- 21. CONVERSATIONS TABLE
-- ===================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_group BOOLEAN DEFAULT FALSE,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- ===================
-- 22. CONVERSATION PARTICIPANTS
-- ===================
CREATE TABLE public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ,
  is_muted BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- ===================
-- 23. MESSAGES TABLE
-- ===================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT,
  media_urls TEXT[] DEFAULT '{}',
  status message_status DEFAULT 'sent',
  reply_to_id UUID REFERENCES public.messages(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ===================
-- 24. NOTIFICATIONS TABLE
-- ===================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT,
  body TEXT,
  payload JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  actor_id UUID REFERENCES auth.users(id),
  entity_type TEXT,
  entity_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ===================
-- 25. EVENTS TABLE (Analytics)
-- ===================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  entity_type TEXT,
  entity_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- ===================
-- 26. SEARCH HISTORY
-- ===================
CREATE TABLE public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  result_count INTEGER DEFAULT 0,
  clicked_result_id UUID,
  clicked_result_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- ===================
-- 27. AI REQUESTS TABLE (Cost tracking)
-- ===================
CREATE TABLE public.ai_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  request_type TEXT NOT NULL, -- 'question_rewrite', 'answer_generate', 'summarize', 'moderate'
  model TEXT NOT NULL,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  latency_ms INTEGER,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;

-- ===================
-- 28. CONTENT MODERATION QUEUE
-- ===================
CREATE TABLE public.moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  risk_score DECIMAL(3,2),
  risk_reasons TEXT[] DEFAULT '{}',
  ai_decision moderation_status,
  human_decision moderation_status,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;

-- ===================
-- 29. REFERRALS TABLE
-- ===================
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'rewarded'
  reward_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- ===================
-- 30. BADGES TABLE
-- ===================
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  points INTEGER DEFAULT 0,
  criteria JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- ===================
-- 31. USER BADGES
-- ===================
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- ===================
-- 32. STORAGE BUCKET FOR UPLOADS
-- ===================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('covers', 'covers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('posts', 'posts', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']);

-- ===================
-- RLS POLICIES
-- ===================

-- PROFILES: Anyone can read, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- USER ROLES: Only admin or self can read
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- AUTH PROVIDERS: Users can manage their own
CREATE POLICY "Users can view own providers" ON public.auth_providers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own providers" ON public.auth_providers FOR ALL USING (auth.uid() = user_id);

-- DEVICE SESSIONS: Users can manage their own
CREATE POLICY "Users can view own sessions" ON public.device_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON public.device_sessions FOR ALL USING (auth.uid() = user_id);

-- TOPICS: Public read
CREATE POLICY "Topics are viewable by everyone" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Admins can manage topics" ON public.topics FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- TAGS: Public read
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);

-- POSTS: Public read, authors can manage their own
CREATE POLICY "Published posts are viewable" ON public.posts FOR SELECT USING (deleted_at IS NULL AND moderation_status != 'rejected');
CREATE POLICY "Users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- POST TOPICS/TAGS: Public read
CREATE POLICY "Post topics viewable" ON public.post_topics FOR SELECT USING (true);
CREATE POLICY "Post tags viewable" ON public.post_tags FOR SELECT USING (true);
CREATE POLICY "Authors can manage post topics" ON public.post_topics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND author_id = auth.uid())
);
CREATE POLICY "Authors can manage post tags" ON public.post_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND author_id = auth.uid())
);

-- ANSWERS: Public read, authors can manage
CREATE POLICY "Answers are viewable" ON public.answers FOR SELECT USING (moderation_status != 'rejected');
CREATE POLICY "Users can create answers" ON public.answers FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own answers" ON public.answers FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own answers" ON public.answers FOR DELETE USING (auth.uid() = author_id);

-- COMMENTS: Public read, authors can manage
CREATE POLICY "Comments are viewable" ON public.comments FOR SELECT USING (deleted_at IS NULL AND moderation_status != 'rejected');
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- REACTIONS: Public read, users can manage own
CREATE POLICY "Reactions are viewable" ON public.reactions FOR SELECT USING (true);
CREATE POLICY "Users can manage own reactions" ON public.reactions FOR ALL USING (auth.uid() = user_id);

-- BOOKMARKS: Private to user
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- FOLLOWS: Public read, users can manage own
CREATE POLICY "Follows are viewable" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows" ON public.follows FOR ALL USING (auth.uid() = follower_id);

-- TOPIC FOLLOWS: Users can manage own
CREATE POLICY "Topic follows viewable" ON public.topic_follows FOR SELECT USING (true);
CREATE POLICY "Users can manage topic follows" ON public.topic_follows FOR ALL USING (auth.uid() = user_id);

-- TRUST EVENTS: Private to user and admins
CREATE POLICY "Users can view own trust events" ON public.trust_events FOR SELECT USING (auth.uid() = user_id);

-- EXPERT PROFILES: Public read
CREATE POLICY "Expert profiles are viewable" ON public.expert_profiles FOR SELECT USING (true);
CREATE POLICY "Experts can update own profile" ON public.expert_profiles FOR UPDATE USING (auth.uid() = user_id);

-- LIVE SESSIONS: Public read
CREATE POLICY "Live sessions are viewable" ON public.live_sessions FOR SELECT USING (true);
CREATE POLICY "Experts can manage own sessions" ON public.live_sessions FOR ALL USING (auth.uid() = expert_id);

-- SESSION PARTICIPANTS: Participants can view
CREATE POLICY "Participants can view" ON public.session_participants FOR SELECT USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM public.live_sessions WHERE id = session_id AND expert_id = auth.uid()
));
CREATE POLICY "Users can join sessions" ON public.session_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CONVERSATIONS: Participants only
CREATE POLICY "Participants can view conversations" ON public.conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid())
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (true);

-- CONVERSATION PARTICIPANTS
CREATE POLICY "View own participations" ON public.conversation_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Manage own participations" ON public.conversation_participants FOR ALL USING (auth.uid() = user_id);

-- MESSAGES: Conversation participants only
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Senders can update own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id);

-- NOTIFICATIONS: Private to user
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- EVENTS: Insert only for authenticated
CREATE POLICY "Users can insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own events" ON public.events FOR SELECT USING (auth.uid() = user_id);

-- SEARCH HISTORY: Private to user
CREATE POLICY "Users can view own search history" ON public.search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own search history" ON public.search_history FOR ALL USING (auth.uid() = user_id);

-- AI REQUESTS: Private to user
CREATE POLICY "Users can view own ai requests" ON public.ai_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert ai requests" ON public.ai_requests FOR INSERT WITH CHECK (true);

-- MODERATION QUEUE: Admins only
CREATE POLICY "Admins can view moderation queue" ON public.moderation_queue FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- REFERRALS: Users can view own
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can create referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- BADGES: Public read
CREATE POLICY "Badges are viewable" ON public.badges FOR SELECT USING (true);

-- USER BADGES: Public read
CREATE POLICY "User badges are viewable" ON public.user_badges FOR SELECT USING (true);

-- STORAGE POLICIES
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Cover images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "Users can upload their own cover" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own cover" ON storage.objects FOR UPDATE USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Post media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'posts');
CREATE POLICY "Users can upload post media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own post media" ON storage.objects FOR UPDATE USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own post media" ON storage.objects FOR DELETE USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ===================
-- TRIGGERS
-- ===================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'learner');
  
  -- Generate referral code
  INSERT INTO public.referrals (referrer_id, referral_code)
  VALUES (NEW.id, UPPER(SUBSTRING(MD5(NEW.id::text) FROM 1 FOR 8)));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update profile counts on follow
CREATE OR REPLACE FUNCTION public.handle_follow_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    
    -- Create notification
    INSERT INTO public.notifications (user_id, type, actor_id, entity_type, entity_id)
    VALUES (NEW.following_id, 'follow', NEW.follower_id, 'user', NEW.follower_id);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
    UPDATE public.profiles SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = OLD.following_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.handle_follow_change();

-- Update post counts on post creation
CREATE OR REPLACE FUNCTION public.handle_post_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET posts_count = posts_count + 1 WHERE id = NEW.author_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET posts_count = GREATEST(posts_count - 1, 0) WHERE id = OLD.author_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_post_change
  AFTER INSERT OR DELETE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_change();

-- Update reaction counts
CREATE OR REPLACE FUNCTION public.handle_reaction_change()
RETURNS TRIGGER AS $$
DECLARE
  delta INTEGER;
  col_name TEXT;
BEGIN
  delta := CASE WHEN TG_OP = 'DELETE' THEN -1 ELSE 1 END;
  
  IF COALESCE(NEW.entity_type, OLD.entity_type) = 'post' THEN
    col_name := CASE COALESCE(NEW.reaction_type, OLD.reaction_type)
      WHEN 'like' THEN 'like_count'
      WHEN 'upvote' THEN 'upvote_count'
      WHEN 'downvote' THEN 'downvote_count'
      WHEN 'save' THEN 'save_count'
    END;
    
    EXECUTE format('UPDATE public.posts SET %I = GREATEST(%I + $1, 0) WHERE id = $2', col_name, col_name)
    USING delta, COALESCE(NEW.entity_id, OLD.entity_id);
  ELSIF COALESCE(NEW.entity_type, OLD.entity_type) = 'answer' THEN
    col_name := CASE COALESCE(NEW.reaction_type, OLD.reaction_type)
      WHEN 'upvote' THEN 'upvote_count'
      WHEN 'downvote' THEN 'downvote_count'
    END;
    
    IF col_name IS NOT NULL THEN
      EXECUTE format('UPDATE public.answers SET %I = GREATEST(%I + $1, 0) WHERE id = $2', col_name, col_name)
      USING delta, COALESCE(NEW.entity_id, OLD.entity_id);
    END IF;
  ELSIF COALESCE(NEW.entity_type, OLD.entity_type) = 'comment' THEN
    UPDATE public.comments SET like_count = GREATEST(like_count + delta, 0) 
    WHERE id = COALESCE(NEW.entity_id, OLD.entity_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_reaction_change
  AFTER INSERT OR DELETE ON public.reactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_reaction_change();

-- Update comment counts
CREATE OR REPLACE FUNCTION public.handle_comment_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.entity_type = 'post' THEN
    UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.entity_id;
  ELSIF TG_OP = 'DELETE' AND OLD.entity_type = 'post' THEN
    UPDATE public.posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.entity_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_change();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON public.answers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_live_sessions_updated_at BEFORE UPDATE ON public.live_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_expert_profiles_updated_at BEFORE UPDATE ON public.expert_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ===================
-- INDEXES FOR PERFORMANCE
-- ===================
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_type ON public.posts(type);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_trending ON public.posts(like_count DESC, comment_count DESC) WHERE deleted_at IS NULL;

CREATE INDEX idx_answers_post ON public.answers(post_id);
CREATE INDEX idx_answers_author ON public.answers(author_id);

CREATE INDEX idx_comments_entity ON public.comments(entity_type, entity_id);
CREATE INDEX idx_comments_author ON public.comments(author_id);

CREATE INDEX idx_reactions_entity ON public.reactions(entity_type, entity_id);
CREATE INDEX idx_reactions_user ON public.reactions(user_id);

CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE is_read = FALSE;

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);

CREATE INDEX idx_events_user ON public.events(user_id, created_at DESC);
CREATE INDEX idx_events_name ON public.events(event_name, created_at DESC);

CREATE INDEX idx_tags_trending ON public.tags(weekly_count DESC) WHERE is_trending = TRUE;
CREATE INDEX idx_topics_trending ON public.topics(post_count DESC) WHERE is_trending = TRUE;

CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_search ON public.profiles USING gin(to_tsvector('english', COALESCE(full_name, '') || ' ' || COALESCE(username, '') || ' ' || COALESCE(bio, '')));