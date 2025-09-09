import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useTranslation } from 'react-i18next';

// Store
import { store } from './store/store';

// Components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loading from './components/common/Loading';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Kanban from './pages/Kanban';
import PrintJobs from './pages/PrintJobs';
import Invoices from './pages/Invoices';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Services
import { initializeAuth } from './services/auth';

// Styles
import './styles/globals.css';
import './styles/components.css';

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Material-UI theme with multi-language support
const createAppTheme = (direction) => createTheme({
  direction,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Inter", "Roboto", sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  // Create theme based on language direction
  const theme = React.useMemo(() => {
    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    return createAppTheme(direction);
  }, [i18n.language]);

  // Initialize authentication on app start
  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Helmet>
              <title>PrintFlow - Printing Workflow Management</title>
              <meta name="description" content="Professional printing workflow management system" />
            </Helmet>

            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                      {/* Sidebar */}
                      <Sidebar open={isSidebarOpen} onToggle={toggleSidebar} />

                      {/* Main content */}
                      <Box 
                        component="main" 
                        sx={{ 
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          marginLeft: isSidebarOpen ? '280px' : '80px',
                          transition: 'margin 0.3s ease',
                        }}
                      >
                        {/* Header */}
                        <Header onMenuClick={toggleSidebar} />

                        {/* Page content */}
                        <Box sx={{ flexGrow: 1, p: 3 }}>
                          <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/projects/*" element={<Projects />} />
                            <Route path="/kanban" element={<Kanban />} />
                            <Route path="/print-jobs/*" element={<PrintJobs />} />
                            <Route path="/invoices/*" element={<Invoices />} />
                            <Route path="/calendar" element={<Calendar />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/settings" element={<Settings />} />
                          </Routes>
                        </Box>
                      </Box>
                    </Box>
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
