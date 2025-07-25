// Data persistence utilities for the todo app
const STORAGE_KEY = 'todo-app-tasks-v1';

export const exportData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      throw new Error('No data found to export');
    }
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-app-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true, message: 'Data exported successfully' };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, message: error.message };
  }
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        resolve({ success: true, message: 'Data imported successfully' });
      } catch (error) {
        reject({ success: false, message: 'Invalid file format' });
      }
    };
    
    reader.onerror = () => {
      reject({ success: false, message: 'Error reading file' });
    };
    
    reader.readAsText(file);
  });
};

export const clearData = () => {
  try {
    // Clear main data
    localStorage.removeItem(STORAGE_KEY);
    
    // Clear all backups
    const backupKeys = Object.keys(localStorage).filter(key => 
      key.startsWith(`${STORAGE_KEY}-backup-`)
    );
    backupKeys.forEach(key => localStorage.removeItem(key));
    
    return { success: true, message: 'All data cleared successfully' };
  } catch (error) {
    console.error('Clear data error:', error);
    return { success: false, message: error.message };
  }
};

export const getDataSize = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return '0 KB';
    
    const sizeInBytes = new Blob([data]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    return `${sizeInKB} KB`;
  } catch (error) {
    return 'Unknown';
  }
};

export const getBackupCount = () => {
  try {
    const backupKeys = Object.keys(localStorage).filter(key => 
      key.startsWith(`${STORAGE_KEY}-backup-`)
    );
    return backupKeys.length;
  } catch (error) {
    return 0;
  }
};

export const restoreFromBackup = () => {
  try {
    const backupKeys = Object.keys(localStorage).filter(key => 
      key.startsWith(`${STORAGE_KEY}-backup-`)
    ).sort();
    
    if (backupKeys.length === 0) {
      throw new Error('No backups found');
    }
    
    const latestBackup = backupKeys[backupKeys.length - 1];
    const backupData = localStorage.getItem(latestBackup);
    
    if (!backupData) {
      throw new Error('Backup data is corrupted');
    }
    
    localStorage.setItem(STORAGE_KEY, backupData);
    return { success: true, message: 'Data restored from latest backup' };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, message: error.message };
  }
};

export const resetToDefaults = () => {
  try {
    // Clear all data to force reload of default tasks
    clearData();
    return { success: true, message: 'Reset to default tasks. Please refresh the page.' };
  } catch (error) {
    console.error('Reset error:', error);
    return { success: false, message: error.message };
  }
}; 