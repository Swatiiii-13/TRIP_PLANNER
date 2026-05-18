import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fallback state if navigated directly without state
  const itemState = location.state || {
    title: 'Trip Booking',
    provider: 'Unknown Provider',
    price: '₹ 0',
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="checkout-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="glass-container" style={{ textAlign: 'center', padding: '3rem', maxWidth: '500px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ marginBottom: '1rem' }}>Payment Successful!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Your booking with {itemState.provider} is confirmed.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <strong>Booking Reference ID:</strong> <br />
            <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '2px', color: 'var(--primary-color)' }}>
              {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="glass-button" style={{ width: '100%', background: 'var(--primary-color)' }}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', maxWidth: '1000px', margin: '2rem auto', minHeight: '70vh', padding: '0 1rem' }}>
      {/* Left Side: Order Summary */}
      <div className="order-summary glass-container" style={{ flex: '1 1 300px', padding: '2rem' }}>
        <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>Order Summary</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>{itemState.title}</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, marginTop: '0.5rem' }}>{itemState.provider}</p>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {itemState.price}
          </div>
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Subtotal</span>
            <span>{itemState.price}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Taxes & Fees</span>
            <span>Included</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total</span>
            <span>{itemState.price}</span>
          </div>
        </div>
      </div>

      {/* Right Side: Payment Details */}
      <div className="payment-details glass-container" style={{ flex: '2 1 400px', padding: '2rem' }}>
        <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>Payment Details</h2>
        <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name on Card</label>
            <input type="text" required defaultValue={user?.name || ''} placeholder="John Doe" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Card Number</label>
            <input type="text" required placeholder="0000 0000 0000 0000" pattern="[0-9\s]{13,19}" maxLength="19" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Expiry Date</label>
              <input type="text" required placeholder="MM/YY" maxLength="5" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>CVC</label>
              <input type="password" required placeholder="123" maxLength="4" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }} />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className="glass-button" 
            style={{ width: '100%', marginTop: '1rem', padding: '1rem', background: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            {isProcessing ? 'Processing...' : `Pay ${itemState.price}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
