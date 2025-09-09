import React, { useState } from 'react';

function Projects() {
  const [projects] = useState([
    {
      id: 1,
      name: 'Business Cards - ABC Corp',
      client: 'ABC Corporation',
      status: 'In Progress',
      priority: 'High',
      deadline: '2025-10-15',
      progress: 75
    },
    {
      id: 2,
      name: 'Marketing Brochure - XYZ Ltd',
      client: 'XYZ Limited',
      status: 'Review',
      priority: 'Medium',
      deadline: '2025-10-20',
      progress: 90
    },
    {
      id: 3,
      name: 'Product Catalog - StartupCo',
      client: 'StartupCo',
      status: 'Planning',
      priority: 'Low',
      deadline: '2025-11-01',
      progress: 25
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      'Planning': '#94a3b8',
      'In Progress': '#3b82f6',
      'Review': '#f59e0b',
      'Completed': '#10b981'
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
          <h1 className="page-title">Projects</h1>
          <p style={{ color: '#64748b' }}>Manage your printing projects</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          + New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {projects.map(project => (
          <div key={project.id} className="card" style={{ 
            border: '1px solid #e2e8f0',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: '#1e293b',
                  fontSize: '1.25rem',
                  fontWeight: '600'
                }}>
                  {project.name}
                </h3>
                <p style={{ color: '#64748b', margin: '0 0 1rem 0' }}>
                  Client: {project.client}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{
                  background: getStatusColor(project.status) + '20',
                  color: getStatusColor(project.status),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {project.status}
                </span>
                <span style={{
                  background: getPriorityColor(project.priority) + '20',
                  color: getPriorityColor(project.priority),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {project.priority}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
                  Progress
                </span>
                <span style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: '600' }}>
                  {project.progress}%
                </span>
              </div>
              <div style={{ 
                background: '#f1f5f9', 
                borderRadius: '8px', 
                height: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: '#1976d2',
                  height: '100%',
                  width: `${project.progress}%`,
                  borderRadius: '8px',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Due: {new Date(project.deadline).toLocaleDateString()}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{ 
                  background: 'none', 
                  border: '1px solid #d1d5db', 
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}>
                  View
                </button>
                <button className="btn btn-primary" style={{ 
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem'
                }}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
