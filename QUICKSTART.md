# 🚀 Quick Start Guide

## Start the Todo App

### Option 1: Using npm
```bash
npm start
# or
npm run dev
```

### Option 2: Using the startup script
```bash
./start.sh
```

### Option 3: Manual steps
```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

## Access the Application

Once started, open your browser and navigate to:
**http://localhost:3000**

## Features Available

✅ **Task Management**: Create, edit, delete tasks  
✅ **Kanban Board**: Drag-and-drop between columns  
✅ **Dashboard**: Analytics and charts  
✅ **Search & Filter**: Find tasks quickly  
✅ **Dark/Light Mode**: Toggle theme  
✅ **Responsive**: Works on all devices  

## Demo Mode

The application runs in **demo mode** by default, which means:
- No Firebase setup required
- Data is stored in localStorage
- All features work immediately
- Sample tasks are included

## Troubleshooting

If you encounter any issues:
1. Make sure Node.js is installed (version 14+)
2. Clear browser cache if needed
3. Check that port 3000 is available
4. Run `npm install` if dependencies are missing

## Next Steps

To use with real Firebase:
1. Set `isDemoMode = false` in `src/firebase.js`
2. Add your Firebase configuration
3. Set up Firestore database

Enjoy your Todo App! 🎉 