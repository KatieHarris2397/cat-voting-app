-- Create the cats table
CREATE TABLE IF NOT EXISTS cats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cat_id UUID REFERENCES cats(id) ON DELETE CASCADE,
  is_cute BOOLEAN NOT NULL,
  voter_ip INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_cat_id ON votes(cat_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);

-- Enable Row Level Security
ALTER TABLE cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to cats" ON cats FOR SELECT USING (true);
CREATE POLICY "Allow public read access to votes" ON votes FOR SELECT USING (true);

-- Create policy for inserting votes
CREATE POLICY "Allow public insert on votes" ON votes FOR INSERT WITH CHECK (true);

-- Create a function to get cat statistics
CREATE OR REPLACE FUNCTION get_cat_stats(cat_uuid UUID)
RETURNS TABLE (
  total_votes BIGINT,
  cute_votes BIGINT,
  not_cute_votes BIGINT,
  cute_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_votes,
    COUNT(*) FILTER (WHERE is_cute = true) as cute_votes,
    COUNT(*) FILTER (WHERE is_cute = false) as not_cute_votes,
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND((COUNT(*) FILTER (WHERE is_cute = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
    END as cute_percentage
  FROM votes 
  WHERE cat_id = cat_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample cats
INSERT INTO cats (name, image_url, description) VALUES
('Whiskers', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop', 'A fluffy orange tabby with the most adorable whiskers'),
('Luna', 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=400&fit=crop', 'A mysterious black cat with bright green eyes'),
('Mittens', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop', 'A playful white cat with cute little mittens'),
('Shadow', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop', 'A sleek gray cat who loves to hide in shadows'),
('Bella', 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=400&fit=crop', 'A beautiful calico cat with the sweetest personality'),
('Max', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop', 'A handsome tuxedo cat who loves to pose for photos'),
('Princess', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop', 'A regal Persian cat with luxurious long fur'),
('Tiger', 'https://images.unsplash.com/photo-1596854307809-2e7e0b0b0b0b?w=400&h=400&fit=crop', 'A striped tabby with wild tiger-like markings');
