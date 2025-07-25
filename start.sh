#!/bin/bash

# Todo App Startup Script
echo "🚀 Starting Todo App..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🌐 Starting development server..."
npm start 