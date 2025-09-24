#!/usr/bin/env node

// Simple test script to verify the setup
const fs = require('fs');
const path = require('path');

console.log('🐱 Testing Cute or Not Cat App Setup...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'client/package.json',
  'server/package.json',
  'client/src/App.jsx',
  'server/index.js',
  'supabase/schema.sql',
  'env.example'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check if .env exists
if (fs.existsSync('.env')) {
  console.log('✅ .env file exists');
} else {
  console.log('⚠️  .env file not found - you need to create it from env.example');
}

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 All required files are present!');
  console.log('\nNext steps:');
  console.log('1. Set up your Supabase project');
  console.log('2. Copy env.example to .env and configure your credentials');
  console.log('3. Run the SQL schema in your Supabase dashboard');
  console.log('4. Run "npm run install:all" to install dependencies');
  console.log('5. Run "npm run dev" to start the development server');
} else {
  console.log('❌ Some files are missing. Please check the setup.');
}

console.log('\n🐱 Happy cat voting!');
