
import React from 'react';
import { 
  Calendar,
  Home,
  Users,
  ShoppingBasket,
  BarChart2,
  Settings,
  Table2,
  FileText,
  DollarSign,
  Package,
  Truck,
  ChefHat,
  User
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/contexts/AppContext";
import { ModeToggle } from "./ModeToggle";

const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "POS",
    url: "/pos",
    icon: ShoppingBasket,
  },
  {
    title: "Tables",
    url: "/table-management",
    icon: Table2,
  },
  {
    title: "Menu",
    url: "/menu",
    icon: FileText,
  },
  {
    title: "Kitchen",
    url: "/kitchen",
    icon: ChefHat,
  },
];

const businessItems = [
  {
    title: "Reservations",
    url: "/reservations",
    icon: Calendar,
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Users,
  },
  {
    title: "Customers",
    url: "/customer",
    icon: User,
  },
  {
    title: "Cash Flow",
    url: "/cashflow",
    icon: DollarSign,
  },
  {
    title: "Delivery",
    url: "/delivery",
    icon: Truck,
  },
];

const inventoryItems = [
  {
    title: "Stock In",
    url: "/inventory/stock-in",
    icon: Package,
  },
  {
    title: "Stock Out",
    url: "/inventory/stock-out",
    icon: Package,
  },
  {
    title: "Wastage",
    url: "/inventory/wastage",
    icon: Package,
  },
  {
    title: "Purchase Orders",
    url: "/inventory/purchase-orders",
    icon: Package,
  },
];

const systemItems = [
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart2,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function StaffSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, currentCafe, logout } = useAppContext();

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-2">
          <ShoppingBasket className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-serif font-bold text-lg">Café Manager</h1>
            {currentCafe && (
              <p className="text-sm text-muted-foreground">{currentCafe.name}</p>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <div className="flex items-center cursor-pointer">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Business</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <div className="flex items-center cursor-pointer">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Inventory</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {inventoryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <div className="flex items-center cursor-pointer">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <div className="flex items-center cursor-pointer">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/assets/avatar.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentUser?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {currentUser?.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {currentUser?.role}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>
                {currentUser?.name || "User"}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                {currentUser?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
