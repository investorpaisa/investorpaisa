
-- Add RLS policies for circles table
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to select public circles
CREATE POLICY "Anyone can view public circles" 
ON public.circles 
FOR SELECT 
USING (type = 'public' OR EXISTS (
  SELECT 1 FROM circle_members WHERE circle_id = id AND user_id = auth.uid()
));

-- Allow authenticated users to insert circles 
CREATE POLICY "Users can create circles" 
ON public.circles 
FOR INSERT 
TO authenticated 
WITH CHECK (created_by = auth.uid());

-- Allow circle admins to update their circles
CREATE POLICY "Admins can update their circles" 
ON public.circles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM circle_members 
    WHERE circle_id = id AND user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow circle admins to delete their circles
CREATE POLICY "Admins can delete their circles" 
ON public.circles 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM circle_members 
    WHERE circle_id = id AND user_id = auth.uid() AND role = 'admin'
  )
);

-- Add RLS policies for circle_members table
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

-- Allow anyone to see members of public circles
CREATE POLICY "Anyone can view members of public circles" 
ON public.circle_members 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM circles WHERE id = circle_id AND type = 'public'
  ) OR EXISTS (
    SELECT 1 FROM circle_members WHERE circle_id = circle_id AND user_id = auth.uid()
  )
);

-- Allow authenticated users to join public circles
CREATE POLICY "Users can join public circles" 
ON public.circle_members 
FOR INSERT 
TO authenticated 
WITH CHECK (
  user_id = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM circles WHERE id = circle_id AND type = 'public'
  )
);

-- Allow circle admins to add members to private circles
CREATE POLICY "Admins can add members to private circles" 
ON public.circle_members 
FOR INSERT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM circle_members 
    WHERE circle_id = circle_id AND user_id = auth.uid() 
    AND (role = 'admin' OR role = 'co-admin')
  )
);

-- Allow users to leave circles (delete own membership)
CREATE POLICY "Users can leave circles" 
ON public.circle_members 
FOR DELETE 
USING (user_id = auth.uid());

-- Allow admins to remove members
CREATE POLICY "Admins can remove members" 
ON public.circle_members 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM circle_members 
    WHERE circle_id = circle_id AND user_id = auth.uid() 
    AND (role = 'admin' OR role = 'co-admin')
  )
);

-- Add RLS policies for circle_posts table
ALTER TABLE public.circle_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view posts in public circles
CREATE POLICY "Anyone can view posts in public circles" 
ON public.circle_posts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM circles WHERE id = circle_id AND type = 'public'
  ) OR EXISTS (
    SELECT 1 FROM circle_members WHERE circle_id = circle_id AND user_id = auth.uid()
  )
);

-- Circle members can add posts to circles
CREATE POLICY "Members can add posts to circles" 
ON public.circle_posts 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM circle_members WHERE circle_id = circle_id AND user_id = auth.uid()
  )
);

-- Post authors can remove their posts from circles
CREATE POLICY "Authors can remove their posts" 
ON public.circle_posts 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM posts WHERE id = post_id AND user_id = auth.uid()
  )
);

-- Admins can remove any posts from their circles
CREATE POLICY "Admins can remove any posts" 
ON public.circle_posts 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM circle_members 
    WHERE circle_id = circle_id AND user_id = auth.uid() 
    AND (role = 'admin' OR role = 'co-admin')
  )
);

-- Admins can update posts (e.g., pin status)
CREATE POLICY "Admins can update posts" 
ON public.circle_posts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM circle_members 
    WHERE circle_id = circle_id AND user_id = auth.uid() 
    AND (role = 'admin' OR role = 'co-admin')
  )
);

-- Add RLS policies for bookmarks table
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON public.bookmarks 
FOR SELECT 
USING (user_id = auth.uid());

-- Users can create their own bookmarks
CREATE POLICY "Users can create their own bookmarks" 
ON public.bookmarks 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" 
ON public.bookmarks 
FOR DELETE 
USING (user_id = auth.uid());

-- Add RLS policies for post_shares table
ALTER TABLE public.post_shares ENABLE ROW LEVEL SECURITY;

-- Users can view shares that are public or directed to them
CREATE POLICY "Users can view public shares or shares directed to them" 
ON public.post_shares 
FOR SELECT 
USING (
  share_type = 'public' OR 
  user_id = auth.uid() OR 
  (share_type = 'user' AND target_id = auth.uid()) OR
  (share_type = 'circle' AND EXISTS (
    SELECT 1 FROM circle_members WHERE circle_id = target_id AND user_id = auth.uid()
  ))
);

-- Users can create their own shares
CREATE POLICY "Users can create their own shares" 
ON public.post_shares 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Users can delete their own shares
CREATE POLICY "Users can delete their own shares" 
ON public.post_shares 
FOR DELETE 
USING (user_id = auth.uid());
