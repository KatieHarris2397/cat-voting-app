import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all cats
app.get('/api/cats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching cats:', error);
    res.status(500).json({ error: 'Failed to fetch cats' });
  }
});

// Get a random cat
app.get('/api/cats/random', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cats')
      .select('*')
      .order('random()')
      .limit(1);

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ error: 'No cats found' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Error fetching random cat:', error);
    res.status(500).json({ error: 'Failed to fetch random cat' });
  }
});

// Get cat statistics
app.get('/api/cats/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .rpc('get_cat_stats', { cat_uuid: id });

    if (error) throw error;

    res.json(data[0] || { total_votes: 0, cute_votes: 0, not_cute_votes: 0, cute_percentage: 0 });
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
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// Get top cats by cuteness
app.get('/api/cats/top', async (req, res) => {
  try {
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
