#!/bin/bash

# Todo App Service Uninstaller
# This script removes the todo app system service

echo "🗑️  Uninstalling Todo App System Service..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    echo "Usage: sudo ./uninstall-service.sh"
    exit 1
fi

SERVICE_NAME="todo-app"
APP_NAME="todo-app"

# Stop the service
echo "🛑 Stopping the service..."
systemctl stop $SERVICE_NAME 2>/dev/null || true

# Disable the service
echo "❌ Disabling the service..."
systemctl disable $SERVICE_NAME 2>/dev/null || true

# Remove the service file
echo "🗑️  Removing service file..."
rm -f /etc/systemd/system/$SERVICE_NAME.service

# Reload systemd
echo "🔄 Reloading systemd..."
systemctl daemon-reload

# Stop PM2 process
echo "🛑 Stopping PM2 process..."
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# Save PM2 configuration
pm2 save 2>/dev/null || true

echo ""
echo "✅ Todo App service uninstalled successfully!"
echo ""
echo "📝 To completely remove PM2:"
echo "  npm uninstall -g pm2"
echo ""
echo "📝 To remove the app directory:"
echo "  rm -rf $(pwd)" 