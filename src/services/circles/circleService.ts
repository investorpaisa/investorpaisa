import { supabase } from '@/integrations/supabase/client';
import { Circle, CircleMember, CircleInsert, CircleUpdate, CircleRole, EnhancedPost, Profile } from '@/types';

/**
 * Create a new circle
 */
export const createCircle = async (circle: CircleInsert): Promise<Circle> => {
  const { data, error } = await supabase
    .from('circles')
    .insert({
      name: circle.name,
      type: circle.type,
      description: circle.description,
      created_by: circle.created_by,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating circle:', error);
    throw new Error(`Failed to create circle: ${error.message}`);
  }

  // Create admin membership for the creator
  await supabase
    .from('circle_members')
    .insert({
      circle_id: data.id,
      user_id: circle.created_by,
      role: CircleRole.ADMIN,
    });

  return data as Circle;
};

/**
 * Update an existing circle
 */
export const updateCircle = async (id: string, updates: CircleUpdate): Promise<Circle> => {
  const { data, error } = await supabase
    .from('circles')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating circle:', error);
    throw new Error(`Failed to update circle: ${error.message}`);
  }

  return data as Circle;
};

/**
 * Get a circle by ID
 */
export const getCircleById = async (id: string): Promise<Circle> => {
  const { data, error } = await supabase
    .from('circles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching circle:', error);
    throw new Error(`Failed to fetch circle: ${error.message}`);
  }

  return data as Circle;
};

/**
 * Get all circles with pagination
 */
export const getCircles = async (page = 1, limit = 10): Promise<Circle[]> => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('circles')
    .select('*, members:circle_members(count)')
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching circles:', error);
    throw new Error(`Failed to fetch circles: ${error.message}`);
  }

  // Convert the count to a number and add as member_count
  const circlesWithMemberCount = data.map(circle => {
    const memberCount = circle.members?.[0]?.count || 0;
    return {
      ...circle,
      member_count: memberCount
    } as Circle;
  });

  return circlesWithMemberCount;
};

/**
 * Get all circles for a specific user
 */
export const getUserCircles = async (userId: string): Promise<Circle[]> => {
  const { data, error } = await supabase
    .from('circle_members')
    .select('circle:circles(*), circle_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user circles:', error);
    throw new Error(`Failed to fetch user circles: ${error.message}`);
  }

  // Extract circles from the join query
  const circles = data.map(item => item.circle) as Circle[];
  return circles;
};

/**
 * Get public circles
 */
export const getPublicCircles = async (page = 1, limit = 10): Promise<Circle[]> => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('circles')
    .select('*, members:circle_members(count)')
    .eq('type', 'public')
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public circles:', error);
    throw new Error(`Failed to fetch public circles: ${error.message}`);
  }

  // Convert the count to a number and add as member_count
  const circlesWithMemberCount = data.map(circle => {
    const memberCount = circle.members?.[0]?.count || 0;
    return {
      ...circle,
      member_count: memberCount
    } as Circle;
  });

  return circlesWithMemberCount;
};

/**
 * Get trending circles based on member count or activity
 */
export const getTrendingCircles = async (limit = 5): Promise<Circle[]> => {
  const { data, error } = await supabase
    .from('circles')
    .select('*, members:circle_members(*)')
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching trending circles:', error);
    throw new Error(`Failed to fetch trending circles: ${error.message}`);
  }

  // Calculate member count for each circle
  const circlesWithStats = data.map(circle => {
    const memberCount = Array.isArray(circle.members) ? circle.members.length : 0;
    return {
      ...circle,
      member_count: memberCount
    } as Circle;
  });

  // Sort by member count (could also sort by recent activity)
  return circlesWithStats.sort((a, b) => 
    (b.member_count || 0) - (a.member_count || 0)
  );
};

/**
 * Search circles by name
 */
export const searchCircles = async (query: string, limit = 10): Promise<Circle[]> => {
  const { data, error } = await supabase
    .from('circles')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching circles:', error);
    throw new Error(`Failed to search circles: ${error.message}`);
  }

  return data as Circle[];
};

/**
 * Get members of a circle
 */
