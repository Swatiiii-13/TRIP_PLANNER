import { useState, useEffect } from 'react';
import api from '../services/api';
import TransportOptions from './TransportOptions';
import HotelCard from './HotelCard';


const ItineraryDisplay = ({ data, requestData }) => {
  const [saving, setSaving] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);

  useEffect(() => {
    if (!data?.tripSummary?.destination) return;
    
    const fetchHotels = async () => {
      setLoadingHotels(true);
      try {
        const response = await api.get(`/hotels/${data.tripSummary.destination}`);
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoadingHotels(false);
      }
    };

    fetchHotels();
  }, [data]);

  const handleSaveTrip = async () => {
    if (!requestData) return;
    setSaving(true);
    try {
      await api.post('/trips/save', {
        destination: requestData.destination,
        duration: requestData.duration,
        budget: requestData.budget,
        itineraryData: data
      });
      alert('Trip saved to history successfully!');
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip.');
    } finally {
      setSaving(false);
    }
  };

  if (!data) return null;

  const { tripSummary, itinerary } = data;

  return (
    <div className="itinerary-display">
      <div className="glass-container summary-card" style={{ padding: 0, overflow: 'hidden' }}>
        <img 
          src={`https://image.pollinations.ai/prompt/Beautiful%20scenery%20of%20${encodeURIComponent(tripSummary.destination)}?width=1200&height=400&nologo=true`} 
          alt="Destination Banner" 
          className="destination-banner" 
          onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"; }}
        />
        <div style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div className="summary-details">
            <h3>{tripSummary.destination}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {tripSummary.totalDays} Days • {tripSummary.generalSafetyTip || "Safe travels!"}
            </p>
          </div>
          <div className="summary-cost">
            ${tripSummary.estimatedCost || "TBD"}
          </div>
        </div>
      </div>

      <TransportOptions destination={tripSummary.destination} />

      {/* Hotels Section */}
      <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginTop: '2rem' }}>
        Recommended Hotels in {tripSummary.destination}
      </h3>
      
      {loadingHotels ? (
        <div className="glass-container" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p>Finding the best stays...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {hotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} destination={tripSummary.destination} />
          ))}
        </div>
      )}

      <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginTop: '2rem' }}>
        Daily Itinerary
      </h3>

      {itinerary.map((dayData, index) => (
        <div key={index} className="day-card glass-container" style={{ padding: '1.5rem' }}>
          <div className="day-header">
            <h3>Day {dayData.day}</h3>
            <span>{dayData.theme}</span>
          </div>

          <div className="activity-grid">
            <div className="activity-card activity-morning">
              <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(tripSummary.destination + ' ' + dayData.morning.activity)}?width=500&height=300&nologo=true`} alt="Morning" className="activity-image" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80"; }} />
              <div className="activity-content">
                <span className="activity-time">Morning</span>
                <p className="activity-desc">{dayData.morning.activity}</p>
                <span className="cost-badge">Est. ${dayData.morning.costEstimate}</span>
              </div>
            </div>
            
            <div className="activity-card activity-afternoon">
              <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(tripSummary.destination + ' ' + dayData.afternoon.activity)}?width=500&height=300&nologo=true`} alt="Afternoon" className="activity-image" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=500&q=80"; }} />
              <div className="activity-content">
                <span className="activity-time">Afternoon</span>
                <p className="activity-desc">{dayData.afternoon.activity}</p>
                <span className="cost-badge">Est. ${dayData.afternoon.costEstimate}</span>
              </div>
            </div>
            
            <div className="activity-card activity-evening">
              <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(tripSummary.destination + ' ' + dayData.evening.activity)}?width=500&height=300&nologo=true`} alt="Evening" className="activity-image" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80"; }} />
              <div className="activity-content">
                <span className="activity-time">Evening</span>
                <p className="activity-desc">{dayData.evening.activity}</p>
                <span className="cost-badge">Est. ${dayData.evening.costEstimate}</span>
              </div>
            </div>
          </div>
          
          {dayData.localFoodSuggestion && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <strong>🍽️ Food Suggestion:</strong> {dayData.localFoodSuggestion}
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          onClick={handleSaveTrip} 
          disabled={saving || !requestData}
          className="glass-button"
          style={{ width: '100%', maxWidth: '300px', margin: '0 auto', padding: '1rem' }}
        >
          {saving ? 'Saving...' : '💾 Save Trip to History'}
        </button>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
