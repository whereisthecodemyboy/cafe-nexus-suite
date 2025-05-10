
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button"; // Added missing Button import

import AppLayout from "@/components/layouts/AppLayout";
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

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAppContext();
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (currentUser.role !== 'superAdmin' && currentUser.role !== 'admin' && currentUser.role !== 'manager') {
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
  
  if (currentUser.role !== 'admin' && currentUser.role !== 'manager') {
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
      
      {/* Regular user routes */}
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/pos" element={<ProtectedRoute><AppLayout><POS /></AppLayout></ProtectedRoute>} />
      <Route path="/table-management" element={<ProtectedRoute><AppLayout><TableManagement /></AppLayout></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute><AppLayout><Menu /></AppLayout></ProtectedRoute>} />
      <Route path="/kitchen" element={<ProtectedRoute><AppLayout><Kitchen /></AppLayout></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><AppLayout><Employees /></AppLayout></ProtectedRoute>} />
      <Route path="/employees/add" element={<ProtectedRoute><AppLayout><AddEmployee /></AppLayout></ProtectedRoute>} />
      <Route path="/reservations" element={<ProtectedRoute><AppLayout><Reservations /></AppLayout></ProtectedRoute>} />
      <Route path="/reservations/add" element={<ProtectedRoute><AppLayout><AddReservation /></AppLayout></ProtectedRoute>} />
      <Route path="/cashflow" element={<ProtectedRoute><AppLayout><CashFlow /></AppLayout></ProtectedRoute>} />
      <Route path="/customer" element={<ProtectedRoute><AppLayout><Customer /></AppLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
      <Route path="/products/add" element={<ProtectedRoute><AppLayout><AddProduct /></AppLayout></ProtectedRoute>} />
      <Route path="/delivery" element={<ProtectedRoute><AppLayout><Delivery /></AppLayout></ProtectedRoute>} />
      
      {/* Inventory Routes */}
      <Route path="/inventory" element={<Navigate to="/inventory/stock-in" replace />} />
      <Route path="/inventory/stock-in" element={<ProtectedRoute><AppLayout><StockIn /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/stock-out" element={<ProtectedRoute><AppLayout><StockOut /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/wastage" element={<ProtectedRoute><AppLayout><Wastage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/purchase-orders" element={<ProtectedRoute><AppLayout><PurchaseOrders /></AppLayout></ProtectedRoute>} />
      
      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Staff Dashboard Route */}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      
      {/* Cafe Admin Routes - use the regular AdminLayout */}
      <Route path="/admin/dashboard" element={<CafeAdminProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/staff" element={<CafeAdminProtectedRoute><AdminLayout><StaffManagement /></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/tables" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Table Management (Admin)</h1><p className="mt-4">Configure restaurant layout for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/menu" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Menu Management (Admin)</h1><p className="mt-4">Configure menu items for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/orders" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Orders Management (Admin)</h1><p className="mt-4">Manage orders for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/reports" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Reports & Analytics (Admin)</h1><p className="mt-4">View analytics data for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/access" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Access Control (Admin)</h1><p className="mt-4">Manage user permissions for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      <Route path="/admin/settings" element={<CafeAdminProtectedRoute><AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">System Settings (Admin)</h1><p className="mt-4">Configure settings for your cafe.</p></div></AdminLayout></CafeAdminProtectedRoute>} />
      
      {/* Super Admin Routes - use the new SuperAdminLayout */}
      <Route path="/admin/super/dashboard" element={<SuperAdminProtectedRoute><SuperAdminLayout><SuperAdminDashboard /></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/cafes" element={<SuperAdminProtectedRoute><SuperAdminLayout><CafeManagement /></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/super/users" element={<SuperAdminProtectedRoute><SuperAdminLayout><div className="p-6"><h1 className="text-2xl font-bold">User Management (Super Admin)</h1><p className="mt-4">Manage all users across the system.</p></div></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/super/database" element={<SuperAdminProtectedRoute><SuperAdminLayout><div className="p-6"><h1 className="text-2xl font-bold">System Database (Super Admin)</h1><p className="mt-4">Manage central database for all cafes.</p></div></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/super/settings" element={<SuperAdminProtectedRoute><SuperAdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Global Settings (Super Admin)</h1><p className="mt-4">Configure system-wide settings.</p></div></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/super/maintenance" element={<SuperAdminProtectedRoute><SuperAdminLayout><div className="p-6"><h1 className="text-2xl font-bold">System Maintenance (Super Admin)</h1><p className="mt-4">Perform system updates and maintenance tasks.</p></div></SuperAdminLayout></SuperAdminProtectedRoute>} />
      <Route path="/admin/super/analytics" element={<SuperAdminProtectedRoute><SuperAdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Global Analytics (Super Admin)</h1><p className="mt-4">View analytics data across all cafes.</p></div></SuperAdminLayout></SuperAdminProtectedRoute>} />
      
      {/* Redirect from /admin to appropriate dashboard based on role */}
      <Route path="/admin" element={
        <ProtectedRoute>
          {currentUser?.role === 'superAdmin' ? 
            <Navigate to="/admin/super/dashboard" replace /> : 
            <Navigate to="/admin/dashboard" replace />
          }
        </ProtectedRoute>
      } />
      
      {/* Unauthorized page */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
          <p className="mt-4">You don't have permission to access this page.</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      } />
      
      {/* Default route for not found */}
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
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
