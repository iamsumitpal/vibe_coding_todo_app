import React, { useState } from 'react';
import { DndContext, DragOverlay, useSensors, useSensor, PointerSensor, closestCorners } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { STATUSES, getTasksByStatus, filterTasks, getVisibleTasks } from '../utils/taskUtils';

const KanbanBoard = ({ 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onMoveTask,
  onArchiveTask,
  onBulkArchiveTasks,
  filters 
}) => {
  const [activeTask, setActiveTask] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter tasks based on search and other filters
  const filteredTasks = filterTasks(tasks, filters);
  
  // For normal display, exclude archived tasks unless searching
  const displayTasks = filters.search ? filteredTasks : getVisibleTasks(filteredTasks);
  
  // Only show main columns (exclude Archived from board display)
  const columns = Object.values(STATUSES).filter(status => status !== 'Archived');

  const handleDragStart = (event) => {
    const { active } = event;
    
    if (!active || !active.id) {
      console.warn('Drag start event missing active or active.id');
      return;
    }

    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
      setIsDragging(true);
      console.log('Started dragging task:', task.title, 'from status:', task.status);
    } else {
      console.warn('Task not found for id:', active.id);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setIsDragging(false);
    setActiveTask(null);

    if (!active || !active.id) {
      console.warn('Drag end event missing active or active.id');
      return;
    }

    if (over && active.id !== over.id) {
      const taskId = active.id;
      const newStatus = over.id;
      
      // Check if the target is a valid status column
      if (Object.values(STATUSES).includes(newStatus)) {
        const currentTask = tasks.find(t => t.id === taskId);
        if (currentTask && currentTask.status !== newStatus) {
          console.log(`Moving task ${taskId} from ${currentTask.status} to ${newStatus}`);
          onMoveTask(taskId, newStatus);
        } else {
          console.log('Task already in target status or invalid move');
        }
      } else {
        console.log('Target is not a valid status column:', newStatus);
      }
    }
  };

  const handleDragCancel = () => {
    setIsDragging(false);
    setActiveTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sumit's Board</h1>
        {filters.search && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing search results (including archived tasks)
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[restrictToHorizontalAxis]}
      >
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {columns.map((status) => {
            const statusTasks = getTasksByStatus(displayTasks, status);
            
            return (
              <KanbanColumn
                key={status}
                status={status}
                tasks={statusTasks}
                onAddTask={onAddTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onArchiveTask={onArchiveTask}
                onBulkArchiveTasks={onBulkArchiveTasks}
                isDragging={isDragging}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard; 