export const getCircleMembers = async (circleId: string): Promise<CircleMember[]> => {
  const { data, error } = await supabase
    .from('circle_members')
    .select('*, profile:profiles(*)')
    .eq('circle_id', circleId);

  if (error) {
    console.error('Error fetching circle members:', error);
    throw new Error(`Failed to fetch circle members: ${error.message}`);
  }

  // Map to CircleMember type with profile data
  const members = data.map(member => ({
    id: member.id,
    circle_id: member.circle_id,
    user_id: member.user_id,
    role: member.role as CircleRole,
    created_at: member.created_at,
    profile: member.profile as unknown as Profile
  }));

  return members;
};

/**
 * Join a circle
 */
export const joinCircle = async (circleId: string): Promise<CircleMember> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const userId = userData.user.id;

  // Check if already a member
  const { data: existingMember } = await supabase
    .from('circle_members')
    .select('*')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingMember) {
    return existingMember as CircleMember;
  }

  // Join the circle
  const { data, error } = await supabase
    .from('circle_members')
    .insert({
      circle_id: circleId,
      user_id: userId,
      role: CircleRole.MEMBER
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error joining circle:', error);
    throw new Error(`Failed to join circle: ${error.message}`);
  }

  return data as CircleMember;
};

/**
 * Leave a circle
 */
export const leaveCircle = async (circleId: string): Promise<boolean> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const userId = userData.user.id;

  // Check if user is the only admin
  const { data: memberData } = await supabase
    .from('circle_members')
    .select('*')
    .eq('circle_id', circleId);

  const admins = memberData?.filter(m => m.role === CircleRole.ADMIN || m.role === CircleRole.CO_ADMIN);
  
  // If user is the only admin, they can't leave
  if (admins?.length === 1 && admins[0].user_id === userId && admins[0].role === CircleRole.ADMIN) {
    throw new Error('You are the only admin. Please assign another admin before leaving the circle.');
  }

  const { error } = await supabase
    .from('circle_members')
    .delete()
    .eq('circle_id', circleId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error leaving circle:', error);
    throw new Error(`Failed to leave circle: ${error.message}`);
  }

  return true;
};

/**
 * Get user's role in a circle
 */
export const getUserCircleRole = async (circleId: string, userId: string): Promise<CircleRole | null> => {
  const { data, error } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user role:', error);
    throw new Error(`Failed to fetch user role: ${error.message}`);
  }

  return data ? data.role as CircleRole : null;
};

/**
 * Update a member's role in a circle
 */
export const updateMemberRole = async (circleId: string, memberId: string, role: CircleRole): Promise<CircleMember> => {
  // Check if the current user has admin rights
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const currentUserId = userData.user.id;

  const { data: currentUserRole } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', currentUserId)
    .single();

  if (!currentUserRole || (currentUserRole.role !== CircleRole.ADMIN && currentUserRole.role !== CircleRole.CO_ADMIN)) {
    throw new Error('You do not have permission to update member roles');
  }
  
  // If updating a co-admin, only admin can do it
  if (role === CircleRole.CO_ADMIN && currentUserRole.role !== CircleRole.ADMIN) {
    throw new Error('Only the admin can assign co-admin roles');
  }

  const { data, error } = await supabase
    .from('circle_members')
    .update({ role })
    .eq('id', memberId)
    .eq('circle_id', circleId)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating member role:', error);
    throw new Error(`Failed to update member role: ${error.message}`);
  }

  return data as CircleMember;
};

/**
 * Remove a member from a circle
 */
export const removeMember = async (circleId: string, userId: string): Promise<boolean> => {
  // Check if the current user has admin/co-admin rights
  const { data: currentUserData } = await supabase.auth.getUser();
  if (!currentUserData.user) {
    throw new Error('User not authenticated');
  }

  const currentUserId = currentUserData.user.id;

  // If trying to remove yourself, use leaveCircle method
  if (currentUserId === userId) {
    return leaveCircle(circleId);
  }

  const { data: currentUserRole } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', currentUserId)
    .single();

  if (!currentUserRole || (currentUserRole.role !== CircleRole.ADMIN && currentUserRole.role !== CircleRole.CO_ADMIN)) {
    throw new Error('You do not have permission to remove members');
  }

  // Get the role of the user being removed
  const { data: targetUserRole } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .single();

  // Co-admins can't remove other co-admins or the admin
  if (currentUserRole.role === CircleRole.CO_ADMIN && 
      targetUserRole && 
      (targetUserRole.role === CircleRole.CO_ADMIN || targetUserRole.role === CircleRole.ADMIN)) {
    throw new Error('Co-admins cannot remove other co-admins or the admin');
  }

  const { error } = await supabase
    .from('circle_members')
    .delete()
    .eq('circle_id', circleId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing member:', error);
    throw new Error(`Failed to remove member: ${error.message}`);
  }

  return true;
};

