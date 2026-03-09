import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/admin/DashboardPage';

// Layouts
import AdminLayout from './components/layout/AdminLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<div>Login Page (TBD)</div>} />
          <Route path="/book" element={<div>Booking Flow (TBD)</div>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="queue" element={<div>Live Queue Management</div>} />
            <Route path="clients" element={<div>Client CRM</div>} />
            <Route path="commission" element={<div>Commission Tracking</div>} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;