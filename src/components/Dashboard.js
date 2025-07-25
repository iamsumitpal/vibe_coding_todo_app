import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getUpcomingTasks, getOverdueTasks, formatDate } from '../utils/dateUtils';
import { getPriorityDistribution, getStatusDistribution, getActiveTasks, PRIORITIES, STATUSES } from '../utils/taskUtils';

const Dashboard = ({ tasks }) => {
  // Exclude archived tasks from dashboard metrics
  const activeTasks = getActiveTasks(tasks);
  const visibleTasks = tasks.filter(task => task.status !== 'Archived');
  
  const upcomingTasks = getUpcomingTasks(visibleTasks, 7);
  const overdueTasks = getOverdueTasks(visibleTasks);
  const priorityDistribution = getPriorityDistribution(visibleTasks);
  const statusDistribution = getStatusDistribution(visibleTasks);

  const totalTasks = visibleTasks.length;
  const completedTasks = visibleTasks.filter(task => task.status === STATUSES.DONE).length;
  const overdueTasksCount = overdueTasks.length;

  const priorityData = Object.entries(priorityDistribution).map(([priority, count]) => ({
    name: priority,
    value: count,
    color: priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#f59e0b' : '#10b981'
  }));

  const statusData = Object.entries(statusDistribution)
    .filter(([status]) => status !== 'Archived') // Exclude archived from chart
    .map(([status, count]) => ({
      name: status,
      value: count,
      color: status === 'To Do' ? '#3b82f6' : status === 'In Progress' ? '#f59e0b' : '#10b981'
    }));

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} text-white`}>
          <Icon size={24} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatCard
          title="Tasks Completed"
          value={completedTasks}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasksCount}
          icon={AlertTriangle}
          color="bg-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Upcoming Tasks (Next 7 Days)
          </h3>
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming tasks</p>
            ) : (
              upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Due: {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Overdue Tasks
          </h3>
          <div className="space-y-3">
            {overdueTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No overdue tasks</p>
            ) : (
              overdueTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Overdue: {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 