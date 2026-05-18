import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TripForm from '../components/TripForm';
import ItineraryDisplay from '../components/ItineraryDisplay';
import TravelHistory from '../components/TravelHistory';
import TravelAgentChat from '../components/TravelAgentChat';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [itineraryData, setItineraryData] = useState(null);
  const [tripRequestData, setTripRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('plan');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGenerateItinerary = async (formData) => {
    setTripRequestData(formData);
    setLoading(true);
    setItineraryData(null);
    try {
      const response = await api.post('/trips/generate', formData);
      setItineraryData(response.data);
    } catch (error) {
      console.error('Error generating itinerary', error);
      alert('Failed to generate itinerary. Check your API key or inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h2>Dashboard</h2>
          <p>Welcome back, {user.name}!</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => setActiveTab('plan')} 
            className={`glass-button ${activeTab === 'plan' ? 'active' : ''}`}
            style={{ margin: 0, padding: '0.5rem 1rem', width: 'auto', background: activeTab === 'plan' ? 'rgba(255,255,255,0.2)' : 'transparent', border: '1px solid var(--glass-border)' }}
          >
            Plan a New Trip
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`glass-button ${activeTab === 'history' ? 'active' : ''}`}
            style={{ margin: 0, padding: '0.5rem 1rem', width: 'auto', background: activeTab === 'history' ? 'rgba(255,255,255,0.2)' : 'transparent', border: '1px solid var(--glass-border)' }}
          >
            My Travel History
          </button>
          <button onClick={handleLogout} className="glass-button" style={{ width: 'auto', margin: 0, padding: '0.5rem 1.5rem', background: 'transparent', border: '1px solid var(--glass-border)' }}>
            Logout
          </button>
        </div>
      </header>

      {activeTab === 'plan' ? (
        <div className="dashboard-grid">
          <aside className="dashboard-sidebar">
            <TripForm onSubmit={handleGenerateItinerary} />
          </aside>

          <main className="dashboard-main">
            {loading && (
              <div className="glass-container loading-spinner">
                <div style={{ fontSize: '2rem' }}>✨</div>
                <p>AI is planning your perfect trip...</p>
              </div>
            )}
            
            {!loading && !itineraryData && (
              <div className="glass-container empty-state">
                <span style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>✈️</span>
                <h3>No trip generated yet</h3>
                <p>Fill out the form on the left to get your personalized AI itinerary.</p>
              </div>
            )}

            {!loading && itineraryData && (
              <ItineraryDisplay data={itineraryData} requestData={tripRequestData} />
            )}
          </main>
        </div>
      ) : (
        <div className="dashboard-main" style={{ marginTop: '2rem' }}>
          <TravelHistory />
        </div>
      )}
      <TravelAgentChat context={tripRequestData?.destination ? `Destination: ${tripRequestData.destination}, Duration: ${tripRequestData.duration} days, Budget: ${tripRequestData.budget}` : null} />
    </div>
  );
};

export default Dashboard;
