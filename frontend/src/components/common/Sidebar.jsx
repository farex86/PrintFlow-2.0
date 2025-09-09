import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ open, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/kanban', label: 'Kanban', icon: '📋' },
    { path: '/print-jobs', label: 'Print Jobs', icon: '🖨️' },
    { path: '/invoices', label: 'Invoices', icon: '📄' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  const sidebarStyle = {
    width: open ? '280px' : '80px',
    background: '#1976d2',
    color: 'white',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    transition: 'width 0.3s ease',
    zIndex: 1000,
    padding: '1rem',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
  };

  return (
    <aside style={sidebarStyle}>
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>{open ? 'PrintFlow' : 'PF'}</h3>
      </div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  background: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {open && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
