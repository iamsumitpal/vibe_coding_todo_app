import { useState, useEffect, useCallback, useRef } from 'react';
import { isDemoMode } from '../firebase';
import stateManager from '../utils/stateManager';

// Auto-save functionality with immediate save option
let autoSaveTimeout = null;
const scheduleAutoSave = (tasks) => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  autoSaveTimeout = setTimeout(() => {
    stateManager.saveTasks(tasks);
  }, 500); // Reduced to 500ms for more frequent saves
};

// Immediate save function
const saveImmediately = (tasks) => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  stateManager.saveTasks(tasks);
};

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use useRef to maintain the latest tasks state for event handlers
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  // Memoize the save function to prevent unnecessary re-renders
  const saveData = useCallback(() => {
    if (isDemoMode) {
      saveImmediately(tasksRef.current);
    }
  }, []);

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode - use robust state manager with persistence
      const demoTasks = stateManager.getTasks();
      setTasks(demoTasks);
      setLoading(false);
      
      // Set up multiple save triggers for maximum persistence
      const handleBeforeUnload = () => {
        saveImmediately(tasksRef.current);
      };
      
      const handleVisibilityChange = () => {
        if (document.hidden) {
          saveImmediately(tasksRef.current);
        }
      };
      
      const handlePageHide = () => {
        saveImmediately(tasksRef.current);
      };
      
      // Add event listeners
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('pagehide', handlePageHide);
      
      // Also save on window focus/blur for extra safety
      const handleWindowFocus = () => {
        saveImmediately(tasksRef.current);
      };
      
      const handleWindowBlur = () => {
        saveImmediately(tasksRef.current);
      };
      
      window.addEventListener('focus', handleWindowFocus);
      window.addEventListener('blur', handleWindowBlur);
      
      // Save on page load to ensure data is persisted
      const handlePageLoad = () => {
        saveImmediately(tasksRef.current);
      };
      
      window.addEventListener('load', handlePageLoad);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('pagehide', handlePageHide);
        window.removeEventListener('focus', handleWindowFocus);
        window.removeEventListener('blur', handleWindowBlur);
        window.removeEventListener('load', handlePageLoad);
        if (autoSaveTimeout) {
          clearTimeout(autoSaveTimeout);
        }
      };
    } else {
      // Real Firebase mode - only load if not in demo mode
      setError(new Error('Firebase mode not implemented in this demo'));
      setLoading(false);
    }
  }, []);

  // Auto-save when tasks change
  useEffect(() => {
    if (isDemoMode && tasks.length >= 0) { // Changed from > 0 to >= 0 to save even empty arrays
      scheduleAutoSave(tasks);
    }
  }, [tasks]);

  const addTask = async (taskData) => {
    try {
      if (isDemoMode) {
        // Demo mode - simulate async operation
        const newTask = {
          id: Date.now().toString(),
          ...taskData,
          createdAt: new Date(),
          status: taskData.status || 'To Do'
        };
        const updatedTasks = [newTask, ...tasks];
        setTasks(updatedTasks);
        saveImmediately(updatedTasks); // Immediate save
        return newTask.id;
      } else {
        throw new Error('Firebase mode not implemented in this demo');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      if (isDemoMode) {
        const updatedTasks = tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        );
        setTasks(updatedTasks);
        saveImmediately(updatedTasks); // Immediate save
      } else {
        throw new Error('Firebase mode not implemented in this demo');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      if (isDemoMode) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        saveImmediately(updatedTasks); // Immediate save
      } else {
        throw new Error('Firebase mode not implemented in this demo');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const moveTask = async (taskId, newStatus) => {
    try {
      if (isDemoMode) {
        const updatedTasks = tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);
        saveImmediately(updatedTasks); // Immediate save
      } else {
        throw new Error('Firebase mode not implemented in this demo');
      }
    } catch (error) {
      console.error('Error moving task:', error);
      throw error;
    }
  };

  const bulkArchiveTasks = async (taskIds) => {
    try {
      if (isDemoMode) {
        const updatedTasks = tasks.map(task =>
          taskIds.includes(task.id) ? { ...task, status: 'Archived' } : task
        );
        setTasks(updatedTasks);
        saveImmediately(updatedTasks); // Immediate save
      } else {
        throw new Error('Firebase mode not implemented in this demo');
      }
    } catch (error) {
      console.error('Error bulk archiving tasks:', error);
      throw error;
    }
  };

  return { tasks, loading, error, addTask, updateTask, deleteTask, moveTask, bulkArchiveTasks, saveData };
}; 