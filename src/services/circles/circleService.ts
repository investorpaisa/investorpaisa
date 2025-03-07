
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Circle, CircleInsert, CircleUpdate, CircleMember, Post, UserRole } from '@/types';

export const circleService = {
  /**
   * Create a new circle
   */
  async createCircle(name: string, type: 'public' | 'private', description?: string): Promise<Circle | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a circle",
          variant: "destructive"
        });
        return null;
      }

      // Check if circle name already exists
      const { data: existingCircle } = await supabase
        .from('circles')
        .select('id')
        .eq('name', name)
        .single();

      if (existingCircle) {
        toast({
          title: "Circle already exists",
          description: "Please choose a different name for your circle",
          variant: "destructive"
        });
        return null;
      }

      const newCircle: CircleInsert = {
        name,
        type,
        description: description || null,
        created_by: user.user.id
      };

      const { data, error } = await supabase
        .from('circles')
        .insert(newCircle)
        .select('*')
        .single();

      if (error) throw error;
      
      toast({
        title: "Circle created",
        description: `Your circle '${name}' has been created successfully`
      });
      
      return data;
    } catch (error) {
      console.error('Error creating circle:', error);
      toast({
        title: "Error",
        description: "Failed to create circle. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  },

  /**
   * Update a circle
   */
  async updateCircle(circleId: string, updates: CircleUpdate): Promise<Circle | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to update circles",
          variant: "destructive"
        });
        return null;
      }

      // Check if user is admin of this circle
      const { data: membership } = await supabase
        .from('circle_members')
        .select('role')
        .eq('circle_id', circleId)
        .eq('user_id', user.user.id)
        .single();

      if (!membership || membership.role !== 'admin') {
        toast({
          title: "Permission denied",
          description: "Only circle admins can update circle details",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('circles')
        .update(updates)
        .eq('id', circleId)
        .select('*')
        .single();

      if (error) throw error;
      
      toast({
        title: "Circle updated",
        description: "Circle details have been updated successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating circle:', error);
      toast({
        title: "Error",
        description: "Failed to update circle. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  },

  /**
   * Delete a circle
   */
  async deleteCircle(circleId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to delete circles",
          variant: "destructive"
        });
        return false;
      }

      // Check if user is admin of this circle
      const { data: membership } = await supabase
        .from('circle_members')
        .select('role')
        .eq('circle_id', circleId)
        .eq('user_id', user.user.id)
        .single();

      if (!membership || membership.role !== 'admin') {
        toast({
          title: "Permission denied",
          description: "Only circle admins can delete circles",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('circles')
        .delete()
        .eq('id', circleId);

      if (error) throw error;
      
      toast({
        title: "Circle deleted",
        description: "The circle has been deleted successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting circle:', error);
      toast({
        title: "Error",
        description: "Failed to delete circle. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Get all circles
   */
  async getAllCircles(): Promise<Circle[]> {
    try {
      const { data, error } = await supabase
        .from('circles')
        .select(`
          *,
          creator:created_by(
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get member counts for each circle
      const circlesWithMemberCount = await Promise.all(data.map(async (circle) => {
        const { count } = await supabase
          .from('circle_members')
          .select('id', { count: 'exact', head: true })
          .eq('circle_id', circle.id);
          
        return {
          ...circle,
          memberCount: count
        };
      }));
      
      return circlesWithMemberCount || [];
    } catch (error) {
      console.error('Error getting all circles:', error);
      return [];
    }
  },

  /**
   * Get circles by type (public or private)
   */
  async getCirclesByType(type: 'public' | 'private'): Promise<Circle[]> {
    try {
      const { data, error } = await supabase
        .from('circles')
        .select(`
          *,
          creator:created_by(
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('type', type)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get member counts for each circle
      const circlesWithMemberCount = await Promise.all(data.map(async (circle) => {
        const { count } = await supabase
          .from('circle_members')
          .select('id', { count: 'exact', head: true })
          .eq('circle_id', circle.id);
          
        return {
          ...circle,
          memberCount: count
        };
      }));
      
      return circlesWithMemberCount || [];
    } catch (error) {
      console.error(`Error getting ${type} circles:`, error);
      return [];
    }
  },

  /**
   * Get a circle by ID
   */
  async getCircleById(circleId: string): Promise<Circle | null> {
    try {
      const { data, error } = await supabase
        .from('circles')
        .select(`
          *,
          creator:created_by(
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('id', circleId)
        .single();

      if (error) throw error;
      
      // Get member count
      const { count } = await supabase
        .from('circle_members')
        .select('id', { count: 'exact', head: true })
        .eq('circle_id', circleId);
        
      return {
        ...data,
        memberCount: count
      };
    } catch (error) {
      console.error('Error getting circle by ID:', error);
      return null;
    }
  },

  /**
   * Get a circle by name
   */
  async getCircleByName(circleName: string): Promise<Circle | null> {
    try {
      const { data, error } = await supabase
        .from('circles')
        .select(`
          *,
          creator:created_by(
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('name', circleName)
        .single();

      if (error) throw error;
      
      // Get member count
      const { count } = await supabase
        .from('circle_members')
        .select('id', { count: 'exact', head: true })
        .eq('circle_id', data.id);
        
      return {
        ...data,
        memberCount: count
      };
    } catch (error) {
      console.error('Error getting circle by name:', error);
      return null;
    }
  },

  /**
   * Get circles that the current user is a member of
   */
  async getUserCircles(): Promise<Circle[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('circle_members')
        .select(`
          circle:circle_id(
            *,
            creator:created_by(
              id,
              full_name,
              username,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.user.id);

      if (error) throw error;
      
      // Extract circles from the joined data and get member counts
      const circles = data.map(item => item.circle);
      const circlesWithMemberCount = await Promise.all(circles.map(async (circle) => {
        const { count } = await supabase
          .from('circle_members')
          .select('id', { count: 'exact', head: true })
          .eq('circle_id', circle.id);
          
        return {
          ...circle,
          memberCount: count
        };
      }));
      
      return circlesWithMemberCount || [];
    } catch (error) {
      console.error('Error getting user circles:', error);
      return [];
    }
  },

  /**
   * Join a circle
   */
  async joinCircle(circleId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to join circles",
          variant: "destructive"
        });
        return false;
      }

      // Check if circle is public
      const { data: circle } = await supabase
        .from('circles')
        .select('type')
        .eq('id', circleId)
        .single();

      if (!circle) {
        toast({
          title: "Circle not found",
          description: "The circle you're trying to join doesn't exist",
          variant: "destructive"
        });
        return false;
      }

      if (circle.type === 'private') {
        toast({
          title: "Private circle",
          description: "This is a private circle. You need an invitation to join.",
          variant: "destructive"
        });
        return false;
      }

      // Check if already a member
      const { data: existingMembership } = await supabase
        .from('circle_members')
        .select('id')
        .eq('circle_id', circleId)
        .eq('user_id', user.user.id)
        .single();

      if (existingMembership) {
        toast({
          title: "Already a member",
          description: "You are already a member of this circle",
          variant: "destructive"
        });
        return false;
      }

      // Join as a regular member
      const { error } = await supabase
        .from('circle_members')
        .insert({
          circle_id: circleId,
          user_id: user.user.id,
          role: 'member'
        });

      if (error) throw error;
      
      toast({
        title: "Joined circle",
        description: "You have successfully joined the circle"
      });
      
      return true;
    } catch (error) {
      console.error('Error joining circle:', error);
      toast({
        title: "Error",
        description: "Failed to join circle. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Leave a circle
   */
  async leaveCircle(circleId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to leave circles",
          variant: "destructive"
        });
        return false;
      }

      // Check if the user is an admin and the only admin
      const { data: membership } = await supabase
        .from('circle_members')
        .select('role')
        .eq('circle_id', circleId)
        .eq('user_id', user.user.id)
        .single();

      if (!membership) {
        toast({
          title: "Not a member",
          description: "You are not a member of this circle",
          variant: "destructive"
        });
        return false;
      }

      if (membership.role === 'admin') {
        // Count other admins
        const { count } = await supabase
          .from('circle_members')
          .select('id', { count: 'exact', head: true })
          .eq('circle_id', circleId)
          .eq('role', 'admin')
          .neq('user_id', user.user.id);

        if (count === 0) {
          toast({
            title: "Cannot leave",
            description: "You are the only admin. Please transfer ownership before leaving.",
            variant: "destructive"
          });
          return false;
        }
      }

      // Leave the circle
      const { error } = await supabase
        .from('circle_members')
        .delete()
        .eq('circle_id', circleId)
        .eq('user_id', user.user.id);

      if (error) throw error;
      
      toast({
        title: "Left circle",
        description: "You have successfully left the circle"
      });
      
      return true;
    } catch (error) {
      console.error('Error leaving circle:', error);
      toast({
        title: "Error",
        description: "Failed to leave circle. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Invite a user to a circle
   */
  async inviteToCircle(circleId: string, userId: string): Promise<boolean> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to invite users",
          variant: "destructive"
        });
        return false;
      }

      // Check if the current user is an admin or co-admin
      const { data: membership } = await supabase
        .from('circle_members')
        .select('role')
        .eq('circle_id', circleId)
        .eq('user_id', currentUser.user.id)
        .single();

      if (!membership || (membership.role !== 'admin' && membership.role !== 'co-admin')) {
        toast({
          title: "Permission denied",
          description: "You need to be an admin or co-admin to invite members",
          variant: "destructive"
        });
        return false;
      }

      // Check if user is already a member
      const { data: existingMembership } = await supabase
        .from('circle_members')
        .select('id')
        .eq('circle_id', circleId)
        .eq('user_id', userId)
        .single();

      if (existingMembership) {
        toast({
          title: "Already a member",
          description: "This user is already a member of the circle",
          variant: "destructive"
        });
        return false;
      }

      // Add user as a member
      const { error } = await supabase
        .from('circle_members')
        .insert({
          circle_id: circleId,
          user_id: userId,
          role: 'member'
        });

      if (error) throw error;
      
      toast({
        title: "Invitation sent",
        description: "User has been added to the circle"
      });
      
      return true;
    } catch (error) {
      console.error('Error inviting to circle:', error);
      toast({
        title: "Error",
        description: "Failed to invite user. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Change a member's role in a circle
   */
  async changeMemberRole(circleId: string, userId: string, newRole: UserRole): Promise<boolean> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to change member roles",
          variant: "destructive"
        });
        return false;
      }

      // Check if the current user is an admin
      const { data: membership } = await supabase
        .from('circle_members')
        .select('role')
        .eq('circle_id', circleId)
        .eq('user_id', currentUser.user.id)
        .single();

      if (!membership || membership.role !== 'admin') {
        toast({
          title: "Permission denied",
          description: "Only circle admins can change member roles",
          variant: "destructive"
        });
        return false;
      }

      // Update the member's role
      const { error } = await supabase
        .from('circle_members')
        .update({ role: newRole })
        .eq('circle_id', circleId)
        .eq('user_id', userId);

      if (error) throw error;
      
      toast({
        title: "Role updated",
        description: "Member's role has been updated successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error changing member role:', error);
      toast({
        title: "Error",
        description: "Failed to change member role. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Remove a member from a circle
   */
  async removeMember(circleId: string, userId: string): Promise<boolean> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to remove members",
          variant: "destructive"
        });
        return false;
      }

      // Check if the current user is an admin
      const { data: membership } = await supabase
        .from('circle_members')
        .select('role')
        .eq('circle_id', circleId)
        .eq('user_id', currentUser.user.id)
        .single();

      if (!membership || membership.role !== 'admin') {
        toast({
          title: "Permission denied",
          description: "Only circle admins can remove members",
          variant: "destructive"
        });
        return false;
      }

      // Cannot remove yourself (use leaveCircle instead)
      if (userId === currentUser.user.id) {
        toast({
          title: "Cannot remove yourself",
          description: "Use the 'Leave Circle' option to leave the circle",
          variant: "destructive"
        });
        return false;
      }

      // Remove the member
      const { error } = await supabase
        .from('circle_members')
        .delete()
        .eq('circle_id', circleId)
        .eq('user_id', userId);

      if (error) throw error;
      
      toast({
        title: "Member removed",
        description: "Member has been removed from the circle"
      });
      
      return true;
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Get all members of a circle
   */
  async getCircleMembers(circleId: string): Promise<CircleMember[]> {
    try {
      const { data, error } = await supabase
        .from('circle_members')
        .select(`
          *,
          profile:user_id(
            id,
            full_name,
            username,
            avatar_url,
            role
          )
        `)
        .eq('circle_id', circleId)
        .order('role', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting circle members:', error);
      return [];
    }
  },

  /**
   * Get posts from a circle
   */
  async getCirclePosts(circleId: string): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('circle_posts')
        .select(`
          is_pinned,
          post:post_id(
            *,
            author:user_id(
              id,
              full_name,
              username,
              avatar_url,
              role
            ),
            category:category_id(
              id,
              name,
              icon
            )
          )
        `)
        .eq('circle_id', circleId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Extract and transform the posts from the joined data
      const posts = data.map(item => {
        return {
          ...item.post,
          is_pinned: item.is_pinned
        };
      });
      
      return posts || [];
    } catch (error) {
      console.error('Error getting circle posts:', error);
      return [];
    }
  },

  /**
   * Add a post to a circle
   */
  async addPostToCircle(circleId: string, postId: string, isPinned: boolean = false): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add posts to circles",
          variant: "destructive"
        });
        return false;
      }

      // Check if user is a member of the circle
      const { data: membership } = await supabase
        .from('circle_members')
        .select('id')
        .eq('circle_id', circleId)
        .eq('user_id', user.user.id)
        .single();

      if (!membership) {
        toast({
          title: "Not a member",
          description: "You need to be a member to post in this circle",
          variant: "destructive"
        });
        return false;
      }

      // Add post to circle
      const { error } = await supabase
        .from('circle_posts')
        .insert({
          circle_id: circleId,
          post_id: postId,
          is_pinned: isPinned
        });

      if (error) throw error;
      
      toast({
        title: "Post added",
        description: "Post has been added to the circle"
      });
      
      return true;
    } catch (error) {
      console.error('Error adding post to circle:', error);
      toast({
        title: "Error",
        description: "Failed to add post to circle. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Toggle pin status of a post in a circle
   */
  async togglePinPost(circleId: string, postId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to manage posts",
          variant: "destructive"
        });
        return false;
      }

      // Check if user is an admin or co-admin
      const { data: membership } = await supabase
        .from('circle_members')
        .select('role')
        .eq('circle_id', circleId)
        .eq('user_id', user.user.id)
        .single();

      if (!membership || (membership.role !== 'admin' && membership.role !== 'co-admin')) {
        toast({
          title: "Permission denied",
          description: "Only admins and co-admins can pin posts",
          variant: "destructive"
        });
        return false;
      }

      // Get current pin status
      const { data: circlePost } = await supabase
        .from('circle_posts')
        .select('is_pinned')
        .eq('circle_id', circleId)
        .eq('post_id', postId)
        .single();

      if (!circlePost) {
        toast({
          title: "Post not found",
          description: "This post is not in the circle",
          variant: "destructive"
        });
        return false;
      }

      // Toggle pin status
      const newPinStatus = !circlePost.is_pinned;
      const { error } = await supabase
        .from('circle_posts')
        .update({ is_pinned: newPinStatus })
        .eq('circle_id', circleId)
        .eq('post_id', postId);

      if (error) throw error;
      
      toast({
        title: newPinStatus ? "Post pinned" : "Post unpinned",
        description: newPinStatus 
          ? "Post has been pinned to the top of the circle" 
          : "Post has been unpinned"
      });
      
      return true;
    } catch (error) {
      console.error('Error toggling pin status:', error);
      toast({
        title: "Error",
        description: "Failed to update pin status. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Remove a post from a circle
   */
  async removePostFromCircle(circleId: string, postId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to remove posts",
          variant: "destructive"
        });
        return false;
      }

      // Check if user is post author or admin/co-admin
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      const isAuthor = post && post.user_id === user.user.id;

      if (!isAuthor) {
        // Check if user is an admin or co-admin
        const { data: membership } = await supabase
          .from('circle_members')
          .select('role')
          .eq('circle_id', circleId)
          .eq('user_id', user.user.id)
          .single();

        if (!membership || (membership.role !== 'admin' && membership.role !== 'co-admin')) {
          toast({
            title: "Permission denied",
            description: "You need to be the post author or a circle admin/co-admin",
            variant: "destructive"
          });
          return false;
        }
      }

      // Remove post from circle
      const { error } = await supabase
        .from('circle_posts')
        .delete()
        .eq('circle_id', circleId)
        .eq('post_id', postId);

      if (error) throw error;
      
      toast({
        title: "Post removed",
        description: "Post has been removed from the circle"
      });
      
      return true;
    } catch (error) {
      console.error('Error removing post from circle:', error);
      toast({
        title: "Error",
        description: "Failed to remove post. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }
};
