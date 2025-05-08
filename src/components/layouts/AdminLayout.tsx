
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
  FileText,
  Key,
  Building2,
  ChevronDown
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { currentUser, currentCafe, cafes, switchCafe } = useAppContext();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
  };

  // Determine if the user is a SuperAdmin
  const isSuperAdmin = currentUser?.role === 'superAdmin';

  // Basic nav items that all admin users should see
  const baseNavItems = [
    { icon: <Shield size={20} />, label: "Dashboard", to: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "Staff Management", to: "/admin/staff" },
    { icon: <Table2 size={20} />, label: "Table Management", to: "/admin/tables" },
    { icon: <ShoppingBasket size={20} />, label: "Menu Management", to: "/admin/menu" },
    { icon: <FileText size={20} />, label: "Orders & Reservations", to: "/admin/orders" },
    { icon: <BarChart2 size={20} />, label: "Reports & Analytics", to: "/admin/reports" },
    { icon: <Key size={20} />, label: "Access Control", to: "/admin/access" },
    { icon: <Settings size={20} />, label: "System Settings", to: "/admin/settings" },
  ];
  
  // SuperAdmin specific nav items
  const superAdminItems = [
    { icon: <Building2 size={20} />, label: "Cafe Management", to: "/admin/cafes" }
  ];
  
  // Combine nav items based on user role
  const navItems = isSuperAdmin 
    ? [...superAdminItems, ...baseNavItems]
    : baseNavItems;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel.",
    });
    navigate("/admin/login");
  };

  const handleCafeChange = (cafeId: string) => {
    const cafe = cafes.find(c => c.id === cafeId);
    if (cafe) {
      switchCafe(cafeId);
      toast({
        title: "Switched Cafe",
        description: `Now managing: ${cafe.name}`,
      });
    }
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
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-serif font-bold">
              {isSuperAdmin ? "Super Admin" : "Café Admin"}
            </h1>
          </div>

          <Alert variant="destructive" className="m-3 border-amber-500">
            <AlertTitle>Restricted Area</AlertTitle>
            <AlertDescription>
              You are in the admin panel. This area is restricted to authorized personnel only.
            </AlertDescription>
          </Alert>

          {isSuperAdmin && (
            <div className="px-4 py-3 bg-primary/10 border-y border-primary/30">
              <h3 className="text-sm font-medium mb-2">Currently Managing</h3>
              
              {currentCafe ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full flex justify-between items-center">
                      <span className="truncate">{currentCafe.name}</span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Switch Cafe</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {cafes.filter(c => c.status === 'active').map(cafe => (
                      <DropdownMenuItem 
                        key={cafe.id} 
                        onClick={() => handleCafeChange(cafe.id)}
                        className={currentCafe.id === cafe.id ? "bg-secondary" : ""}
                      >
                        {cafe.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin/cafes')}>
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>Manage All Cafes</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/admin/cafes')}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>Select a Cafe</span>
                </Button>
              )}
            </div>
          )}

          {!isSuperAdmin && currentCafe && (
            <div className="px-4 py-2 bg-secondary/50">
              <p className="text-sm font-medium">Managing Cafe:</p>
              <p className="text-primary font-bold">{currentCafe.name}</p>
            </div>
          )}

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
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {isSuperAdmin ? "SA" : "A"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>
                      {currentUser?.name || (isSuperAdmin ? "Super Admin" : "Admin")}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      {currentUser?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {isSuperAdmin ? "Super Admin" : "Cafe Admin"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isSuperAdmin ? "System Controller" : "Cafe Manager"}
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

export default AdminLayout;
