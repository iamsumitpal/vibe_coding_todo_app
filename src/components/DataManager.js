import React, { useState, useRef } from 'react';
import { Download, Upload, Trash2, RotateCcw, Database, RefreshCw } from 'lucide-react';
import { exportData, importData, clearData, getDataSize, getBackupCount, restoreFromBackup, resetToDefaults } from '../utils/dataPersistence';

const DataManager = ({ onDataImported }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    setIsExporting(true);
    setMessage('');
    
    try {
      const result = exportData();
      if (result.success) {
        setMessage('✅ ' + result.message);
      } else {
        setMessage('❌ ' + result.message);
      }
    } catch (error) {
      setMessage('❌ Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setMessage('');
    
    try {
      const result = await importData(file);
      if (result.success) {
        setMessage('✅ ' + result.message);
        if (onDataImported) {
          onDataImported();
        }
      } else {
        setMessage('❌ ' + result.message);
      }
    } catch (error) {
      setMessage('❌ Import failed: ' + error.message);
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      const result = clearData();
      if (result.success) {
        setMessage('✅ ' + result.message);
        if (onDataImported) {
          onDataImported();
        }
      } else {
        setMessage('❌ ' + result.message);
      }
    }
  };

  const handleRestoreBackup = () => {
    if (window.confirm('Are you sure you want to restore from the latest backup?')) {
      const result = restoreFromBackup();
      if (result.success) {
        setMessage('✅ ' + result.message);
        if (onDataImported) {
          onDataImported();
        }
      } else {
        setMessage('❌ ' + result.message);
      }
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset to default tasks? This will clear all current data.')) {
      const result = resetToDefaults();
      if (result.success) {
        setMessage('✅ ' + result.message);
        // Force page reload to load new default tasks
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage('❌ ' + result.message);
      }
    }
  };

  const dataSize = getDataSize();
  const backupCount = getBackupCount();

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Data Management</h2>
        <Database className="text-gray-400" size={24} />
      </div>

      {/* Data Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Data Size</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{dataSize}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Backups Available</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{backupCount}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <Download size={16} />
          <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <Upload size={16} />
          <span>{isImporting ? 'Importing...' : 'Import'}</span>
        </button>

        <button
          onClick={handleRestoreBackup}
          disabled={backupCount === 0}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <RotateCcw size={16} />
          <span>Restore</span>
        </button>

        <button
          onClick={handleClearData}
          className="btn-secondary flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
        >
          <Trash2 size={16} />
          <span>Clear</span>
        </button>
      </div>

      {/* Reset to Defaults Button */}
      <div className="mb-6">
        <button
          onClick={handleResetToDefaults}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <RefreshCw size={16} />
          <span>Reset to Default Tasks</span>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      {/* Message Display */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.startsWith('✅') 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
        }`}>
          {message}
        </div>
      )}

      {/* Information */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Export: Download your current data as a JSON file</p>
        <p>• Import: Load data from a previously exported JSON file</p>
        <p>• Restore: Recover data from the latest backup</p>
        <p>• Clear: Remove all data and backups</p>
        <p>• Reset: Load default tasks with multiple items per column</p>
      </div>
    </div>
  );
};

export default DataManager; 