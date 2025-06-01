
import React, { ReactNode, useState } from "react";
import { 
  Shield, 
  Users, 
  ShoppingBasket, 
  BarChart2, 
  Settings, 
  X, 
  LogOut,
  Table2,
  Menu as MenuIcon,
  Building2,
  FileText,
  Key,
  Globe,
  Database,
  ServerCog,
  CreditCard
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModeToggle } from "./ModeToggle";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/contexts/AppContext";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
  onClick: (to: string) => void;
}

const NavItem = ({ icon, label, to, active, onClick }: NavItemProps) => {
  return (
    <div
      onClick={() => onClick(to)}
      className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground/70 hover:bg-secondary hover:text-foreground"
      )}
    >
      <div className="text-xl">{icon}</div>
      <div className="font-medium">{label}</div>
    </div>
  );
};

interface SuperAdminLayoutProps {
  children: ReactNode;
}

const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { currentUser, cafes, logout } = useAppContext();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
  };

  // Super Admin specific nav items - different from Cafe Admin
  const navItems = [
    { icon: <Shield size={20} />, label: "Platform Dashboard", to: "/admin/super/dashboard" },
    { icon: <Building2 size={20} />, label: "Cafe Management", to: "/admin/cafes" },
    { icon: <CreditCard size={20} />, label: "Subscription Management", to: "/admin/super/subscriptions" },
    { icon: <Users size={20} />, label: "User Management", to: "/admin/super/users" },
    { icon: <Database size={20} />, label: "System Database", to: "/admin/super/database" },
    { icon: <Globe size={20} />, label: "Global Settings", to: "/admin/super/settings" },
    { icon: <ServerCog size={20} />, label: "System Maintenance", to: "/admin/super/maintenance" },
    { icon: <BarChart2 size={20} />, label: "Global Analytics", to: "/admin/super/analytics" }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout(); // Use the logout function from context
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the Platform Admin panel.",
    });
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-card border-r border-border",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-center space-x-2 border-b border-border">
            <Shield className="h-6 w-6 text-destructive" />
            <h1 className="text-xl font-serif font-bold text-destructive">
              Platform Admin
            </h1>
          </div>

          <div className="m-3">
            <Badge variant="destructive" className="w-full justify-center py-1 text-sm font-bold">
              PLATFORM CONTROLLER
            </Badge>
          </div>

          <div className="px-4 py-2 mb-2">
            <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3">
              <h3 className="text-sm font-semibold text-destructive mb-1">Platform Overview</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-medium">Active Cafes:</span> {cafes.filter(c => c.status === 'active').length}</p>
                <p><span className="font-medium">Total Cafes:</span> {cafes.length}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={location.pathname === item.to}
                onClick={handleNavigation}
              />
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src="/assets/avatar.png" />
                      <AvatarFallback className="bg-destructive text-destructive-foreground">
                        SA
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>
                      {currentUser?.name || "Platform Administrator"}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      {currentUser?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/admin/super/settings')} className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      <span>System Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {currentUser?.name || "Platform Admin"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    System Controller
                  </span>
                </div>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main className="p-4 md:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
