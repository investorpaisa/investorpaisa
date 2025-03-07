
import { supabase } from "@/integrations/supabase/client";
import { Circle, CircleMember, CircleInsert, CircleUpdate, CirclePost, CircleRole, EnhancedPost, Profile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

/**
 * Create a new circle
 * @param circle - The circle data to insert
 * @returns The created circle
 */
export const createCircle = async (circle: CircleInsert): Promise<Circle | null> => {
  const user = supabase.auth.getUser();
  
  if (!(await user).data.user) {
    toast("Please sign in to create a circle");
    return null;
  }
  
  // Check if a circle with this name already exists
  const { data: existingCircle } = await supabase
    .from('circles')
    .select('id')
    .eq('name', circle.name)
    .single();
    
  if (existingCircle) {
    toast("Please choose a different name for your circle");
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('circles')
      .insert({
        ...circle,
        created_by: (await user).data.user!.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add the creator as an admin member
    await supabase
      .from('circle_members')
      .insert({
        circle_id: data.id,
        user_id: (await user).data.user!.id,
        role: CircleRole.ADMIN
      });
    
    toast(`Circle "${circle.name}" created successfully`);
    return data;
  } catch (error) {
    console.error("Error creating circle:", error);
    toast("Failed to create circle. Please try again.");
    return null;
  }
};

/**
 * Update a circle
 * @param id - The ID of the circle to update
 * @param updates - The circle data to update
 * @returns The updated circle
 */
export const updateCircle = async (id: string, updates: CircleUpdate): Promise<Circle | null> => {
  const user = supabase.auth.getUser();
  
  if (!(await user).data.user) {
    toast("Please sign in to update circles");
    return null;
  }
  
  try {
    // Check if the user is an admin of the circle
    const { data: membership } = await supabase
      .from('circle_members')
      .select('*')
      .eq('circle_id', id)
      .eq('user_id', (await user).data.user!.id)
      .single();
    
    if (!membership || membership.role !== CircleRole.ADMIN) {
      toast("Only circle admins can update circle details");
      return null;
    }
    
    const { data, error } = await supabase
      .from('circles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast("Circle details have been updated successfully");
    
    return data;
  } catch (error) {
    console.error("Error updating circle:", error);
    toast("Failed to update circle. Please try again.");
    return null;
  }
};

/**
 * Delete a circle
 * @param id - The ID of the circle to delete
 * @returns Whether the deletion was successful
 */
export const deleteCircle = async (id: string): Promise<boolean> => {
  const user = supabase.auth.getUser();
  
  if (!(await user).data.user) {
    toast("Please sign in to delete circles");
    return false;
  }
  
  try {
    // Check if the user is an admin of the circle
    const { data: membership } = await supabase
      .from('circle_members')
      .select('*')
      .eq('circle_id', id)
      .eq('user_id', (await user).data.user!.id)
      .single();
    
    if (!membership || membership.role !== CircleRole.ADMIN) {
      toast("Only circle admins can delete circles");
      return false;
    }
    
    const { error } = await supabase
      .from('circles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast("The circle has been deleted successfully");
    
    return true;
  } catch (error) {
    console.error("Error deleting circle:", error);
    toast("Failed to delete circle. Please try again.");
    return false;
  }
};

/**
 * Get a circle by ID
 * @param id - The ID of the circle to retrieve
 * @returns The circle data
 */
export const getCircleById = async (id: string): Promise<Circle | null> => {
  try {
    const { data, error } = await supabase
      .from('circles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error getting circle:", error);
    return null;
  }
};

/**
 * Get circles with their creators
 * @param limit - The maximum number of circles to retrieve
 * @param offset - The number of circles to skip
 * @returns The circles with their creators
 */
export const getCircles = async (limit = 10, offset = 0): Promise<Circle[]> => {
  try {
    const { data, error } = await supabase
      .from('circles')
      .select(`
        *,
        members:circle_members(count)
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(circle => ({
      ...circle,
      member_count: circle.members?.[0]?.count || 0
    }));
  } catch (error) {
    console.error("Error getting circles:", error);
    return [];
  }
};

/**
 * Get popular circles
 * @param limit - The maximum number of circles to retrieve
 * @returns The popular circles
 */
export const getPopularCircles = async (limit = 5): Promise<Circle[]> => {
  try {
    const { data, error } = await supabase
      .from('circles')
      .select(`
        *,
        members:circle_members(count)
      `)
      .order('member_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data.map(circle => ({
      ...circle,
      member_count: circle.members?.[0]?.count || 0
    }));
  } catch (error) {
    console.error("Error getting popular circles:", error);
    return [];
  }
};

/**
 * Get circles by user ID
 * @param userId - The ID of the user to retrieve circles for
 * @returns The circles the user is a member of
 */
export const getUserCircles = async (userId: string): Promise<Circle[]> => {
  try {
    const { data, error } = await supabase
      .from('circles')
      .select(`
        *,
        members:circle_members(*)
      `)
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    // Filter circles where the user is a member
    const userCircles = data.filter(circle => {
      return circle.members?.some(member => member.user_id === userId);
    });
    
    return userCircles.map(circle => ({
      ...circle,
      member_count: circle.members?.length || 0
    }));
  } catch (error) {
    console.error("Error getting user circles:", error);
    return [];
  }
};

/**
 * Get a user's membership in a circle
 * @param circleId - The ID of the circle
 * @param userId - The ID of the user
 * @returns The user's membership data
 */
export const getUserMembership = async (circleId: string, userId: string): Promise<CircleMember | null> => {
  try {
    const { data, error } = await supabase
      .from('circle_members')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('circle_id', circleId)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      profile: data.profile?.[0] as Profile
    };
  } catch (error) {
    console.error("Error getting user membership:", error);
    return null;
  }
};

/**
 * Join a circle
 * @param circleId - The ID of the circle to join
 * @returns Whether joining was successful
 */
export const joinCircle = async (circleId: string): Promise<boolean> => {
  const user = supabase.auth.getUser();
  
  if (!(await user).data.user) {
    toast("Please sign in to join circles");
    return false;
  }
  
  try {
    // Check if the circle exists
    const { data: circle, error: circleError } = await supabase
      .from('circles')
      .select('*')
      .eq('id', circleId)
      .single();
    
    if (circleError || !circle) {
      toast("The circle you're trying to join doesn't exist");
      return false;
    }
    
    if (circle.type === 'private') {
      toast("This is a private circle. You need an invitation to join.");
      return false;
    }
    
    // Check if the user is already a member
    const { data: existingMembership } = await supabase
      .from('circle_members')
      .select('id')
      .eq('circle_id', circleId)
      .eq('user_id', (await user).data.user!.id)
      .single();
    
    if (existingMembership) {
      toast("You are already a member of this circle");
      return false;
    }
    
    // Add the user as a member
    const { error } = await supabase
      .from('circle_members')
      .insert({
        circle_id: circleId,
        user_id: (await user).data.user!.id,
        role: CircleRole.MEMBER
      });
    
    if (error) throw error;
    
    toast("You have successfully joined the circle");
    
    return true;
  } catch (error) {
    console.error("Error joining circle:", error);
    toast("Failed to join circle. Please try again.");
    return false;
  }
};

/**
 * Leave a circle
 * @param circleId - The ID of the circle to leave
 * @returns Whether leaving was successful
 */
export const leaveCircle = async (circleId: string): Promise<boolean> => {
  const user = supabase.auth.getUser();
  
  if (!(await user).data.user) {
    toast("Please sign in to leave circles");
    return false;
  }
  
  try {
    // Check if the user is a member
    const { data: membership } = await supabase
      .from('circle_members')
      .select('*')
      .eq('circle_id', circleId)
      .eq('user_id', (await user).data.user!.id)
      .single();
    
    if (!membership) {
      toast("You are not a member of this circle");
      return false;
    }
    
    if (membership.role === CircleRole.ADMIN) {
      // Check if they're the only admin
      const { data: adminCount, error: countError } = await supabase
        .from('circle_members')
        .select('*', { count: 'exact' })
        .eq('circle_id', circleId)
        .eq('role', CircleRole.ADMIN);
      
      if (!countError && adminCount && adminCount.length === 1) {
        toast("You are the only admin. Please transfer ownership before leaving.");
        return false;
      }
    }
    
    // Remove the membership
    const { error } = await supabase
      .from('circle_members')
      .delete()
      .eq('circle_id', circleId)
      .eq('user_id', (await user).data.user!.id);
    
    if (error) throw error;
    
    toast("You have successfully left the circle");
    
    return true;
  } catch (error) {
    console.error("Error leaving circle:", error);
    toast("Failed to leave circle. Please try again.");
    return false;
  }
};

/**
 * Get members of a circle
 * @param circleId - The ID of the circle
 * @returns The members of the circle
 */
export const getCircleMembers = async (circleId: string): Promise<CircleMember[]> => {
  try {
    const { data, error } = await supabase
      .from('circle_members')
      .select(`
        *,
        profiles(*)
      `)
      .eq('circle_id', circleId)
      .order('role', { ascending: true });
    
    if (error) throw error;
    
    return data.map(member => ({
      ...member,
      profile: member.profiles as unknown as Profile
    }));
  } catch (error) {
    console.error("Error getting circle members:", error);
    return [];
  }
};

/**
 * Get posts in a circle
 * @param circleId - The ID of the circle
 * @returns The posts in the circle
 */
export const getCirclePosts = async (circleId: string): Promise<EnhancedPost[]> => {
  try {
    const { data, error } = await supabase
      .from('circle_posts')
      .select(`
        *,
        post:posts(*, author:profiles(*), category:categories(*))
      `)
      .eq('circle_id', circleId);
    
    if (error) throw error;
    
    return data.map(cp => ({
      ...cp.post,
      is_pinned: cp.is_pinned
    })) as EnhancedPost[];
  } catch (error) {
    console.error("Error getting circle posts:", error);
    return [];
  }
};

/**
 * Add a post to a circle
 * @param circleId - The ID of the circle
 * @param postId - The ID of the post
 * @returns Whether adding was successful
 */
export const addPostToCircle = async (circleId: string, postId: string): Promise<boolean> => {
  const user = supabase.auth.getUser();
  
  if (!(await user).data.user) {
    toast("Please sign in to add posts to circles");
    return false;
  }
  
  try {
    // Check if the user is a member
    const { data: membership } = await supabase
      .from('circle_members')
      .select('*')
      .eq('circle_id', circleId)
      .eq('user_id', (await user).data.user!.id)
      .single();
    
    if (!membership) {
      toast("You need to be a member to post in this circle");
      return false;
    }
    
    // Add the post to the circle
    const { error } = await supabase
      .from('circle_posts')
      .insert({
        circle_id: circleId,
        post_id: postId,
        is_pinned: false
      });
    
    if (error) throw error;
    
    toast("Post has been added to the circle");
    
    return true;
  } catch (error) {
    console.error("Error adding post to circle:", error);
    toast("Failed to add post to circle. Please try again.");
    return false;
  }
};

/**
 * Toggle pin status of a post in a circle
 * @param circleId - The ID of the circle
 * @param postId - The ID of the post
 * @returns Whether toggling was successful
 */
export const togglePinPost = async (circleId: string, postId: string): Promise<boolean> => {
  const user = supabase.auth.getUser();
  
  if (!(await user).data.user) {
    toast("Please sign in to manage posts");
    return false;
  }
  
  try {
    // Check if the user is an admin or co-admin
    const { data: membership } = await supabase
      .from('circle_members')
      .select('*')
      .eq('circle_id', circleId)
      .eq('user_id', (await user).data.user!.id)
      .single();
    
    if (!membership || (membership.role !== CircleRole.ADMIN && membership.role !== CircleRole.CO_ADMIN)) {
      toast("Only admins and co-admins can pin posts");
      return false;
    }
    
    // Get the current pin status
    const { data: circlePost, error: getError } = await supabase
      .from('circle_posts')
      .select('*')
      .eq('circle_id', circleId)
      .eq('post_id', postId)
      .single();
    
    if (getError || !circlePost) {
      toast("This post is not in the circle");
      return false;
    }
    
    const newPinStatus = !circlePost.is_pinned;
    
    // Update the pin status
    const { error } = await supabase
      .from('circle_posts')
      .update({ is_pinned: newPinStatus })
      .eq('circle_id', circleId)
      .eq('post_id', postId);
    
    if (error) throw error;
    
    if (newPinStatus) {
      toast("Post has been pinned to the top of the circle");
    } else {
      toast("Post has been unpinned");
    }
    
    return true;
  } catch (error) {
    console.error("Error updating pin status:", error);
    toast("Failed to update pin status. Please try again.");
    return false;
  }
};

/**
 * Remove a post from a circle
 * @param circleId - The ID of the circle
 * @param postId - The ID of the post
 * @returns Whether removal was successful
 */
export const removePostFromCircle = async (circleId: string, postId: string): Promise<boolean> => {
  const user = supabase.auth.getUser();
  
  if (!(await user).data.user) {
    toast("Please sign in to remove posts");
    return false;
  }
  
  try {
    const userId = (await user).data.user!.id;
    
    // Get the post to check if the user is the author
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single();
    
    // Check if the user is an admin/co-admin or the post author
    const { data: membership } = await supabase
      .from('circle_members')
      .select('role')
      .eq('circle_id', circleId)
      .eq('user_id', userId)
      .single();
    
    const isAdmin = membership && (membership.role === CircleRole.ADMIN || membership.role === CircleRole.CO_ADMIN);
    const isAuthor = post && post.user_id === userId;
    
    if (!isAdmin && !isAuthor) {
      toast("You need to be the post author or a circle admin/co-admin");
      return false;
    }
    
    // Remove the post from the circle
    const { error } = await supabase
      .from('circle_posts')
      .delete()
      .eq('circle_id', circleId)
      .eq('post_id', postId);
    
    if (error) throw error;
    
    toast("Post has been removed from the circle");
    
    return true;
  } catch (error) {
    console.error("Error removing post:", error);
    toast("Failed to remove post. Please try again.");
    return false;
  }
};

export const circleService = {
  createCircle,
  updateCircle,
  deleteCircle,
  getCircleById,
  getCircles,
  getPopularCircles,
  getUserCircles,
  getUserMembership,
  joinCircle,
  leaveCircle,
  getCircleMembers,
  getCirclePosts,
  addPostToCircle,
  togglePinPost,
  removePostFromCircle
};
