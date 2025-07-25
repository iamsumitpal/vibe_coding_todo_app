import React from 'react';
import { Trash2, Calendar, Archive } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { formatDate, isOverdueTask } from '../utils/dateUtils';
import { getPriorityColor } from '../utils/taskUtils';

const TaskCard = ({ task, onEdit, onDelete, onArchive, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isCardDragging,
  } = useDraggable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleArchive = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to archive this task? It will be hidden from the board but can still be found via search.')) {
      onArchive(task.id);
    }
  };

  // Ensure task exists and has required properties
  if (!task || !task.id) {
    console.warn('TaskCard: Invalid task provided', task);
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`card p-4 mb-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isDragging || isCardDragging ? 'opacity-50 rotate-2' : ''
      } ${isOverdueTask(task.dueDate) ? 'border-red-300 dark:border-red-600' : ''}`}
      onClick={handleEdit}
      data-task-id={task.id}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex items-center space-x-1 ml-2">
          <div
            className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}
            title={`Priority: ${task.priority}`}
          />
          {onArchive && (
            <button
              onClick={handleArchive}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
              title="Archive task"
            >
              <Archive size={16} />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <Calendar size={14} />
          {task.dueDate ? (
            <span className={isOverdueTask(task.dueDate) ? 'text-red-500 font-medium' : ''}>
              {formatDate(task.dueDate)}
            </span>
          ) : (
            <span>No due date</span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 