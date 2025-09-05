import { useState, useEffect, useCallback } from 'react';
import supabase from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Hook for managing projects
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          areas:area_id (name, color)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addProject = async (projectData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => [data, ...prev]);
      toast.success('Project created successfully!');
      return data;
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to create project');
      throw error;
    }
  };

  const updateProject = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => prev.map(p => p.id === id ? data : p));
      toast.success('Project updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
      throw error;
    }
  };

  const deleteProject = async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
};

// Hook for managing areas
export const useAreas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAreas = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error('Failed to load areas');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addArea = async (areaData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('areas')
        .insert([{ ...areaData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setAreas(prev => [data, ...prev]);
      toast.success('Area created successfully!');
      return data;
    } catch (error) {
      console.error('Error adding area:', error);
      toast.error('Failed to create area');
      throw error;
    }
  };

  const updateArea = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setAreas(prev => prev.map(a => a.id === id ? data : a));
      toast.success('Area updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating area:', error);
      toast.error('Failed to update area');
      throw error;
    }
  };

  const deleteArea = async (id) => {
    try {
      const { error } = await supabase
        .from('areas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAreas(prev => prev.filter(a => a.id !== id));
      toast.success('Area deleted successfully!');
    } catch (error) {
      console.error('Error deleting area:', error);
      toast.error('Failed to delete area');
      throw error;
    }
  };

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  return {
    areas,
    loading,
    addArea,
    updateArea,
    deleteArea,
    refetch: fetchAreas
  };
};

// Hook for managing tasks
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects:project_id (title),
          areas:area_id (name, color)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addTask = async (taskData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [data, ...prev]);
      toast.success('Task created successfully!');
      return data;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => prev.map(t => t.id === id ? data : t));
      toast.success('Task updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const completeTask = async (id) => {
    return updateTask(id, { 
      status: 'completed', 
      completed_at: new Date().toISOString() 
    });
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    completeTask,
    refetch: fetchTasks
  };
};

// Hook for managing inbox items
export const useInbox = () => {
  const [inboxItems, setInboxItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInboxItems = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('inbox_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInboxItems(data || []);
    } catch (error) {
      console.error('Error fetching inbox items:', error);
      toast.error('Failed to load inbox items');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addInboxItem = async (itemData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('inbox_items')
        .insert([{ ...itemData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setInboxItems(prev => [data, ...prev]);
      toast.success('Item added to inbox!');
      return data;
    } catch (error) {
      console.error('Error adding inbox item:', error);
      toast.error('Failed to add item to inbox');
      throw error;
    }
  };

  const processInboxItem = async (id) => {
    try {
      const { data, error } = await supabase
        .from('inbox_items')
        .update({ 
          status: 'processed', 
          processed_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setInboxItems(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Item processed!');
      return data;
    } catch (error) {
      console.error('Error processing inbox item:', error);
      toast.error('Failed to process item');
      throw error;
    }
  };

  useEffect(() => {
    fetchInboxItems();
  }, [fetchInboxItems]);

  return {
    inboxItems,
    loading,
    addInboxItem,
    processInboxItem,
    refetch: fetchInboxItems
  };
};
