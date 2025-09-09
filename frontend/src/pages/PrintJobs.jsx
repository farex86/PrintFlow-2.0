import React, { useState } from 'react';

function PrintJobs() {
  const [printJobs] = useState([
    {
      id: 'PJ2025001',
      title: 'Business Cards - ABC Corp',
      machine: 'Digital Press A',
      status: 'Printing',
      priority: 'High',
      quantity: { ordered: 5000, printed: 3000 },
      operator: 'John Smith',
      startTime: '2025-10-10T09:00:00',
      estimatedCompletion: '2025-10-10T15:00:00'
    },
    {
      id: 'PJ2025002',
      title: 'Brochures - XYZ Ltd',
      machine: 'Offset Press B',
      status: 'Quality Check',
      priority: 'Medium',
      quantity: { ordered: 2000, printed: 2000 },
      operator: 'Sarah Johnson',
      startTime: '2025-10-10T08:00:00',
      estimatedCompletion: '2025-10-10T12:00:00'
    },
    {
      id: 'PJ2025003',
      title: 'Posters - StartupCo',
      machine: 'Large Format C',
      status: 'Pending',
      priority: 'Low',
      quantity: { ordered: 100, printed: 0 },
      operator: 'Mike Davis',
      startTime: '2025-10-11T10:00:00',
      estimatedCompletion: '2025-10-11T14:00:00'
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#94a3b8',
      'Printing': '#3b82f6',
      'Quality Check': '#f59e0b',
      'Completed': '#10b981',
      'Failed': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#10b981',
      'Medium': '#f59e0b',
      'High': '#ef4444',
      'Urgent': '#dc2626'
    };
    return colors[priority] || '#6b7280';
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Print Jobs</h1>
          <p style={{ color: '#64748b' }}>Monitor and manage print jobs</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          + New Print Job
        </button>
      </div>

      {/* Print Jobs List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {printJobs.map(job => (
          <div key={job.id} className="card" style={{ 
            border: '1px solid #e2e8f0',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ 
                    margin: 0, 
                    color: '#1e293b',
                    fontSize: '1.125rem',
                    fontWeight: '600'
                  }}>
                    {job.title}
                  </h3>
                  <span style={{ 
                    background: '#f1f5f9', 
                    color: '#64748b', 
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {job.id}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                  <span>🖨️ {job.machine}</span>
                  <span>👤 {job.operator}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{
                  background: getStatusColor(job.status) + '20',
                  color: getStatusColor(job.status),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {job.status}
                </span>
                <span style={{
                  background: getPriorityColor(job.priority) + '20',
                  color: getPriorityColor(job.priority),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {job.priority}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
                  Progress
                </span>
                <span style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: '600' }}>
                  {job.quantity.printed} / {job.quantity.ordered}
                </span>
              </div>
              <div style={{ 
                background: '#f1f5f9', 
                borderRadius: '8px', 
                height: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: getStatusColor(job.status),
                  height: '100%',
                  width: `${(job.quantity.printed / job.quantity.ordered) * 100}%`,
                  borderRadius: '8px',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            {/* Time Information */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                <div>Started: {new Date(job.startTime).toLocaleString()}</div>
                <div>Est. Completion: {new Date(job.estimatedCompletion).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{ 
                  background: 'none', 
                  border: '1px solid #d1d5db', 
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}>
                  View Details
                </button>
                <button className="btn btn-primary" style={{ 
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem'
                }}>
                  Update Status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrintJobs;
