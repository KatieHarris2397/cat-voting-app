# 🐱 Cute or Not - Cat Voting App

A full-stack web application where users can vote on cute cats and see a leaderboard of the most adorable felines! Built with React, Node.js, and Supabase.

## Features

- 🐱 **Random Cat Voting**: Vote on randomly selected cats
- 📊 **Real-time Statistics**: See vote counts and cute percentages
- 🏆 **Leaderboard**: View the top-rated cats
- 📱 **Responsive Design**: Works on desktop and mobile
- ⚡ **Fast & Modern**: Built with React and Vite

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Supabase** - Backend-as-a-Service (PostgreSQL database)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (client and server)
npm run install:all
```

### 2. Set up Supabase

1. Go to [Supabase](https://supabase.com/) and create a new project
2. In your Supabase dashboard, go to the SQL Editor
3. Copy and paste the contents of `supabase/schema.sql` and run it
4. Go to Settings > API to get your project URL and keys

### 3. Environment Configuration

1. Copy `env.example` to `.env` in the root directory:
```bash
cp env.example .env
```

2. Update the `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run the Application

```bash
# Start both client and server in development mode
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend API on http://localhost:5000

## Project Structure

```
cute-or-not-cat-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css        # Component styles
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── server/                # Node.js backend
│   ├── index.js           # Express server
│   └── package.json       # Backend dependencies
├── supabase/
│   └── schema.sql         # Database schema
├── package.json           # Root package.json
├── env.example            # Environment variables template
└── README.md              # This file
```

## API Endpoints

- `GET /api/cats` - Get all cats
- `GET /api/cats/random` - Get a random cat
- `GET /api/cats/:id/stats` - Get cat statistics
- `POST /api/votes` - Submit a vote
- `GET /api/cats/top` - Get top cats leaderboard
- `GET /api/health` - Health check

## Database Schema

### Cats Table
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Cat's name
- `image_url` (TEXT) - URL to cat image
- `description` (TEXT) - Cat description
- `created_at` (TIMESTAMP) - Creation timestamp

### Votes Table
- `id` (UUID) - Primary key
- `cat_id` (UUID) - Foreign key to cats table
- `is_cute` (BOOLEAN) - Vote value
- `voter_ip` (INET) - Voter IP address
- `created_at` (TIMESTAMP) - Vote timestamp

## Development

### Available Scripts

- `npm run dev` - Start both client and server
- `npm run dev:client` - Start only the React frontend
- `npm run dev:server` - Start only the Node.js backend
- `npm run build` - Build the frontend for production
- `npm run install:all` - Install all dependencies

### Adding New Cats

You can add new cats by inserting records into the `cats` table in Supabase:

```sql
INSERT INTO cats (name, image_url, description) VALUES
('Your Cat Name', 'https://example.com/cat-image.jpg', 'Your cat description');
```

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `client/dist` folder to your hosting service
3. Make sure to set the environment variables in your hosting service

### Backend (Railway/Heroku)
1. Deploy the `server` folder to your hosting service
2. Set the environment variables in your hosting service
3. Make sure the database connection is properly configured

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Cat images from [Unsplash](https://unsplash.com/)
- Icons from [Lucide](https://lucide.dev/)
- Built with [Supabase](https://supabase.com/)
