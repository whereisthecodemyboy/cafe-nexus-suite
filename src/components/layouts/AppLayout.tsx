
import React, { ReactNode, useState } from "react";
import { 
  Coffee, 
  Users, 
  ShoppingBasket, 
  Calendar, 
  BarChart2, 
  Settings, 
  Menu as MenuIcon, 
  X, 
  Home, 
  ChefHat, 
  LogOut
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

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <div
    onClick={onClick}
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

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Navigation items
  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", to: "/" },
    { icon: <Coffee size={20} />, label: "POS", to: "/pos" },
    { icon: <ShoppingBasket size={20} />, label: "Menu", to: "/menu" },
    { icon: <ChefHat size={20} />, label: "Kitchen", to: "/kitchen" },
    { icon: <Users size={20} />, label: "Employees", to: "/employees" },
    { icon: <Calendar size={20} />, label: "Reservations", to: "/reservations" },
    { icon: <BarChart2 size={20} />, label: "Analytics", to: "/analytics" },
    { icon: <Settings size={20} />, label: "Settings", to: "/settings" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    // In a real app, you would handle actual logout logic here
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-card border-r border-border",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0" // Always show on desktop
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-center">
            <h1 className="text-2xl font-serif font-bold text-primary">Café Nexus</h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={location.pathname === item.to}
                onClick={() => {
                  navigate(item.to);
                  if (isMobile) setSidebarOpen(false);
                }}
              />
            ))}
          </div>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src="/assets/avatar.png" />
                      <AvatarFallback className="bg-primary text-primary-foreground">CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Admin User</span>
                  <span className="text-xs text-muted-foreground">admin@cafenexus.com</span>
                </div>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        {/* Overlay for closing sidebar on mobile */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Content */}
        <main className="p-4 md:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
