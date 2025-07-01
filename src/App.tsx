
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { SupabaseAppProvider } from '@/contexts/SupabaseAppContext';
import Login from '@/pages/Login';
import AdminLogin from '@/pages/AdminLogin';
import Dashboard from '@/pages/Dashboard';
import StaffManagement from '@/pages/admin/StaffManagement';
import SuperUserManagement from '@/pages/admin/SuperUserManagement';
import Menu from '@/pages/Menu';
import Reservations from '@/pages/Reservations';
import Customer from '@/pages/Customer';
import POS from '@/pages/POS';
import Index from '@/pages/Index';
import TestUserRegistration from '@/pages/TestUserRegistration';

const App: React.FC = () => {
  return (
    <Router>
      <SupabaseAppProvider>
        <AppContent />
      </SupabaseAppProvider>
    </Router>
  );
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  // useEffect(() => {
  //   console.log('Current user:', user);
  // }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    if (!user) {
      return <Navigate to="/admin-login" replace />;
    }
    return <>{children}</>;
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/test-users" element={<TestUserRegistration />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-management"
        element={
          <AdminRoute>
            <StaffManagement />
          </AdminRoute>
        }
      />
      <Route
        path="/super-user-management"
        element={
          <AdminRoute>
            <SuperUserManagement />
          </AdminRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            <Menu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <Reservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Customer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <POS />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
