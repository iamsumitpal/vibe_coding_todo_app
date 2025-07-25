import React from 'react';
import { Plus, Archive } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { getStatusColor } from '../utils/taskUtils';

const KanbanColumn = ({ 
  status, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  onArchiveTask,
  onBulkArchiveTasks,
  isDragging 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const getStatusCount = () => {
    return tasks.length;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'To Do':
        return '📋';
      case 'In Progress':
        return '🔄';
      case 'Done':
        return '✅';
      case 'Archived':
        return '📦';
      default:
        return '📋';
    }
  };

  const handleArchiveAll = () => {
    if (window.confirm(`Are you sure you want to archive all ${tasks.length} completed tasks?`)) {
      const taskIds = tasks.map(task => task.id);
      if (onBulkArchiveTasks) {
        onBulkArchiveTasks(taskIds);
      }
    }
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div 
        ref={setNodeRef}
        className={`rounded-lg p-4 ${getStatusColor(status)} min-h-[400px] transition-colors duration-200 ${
          isDragging ? 'bg-opacity-80' : ''
        } ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50 bg-opacity-90' : ''}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon()}</span>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {status}
            </h3>
            <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
              {getStatusCount()}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            {status === 'To Do' && (
              <button
                onClick={() => onAddTask(status)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                title="Add task"
              >
                <Plus size={16} />
              </button>
            )}
            
            {status === 'Done' && tasks.length > 0 && (
              <button
                onClick={handleArchiveAll}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                title="Archive all completed tasks"
              >
                <Archive size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 min-h-[200px]">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-sm">No tasks here</p>
              <p className="text-xs mt-1">
                {status === 'Done' ? 'Completed tasks will appear here' : 'Drop tasks here or add one!'}
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onArchive={status === 'Done' ? onArchiveTask : undefined}
                isDragging={isDragging}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn; 