import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTasks } from './hooks/useTasks';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import Dashboard from './components/Dashboard';
import SearchAndFilters from './components/SearchAndFilters';
import TaskModal from './components/TaskModal';
import DataManager from './components/DataManager';
import { Loader2, Settings } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('kanban');
  const [filters, setFilters] = useState({
    search: '',
    priorities: [],
    dueDateFilter: ''
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    task: null,
    mode: 'create'
  });

  const { tasks, loading, error, addTask, updateTask, deleteTask, moveTask, bulkArchiveTasks, saveData } = useTasks();

  const handleAddTask = (status) => {
    setModalState({
      isOpen: true,
      task: null,
      mode: 'create'
    });
  };

  const handleEditTask = (task) => {
    setModalState({
      isOpen: true,
      task: task,
      mode: 'edit'
    });
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (modalState.mode === 'create') {
        await addTask(taskData);
      } else {
        await updateTask(modalState.task.id, taskData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      await moveTask(taskId, newStatus);
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const handleArchiveTask = async (taskId) => {
    try {
      await moveTask(taskId, 'Archived');
    } catch (error) {
      console.error('Error archiving task:', error);
    }
  };

  const handleBulkArchiveTasks = async (taskIds) => {
    try {
      await bulkArchiveTasks(taskIds);
    } catch (error) {
      console.error('Error bulk archiving tasks:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      priorities: [],
      dueDateFilter: ''
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      task: null,
      mode: 'create'
    });
  };

  const handleDataImported = (importedData) => {
    window.location.reload(); // Force a page reload to apply the imported data
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Error Loading Application
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
          ) : (
            <>
              {currentView === 'kanban' && (
                <SearchAndFilters 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  onClearFilters={handleClearFilters} 
                />
              )}
              
              {currentView === 'kanban' ? (
                <KanbanBoard 
                  tasks={tasks} 
                  onAddTask={handleAddTask} 
                  onEditTask={handleEditTask} 
                  onDeleteTask={handleDeleteTask} 
                  onMoveTask={handleMoveTask}
                  onArchiveTask={handleArchiveTask}
                  onBulkArchiveTasks={handleBulkArchiveTasks}
                  filters={filters} 
                />
              ) : currentView === 'dashboard' ? (
                <Dashboard tasks={tasks} />
              ) : currentView === 'settings' ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                  </div>
                  <DataManager onDataImported={handleDataImported} />
                </div>
              ) : null}
            </>
          )}
        </main>
        <TaskModal 
          isOpen={modalState.isOpen} 
          onClose={closeModal} 
          task={modalState.task} 
          onSave={handleSaveTask} 
          mode={modalState.mode} 
        />
      </div>
    </ThemeProvider>
  );
};

export default App; 