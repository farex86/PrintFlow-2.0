import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual registration logic
    console.log('Registration attempt:', formData);
    // For now, just navigate to login
    navigate('/login');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 0'
    }}>
      <div className="card" style={{ 
        width: '450px', 
        background: 'white',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>Register for PrintFlow</h2>
          <p style={{ color: '#64748b' }}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Full Name
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Email
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Company Name (Optional)
            </label>
            <input 
              type="text" 
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Password
            </label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Confirm Password
            </label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password" 
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px',
                fontSize: '1rem'
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
            Create Account
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#64748b' }}>
            Already have an account? 
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#1976d2', 
                cursor: 'pointer',
                marginLeft: '0.25rem',
                textDecoration: 'underline'
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
