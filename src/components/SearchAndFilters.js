import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { PRIORITIES } from '../utils/taskUtils';

const SearchAndFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handlePriorityChange = (priority) => {
    const currentPriorities = filters.priorities || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];
    
    onFilterChange({ ...filters, priorities: newPriorities });
  };

  const handleDueDateFilterChange = (filter) => {
    onFilterChange({ ...filters, dueDateFilter: filter });
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      (filters.priorities && filters.priorities.length > 0) ||
      filters.dueDateFilter
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div className="flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</span>
            {Object.values(PRIORITIES).map((priority) => (
              <button
                key={priority}
                onClick={() => handlePriorityChange(priority)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                  filters.priorities?.includes(priority)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date Filter */}
        <div className="flex-shrink-0">
          <select
            value={filters.dueDateFilter || ''}
            onChange={(e) => handleDueDateFilterChange(e.target.value)}
            className="input-field text-sm"
          >
            <option value="">All Due Dates</option>
            <option value="overdue">Overdue</option>
            <option value="dueToday">Due Today</option>
            <option value="dueThisWeek">Due This Week</option>
            <option value="noDueDate">No Due Date</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters() && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <X size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Search: "{filters.search}"
              </span>
            )}
            {filters.priorities?.map((priority) => (
              <span
                key={priority}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                Priority: {priority}
              </span>
            ))}
            {filters.dueDateFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Due: {filters.dueDateFilter.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters; 