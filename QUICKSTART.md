# 🚀 Quick Start Guide

Get your Cute or Not Cat App running in 5 minutes!

## Prerequisites
- Node.js 16+ installed
- A Supabase account (free at [supabase.com](https://supabase.com))

## Step 1: Set up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually 1-2 minutes)
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy the entire contents of `supabase/schema.sql` and paste it into the SQL editor
5. Click **Run** to create the database tables and sample data
6. Go to **Settings > API** and copy your:
   - Project URL
   - `anon` public key
   - `service_role` secret key

## Step 2: Configure Environment (1 minute)

```bash
# Copy the environment template
cp env.example .env

# Edit .env with your Supabase credentials
# Replace the placeholder values with your actual Supabase credentials
```

Your `.env` file should look like:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 3: Install and Run (2 minutes)

```bash
# Install all dependencies
npm run install:all

# Start the development server
npm run dev
```

That's it! 🎉

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## What You'll See

1. **Voting Interface**: Vote on random cats with cute/not cute buttons
2. **Real-time Stats**: See vote counts and percentages after voting
3. **Leaderboard**: View the top-rated cats
4. **Beautiful UI**: Modern, responsive design with smooth animations

## Troubleshooting

### "Failed to fetch cats" error
- Check your Supabase URL and keys in `.env`
- Make sure you ran the SQL schema in Supabase
- Verify your Supabase project is active

### Port already in use
- Change the PORT in `.env` to a different number (e.g., 5001)
- Or kill the process using the port: `lsof -ti:5000 | xargs kill`

### Dependencies won't install
- Make sure you have Node.js 16+ installed
- Try deleting `node_modules` and running `npm install` again

## Next Steps

- Add your own cat images by inserting records into the `cats` table
- Customize the styling in `client/src/index.css`
- Deploy to production using the Docker configuration
- Add more features like user accounts or cat categories

Happy cat voting! 🐱
