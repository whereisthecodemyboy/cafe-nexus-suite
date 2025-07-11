
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { SupabaseAppProvider } from '@/contexts/SupabaseAppContext';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import StaffManagement from '@/pages/admin/StaffManagement';
import SuperUserManagement from '@/pages/admin/SuperUserManagement';
import Menu from '@/pages/Menu';
import Reservations from '@/pages/Reservations';
import Customer from '@/pages/Customer';
import POS from '@/pages/POS';
import Index from '@/pages/Index';
import TestUserRegistration from '@/pages/TestUserRegistration';
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <Router>
      <SupabaseAppProvider>
        <AppContent />
        <Toaster />
      </SupabaseAppProvider>
    </Router>
  );
};

const AppContent: React.FC = () => {
  const { user, userProfile, loading } = useAuth();

  console.log('App state:', { user: user?.email, userProfile: userProfile?.name, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || !userProfile) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || !userProfile) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      {/* Redirect admin-login to main login */}
      <Route path="/admin-login" element={<Navigate to="/login" replace />} />
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
