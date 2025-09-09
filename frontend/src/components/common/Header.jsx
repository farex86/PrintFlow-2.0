import React from 'react';

function Header({ onMenuClick }) {
  return (
    <header className="header">
      <div>
        <button 
          onClick={onMenuClick} 
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '1.5rem', 
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          ☰
        </button>
        <span style={{ marginLeft: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          PrintFlow
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Welcome User</span>
        <button className="btn btn-primary">Settings</button>
      </div>
    </header>
  );
}

export default Header;
