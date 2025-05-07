
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
    currentUser 
  } = useAppContext();
  
  // Determine if the user is a SuperAdmin
  const isSuperAdmin = currentUser?.role === 'superAdmin';
  
  const activeUsers = users.filter(user => user.status === 'active').length;
  const activeCafes = cafes.filter(cafe => cafe.status === 'active').length;
  const activeProducts = products.filter(product => product.available).length;
  const pendingOrders = orders.filter(order => 
    order.status !== 'completed' && order.status !== 'cancelled'
  ).length;
  const todayReservations = reservations.filter(reservation => {
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
      description: "Manage staff accounts, roles, and permissions",
      icon: <Users className="h-8 w-8 text-primary" />,
      stats: `${activeUsers} active staff`,
      path: "/admin/staff"
    },
    {
      title: "Menu Management",
      description: "Update menu items, prices, and categories",
      icon: <ShoppingBasket className="h-8 w-8 text-primary" />,
      stats: `${activeProducts} active items`,
      path: "/admin/menu"
    },
    {
      title: "Table Management",
      description: "Configure restaurant layout and table settings",
      icon: <Table2 className="h-8 w-8 text-primary" />,
      stats: `${tables.length} tables configured`,
      path: "/admin/tables"
    },
    {
      title: "Orders & Reservations",
      description: "Monitor and manage orders and bookings",
      icon: <FileText className="h-8 w-8 text-primary" />,
      stats: `${pendingOrders} pending orders, ${todayReservations} today's reservations`,
      path: "/admin/orders"
    },
    {
      title: "Reports & Analytics",
      description: "View sales reports and business analytics",
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      stats: "System-wide analytics",
      path: "/admin/reports"
    },
    {
      title: "Access Control",
      description: "Manage user access and permissions",
      icon: <Key className="h-8 w-8 text-primary" />,
      stats: "Configure system access",
      path: "/admin/access"
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings and preferences",
      icon: <Settings className="h-8 w-8 text-primary" />,
      stats: "Global configuration",
      path: "/admin/settings"
    }
  ];
  
  const adminCards = [
    {
      title: "Staff Management",
      description: "Manage staff accounts, roles, and permissions",
      icon: <Users className="h-8 w-8 text-primary" />,
      stats: `${activeUsers} active staff`,
      path: "/admin/staff"
    },
    {
      title: "Table Management",
      description: "Configure restaurant layout and table settings",
      icon: <Table2 className="h-8 w-8 text-primary" />,
      stats: `${tables.length} tables configured`,
      path: "/admin/tables"
    },
    {
      title: "Menu Management",
      description: "Update menu items, prices, and categories",
      icon: <ShoppingBasket className="h-8 w-8 text-primary" />,
      stats: `${activeProducts} active items`,
      path: "/admin/menu"
    },
    {
      title: "Orders & Reservations",
      description: "Monitor and manage orders and bookings",
      icon: <FileText className="h-8 w-8 text-primary" />,
      stats: `${pendingOrders} pending orders, ${todayReservations} today's reservations`,
      path: "/admin/orders"
    },
    {
      title: "Reports & Analytics",
      description: "View sales reports and business analytics",
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      stats: "Full access to all reports",
      path: "/admin/reports"
    },
    {
      title: "Access Control",
      description: "Manage user access and permissions",
      icon: <Key className="h-8 w-8 text-primary" />,
      stats: "Configure system access",
      path: "/admin/access"
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings and preferences",
      icon: <Settings className="h-8 w-8 text-primary" />,
      stats: "Global configuration",
      path: "/admin/settings"
    }
  ];
  
  // Choose which cards to display based on user role
  const cardsToDisplay = isSuperAdmin ? superAdminCards : adminCards;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-serif font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      
      <p className="text-muted-foreground">
        {isSuperAdmin 
          ? "Welcome to the master control panel. As Super Admin, you have complete control over all cafes and system-wide settings."
          : "Welcome to the admin control panel. This secure area provides complete control over the café management system."
        }
      </p>
      
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
