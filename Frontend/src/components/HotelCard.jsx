import { useNavigate } from 'react-router-dom';

const HotelCard = ({ hotel, destination }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      color: '#1f2937',
      fontFamily: 'sans-serif'
    }}>
      <img 
        src={hotel.imageUrl} 
        alt={hotel.name} 
        style={{ width: '100%', height: '14rem', objectFit: 'cover' }} 
        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"; }}
      />
      <div style={{ backgroundColor: '#f9fafb', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', flex: 1 }}>
        <div style={{ flex: 1, paddingRight: '1rem' }}>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{hotel.name}</h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#6b7280' }}>{hotel.location}</p>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {hotel.features.map((feature, idx) => (
              <li key={idx} style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.35rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#10b981', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span> {feature}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid #e5e7eb', paddingLeft: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Starting from</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0.25rem 0' }}>₹ {hotel.price}</div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>Per night</span>
          <button 
            onClick={() => navigate('/checkout', { 
              state: { title: `1 Night Stay at ${hotel.name}`, provider: hotel.name, price: `₹ ${hotel.price}` } 
            })}
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '0.6rem 1rem', 
              borderRadius: '0.25rem', 
              border: 'none', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Select Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
