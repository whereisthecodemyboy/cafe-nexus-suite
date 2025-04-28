
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AppProvider, useAppContext } from "@/contexts/AppContext";

import AppLayout from "@/components/layouts/AppLayout";
import Dashboard from "@/pages/Dashboard";
import POS from "@/pages/POS";
import Menu from "@/pages/Menu";
import Kitchen from "@/pages/Kitchen";
import Employees from "@/pages/Employees";
import Reservations from "@/pages/Reservations";
import CashFlow from "@/pages/CashFlow";
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAppContext();
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { currentUser } = useAppContext();
  
  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/pos" element={<ProtectedRoute><AppLayout><POS /></AppLayout></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute><AppLayout><Menu /></AppLayout></ProtectedRoute>} />
      <Route path="/kitchen" element={<ProtectedRoute><AppLayout><Kitchen /></AppLayout></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><AppLayout><Employees /></AppLayout></ProtectedRoute>} />
      <Route path="/reservations" element={<ProtectedRoute><AppLayout><Reservations /></AppLayout></ProtectedRoute>} />
      <Route path="/cashflow" element={<ProtectedRoute><AppLayout><CashFlow /></AppLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
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
