#!/bin/bash

# Todo App Auto-Start Script
# This script sets up the app to start automatically on login

echo "🚀 Setting up Todo App Auto-Start..."

# Get the current directory
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
USER=$(whoami)

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

# Create startup script
echo "🔧 Creating startup script..."
cat > "$APP_DIR/startup.sh" << EOF
#!/bin/bash
cd "$APP_DIR"
pm2 start ecosystem.config.js
EOF

chmod +x "$APP_DIR/startup.sh"

# Add to user's login items (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Adding to macOS login items..."
    osascript << EOF
tell application "System Events"
    make login item at end with properties {path:"$APP_DIR/startup.sh", hidden:true}
end tell
EOF
    echo "✅ Added to macOS login items"
fi

# Add to user's crontab (Linux/Unix)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Adding to crontab for auto-start..."
    (crontab -l 2>/dev/null; echo "@reboot cd $APP_DIR && pm2 start ecosystem.config.js") | crontab -
    echo "✅ Added to crontab"
fi

# Start the app now
echo "🚀 Starting the app..."
pm2 start ecosystem.config.js

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Set PM2 to start on system boot
echo "🔧 Setting PM2 to start on boot..."
pm2 startup

echo ""
echo "✅ Todo App auto-start configured successfully!"
echo ""
echo "📋 Commands:"
echo "  Start:   pm2 start ecosystem.config.js"
echo "  Stop:    pm2 stop todo-app"
echo "  Restart: pm2 restart todo-app"
echo "  Status:  pm2 status"
echo "  Logs:    pm2 logs todo-app"
echo "  Monitor: pm2 monit"
echo ""
echo "🌐 Access the app at: http://localhost:3000"
echo ""
echo "📝 The app will now start automatically when you log in!" 