
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { SupabaseAppProvider, useAppContext } from "@/contexts/SupabaseAppContext";
import { Button } from "@/components/ui/button";

import AppLayout from "@/components/layouts/AppLayout";
import StaffLayout from "@/components/layouts/StaffLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import SuperAdminLayout from "@/components/layouts/SuperAdminLayout";
import Dashboard from "@/pages/Dashboard";
import POS from "@/pages/POS";
import Menu from "@/pages/Menu";
import Kitchen from "@/pages/Kitchen";
import Employees from "@/pages/Employees";
import Reservations from "@/pages/Reservations";
import AddReservation from "@/pages/reservations/AddReservation";
import CashFlow from "@/pages/CashFlow";
import Customer from "@/pages/Customer";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import NotFound from "./pages/NotFound";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import StockIn from "@/pages/inventory/StockIn";
import StockOut from "@/pages/inventory/StockOut";
import Wastage from "@/pages/inventory/Wastage";
import PurchaseOrders from "@/pages/inventory/PurchaseOrders";
import AddEmployee from "@/pages/employees/AddEmployee";
import AddProduct from "@/pages/products/AddProduct";
import TableManagement from "@/pages/TableManagement";
import Delivery from "@/pages/Delivery";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import SuperAdminDashboard from "@/pages/admin/SuperAdminDashboard";
import StaffManagement from "@/pages/admin/StaffManagement";
import CafeManagement from "@/pages/admin/CafeManagement";
import Index from "@/pages/Index";
import SuperUserManagement from "@/pages/admin/SuperUserManagement";
import SystemDatabase from "@/pages/admin/SystemDatabase";
import GlobalSettings from "@/pages/admin/GlobalSettings";
import SystemMaintenance from "@/pages/admin/SystemMaintenance";
import GlobalAnalytics from "@/pages/admin/GlobalAnalytics";
import ProtectedFeature from "@/components/auth/ProtectedFeature";
import SubscriptionManagement from '@/pages/admin/SubscriptionManagement';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAppContext();
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

