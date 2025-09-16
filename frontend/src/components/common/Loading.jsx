import React from 'react';

function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      background: '#f8fafc'
    }}>
      <div className="spinner"></div>
      <p style={{ 
        marginTop: '1rem', 
        color: '#64748b',
        fontSize: '1.1rem'
      }}>
        Loading PrintFlow...
      </p>
    </div>
  );
}

export default Loading;
