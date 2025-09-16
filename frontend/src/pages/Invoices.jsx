import React, { useState } from 'react';

function Invoices() {
  const [invoices] = useState([
    {
      id: 'INV-2025-001',
      client: 'ABC Corporation',
      project: 'Business Cards Design',
      amount: 2500,
      currency: 'AED',
      status: 'Paid',
      issueDate: '2025-09-15',
      dueDate: '2025-10-15',
      paidDate: '2025-09-20'
    },
    {
      id: 'INV-2025-002',
      client: 'XYZ Limited',
      project: 'Marketing Brochure',
      amount: 4200,
      currency: 'AED',
      status: 'Pending',
      issueDate: '2025-10-01',
      dueDate: '2025-10-31',
      paidDate: null
    },
    {
      id: 'INV-2025-003',
      client: 'StartupCo',
      project: 'Product Catalog',
      amount: 6800,
      currency: 'AED',
      status: 'Overdue',
      issueDate: '2025-09-01',
      dueDate: '2025-09-30',
      paidDate: null
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      'Draft': '#94a3b8',
      'Sent': '#3b82f6',
      'Pending': '#f59e0b',
      'Paid': '#10b981',
      'Overdue': '#ef4444',
      'Cancelled': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { AED: 'د.إ', USD: '$', EUR: '€', SAR: 'ر.س', SDG: 'ج.س' };
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Invoices</h1>
          <p style={{ color: '#64748b' }}>Manage billing and payments</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          + Create Invoice
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Total Outstanding</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>
            د.إ 11,000
          </p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>This Month</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2', margin: 0 }}>
            د.إ 13,500
          </p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Paid This Month</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
            د.إ 2,500
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="card">
        <div style={{ display: 'grid', gap: '1px', background: '#f1f5f9' }}>
          {/* Header */}
          <div style={{ 
            background: 'white', 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr auto auto auto auto',
            gap: '1rem',
            padding: '1rem',
            fontWeight: '600',
            fontSize: '0.875rem',
            color: '#374151',
            borderBottom: '2px solid #f1f5f9'
          }}>
            <div>Invoice ID</div>
            <div>Client</div>
            <div>Project</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Due Date</div>
            <div>Actions</div>
          </div>

          {/* Invoices */}
          {invoices.map(invoice => (
            <div key={invoice.id} style={{ 
              background: 'white', 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr auto auto auto auto',
              gap: '1rem',
              padding: '1rem',
              alignItems: 'center',
              fontSize: '0.875rem'
            }}>
              <div>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>{invoice.id}</span>
              </div>
              <div>
                <span style={{ color: '#374151' }}>{invoice.client}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>{invoice.project}</span>
              </div>
              <div>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>
                  {formatCurrency(invoice.amount, invoice.currency)}
                </span>
              </div>
              <div>
                <span style={{
                  background: getStatusColor(invoice.status) + '20',
                  color: getStatusColor(invoice.status),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {invoice.status}
                </span>
              </div>
              <div>
                <span style={{ 
                  color: invoice.status === 'Overdue' ? '#ef4444' : '#64748b',
                  fontWeight: invoice.status === 'Overdue' ? '600' : 'normal'
                }}>
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{
                  background: 'none',
                  border: '1px solid #d1d5db',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}>
                  View
                </button>
                <button style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}>
                  Send
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Invoices;
