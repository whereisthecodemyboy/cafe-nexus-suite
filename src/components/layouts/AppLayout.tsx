
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
  LogOut,
  History,
  User,
  Box,
  Package,
  PackageOpen,
  Truck,
  File,
  Table2
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
  onClick: (to: string) => void;
  subItems?: { icon: React.ReactNode; label: string; to: string }[];
}

const NavItem = ({ icon, label, to, active, onClick, subItems }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  if (subItems) {
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-secondary hover:text-foreground"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="text-xl">{icon}</div>
              <div className="font-medium">{label}</div>
            </div>
            <div className={cn("transform transition-transform", isOpen ? "rotate-180" : "")}>
              <ChevronIcon />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pl-9 mt-1 space-y-1">
            {subItems.map((item) => (
              <div
                key={item.to}
                onClick={() => onClick(item.to)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                  location.pathname === item.to
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                )}
              >
                <div className="text-xl">{item.icon}</div>
                <div className="font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

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

// Helper ChevronIcon component
const ChevronIcon = () => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 12 12" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M2 4L6 8L10 4" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
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

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
  };

  const inventorySubItems = [
    { icon: <Package size={20} />, label: "Stock In", to: "/inventory/stock-in" },
    { icon: <PackageOpen size={20} />, label: "Stock Out", to: "/inventory/stock-out" },
    { icon: <File size={20} />, label: "Wastage", to: "/inventory/wastage" },
    { icon: <Truck size={20} />, label: "Purchase Orders", to: "/inventory/purchase-orders" }
  ];

  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", to: "/" },
    { icon: <Coffee size={20} />, label: "POS", to: "/pos" },
    { icon: <Table2 size={20} />, label: "Table Management", to: "/table-management" },
    { icon: <Truck size={20} />, label: "Delivery", to: "/delivery" },
    { icon: <ShoppingBasket size={20} />, label: "Menu", to: "/menu" },
    { icon: <ChefHat size={20} />, label: "Kitchen", to: "/kitchen" },
    { icon: <Box size={20} />, label: "Inventory", to: "/inventory/stock-in", subItems: inventorySubItems },
    { icon: <Users size={20} />, label: "Employees", to: "/employees" },
    { icon: <Calendar size={20} />, label: "Reservations", to: "/reservations" },
    { icon: <History size={20} />, label: "History", to: "/cashflow" },
    { icon: <User size={20} />, label: "Customer", to: "/customer" },
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
    navigate("/login");
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
          <div className="p-6 flex items-center justify-center">
            <h1 className="text-2xl font-serif font-bold text-primary">Café Nexus</h1>
          </div>

          <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={item.subItems ? 
                  item.subItems.some(subItem => location.pathname === subItem.to) || location.pathname === item.to
                  : location.pathname === item.to}
                onClick={handleNavigation}
                subItems={item.subItems}
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

export default AppLayout;
