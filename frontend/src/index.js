import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext'; // <-- added
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './index.css'; // Tailwind styles

const theme = createTheme({ palette: { mode: 'light' } });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DashboardProvider> {/* Wrap App with DashboardProvider */}
          <App />
        </DashboardProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
