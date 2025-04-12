
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { usePixelEvents } from './hooks/usePixelEvents';
import AdminRoutes from './routes/AdminRoutes';
import PublicRoutes from './routes/PublicRoutes';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient();

// Root App component to initialize pixels
const AppWithPixels = () => {
  // Initialize pixels on app mount
  usePixelEvents({ initialize: true });
  
  return (
    <Routes>
      <Route path="admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<PublicRoutes />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppWithPixels />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
