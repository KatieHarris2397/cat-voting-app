import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client (only if credentials are provided)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Mock data for when Supabase is not available
const mockCats = [
  {
    id: '1',
    name: 'Whiskers',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
    description: 'A fluffy orange tabby with the most adorable whiskers'
  },
  {
    id: '2',
    name: 'Luna',
    image_url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=400&fit=crop',
    description: 'A mysterious black cat with bright green eyes'
  },
  {
    id: '3',
    name: 'Mittens',
    image_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
    description: 'A playful white cat with cute little mittens'
  },
  {
    id: '4',
    name: 'Shadow',
    image_url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop',
    description: 'A sleek gray cat who loves to hide in shadows'
  },
  {
    id: '5',
    name: 'Bella',
    image_url: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=400&fit=crop',
    description: 'A beautiful calico cat with the sweetest personality'
  }
];

const mockVotes = new Map(); // In-memory storage for votes

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all cats
app.get('/api/cats', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } else {
      // Use mock data
      res.json(mockCats);
    }
  } catch (error) {
    console.error('Error fetching cats:', error);
    res.status(500).json({ error: 'Failed to fetch cats' });
  }
});

// Get a random cat
app.get('/api/cats/random', async (req, res) => {
  try {
    if (supabase) {
      // Fetch all cats first, then select a random one
      const { data, error } = await supabase
        .from('cats')
        .select('*');

      if (error) throw error;

      if (data.length === 0) {
        return res.status(404).json({ error: 'No cats found' });
      }

      // Select a random cat from the results
      const randomCat = data[Math.floor(Math.random() * data.length)];
      res.json(randomCat);
    } else {
      // Use mock data - return random cat
      const randomCat = mockCats[Math.floor(Math.random() * mockCats.length)];
      res.json(randomCat);
    }
  } catch (error) {
    console.error('Error fetching random cat:', error);
    res.status(500).json({ error: 'Failed to fetch random cat' });
  }
});

// Get cat statistics
app.get('/api/cats/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (supabase) {
      const { data, error } = await supabase
        .rpc('get_cat_stats', { cat_uuid: id });

      if (error) throw error;

      res.json(data[0] || { total_votes: 0, cute_votes: 0, not_cute_votes: 0, cute_percentage: 0 });
    } else {
      // Use mock data - calculate stats from mockVotes
      const votes = mockVotes.get(id) || [];
      const totalVotes = votes.length;
      const cuteVotes = votes.filter(vote => vote.isCute).length;
      const notCuteVotes = totalVotes - cuteVotes;
      const cutePercentage = totalVotes > 0 ? Math.round((cuteVotes / totalVotes) * 100) : 0;
      
      res.json({
        total_votes: totalVotes,
        cute_votes: cuteVotes,
        not_cute_votes: notCuteVotes,
        cute_percentage: cutePercentage
      });
    }
  } catch (error) {
    console.error('Error fetching cat stats:', error);
    res.status(500).json({ error: 'Failed to fetch cat statistics' });
  }
});

// Submit a vote
app.post('/api/votes', async (req, res) => {
  try {
    const { catId, isCute, voterIp } = req.body;

    if (!catId || typeof isCute !== 'boolean') {
      return res.status(400).json({ error: 'Invalid vote data' });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('votes')
        .insert([
          {
            cat_id: catId,
            is_cute: isCute,
            voter_ip: voterIp
          }
        ])
        .select();

      if (error) throw error;

      res.json({ success: true, vote: data[0] });
    } else {
      // Use mock data - store vote in memory
      const vote = {
        id: Date.now().toString(),
        cat_id: catId,
        is_cute: isCute,
        voter_ip: voterIp,
        created_at: new Date().toISOString()
      };
      
      if (!mockVotes.has(catId)) {
        mockVotes.set(catId, []);
      }
      mockVotes.get(catId).push(vote);
      
      res.json({ success: true, vote });
    }
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// Get top cats by cuteness
app.get('/api/cats/top', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('cats')
        .select(`
          *,
          votes!inner(is_cute)
        `);

      if (error) throw error;

      // Calculate statistics for each cat
      const catStats = data.reduce((acc, cat) => {
        if (!acc[cat.id]) {
          acc[cat.id] = {
            ...cat,
            total_votes: 0,
            cute_votes: 0,
            not_cute_votes: 0,
            cute_percentage: 0
          };
        }
        
        acc[cat.id].total_votes++;
        if (cat.votes.is_cute) {
          acc[cat.id].cute_votes++;
        } else {
          acc[cat.id].not_cute_votes++;
        }
        
        return acc;
      }, {});

      // Calculate percentages and sort by cuteness
      const topCats = Object.values(catStats)
        .map(cat => ({
          ...cat,
          cute_percentage: cat.total_votes > 0 ? 
            Math.round((cat.cute_votes / cat.total_votes) * 100) : 0
        }))
        .sort((a, b) => b.cute_percentage - a.cute_percentage)
        .slice(0, 10);

      res.json(topCats);
    } else {
      // Use mock data - calculate leaderboard from mockVotes
      const topCats = mockCats.map(cat => {
        const votes = mockVotes.get(cat.id) || [];
        const totalVotes = votes.length;
        const cuteVotes = votes.filter(vote => vote.isCute).length;
        const cutePercentage = totalVotes > 0 ? Math.round((cuteVotes / totalVotes) * 100) : 0;
        
        return {
          ...cat,
          total_votes: totalVotes,
          cute_votes: cuteVotes,
          not_cute_votes: totalVotes - cuteVotes,
          cute_percentage: cutePercentage
        };
      })
      .sort((a, b) => b.cute_percentage - a.cute_percentage)
      .slice(0, 10);
      
      res.json(topCats);
    }
  } catch (error) {
    console.error('Error fetching top cats:', error);
    res.status(500).json({ error: 'Failed to fetch top cats' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
