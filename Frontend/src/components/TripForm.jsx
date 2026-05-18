import { useState } from 'react';

const TripForm = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [travelers, setTravelers] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      destination,
      duration: parseInt(duration),
      travelers: parseInt(travelers),
      budget: parseInt(budget),
      preferences: preferences.split(',').map(p => p.trim()).filter(p => p),
    });
  };

  return (
    <div className="glass-container">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Trip Details</h3>
      <form onSubmit={handleSubmit} className="trip-form-grid">
        <div className="form-group full-width">
          <label>Destination</label>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="e.g., Tokyo, Japan"
            value={destination} 
            onChange={(e) => setDestination(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Duration (days)</label>
          <input 
            type="number" 
            min="1" 
            className="glass-input" 
            placeholder="7"
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Travelers</label>
          <input 
            type="number" 
            min="1" 
            className="glass-input" 
            placeholder="2"
            value={travelers} 
            onChange={(e) => setTravelers(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Total Budget ($)</label>
          <input 
            type="number" 
            min="1" 
            className="glass-input" 
            placeholder="3000"
            value={budget} 
            onChange={(e) => setBudget(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Preferences (comma separated)</label>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Nature, Food, History"
            value={preferences} 
            onChange={(e) => setPreferences(e.target.value)} 
          />
        </div>
        <div className="form-group full-width" style={{ marginTop: '0.5rem' }}>
          <button type="submit" className="glass-button">Generate AI Itinerary ✨</button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;
