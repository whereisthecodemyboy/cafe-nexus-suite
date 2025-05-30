
import React from 'react';
import { 
  Shield, 
  Building2, 
  Users, 
  Database, 
  ServerCog, 
  Settings, 
  BarChart2, 
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { cafes, users, orders, customers, products } = useAppContext();
  
  // Calculate real statistics
  const activeCafes = cafes.filter(cafe => cafe.status === 'active').length;
  const inactiveCafes = cafes.length - activeCafes;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  
  const platformStats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      description: "Across all cafes",
      icon: <BarChart2 className="h-8 w-8 text-green-600" />,
      trend: "+12.5%"
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      description: "Platform-wide orders",
      icon: <Database className="h-8 w-8 text-blue-600" />,
      trend: "+8.2%"
    },
    {
      title: "Registered Customers",
      value: customers.length.toLocaleString(),
      description: "Active customer base",
      icon: <Users className="h-8 w-8 text-purple-600" />,
      trend: "+5.7%"
    },
    {
      title: "Product Catalog",
      value: products.length.toLocaleString(),
      description: "Products across cafes",
      icon: <Settings className="h-8 w-8 text-orange-600" />,
      trend: "+3.2%"
    }
  ];
  
  const adminCards = [
    {
      title: "Cafe Management",
      description: "Create, edit and manage all cafe accounts in the platform",
      icon: <Building2 className="h-8 w-8 text-destructive" />,
      stats: `${activeCafes} active, ${inactiveCafes} inactive cafes`,
      path: "/admin/cafes",
      badge: "Primary"
    },
    {
      title: "User Management",
      description: "Manage all users, roles and permissions across all cafes",
      icon: <Users className="h-8 w-8 text-destructive" />,
      stats: `${activeUsers} active users`,
      path: "/admin/super/users",
      badge: "Primary"
    },
    {
      title: "System Database",
      description: "Manage and monitor the central platform database",
      icon: <Database className="h-8 w-8 text-destructive" />,
      stats: `${orders.length} orders, ${customers.length} customers`,
      path: "/admin/super/database"
    },
    {
      title: "Global Settings",
      description: "Configure platform-wide settings and defaults",
      icon: <Globe className="h-8 w-8 text-destructive" />,
      stats: "Global configuration",
      path: "/admin/super/settings"
    },
    {
      title: "System Maintenance",
      description: "Perform maintenance tasks and platform updates",
      icon: <ServerCog className="h-8 w-8 text-destructive" />,
      stats: "System maintenance",
      path: "/admin/super/maintenance"
    },
    {
      title: "Global Analytics",
      description: "Access analytics data across all cafes in the platform",
      icon: <BarChart2 className="h-8 w-8 text-destructive" />,
      stats: `$${totalRevenue.toLocaleString()} revenue, ${totalOrders} orders`,
      path: "/admin/super/analytics"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-destructive" />
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          Platform Admin Dashboard
        </h1>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="bg-destructive/10 p-4 rounded-md border border-destructive/30">
          <p className="font-semibold text-destructive">Multi-Cafe Management Platform</p>
          <p className="text-sm text-muted-foreground">
            Welcome to the central management system. As Platform Administrator, you have complete control over all {cafes.length} cafes and platform-wide settings.
          </p>
        </div>
        
        {/* Platform Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {stat.icon}
                  <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5 text-destructive" /> Cafes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cafes.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeCafes} active, {inactiveCafes} inactive
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-4 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => navigate('/admin/cafes')}
              >
                Manage Cafes
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-destructive" /> Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeUsers} active users
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-4 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => navigate('/admin/super/users')}
              >
                Manage Users
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-destructive" /> Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">System</div>
              <p className="text-xs text-muted-foreground">
                Global settings and maintenance
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-4 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => navigate('/admin/super/settings')}
              >
                Platform Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                {card.icon}
                {card.badge && (
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                    {card.badge}
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-4">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-medium text-sm text-muted-foreground mb-4">
                {card.stats}
              </div>
              <Button 
                className="w-full border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
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

export default SuperAdminDashboard;
