import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { SupabaseAppProvider } from '@/contexts/SupabaseAppContext';
import Login from '@/pages/Login';
import AdminLogin from '@/pages/AdminLogin';
import Dashboard from '@/pages/Dashboard';
import StaffManagement from '@/pages/admin/StaffManagement';
import SuperUserManagement from '@/pages/admin/SuperUserManagement';
import MenuManagement from '@/pages/MenuManagement';
import InventoryManagement from '@/pages/InventoryManagement';
import OrderManagement from '@/pages/OrderManagement';
import CustomerManagement from '@/pages/CustomerManagement';
import AnalyticsDashboard from '@/pages/AnalyticsDashboard';
import SettingsPage from '@/pages/SettingsPage';
import ReservationsPage from '@/pages/ReservationsPage';
import TablesPage from '@/pages/TablesPage';
import CashflowPage from '@/pages/CashflowPage';
import KitchenDisplay from '@/pages/KitchenDisplay';
import DeliveryManagement from '@/pages/DeliveryManagement';
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
        path="/menu-management"
        element={
          <ProtectedRoute>
            <MenuManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory-management"
        element={
          <ProtectedRoute>
            <InventoryManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-management"
        element={
          <ProtectedRoute>
            <OrderManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer-management"
        element={
          <ProtectedRoute>
            <CustomerManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <ReservationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tables"
        element={
          <ProtectedRoute>
            <TablesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cashflow"
        element={
          <ProtectedRoute>
            <CashflowPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kitchen"
        element={
          <ProtectedRoute>
            <KitchenDisplay />
          </ProtectedRoute>
        }
      />
      <Route
        path="/delivery"
        element={
          <ProtectedRoute>
            <DeliveryManagement />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
