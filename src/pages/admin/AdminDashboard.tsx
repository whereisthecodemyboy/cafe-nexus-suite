
import React from 'react';
import { Shield, Users, ShoppingBasket, Table2, FileText, BarChart2, Key, Settings, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    users, 
    products, 
    orders, 
    tables, 
    reservations,
    cafes,
    currentUser,
    currentCafe
  } = useAppContext();
  
  // Determine if the user is a SuperAdmin
  const isSuperAdmin = currentUser?.role === 'superAdmin';
  
  // Calculate statistics based on active cafes or current cafe
  const activeCafes = cafes.filter(cafe => cafe.status === 'active').length;
  
  // Filter users for either all cafes (super admin) or current cafe (cafe admin)
  const filteredUsers = isSuperAdmin 
    ? users 
    : users.filter(user => user.cafeId === currentCafe?.id);
  
  const activeUsers = filteredUsers.filter(user => user.status === 'active').length;
  
  // Filter products for either all cafes or current cafe
  const filteredProducts = isSuperAdmin 
    ? products 
    : products.filter(p => !p.cafeId || p.cafeId === currentCafe?.id);
  
  const activeProducts = filteredProducts.filter(product => product.available).length;
  
  // Filter orders for either all cafes or current cafe
  const filteredOrders = isSuperAdmin 
    ? orders 
    : orders.filter(o => !o.cafeId || o.cafeId === currentCafe?.id);
  
  const pendingOrders = filteredOrders.filter(order => 
    order.status !== 'completed' && order.status !== 'cancelled'
  ).length;
  
  // Filter tables for either all cafes or current cafe
  const filteredTables = tables.length;
  
  // Filter reservations for either all cafes or current cafe
  const filteredReservations = reservations;
  
  const todayReservations = filteredReservations.filter(reservation => {
    const today = new Date().toISOString().split('T')[0];
    return reservation.date === today;
  }).length;

  // Different cards for SuperAdmin vs regular Admin
  const superAdminCards = [
    {
      title: "Cafe Management",
      description: "Create and manage cafes across the system",
      icon: <Building2 className="h-8 w-8 text-primary" />,
      stats: `${activeCafes} active cafes`,
      path: "/admin/cafes"
    },
    {
      title: "Staff Management",
      description: "Manage staff accounts, roles, and permissions across all cafes",
      icon: <Users className="h-8 w-8 text-primary" />,
      stats: `${activeUsers} active staff members`,
      path: "/admin/staff"
    },
    {
      title: "Menu Management",
      description: "Oversee all menu items across the system",
      icon: <ShoppingBasket className="h-8 w-8 text-primary" />,
      stats: `${activeProducts} active menu items`,
      path: "/admin/menu"
    },
    {
      title: "Table Management",
      description: "Configure restaurant layouts for all cafes",
      icon: <Table2 className="h-8 w-8 text-primary" />,
      stats: `${filteredTables} tables configured`,
      path: "/admin/tables"
    },
    {
      title: "Orders & Reservations",
      description: "Monitor all orders and bookings across the system",
      icon: <FileText className="h-8 w-8 text-primary" />,
      stats: `${pendingOrders} pending orders, ${todayReservations} today's reservations`,
      path: "/admin/orders"
    },
    {
      title: "Reports & Analytics",
      description: "View system-wide sales reports and business analytics",
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      stats: "System-wide analytics",
      path: "/admin/reports"
    },
    {
      title: "Access Control",
      description: "Manage system access and roles across the platform",
      icon: <Key className="h-8 w-8 text-primary" />,
      stats: "Configure system access",
      path: "/admin/access"
    },
    {
      title: "System Settings",
      description: "Configure global system settings and preferences",
      icon: <Settings className="h-8 w-8 text-primary" />,
      stats: "Global configuration",
      path: "/admin/settings"
    }
  ];
  
  const adminCards = [
    {
      title: "Staff Management",
      description: "Manage staff accounts for your cafe",
      icon: <Users className="h-8 w-8 text-primary" />,
      stats: `${activeUsers} active staff`,
      path: "/admin/staff"
    },
    {
      title: "Menu Management",
      description: "Update menu items for your cafe",
      icon: <ShoppingBasket className="h-8 w-8 text-primary" />,
      stats: `${activeProducts} active items`,
      path: "/admin/menu"
    },
    {
      title: "Table Management",
      description: "Configure restaurant layout for your cafe",
      icon: <Table2 className="h-8 w-8 text-primary" />,
      stats: `${filteredTables} tables configured`,
      path: "/admin/tables"
    },
    {
      title: "Orders & Reservations",
      description: "Monitor orders and bookings for your cafe",
      icon: <FileText className="h-8 w-8 text-primary" />,
      stats: `${pendingOrders} pending orders, ${todayReservations} today's reservations`,
      path: "/admin/orders"
    },
    {
      title: "Reports & Analytics",
      description: "View sales reports for your cafe",
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      stats: "Cafe analytics",
      path: "/admin/reports"
    },
    {
      title: "Access Control",
      description: "Manage user access for your cafe",
      icon: <Key className="h-8 w-8 text-primary" />,
      stats: "Configure cafe access",
      path: "/admin/access"
    },
    {
      title: "Cafe Settings",
      description: "Configure settings for your cafe",
      icon: <Settings className="h-8 w-8 text-primary" />,
      stats: "Cafe configuration",
      path: "/admin/settings"
    }
  ];
  
  // Choose which cards to display based on user role
  const cardsToDisplay = isSuperAdmin ? superAdminCards : adminCards;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          {isSuperAdmin ? "Super Admin Dashboard" : "Café Admin Dashboard"}
        </h1>
      </div>
      
      <div className="flex flex-col space-y-2">
        <p className="text-muted-foreground">
          {isSuperAdmin 
            ? "Welcome to the central management system. As Super Admin, you have complete control over all cafes and system-wide settings."
            : `Welcome to the ${currentCafe?.name} dashboard. This area provides complete control over your café management.`
          }
        </p>
        
        {isSuperAdmin && (
          <div className="bg-primary/10 p-4 rounded-md border border-primary/30">
            <p className="font-semibold text-primary">You are currently in the System Administrator view</p>
            <p className="text-sm text-muted-foreground">You have access to manage all cafes in the system</p>
          </div>
        )}
        
        {!isSuperAdmin && currentCafe && (
          <div className="bg-secondary/30 p-4 rounded-md border border-secondary/50">
            <p className="font-semibold">Currently managing: {currentCafe.name}</p>
            <p className="text-sm text-muted-foreground">You have access to manage this cafe only</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardsToDisplay.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                {card.icon}
              </div>
              <CardTitle className="mt-4">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-medium text-sm text-muted-foreground mb-4">
                {card.stats}
              </div>
              <Button 
                className="w-full" 
                onClick={() => navigate(card.path)}
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