/**
 * Add a post to a circle
 */
export const addPostToCircle = async (circleId: string, postId: string, isPinned = false): Promise<CirclePost> => {
  // Check if the current user is a member of the circle
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const userId = userData.user.id;

  const { data: membershipData } = await supabase
    .from('circle_members')
    .select('*')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!membershipData) {
    throw new Error('You must be a member of the circle to add posts');
  }

  // Check if the post is already in the circle
  const { data: existingPostData } = await supabase
    .from('circle_posts')
    .select('*')
    .eq('circle_id', circleId)
    .eq('post_id', postId)
    .maybeSingle();

  if (existingPostData) {
    // If it exists and only the pin status is changing, update it
    if (existingPostData.is_pinned !== isPinned) {
      const { data, error } = await supabase
        .from('circle_posts')
        .update({ is_pinned: isPinned })
        .eq('id', existingPostData.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating post pin status:', error);
        throw new Error(`Failed to update post pin status: ${error.message}`);
      }

      return data as unknown as CirclePost;
    }
    
    return existingPostData as CirclePost;
  }

  // Add new post to circle
  const { data, error } = await supabase
    .from('circle_posts')
    .insert({
      circle_id: circleId,
      post_id: postId,
      is_pinned: isPinned
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error adding post to circle:', error);
    throw new Error(`Failed to add post to circle: ${error.message}`);
  }

  return data as unknown as CirclePost;
};

/**
 * Get posts from a circle
 */
export const getCirclePosts = async (circleId: string): Promise<EnhancedPost[]> => {
  const { data, error } = await supabase
    .from('circle_posts')
    .select('*, post:posts(*)')
    .eq('circle_id', circleId);

  if (error) {
    console.error('Error fetching circle posts:', error);
    throw new Error(`Failed to fetch circle posts: ${error.message}`);
  }

  // Extract posts and add is_pinned flag
  const posts = data.map(item => {
    return {
      ...item.post,
      is_pinned: item.is_pinned
    } as EnhancedPost;
  });

  return posts;
};

/**
 * Toggle pin status of a post in a circle
 */
export const togglePostPin = async (circleId: string, postId: string): Promise<CirclePost> => {
  // Check if the current user has admin/co-admin rights
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const userId = userData.user.id;

  const { data: userRole } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .single();

  if (!userRole || (userRole.role !== CircleRole.ADMIN && userRole.role !== CircleRole.CO_ADMIN)) {
    throw new Error('You do not have permission to pin or unpin posts');
  }

  // Get current pin status
  const { data: postData } = await supabase
    .from('circle_posts')
    .select('*')
    .eq('circle_id', circleId)
    .eq('post_id', postId)
    .single();

  if (!postData) {
    throw new Error('Post not found in this circle');
  }

  // Toggle pin status
  const { data, error } = await supabase
    .from('circle_posts')
    .update({ is_pinned: !postData.is_pinned })
    .eq('circle_id', circleId)
    .eq('post_id', postId)
    .select('*')
    .single();

  if (error) {
    console.error('Error toggling post pin status:', error);
    throw new Error(`Failed to toggle post pin status: ${error.message}`);
  }

  return data as unknown as CirclePost;
};

/**
 * Remove a post from a circle
 */
export const removePostFromCircle = async (circleId: string, postId: string): Promise<boolean> => {
  // Check if the current user has admin/co-admin rights or is the post author
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User not authenticated');
  }

  const userId = userData.user.id;

  // Check user's role in the circle
  const { data: userRole } = await supabase
    .from('circle_members')
    .select('role')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .maybeSingle();

  // Check if user is the post author
  const { data: postData } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .maybeSingle();

  const isAdmin = userRole && (userRole.role === CircleRole.ADMIN || userRole.role === CircleRole.CO_ADMIN);
  const isAuthor = postData && postData.user_id === userId;

  if (!isAdmin && !isAuthor) {
    throw new Error('You do not have permission to remove this post');
  }

  const { error } = await supabase
    .from('circle_posts')
    .delete()
    .eq('circle_id', circleId)
    .eq('post_id', postId);

  if (error) {
    console.error('Error removing post from circle:', error);
    throw new Error(`Failed to remove post from circle: ${error.message}`);
  }

  return true;
};
