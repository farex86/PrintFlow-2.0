import React from 'react';

function Analytics() {
  const stats = {
    revenue: [
      { month: 'Sep', amount: 45000 },
      { month: 'Aug', amount: 38000 },
      { month: 'Jul', amount: 42000 },
      { month: 'Jun', amount: 35000 },
      { month: 'May', amount: 40000 },
      { month: 'Apr', amount: 33000 }
    ],
    projectTypes: [
      { type: 'Business Cards', count: 25, revenue: 18000 },
      { type: 'Brochures', count: 15, revenue: 22000 },
      { type: 'Posters', count: 12, revenue: 8000 },
      { type: 'Banners', count: 8, revenue: 12000 },
      { type: 'Other', count: 10, revenue: 5000 }
    ]
  };

  const maxRevenue = Math.max(...stats.revenue.map(r => r.amount));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p style={{ color: '#64748b' }}>Business insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Total Revenue</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2', margin: '0 0 0.25rem 0' }}>
            د.إ 233,000
          </p>
          <p style={{ fontSize: '0.875rem', color: '#22c55e', fontWeight: '500' }}>+12% from last period</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Active Projects</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc004e', margin: '0 0 0.25rem 0' }}>
            28
          </p>
          <p style={{ fontSize: '0.875rem', color: '#22c55e', fontWeight: '500' }}>+8% from last month</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Avg. Project Value</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800', margin: '0 0 0.25rem 0' }}>
            د.إ 3,318
          </p>
          <p style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: '500' }}>-2% from last month</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Client Satisfaction</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50', margin: '0 0 0.25rem 0' }}>
            4.8/5
          </p>
          <p style={{ fontSize: '0.875rem', color: '#22c55e', fontWeight: '500' }}>+0.3 from last quarter</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Revenue Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Revenue Trends</h3>
          <div style={{ display: 'flex', alignItems: 'end', gap: '1rem', height: '200px' }}>
            {stats.revenue.reverse().map((item, index) => (
              <div key={index} style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                height: '100%'
              }}>
                <div style={{
                  width: '100%',
                  background: '#1976d2',
                  borderRadius: '4px 4px 0 0',
                  height: `${(item.amount / maxRevenue) * 80}%`,
                  minHeight: '20px',
                  marginBottom: '0.5rem'
                }}></div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#64748b',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  {item.month}
                </div>
                <div style={{ fontSize: '0.625rem', color: '#1e293b' }}>
                  د.إ {(item.amount / 1000).toFixed(0)}K
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Types */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Project Types</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.projectTypes.map((type, index) => {
              const maxCount = Math.max(...stats.projectTypes.map(t => t.count));
              const percentage = (type.count / maxCount) * 100;

              return (
                <div key={index}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '0.25rem' 
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b' }}>
                      {type.type}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {type.count}
                    </span>
                  </div>
                  <div style={{ 
                    background: '#f1f5f9', 
                    borderRadius: '8px', 
                    height: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: '#1976d2',
                      height: '100%',
                      width: `${percentage}%`,
                      borderRadius: '8px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#64748b',
                    marginTop: '0.25rem'
                  }}>
                    Revenue: د.إ {type.revenue.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
