// Robust state manager for task persistence
const STORAGE_KEY = 'todo-app-tasks-v1';
const MEMORY_STORE_KEY = 'todo-app-memory-store';

class StateManager {
  constructor() {
    this.memoryStore = new Map();
    this.loadMemoryStore();
  }

  // Load memory store from localStorage
  loadMemoryStore() {
    try {
      const stored = localStorage.getItem(MEMORY_STORE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.memoryStore = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Error loading memory store:', error);
    }
  }

  // Save memory store to localStorage
  saveMemoryStore() {
    try {
      const serialized = Object.fromEntries(this.memoryStore);
      localStorage.setItem(MEMORY_STORE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error('Error saving memory store:', error);
    }
  }

  // Get tasks with fallback to memory store
  getTasks() {
    try {
      // Try localStorage first
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Convert date strings back to Date objects
          const tasks = parsed.map(task => ({
            ...task,
            createdAt: new Date(task.createdAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : null
          }));
          
          // Update memory store
          this.memoryStore.set(STORAGE_KEY, tasks);
          this.saveMemoryStore();
          
          return tasks;
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }

    // Fallback to memory store
    const memoryTasks = this.memoryStore.get(STORAGE_KEY);
    if (memoryTasks && Array.isArray(memoryTasks)) {
      console.log('Using memory store as fallback');
      return memoryTasks;
    }

    // Return default tasks if nothing is stored
    return this.getDefaultTasks();
  }

  // Save tasks with multiple fallbacks
  saveTasks(tasks) {
    if (!Array.isArray(tasks)) {
      console.error('Invalid tasks data:', tasks);
      return false;
    }

    try {
      // Convert Date objects to strings for localStorage
      const serializedTasks = tasks.map(task => ({
        ...task,
        createdAt: task.createdAt instanceof Date ? task.createdAt.toISOString() : new Date(task.createdAt).toISOString(),
        dueDate: task.dueDate ? (task.dueDate instanceof Date ? task.dueDate.toISOString() : new Date(task.dueDate).toISOString()) : null
      }));
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedTasks));
      
      // Save to memory store as backup
      this.memoryStore.set(STORAGE_KEY, tasks);
      this.saveMemoryStore();
      
      // Create backup with timestamp
      const backupKey = `${STORAGE_KEY}-backup-${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(serializedTasks));
      
      // Clean up old backups (keep only last 10)
      const backupKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(`${STORAGE_KEY}-backup-`)
      ).sort();
      
      if (backupKeys.length > 10) {
        backupKeys.slice(0, -10).forEach(key => localStorage.removeItem(key));
      }
      
      console.log(`Saved ${tasks.length} tasks (localStorage + memory store)`);
      return true;
    } catch (error) {
      console.error('Error saving tasks:', error);
      
      // Fallback: save only to memory store
      try {
        this.memoryStore.set(STORAGE_KEY, tasks);
        this.saveMemoryStore();
        console.log(`Saved ${tasks.length} tasks to memory store only`);
        return true;
      } catch (memoryError) {
        console.error('Error saving to memory store:', memoryError);
        return false;
      }
    }
  }

  // Get default tasks
  getDefaultTasks() {
    return [
      {
        id: '1',
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the React todo app',
        status: 'To Do',
        priority: 'High',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: 'Implement drag and drop',
        description: 'Add smooth drag and drop functionality using dnd-kit',
        status: 'In Progress',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: 'Design user interface',
        description: 'Create modern and responsive UI with Tailwind CSS',
        status: 'Done',
        priority: 'Low',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        title: 'Set up Firebase integration',
        description: 'Configure Firestore database and real-time updates',
        status: 'To Do',
        priority: 'High',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        title: 'Add search and filtering',
        description: 'Implement advanced search and filter functionality',
        status: 'To Do',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '6',
        title: 'Create dashboard analytics',
        description: 'Build charts and statistics for task overview',
        status: 'In Progress',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '7',
        title: 'Test responsive design',
        description: 'Ensure app works perfectly on mobile and tablet',
        status: 'Done',
        priority: 'Low',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        id: '8',
        title: 'Optimize performance',
        description: 'Improve loading times and reduce bundle size',
        status: 'Done',
        priority: 'High',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  // Clear all data
  clearData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.memoryStore.delete(STORAGE_KEY);
      this.saveMemoryStore();
      
      // Clear all backups
      const backupKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(`${STORAGE_KEY}-backup-`)
      );
      backupKeys.forEach(key => localStorage.removeItem(key));
      
      console.log('Cleared all task data');
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  // Get storage info
  getStorageInfo() {
    try {
      const localStorageSize = localStorage.getItem(STORAGE_KEY)?.length || 0;
      const memoryStoreSize = this.memoryStore.size;
      const backupCount = Object.keys(localStorage).filter(key => 
        key.startsWith(`${STORAGE_KEY}-backup-`)
      ).length;
      
      return {
        localStorageSize,
        memoryStoreSize,
        backupCount,
        hasData: localStorageSize > 0 || memoryStoreSize > 0
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { localStorageSize: 0, memoryStoreSize: 0, backupCount: 0, hasData: false };
    }
  }
}

// Create singleton instance
const stateManager = new StateManager();

export default stateManager; 