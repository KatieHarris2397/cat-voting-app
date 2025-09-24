#!/bin/bash

# Cute or Not Cat App - Deployment Script
echo "🐱 Deploying Cute or Not Cat App..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy env.example to .env and configure your Supabase credentials."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build the client
echo "🏗️  Building client..."
cd client
npm run build
cd ..

# Start the server
echo "🚀 Starting server..."
cd server
npm start
