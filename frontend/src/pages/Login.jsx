import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    console.log('Login attempt:', { email, password });
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card" style={{ 
        width: '400px', 
        background: 'white',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>Login to PrintFlow</h2>
          <p style={{ color: '#64748b' }}>Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease'
              }}
              required
            />
          </div>

          <button 
            type="submit"
            className="btn btn-primary" 
            style={{ 
              width: '100%',
              padding: '0.875rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#64748b' }}>
            Don't have an account? 
            <button 
              onClick={() => navigate('/register')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#1976d2', 
                cursor: 'pointer',
                marginLeft: '0.25rem',
                textDecoration: 'underline'
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
