import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TransportOptions = ({ destination }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!destination) return;

    const fetchTransportOptions = async () => {
      try {
        const response = await api.get(`/transport/${destination}`);
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching transport options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransportOptions();
  }, [destination]);

  if (loading) {
    return (
      <div className="glass-container" style={{ padding: '1.5rem', marginTop: '1.5rem', textAlign: 'center' }}>
        <p>Finding the best routes to {destination}...</p>
      </div>
    );
  }

  if (options.length === 0) return null;

  return (
    <div className="transport-options" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
        Transport Options to {destination}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {options.map((option) => (
          <div key={option.id} className="glass-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>
                {option.type === 'Flight' ? '✈️' : '🚆'}
              </span>
              <div>
                <h4 style={{ margin: 0 }}>{option.provider}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {option.departureTime} - {option.arrivalTime}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {option.price}
              </div>
              <button 
                onClick={() => navigate('/checkout', { 
                  state: { title: `${option.type} to ${destination}`, provider: option.provider, price: option.price } 
                })}
                className="glass-button" 
                style={{ margin: 0, padding: '0.4rem 1rem', background: 'var(--primary-color)', fontSize: '0.9rem' }}
              >
                Book Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportOptions;
