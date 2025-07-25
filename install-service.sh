#!/bin/bash

# Todo App Service Installer
# This script installs the todo app as a system service that starts on boot

echo "🚀 Installing Todo App as System Service..."

# Check if running as root (needed for system service installation)
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    echo "Usage: sudo ./install-service.sh"
    exit 1
fi

# Get the current directory
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_NAME="todo-app"
SERVICE_NAME="todo-app"
USER=$(who am i | awk '{print $1}')

echo "📁 App Directory: $APP_DIR"
echo "👤 User: $USER"

# Install dependencies
echo "📦 Installing dependencies..."
cd "$APP_DIR"
npm install

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Create logs directory
mkdir -p "$APP_DIR/logs"

# Create systemd service file
echo "🔧 Creating systemd service..."
cat > /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=Todo App Service
After=network.target

[Service]
Type=forking
User=$USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/pm2 start ecosystem.config.js
ExecStop=/usr/bin/pm2 stop $APP_NAME
ExecReload=/usr/bin/pm2 reload $APP_NAME
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
echo "🔄 Reloading systemd..."
systemctl daemon-reload

# Enable the service to start on boot
echo "✅ Enabling service to start on boot..."
systemctl enable $SERVICE_NAME

# Start the service
echo "🚀 Starting the service..."
systemctl start $SERVICE_NAME

# Check service status
echo "📊 Service status:"
systemctl status $SERVICE_NAME --no-pager

echo ""
echo "✅ Todo App service installed successfully!"
echo ""
echo "📋 Service Commands:"
echo "  Start:   sudo systemctl start $SERVICE_NAME"
echo "  Stop:    sudo systemctl stop $SERVICE_NAME"
echo "  Restart: sudo systemctl restart $SERVICE_NAME"
echo "  Status:  sudo systemctl status $SERVICE_NAME"
echo "  Logs:    sudo journalctl -u $SERVICE_NAME -f"
echo ""
echo "🌐 Access the app at: http://localhost:3000"
echo ""
echo "📝 PM2 Commands:"
echo "  Status:  pm2 status"
echo "  Logs:    pm2 logs $APP_NAME"
echo "  Monitor: pm2 monit" 