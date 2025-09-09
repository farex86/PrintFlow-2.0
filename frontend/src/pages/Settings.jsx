import React, { useState } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    company: {
      name: 'PrintFlow Agency',
      email: 'info@printflow.com',
      phone: '+971 50 123 4567',
      address: 'Dubai, UAE'
    },
    preferences: {
      currency: 'AED',
      language: 'en',
      timezone: 'UTC+4'
    },
    notifications: {
      email: true,
      sms: false,
      whatsapp: true,
      desktop: true
    }
  });

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const currencies = [
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'SDG', name: 'Sudanese Pound' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p style={{ color: '#64748b' }}>Configure your application preferences</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', maxWidth: '800px' }}>
        {/* Company Information */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            Company Information
          </h3>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Company Name
              </label>
              <input
                type="text"
                value={settings.company.name}
                onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Email Address
              </label>
              <input
                type="email"
                value={settings.company.email}
                onChange={(e) => handleInputChange('company', 'email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.company.phone}
                onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Address
              </label>
              <textarea
                value={settings.company.address}
                onChange={(e) => handleInputChange('company', 'address', e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        </div>

        {/* Application Preferences */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            Application Preferences
          </h3>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Default Currency
              </label>
              <select
                value={settings.preferences.currency}
                onChange={(e) => handleInputChange('preferences', 'currency', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                Language
              </label>
              <select
                value={settings.preferences.language}
                onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                {languages.map(language => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            Notification Preferences
          </h3>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: '500', color: '#374151', textTransform: 'capitalize' }}>
                    {key === 'whatsapp' ? 'WhatsApp' : key} Notifications
                  </span>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: value ? '#1976d2' : '#ccc',
                    borderRadius: '34px',
                    transition: '0.4s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '26px',
                      width: '26px',
                      left: value ? '30px' : '4px',
                      bottom: '4px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: '0.4s'
                    }}></span>
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button style={{
            background: 'none',
            border: '1px solid #d1d5db',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            Cancel
          </button>
          <button className="btn btn-primary" style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem'
          }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