const FeatureProtectedRoute = ({ feature, children }: { feature: string; children: React.ReactNode }) => {
  const { currentUser, canAccess } = useAppContext();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!canAccess(feature)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (!['superAdmin', 'admin', 'manager'].includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

const SuperAdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (currentUser.role !== 'superAdmin') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

const CafeAdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (!['admin', 'manager'].includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { currentUser } = useAppContext();
  
  return (
    <Routes>
      {/* Index Route */}
      <Route path="/" element={<Index />} />
      
      {/* Staff login route */}
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} />
      
      {/* Staff routes with feature-based protection and StaffLayout */}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><StaffLayout><Dashboard /></StaffLayout></AppLayout></ProtectedRoute>} />
      <Route path="/pos" element={<FeatureProtectedRoute feature="pos"><AppLayout><StaffLayout><POS /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/table-management" element={<FeatureProtectedRoute feature="tables"><AppLayout><StaffLayout><TableManagement /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/menu" element={<FeatureProtectedRoute feature="menu"><AppLayout><StaffLayout><Menu /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/kitchen" element={<FeatureProtectedRoute feature="kitchen"><AppLayout><StaffLayout><Kitchen /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/employees" element={<FeatureProtectedRoute feature="employees"><AppLayout><StaffLayout><Employees /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/employees/add" element={<FeatureProtectedRoute feature="employees"><AppLayout><StaffLayout><AddEmployee /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/reservations" element={<FeatureProtectedRoute feature="reservations"><AppLayout><StaffLayout><Reservations /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/reservations/add" element={<FeatureProtectedRoute feature="reservations"><AppLayout><StaffLayout><AddReservation /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/cashflow" element={<FeatureProtectedRoute feature="cashflow"><AppLayout><StaffLayout><CashFlow /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/customer" element={<FeatureProtectedRoute feature="customers"><AppLayout><StaffLayout><Customer /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/analytics" element={<FeatureProtectedRoute feature="analytics"><AppLayout><StaffLayout><Analytics /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/settings" element={<FeatureProtectedRoute feature="settings"><AppLayout><StaffLayout><Settings /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><StaffLayout><Profile /></StaffLayout></AppLayout></ProtectedRoute>} />
      <Route path="/products/add" element={<FeatureProtectedRoute feature="menu"><AppLayout><StaffLayout><AddProduct /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/delivery" element={<FeatureProtectedRoute feature="delivery"><AppLayout><StaffLayout><Delivery /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      
      {/* Inventory Routes */}
      <Route path="/inventory" element={<Navigate to="/inventory/stock-in" replace />} />
      <Route path="/inventory/stock-in" element={<FeatureProtectedRoute feature="inventory"><AppLayout><StaffLayout><StockIn /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/inventory/stock-out" element={<FeatureProtectedRoute feature="inventory"><AppLayout><StaffLayout><StockOut /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/inventory/wastage" element={<FeatureProtectedRoute feature="inventory"><AppLayout><StaffLayout><Wastage /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      <Route path="/inventory/purchase-orders" element={<FeatureProtectedRoute feature="inventory"><AppLayout><StaffLayout><PurchaseOrders /></StaffLayout></AppLayout></FeatureProtectedRoute>} />
      
      {/* Admin Login */}
      <Route path="/admin/login" element={currentUser ? <Navigate to={currentUser.role === 'superAdmin' ? '/admin/super/dashboard' : '/admin/dashboard'} replace /> : <AdminLogin />} />
      
      {/* Cafe Admin Routes - These should show AdminDashboard, not SuperAdminDashboard */}
      <Route path="/admin/dashboard" element={<CafeAdminProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/staff" element={<CafeAdminProtectedRoute><AdminLayout><StaffManagement /></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/tables" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Table Management (Admin)</h1><p className="mt-4">Configure restaurant layout for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/menu" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Menu Management (Admin)</h1><p className="mt-4">Configure menu items for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/orders" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Orders Management (Admin)</h1><p className="mt-4">Manage orders for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/reports" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Reports & Analytics (Admin)</h1><p className="mt-4">View analytics data for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/access" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Access Control (Admin)</h1><p className="mt-4">Manage user permissions for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/settings" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">System Settings (Admin)</h1><p className="mt-4">Configure settings for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      
      {/* Super Admin Routes - Only these should show SuperAdminDashboard */}
      <Route path="/admin/super/dashboard" element={<SuperAdminProtectedRoute><SuperAdminLayout><SuperAdminDashboard /></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/cafes" element={<SuperAdminProtectedRoute><SuperAdminLayout><CafeManagement /></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/super/users" element={<SuperAdminProtectedRoute><SuperAdminLayout><SuperUserManagement /></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/super/database" element={<SuperAdminProtectedRoute><SuperAdminLayout><SystemDatabase /></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/super/settings" element={<SuperAdminProtectedRoute><SuperAdminLayout><GlobalSettings /></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/super/maintenance" element={<SuperAdminProtectedRoute><SuperAdminLayout><SystemMaintenance /></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/super/analytics" element={<SuperAdminProtectedRoute><SuperAdminLayout><GlobalAnalytics /></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/super/subscriptions" element={<SuperAdminProtectedRoute><SuperAdminLayout><SubscriptionManagement /></SuperAdminLayout></SuperAdminProtectedRoute>} />
      
      {/* Admin redirect based on role */}
      <Route path="/admin" element={
        <AdminProtectedRoute>
          {currentUser?.role === 'superAdmin' ? 
            <Navigate to="/admin/super/dashboard" replace /> : 
            <Navigate to="/admin/dashboard" replace />
          }
        </AdminProtectedRoute>
      } />
      
      {/* Unauthorized page */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
          <p className="mt-4">You don't have permission to access this page.</p>
          <p className="text-sm text-muted-foreground mt-2">Contact your administrator if you need access to this feature.</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      } />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SupabaseAppProvider>
            <AppRoutes />
          </SupabaseAppProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
