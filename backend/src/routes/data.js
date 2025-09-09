// Backend Data API Routes - Comprehensive CRUD Operations
// This provides all the backend endpoints for data management

const express = require('express');
const router = express.Router();
const { supabase } = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateRequest } = require('../utils/auth');
const { body } = require('express-validator');

// ==================== AREAS ROUTES ====================

// Get all areas for user
router.get('/areas', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('user_id', req.userId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new area
router.post('/areas', authenticateToken, [
  body('name').notEmpty().withMessage('Area name is required'),
  body('description').optional().isString(),
  body('color').optional().isString(),
  body('icon').optional().isString(),
  body('order_index').optional().isInt()
], validateRequest, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('areas')
      .insert([{
        user_id: req.userId,
        name: req.body.name,
        description: req.body.description,
        color: req.body.color || '#3B82F6',
        icon: req.body.icon || 'folder',
        order_index: req.body.order_index || 0
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: 'Area created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update area
router.put('/areas/:id', authenticateToken, [
  body('name').optional().notEmpty(),
  body('description').optional().isString(),
  body('color').optional().isString(),
  body('icon').optional().isString(),
  body('order_index').optional().isInt()
], validateRequest, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('areas')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: 'Area updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete area
router.delete('/areas/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('areas')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ success: true, message: 'Area deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PROJECTS ROUTES ====================

// Get all projects for user
router.get('/projects', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        areas:area_id(name, color, icon)
      `)
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new project
router.post('/projects', authenticateToken, [
  body('title').notEmpty().withMessage('Project title is required'),
  body('description').optional().isString(),
  body('area_id').optional().isUUID(),
  body('status').optional().isIn(['active', 'completed', 'on_hold', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('due_date').optional().isISO8601(),
  body('tags').optional().isArray()
], validateRequest, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: req.userId,
        area_id: req.body.area_id,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'active',
        priority: req.body.priority || 'medium',
        due_date: req.body.due_date,
        tags: req.body.tags || [],
        metadata: req.body.metadata || {}
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: 'Project created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update project
router.put('/projects/:id', authenticateToken, [
  body('title').optional().notEmpty(),
  body('description').optional().isString(),
  body('area_id').optional().isUUID(),
  body('status').optional().isIn(['active', 'completed', 'on_hold', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('due_date').optional().isISO8601(),
  body('tags').optional().isArray()
], validateRequest, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete project
router.delete('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== TASKS ROUTES ====================

// Get all tasks for user
router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        projects:project_id(title, status),
        areas:area_id(name, color, icon)
      `)
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new task
router.post('/tasks', authenticateToken, [
  body('title').notEmpty().withMessage('Task title is required'),
  body('description').optional().isString(),
  body('project_id').optional().isUUID(),
  body('area_id').optional().isUUID(),
  body('status').optional().isIn(['not_started', 'in_progress', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('due_date').optional().isISO8601(),
  body('estimated_duration').optional().isInt(),
  body('tags').optional().isArray()
], validateRequest, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: req.userId,
        project_id: req.body.project_id,
        area_id: req.body.area_id,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'not_started',
        priority: req.body.priority || 'medium',
        due_date: req.body.due_date,
        estimated_duration: req.body.estimated_duration,
        tags: req.body.tags || [],
        metadata: req.body.metadata || {}
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update task
router.put('/tasks/:id', authenticateToken, [
  body('title').optional().notEmpty(),
  body('description').optional().isString(),
  body('project_id').optional().isUUID(),
  body('area_id').optional().isUUID(),
  body('status').optional().isIn(['not_started', 'in_progress', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('due_date').optional().isISO8601(),
  body('estimated_duration').optional().isInt(),
  body('actual_duration').optional().isInt(),
  body('tags').optional().isArray()
], validateRequest, async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Set completed_at if status is completed
    if (updates.status === 'completed' && !updates.completed_at) {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete task
router.delete('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== HABITS ROUTES ====================

// Get all habits for user
router.get('/habits', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', req.userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new habit
router.post('/habits', authenticateToken, [
  body('title').notEmpty().withMessage('Habit title is required'),
  body('description').optional().isString(),
  body('frequency').optional().isIn(['daily', 'weekly', 'monthly']),
  body('target_count').optional().isInt(),
  body('color').optional().isString(),
  body('icon').optional().isString()
], validateRequest, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .insert([{
        user_id: req.userId,
        title: req.body.title,
        description: req.body.description,
        frequency: req.body.frequency || 'daily',
        target_count: req.body.target_count || 1,
        color: req.body.color || '#10B981',
        icon: req.body.icon || 'target'
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: 'Habit created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track habit
router.post('/habits/:id/track', authenticateToken, [
  body('date').optional().isISO8601(),
  body('count').optional().isInt()
], validateRequest, async (req, res) => {
  try {
    const date = req.body.date || new Date().toISOString().split('T')[0];
    const count = req.body.count || 1;

    const { data, error } = await supabase
      .from('habit_entries')
      .upsert([{
        habit_id: req.params.id,
        user_id: req.userId,
        date: date,
        count: count
      }], {
        onConflict: 'habit_id,date'
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: 'Habit tracked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== JOURNAL ROUTES ====================

// Get all journal entries for user
router.get('/journal', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new journal entry
router.post('/journal', authenticateToken, [
  body('content').notEmpty().withMessage('Journal content is required'),
  body('title').optional().isString(),
  body('mood').optional().isIn(['excellent', 'good', 'neutral', 'poor', 'terrible']),
  body('tags').optional().isArray(),
  body('is_private').optional().isBoolean()
], validateRequest, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([{
        user_id: req.userId,
        title: req.body.title,
        content: req.body.content,
        mood: req.body.mood,
        tags: req.body.tags || [],
        is_private: req.body.is_private !== false
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: 'Journal entry created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ANALYTICS ROUTES ====================

// Track user event
router.post('/analytics/track', optionalAuth, [
  body('event_type').notEmpty().withMessage('Event type is required'),
  body('event_data').optional().isObject()
], validateRequest, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_analytics')
      .insert([{
        user_id: req.userId || 'demo-user-1',
        event_type: req.body.event_type,
        event_data: req.body.event_data || {},
        page_url: req.body.page_url || '',
        user_agent: req.body.user_agent || ''
      }]);

    if (error) throw error;
    res.json({ success: true, message: 'Event tracked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== DASHBOARD DATA ROUTE ====================

// Get all dashboard data in one request
router.get('/dashboard', optionalAuth, async (req, res) => {
  try {
    const userId = req.userId;

    // Get all data in parallel
    const [areasResult, projectsResult, tasksResult, habitsResult, journalResult] = await Promise.all([
      supabase.from('areas').select('*').eq('user_id', userId).order('order_index'),
      supabase.from('projects').select('*, areas:area_id(name, color, icon)').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('tasks').select('*, projects:project_id(title, status), areas:area_id(name, color, icon)').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('habits').select('*').eq('user_id', userId).eq('is_active', true).order('created_at', { ascending: false }),
      supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5)
    ]);

    // Check for errors
    const errors = [areasResult.error, projectsResult.error, tasksResult.error, habitsResult.error, journalResult.error].filter(Boolean);
    if (errors.length > 0) {
      throw new Error(`Database errors: ${errors.map(e => e.message).join(', ')}`);
    }

    res.json({
      success: true,
      data: {
        areas: areasResult.data || [],
        projects: projectsResult.data || [],
        tasks: tasksResult.data || [],
        habits: habitsResult.data || [],
        recentJournalEntries: journalResult.data || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
