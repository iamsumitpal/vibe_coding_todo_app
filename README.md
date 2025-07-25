# Todo App - Kanban Board

A modern, feature-rich browser-based to-do list application built with React, Firestore, and Tailwind CSS. The application provides a seamless user experience for creating, organizing, and tracking tasks with a visual Kanban-style interface and powerful filtering capabilities.

## 🚀 Features

### Core Functionality
- **Task Management (CRUD Operations)**: Create, read, update, and delete tasks with full form validation
- **Kanban Board**: Visual task organization with three columns: To Do, In Progress, and Done
- **Drag-and-Drop**: Smooth drag-and-drop functionality for moving tasks between columns
- **Real-time Updates**: Live synchronization with Firestore database
- **Search & Filtering**: Advanced search and filtering capabilities
- **Dashboard Analytics**: Comprehensive task overview with charts and statistics
- **Auto-Start**: Runs automatically on system boot and login

### Task Properties
- **Title** (required): Task name
- **Description** (optional): Detailed task description
- **Priority** (required): Low, Medium, or High with color coding
- **Status**: To Do, In Progress, or Done
- **Due Date** (optional): Task deadline with overdue detection

### Advanced Features
- **Dark/Light Mode**: Theme toggle with persistent user preference
- **Responsive Design**: Fully responsive layout for desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators and error handling
- **Empty States**: Helpful empty state messages and guidance
- **Confirmation Dialogs**: Safe delete operations with confirmation
- **Data Persistence**: Survives browser restarts and system reboots
- **Auto-Restart**: Automatically restarts if the application crashes

## 🛠️ Technology Stack

- **Frontend**: React 18+ with functional components and hooks
- **Styling**: Tailwind CSS with custom design system
- **Database**: Google Firestore with real-time updates
- **Drag-and-Drop**: @dnd-kit for smooth interactions
- **Icons**: Lucide React for consistent iconography
- **Date Management**: date-fns for date formatting and calculations
- **Charts**: Recharts for data visualization
- **Process Management**: PM2 for auto-restart and system integration

## 📦 Installation

### Option 1: Quick Start (Development)
```bash
# Clone the repository
git clone <repository-url>
cd todo

# Install dependencies
npm install

# Start development server
npm start
```

### Option 2: Auto-Start Setup (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd todo

# Set up auto-start (runs on login)
./auto-start.sh

# The app will now start automatically when you log in
```

### Option 3: System Service (Production)
```bash
# Clone the repository
git clone <repository-url>
cd todo

# Install as system service (requires sudo)
sudo ./install-service.sh

# The app will now start automatically on system boot
```

## 🔄 Auto-Start Options

### 1. User-Level Auto-Start (Recommended)
```bash
./auto-start.sh
```
- Starts when you log in
- Uses PM2 for process management
- Works on macOS and Linux
- No system-level permissions required

### 2. System Service (Production)
```bash
sudo ./install-service.sh
```
- Starts on system boot
- Runs as a system service
- Requires sudo permissions
- Best for servers and production environments

### 3. Manual PM2 Management
```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

## 🗄️ Firestore Data Structure

The application uses a `tasks` collection with the following document structure:

```javascript
{
  "title": "string",           // Required
  "description": "string",      // Optional
  "status": "string",          // "To Do", "In Progress", "Done"
  "priority": "string",        // "Low", "Medium", "High"
  "dueDate": "timestamp",      // Firestore timestamp (optional)
  "createdAt": "timestamp"     // Auto-generated
}
```

## 🎨 Features in Detail

### Kanban Board
- Three default columns: To Do, In Progress, Done
- Drag-and-drop task movement between columns
- Visual task cards with priority indicators and due dates
- Empty state messages for each column
- Horizontal scrolling for smaller screens

### Dashboard Analytics
- **Summary Cards**: Total tasks, completed tasks, overdue tasks
- **Priority Distribution**: Pie chart showing task distribution by priority
- **Status Distribution**: Bar chart showing task distribution by status
- **Upcoming Tasks**: List of tasks due in the next 7 days
- **Overdue Tasks**: Highlighted overdue tasks with warnings

### Search and Filtering
- **Real-time Search**: Search tasks by title or description
- **Priority Filtering**: Multi-select priority filter
- **Due Date Filtering**: Filter by overdue, due today, due this week, or no due date
- **Combined Filters**: Multiple filters work together
- **Clear Filters**: One-click filter reset

### Task Management
- **Create Tasks**: Modal form with all required fields
- **Edit Tasks**: Click any task card to edit
- **Delete Tasks**: Safe deletion with confirmation dialog
- **Move Tasks**: Drag-and-drop or status dropdown
- **Form Validation**: Required field validation and error handling

### Data Persistence
- **Automatic Saving**: Data saved after every change
- **Backup System**: Automatic timestamped backups
- **Export/Import**: Backup and restore functionality
- **Cross-Device**: Export files work across devices
- **Survives Reboots**: Data persists across system restarts

### User Experience
- **Dark/Light Mode**: Toggle with persistent preference
- **Responsive Design**: Works on all device sizes
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error messages
- **Animations**: Smooth transitions and hover effects

## 🔧 Management Commands

### PM2 Commands
```bash
# Check status
pm2 status

# View logs
pm2 logs todo-app

# Monitor processes
pm2 monit

# Restart app
pm2 restart todo-app

# Stop app
pm2 stop todo-app

# Delete app
pm2 delete todo-app
```

### System Service Commands (if installed as service)
```bash
# Start service
sudo systemctl start todo-app

# Stop service
sudo systemctl stop todo-app

# Restart service
sudo systemctl restart todo-app

# Check status
sudo systemctl status todo-app

# View logs
sudo journalctl -u todo-app -f
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy with PM2
```bash
# Build and deploy
npm run deploy

# Or manually
npm run build
pm2 start ecosystem.config.js
```

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### Environment Variables
For production, consider using environment variables for Firebase configuration:
```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // ... other config
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the Firebase configuration
2. Ensure all dependencies are installed
3. Check the browser console for errors
4. Verify Firestore rules allow read/write operations
5. Check PM2 logs: `pm2 logs todo-app`

## 🔮 Future Enhancements

- User authentication and multi-user support
- Task categories and labels
- File attachments
- Task comments and collaboration
- Export/import functionality
- Advanced analytics and reporting
- Mobile app version
- Offline support with service workers
- Docker containerization
- Kubernetes deployment 