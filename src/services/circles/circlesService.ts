
import { supabase } from '@/integrations/supabase/client';
import { Circle, CircleInsert, CircleUpdate } from './types';

/**
 * Create a new circle
 */
const createCircle = async (circle: CircleInsert): Promise<Circle> => {
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
      role: 'admin',
    });

  return data as Circle;
};

/**
 * Update an existing circle
 */
const updateCircle = async (id: string, updates: CircleUpdate): Promise<Circle> => {
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
const getCircleById = async (id: string): Promise<Circle> => {
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
const getCircles = async (page = 1, limit = 10): Promise<Circle[]> => {
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
const getUserCircles = async (userId: string): Promise<Circle[]> => {
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
const getPublicCircles = async (page = 1, limit = 10): Promise<Circle[]> => {
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
const getTrendingCircles = async (limit = 5): Promise<Circle[]> => {
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
const searchCircles = async (query: string, limit = 10): Promise<Circle[]> => {
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

// Export as a group of functions
export const circles = {
  createCircle,
  updateCircle,
  getCircleById,
  getCircles,
  getUserCircles,
  getPublicCircles,
  getTrendingCircles,
  searchCircles
};
