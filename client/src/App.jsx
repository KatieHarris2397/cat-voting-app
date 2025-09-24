import React, { useState, useEffect } from 'react';
import { Heart, X, Trophy, RotateCcw } from 'lucide-react';
import './App.css';

const API_BASE = '/api';

function App() {
  const [currentView, setCurrentView] = useState('vote'); // 'vote' or 'leaderboard'
  const [currentCat, setCurrentCat] = useState(null);
  const [catStats, setCatStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voted, setVoted] = useState(false);

  // Fetch a random cat
  const fetchRandomCat = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/cats/random`);
      if (!response.ok) throw new Error('Failed to fetch cat');
      const cat = await response.json();
      setCurrentCat(cat);
      setVoted(false);
      await fetchCatStats(cat.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cat statistics
  const fetchCatStats = async (catId) => {
    try {
      const response = await fetch(`${API_BASE}/cats/${catId}/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const stats = await response.json();
      setCatStats(stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/cats/top`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit a vote
  const submitVote = async (isCute) => {
    if (!currentCat || voted) return;

    try {
      const response = await fetch(`${API_BASE}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          catId: currentCat.id,
          isCute: isCute,
          voterIp: 'anonymous' // In a real app, you'd get the actual IP
        }),
      });

      if (!response.ok) throw new Error('Failed to submit vote');
      
      setVoted(true);
      await fetchCatStats(currentCat.id);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchRandomCat();
  }, []);

  // Load leaderboard when switching to that view
  useEffect(() => {
    if (currentView === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [currentView]);

  const renderVotingView = () => {
    if (loading) {
      return <div className="loading">Loading adorable cat... 🐱</div>;
    }

    if (error) {
      return (
        <div className="error">
          <p>Oops! Something went wrong: {error}</p>
          <button onClick={fetchRandomCat} className="nav-button">
            Try Again
          </button>
        </div>
      );
    }

    if (!currentCat) {
      return <div className="loading">No cats available 😿</div>;
    }

    return (
      <div className="card cat-card">
        <img 
          src={currentCat.image_url} 
          alt={currentCat.name}
          className="cat-image"
        />
        <h2 className="cat-name">{currentCat.name}</h2>
        <p className="cat-description">{currentCat.description}</p>
        
        <div className="vote-buttons">
          <button 
            className="vote-button cute"
            onClick={() => submitVote(true)}
            disabled={voted}
          >
            <Heart size={24} />
            Cute! 😍
          </button>
          <button 
            className="vote-button not-cute"
            onClick={() => submitVote(false)}
            disabled={voted}
          >
            <X size={24} />
            Not Cute 😿
          </button>
        </div>

        {voted && (
          <div className="stats">
            <div className="stat">
              <div className="stat-number">{catStats?.total_votes || 0}</div>
              <div className="stat-label">Total Votes</div>
            </div>
            <div className="stat">
              <div className="stat-number">{catStats?.cute_votes || 0}</div>
              <div className="stat-label">Cute Votes</div>
            </div>
            <div className="stat">
              <div className="stat-number">{catStats?.not_cute_votes || 0}</div>
              <div className="stat-label">Not Cute Votes</div>
            </div>
            <div className="stat">
              <div className="stat-number">{catStats?.cute_percentage || 0}%</div>
              <div className="stat-label">Cute Rating</div>
            </div>
          </div>
        )}

        <button 
          onClick={fetchRandomCat} 
          className="nav-button"
          style={{ marginTop: '20px' }}
        >
          <RotateCcw size={20} />
          Next Cat
        </button>
      </div>
    );
  };

  const renderLeaderboardView = () => {
    if (loading) {
      return <div className="loading">Loading leaderboard... 🏆</div>;
    }

    if (error) {
      return (
        <div className="error">
          <p>Oops! Something went wrong: {error}</p>
          <button onClick={fetchLeaderboard} className="nav-button">
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="leaderboard">
        <h2><Trophy size={32} /> Cutest Cats Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            No votes yet! Be the first to vote on some cats! 🐱
          </p>
        ) : (
          leaderboard.map((cat, index) => (
            <div key={cat.id} className="leaderboard-item">
              <div className="leaderboard-rank">#{index + 1}</div>
              <img 
                src={cat.image_url} 
                alt={cat.name}
                className="leaderboard-image"
              />
              <div className="leaderboard-info">
                <div className="leaderboard-name">{cat.name}</div>
                <div className="leaderboard-stats">
                  {cat.cute_votes} cute votes • {cat.total_votes} total votes
                </div>
              </div>
              <div className="leaderboard-percentage">
                {cat.cute_percentage}%
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🐱 Cute or Not? 🐱</h1>
        <p>Vote on the cutest cats and see who makes it to the top!</p>
      </header>

      <nav className="navigation">
        <button 
          className={`nav-button ${currentView === 'vote' ? 'active' : ''}`}
          onClick={() => setCurrentView('vote')}
        >
          Vote on Cats
        </button>
        <button 
          className={`nav-button ${currentView === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('leaderboard')}
        >
          <Trophy size={20} />
          Leaderboard
        </button>
      </nav>

      {currentView === 'vote' ? renderVotingView() : renderLeaderboardView()}
    </div>
  );
}

export default App;
