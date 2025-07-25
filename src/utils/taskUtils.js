export const PRIORITIES = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };
export const STATUSES = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done', ARCHIVED: 'Archived' };

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-red-500';
    case 'Medium':
      return 'bg-yellow-500';
    case 'Low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'To Do':
      return 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800';
    case 'In Progress':
      return 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800';
    case 'Done':
      return 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800';
    case 'Archived':
      return 'bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800';
    default:
      return 'bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800';
  }
};

export const filterTasks = (tasks, filters) => {
  let filtered = [...tasks];

  // Filter by search term
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      (task.description && task.description.toLowerCase().includes(searchTerm))
    );
  }

  // Filter by priority
  if (filters.priorities && filters.priorities.length > 0) {
    filtered = filtered.filter(task => filters.priorities.includes(task.priority));
  }

  // Filter by due date
  if (filters.dueDateFilter) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    switch (filters.dueDateFilter) {
      case 'overdue':
        filtered = filtered.filter(task => 
          task.dueDate && task.dueDate < today
        );
        break;
      case 'today':
        filtered = filtered.filter(task => 
          task.dueDate && task.dueDate >= today && task.dueDate < tomorrow
        );
        break;
      case 'thisWeek':
        filtered = filtered.filter(task => 
          task.dueDate && task.dueDate >= today && task.dueDate < endOfWeek
        );
        break;
      case 'noDueDate':
        filtered = filtered.filter(task => !task.dueDate);
        break;
    }
  }

  return filtered;
};

export const getTasksByStatus = (tasks, status) => {
  return tasks.filter(task => task.status === status);
};

export const getPriorityDistribution = (tasks) => {
  const distribution = { Low: 0, Medium: 0, High: 0 };
  tasks.forEach(task => {
    if (distribution.hasOwnProperty(task.priority)) {
      distribution[task.priority]++;
    }
  });
  return distribution;
};

export const getStatusDistribution = (tasks) => {
  const distribution = { 'To Do': 0, 'In Progress': 0, 'Done': 0, 'Archived': 0 };
  tasks.forEach(task => {
    if (distribution.hasOwnProperty(task.status)) {
      distribution[task.status]++;
    }
  });
  return distribution;
};

// Get visible tasks (exclude archived for normal display)
export const getVisibleTasks = (tasks) => {
  return tasks.filter(task => task.status !== 'Archived');
};

// Get archived tasks only
export const getArchivedTasks = (tasks) => {
  return tasks.filter(task => task.status === 'Archived');
};

// Get active tasks (exclude archived and done for metrics)
export const getActiveTasks = (tasks) => {
  return tasks.filter(task => task.status !== 'Archived' && task.status !== 'Done');
}; 