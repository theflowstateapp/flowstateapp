import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import dataService from '../services/DataInterlinkingService';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState({
    areas: [],
    projects: [],
    tasks: [],
    resources: [],
    archives: [],
    goals: [],
    habits: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data service when user changes
  useEffect(() => {
    if (user?.id) {
      initializeDataService();
    } else {
      setData({
        areas: [],
        projects: [],
        tasks: [],
        resources: [],
        archives: [],
        goals: [],
        habits: []
      });
      setLoading(false);
    }
  }, [user?.id]);

  const initializeDataService = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await dataService.initialize(user.id);
      
      // Subscribe to data changes
      dataService.subscribe('dataLoaded', handleDataLoaded);
      dataService.subscribe('dataChanged', handleDataChanged);
      
      // Get initial data
      const allData = dataService.getAllData();
      setData(allData);
      
    } catch (err) {
      console.error('Error initializing data service:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDataLoaded = (newData) => {
    setData(newData);
  };

  const handleDataChanged = ({ table, data: newData }) => {
    setData(prevData => ({
      ...prevData,
      [table]: newData
    }));
  };

  // CRUD Operations
  const createArea = async (areaData) => {
    try {
      const result = await dataService.createArea(areaData);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error creating area:', err);
      throw err;
    }
  };

  const updateArea = async (id, updates) => {
    try {
      const result = await dataService.updateArea(id, updates);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error updating area:', err);
      throw err;
    }
  };

  const deleteArea = async (id) => {
    try {
      const result = await dataService.deleteArea(id);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error deleting area:', err);
      throw err;
    }
  };

  const createProject = async (projectData) => {
    try {
      const result = await dataService.createProject(projectData);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  };

  const updateProject = async (id, updates) => {
    try {
      const result = await dataService.updateProject(id, updates);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      const result = await dataService.deleteProject(id);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  const createTask = async (taskData) => {
    try {
      const result = await dataService.createTask(taskData);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const result = await dataService.updateTask(id, updates);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      const result = await dataService.deleteTask(id);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  const createResource = async (resourceData) => {
    try {
      const result = await dataService.createResource(resourceData);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error creating resource:', err);
      throw err;
    }
  };

  const updateResource = async (id, updates) => {
    try {
      const result = await dataService.updateResource(id, updates);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error updating resource:', err);
      throw err;
    }
  };

  const deleteResource = async (id) => {
    try {
      const result = await dataService.deleteResource(id);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error deleting resource:', err);
      throw err;
    }
  };

  const createGoal = async (goalData) => {
    try {
      const result = await dataService.createGoal(goalData);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error creating goal:', err);
      throw err;
    }
  };

  const updateGoal = async (id, updates) => {
    try {
      const result = await dataService.updateGoal(id, updates);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error updating goal:', err);
      throw err;
    }
  };

  const deleteGoal = async (id) => {
    try {
      const result = await dataService.deleteGoal(id);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error deleting goal:', err);
      throw err;
    }
  };

  const createHabit = async (habitData) => {
    try {
      const result = await dataService.createHabit(habitData);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error creating habit:', err);
      throw err;
    }
  };

  const updateHabit = async (id, updates) => {
    try {
      const result = await dataService.updateHabit(id, updates);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error updating habit:', err);
      throw err;
    }
  };

  const deleteHabit = async (id) => {
    try {
      const result = await dataService.deleteHabit(id);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error deleting habit:', err);
      throw err;
    }
  };

  const archiveItem = async (itemId, itemType, reason) => {
    try {
      const result = await dataService.archiveItem(itemId, itemType, reason);
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      console.error('Error archiving item:', err);
      throw err;
    }
  };

  const getRelatedData = (itemId, itemType) => {
    return dataService.getRelatedData(itemId, itemType);
  };

  const refreshData = async () => {
    if (user?.id) {
      await dataService.loadAllData();
    }
  };

  const value = {
    // Data
    data,
    loading,
    error,
    
    // Areas
    areas: data.areas,
    createArea,
    updateArea,
    deleteArea,
    
    // Projects
    projects: data.projects,
    createProject,
    updateProject,
    deleteProject,
    
    // Tasks
    tasks: data.tasks,
    createTask,
    updateTask,
    deleteTask,
    
    // Resources
    resources: data.resources,
    createResource,
    updateResource,
    deleteResource,
    
    // Archives
    archives: data.archives,
    archiveItem,
    
    // Goals
    goals: data.goals,
    createGoal,
    updateGoal,
    deleteGoal,
    
    // Habits
    habits: data.habits,
    createHabit,
    updateHabit,
    deleteHabit,
    
    // Utilities
    getRelatedData,
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

