import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Real-time subscription hook
export const useRealtimeSubscription = (table, filter = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Memoize filter to avoid dependency issues
  const filterString = JSON.stringify(filter);

  const fetchData = useCallback(async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id);

      // Apply additional filters
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data: initialData, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setData(initialData || []);
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      toast.error(`Failed to load ${table}`);
    } finally {
      setLoading(false);
    }
  }, [user?.id, table, filterString]);

  useEffect(() => {
    fetchData();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new, ...prev]);
            toast.success(`New ${table.slice(0, -1)} added!`);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new : item
            ));
            toast.success(`${table.slice(0, -1)} updated!`);
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => item.id !== payload.old.id));
            toast.success(`${table.slice(0, -1)} deleted!`);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, table, filterString]);

  return { data, loading };
};

// Specific real-time hooks for each table
export const useRealtimeProjects = () => {
  return useRealtimeSubscription('projects');
};

export const useRealtimeTasks = () => {
  return useRealtimeSubscription('tasks');
};

export const useRealtimeInbox = () => {
  return useRealtimeSubscription('inbox_items');
};

export const useRealtimeHabits = () => {
  return useRealtimeSubscription('habits');
};

// Real-time notifications hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Listen for various changes and create notifications
    const projectsSubscription = supabase
      .channel('project_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const notification = {
            id: Date.now(),
            type: 'project',
            title: 'New Project Created',
            message: `Project "${payload.new.title}" has been created`,
            timestamp: new Date(),
            read: false
          };
          setNotifications(prev => [notification, ...prev]);
        }
      )
      .subscribe();

    const tasksSubscription = supabase
      .channel('task_notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new.status === 'completed' && payload.old.status !== 'completed') {
            const notification = {
              id: Date.now(),
              type: 'task',
              title: 'Task Completed',
              message: `Task "${payload.new.title}" has been completed`,
              timestamp: new Date(),
              read: false
            };
            setNotifications(prev => [notification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      projectsSubscription.unsubscribe();
      tasksSubscription.unsubscribe();
    };
  }, [user]);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    markAsRead,
    clearNotifications,
    unreadCount: notifications.filter(n => !n.read).length
  };
};
