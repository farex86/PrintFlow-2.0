import React, { useState } from 'react';

function Kanban() {
  const [tasks] = useState({
    'To Do': [
      { id: 1, title: 'Design Business Cards', assignee: 'John Doe', priority: 'High' },
      { id: 2, title: 'Print Setup Review', assignee: 'Jane Smith', priority: 'Medium' }
    ],
    'In Progress': [
      { id: 3, title: 'Brochure Layout', assignee: 'Mike Johnson', priority: 'High' },
      { id: 4, title: 'Color Proofing', assignee: 'Sarah Wilson', priority: 'Low' }
    ],
    'Review': [
      { id: 5, title: 'Logo Design', assignee: 'Tom Brown', priority: 'Medium' }
    ],
    'Completed': [
      { id: 6, title: 'Invoice Generation', assignee: 'Lisa Davis', priority: 'Low' }
    ]
  });

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#10b981',
      'Medium': '#f59e0b',
      'High': '#ef4444'
    };
    return colors[priority] || '#6b7280';
  };

  const getColumnColor = (column) => {
    const colors = {
      'To Do': '#94a3b8',
      'In Progress': '#3b82f6',
      'Review': '#f59e0b',
      'Completed': '#10b981'
    };
    return colors[column] || '#6b7280';
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Kanban Board</h1>
        <p style={{ color: '#64748b' }}>Visual task management</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '1.5rem',
        height: 'calc(100vh - 200px)',
        overflow: 'hidden'
      }}>
        {Object.entries(tasks).map(([column, columnTasks]) => (
          <div key={column} style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Column Header */}
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #f1f5f9',
              background: getColumnColor(column) + '10'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ 
                  margin: 0, 
                  color: getColumnColor(column),
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  {column}
                </h3>
                <span style={{
                  background: getColumnColor(column),
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Tasks */}
            <div style={{ 
              flex: 1, 
              padding: '1rem', 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {columnTasks.map(task => (
                <div key={task.id} style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1rem',
                  cursor: 'grab',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    {task.title}
                  </h4>

                  <p style={{ 
                    margin: '0 0 0.75rem 0', 
                    fontSize: '0.75rem',
                    color: '#64748b'
                  }}>
                    👤 {task.assignee}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      background: getPriorityColor(task.priority) + '20',
                      color: getPriorityColor(task.priority),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.625rem',
                      fontWeight: '500'
                    }}>
                      {task.priority}
                    </span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        padding: '0.25rem'
                      }}>
                        ✏️
                      </button>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        padding: '0.25rem'
                      }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Task Button */}
              <button style={{
                background: 'none',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              }}>
                + Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kanban;
