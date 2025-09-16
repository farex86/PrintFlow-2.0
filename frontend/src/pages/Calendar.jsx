import React, { useState } from 'react';

function Calendar() {
  const [events] = useState([
    {
      id: 1,
      title: 'Client Meeting - ABC Corp',
      date: '2025-10-15',
      time: '10:00 AM',
      type: 'meeting',
      color: '#3b82f6'
    },
    {
      id: 2,
      title: 'Design Review Session',
      date: '2025-10-16',
      time: '2:00 PM',
      type: 'review',
      color: '#f59e0b'
    },
    {
      id: 3,
      title: 'Print Job Deadline - XYZ Ltd',
      date: '2025-10-18',
      time: '5:00 PM',
      type: 'deadline',
      color: '#ef4444'
    },
    {
      id: 4,
      title: 'Quality Check Session',
      date: '2025-10-20',
      time: '9:00 AM',
      type: 'quality',
      color: '#10b981'
    }
  ]);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Calendar</h1>
        <p style={{ color: '#64748b' }}>View project schedules and deadlines</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Calendar Grid */}
        <div className="card">
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: '#1e293b' }}>
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ 
                background: 'none', 
                border: '1px solid #d1d5db', 
                padding: '0.5rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                ←
              </button>
              <button style={{ 
                background: 'none', 
                border: '1px solid #d1d5db', 
                padding: '0.5rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                →
              </button>
            </div>
          </div>

          {/* Calendar Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '1px',
            marginBottom: '1px',
            background: '#f1f5f9'
          }}>
            {dayNames.map(day => (
              <div key={day} style={{ 
                background: '#f8fafc', 
                padding: '0.75rem', 
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '1px',
            background: '#f1f5f9'
          }}>
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} style={{ 
                background: 'white', 
                minHeight: '100px',
                padding: '0.5rem'
              }} />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = day === today.getDate();

              return (
                <div key={day} style={{ 
                  background: 'white', 
                  minHeight: '100px',
                  padding: '0.5rem',
                  border: isToday ? '2px solid #1976d2' : 'none'
                }}>
                  <div style={{ 
                    fontWeight: isToday ? '700' : '600',
                    color: isToday ? '#1976d2' : '#1e293b',
                    marginBottom: '0.25rem'
                  }}>
                    {day}
                  </div>

                  {dayEvents.map(event => (
                    <div key={event.id} style={{
                      background: event.color + '20',
                      color: event.color,
                      padding: '0.125rem 0.25rem',
                      borderRadius: '4px',
                      fontSize: '0.625rem',
                      marginBottom: '0.125rem',
                      cursor: 'pointer'
                    }}>
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Upcoming Events</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {events.slice(0, 4).map(event => (
              <div key={event.id} style={{
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                borderLeft: `4px solid ${event.color}`
              }}>
                <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                  {event.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
