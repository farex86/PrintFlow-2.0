import React from 'react';

function Dashboard() {
  const stats = [
    { label: 'Total Projects', value: '42', change: '+12%', color: '#1976d2', icon: '📁' },
    { label: 'Active Tasks', value: '28', change: '+5%', color: '#dc004e', icon: '📋' },
    { label: 'Pending Invoices', value: '15', change: '-3%', color: '#ff9800', icon: '📄' },
    { label: 'Revenue (AED)', value: '45,280', change: '+18%', color: '#4caf50', icon: '💰' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Welcome to your PrintFlow dashboard. Here's an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <div key={index} className="card" style={{ 
            background: 'white',
            border: '1px solid #e2e8f0',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '0.875rem', 
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </p>
                <p style={{ 
                  fontSize: '2.25rem', 
                  fontWeight: 'bold', 
                  color: stat.color,
                  margin: '0 0 0.5rem 0'
                }}>
                  {stat.value}
                </p>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: stat.change.startsWith('+') ? '#22c55e' : '#ef4444',
                  fontWeight: '500'
                }}>
                  {stat.change} from last month
                </p>
              </div>
              <div style={{ 
                fontSize: '2rem',
                opacity: '0.7'
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Recent Projects</h3>
          <div>
            {['Business Card Design - ABC Corp', 'Brochure Print - XYZ Ltd', 'Banner Design - StartupCo'].map((project, index) => (
              <div key={index} style={{ 
                padding: '0.75rem 0', 
                borderBottom: index < 2 ? '1px solid #f1f5f9' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '500' }}>{project}</span>
                <span style={{ 
                  background: '#e0f2fe', 
                  color: '#0277bd', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  In Progress
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Upcoming Deadlines</h3>
          <div>
            {[
              { task: 'Logo Design Review', date: 'Today' },
              { task: 'Print Job Completion', date: 'Tomorrow' },
              { task: 'Client Presentation', date: 'Oct 12' }
            ].map((item, index) => (
              <div key={index} style={{ 
                padding: '0.75rem 0', 
                borderBottom: index < 2 ? '1px solid #f1f5f9' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '500' }}>{item.task}</span>
                <span style={{ 
                  color: '#dc2626', 
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
