import { format, isToday, isTomorrow, isYesterday, addDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  
  if (isToday(date)) {
    return 'Today';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM dd, yyyy');
  }
};

export const formatTime = (date) => {
  if (!date) return '';
  return format(date, 'HH:mm');
};

// Custom implementation of isOverdue since it doesn't exist in date-fns
export const isOverdueTask = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  return dueDate < now;
};

export const isDueToday = (dueDate) => {
  if (!dueDate) return false;
  return isToday(dueDate);
};

export const isDueThisWeek = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  
  return isWithinInterval(dueDate, { start: weekStart, end: weekEnd });
};

export const getUpcomingTasks = (tasks, days = 7) => {
  const now = new Date();
  const futureDate = addDays(now, days);
  
  return tasks.filter(task => {
    if (!task.dueDate) return false;
    return task.dueDate >= now && task.dueDate <= futureDate;
  }).sort((a, b) => a.dueDate - b.dueDate);
};

export const getOverdueTasks = (tasks) => {
  return tasks.filter(task => task.dueDate && isOverdueTask(task.dueDate));
}; 