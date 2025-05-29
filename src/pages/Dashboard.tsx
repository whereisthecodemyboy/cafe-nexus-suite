
import React from 'react';
import { Coffee, DollarSign, Users, ShoppingBag, Calendar, Clock } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import SalesChart from '@/components/dashboard/SalesChart';
import PopularItems from '@/components/dashboard/PopularItems';
import HourlyTrafficChart from '@/components/dashboard/HourlyTrafficChart';
import OrdersOverview from '@/components/dashboard/OrdersOverview';
import InventoryAlerts from '@/components/dashboard/InventoryAlerts';
import { useAppContext } from '@/contexts/AppContext';

const Dashboard: React.FC = () => {
  const { 
    orders, 
    salesData, 
    hourlyTraffic, 
    popularItems, 
    customers,
    reservations,
    inventoryItems,
    currentCafe,
    currentUser
  } = useAppContext();

  // Calculate today's sales
  const todaySales = salesData[salesData.length - 1]?.total || 0;
  const yesterdaySales = salesData[salesData.length - 2]?.total || 0;
  const salesChange = todaySales - yesterdaySales;
  const salesChangePercent = yesterdaySales ? ((salesChange / yesterdaySales) * 100).toFixed(1) : '0';
  const salesTrend = salesChange >= 0 ? 'up' : 'down';
  
  // Calculate active orders (not completed or cancelled)
  const activeOrders = orders.filter(order => 
    order.status !== 'completed' && 
    order.status !== 'cancelled'
  ).length;
  
  // Calculate today's reservations
  const today = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter(res => res.date === today).length;
  
  // Calculate total customers and new today
  const totalCustomers = customers.length;
  const newCustomersToday = customers.filter(cust => 
    new Date(cust.joinDate).toISOString().split('T')[0] === today
  ).length;
  
  // Calculate low stock inventory
  const lowStockItems = inventoryItems.filter(item => 
    item.currentStock <= item.minimumStock
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          {currentCafe ? `${currentCafe.name} Dashboard` : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {currentCafe 
            ? `Overview of ${currentCafe.name} performance and operations.`
            : 'Overview of your café performance and operations.'
          }
        </p>
        {currentCafe && (
          <p className="text-sm text-muted-foreground mt-1">
            {currentCafe.address} • {currentCafe.phone}
          </p>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Today's Sales" 
          value={`$${todaySales.toFixed(2)}`} 
          icon={<DollarSign className="h-4 w-4" />} 
          change={`${salesChangePercent}% from yesterday`}
          trend={salesTrend}
        />
        <StatCard 
          title="Active Orders" 
          value={activeOrders} 
          icon={<Coffee className="h-4 w-4" />} 
        />
        <StatCard 
          title="Today's Reservations" 
          value={todayReservations} 
          icon={<Calendar className="h-4 w-4" />} 
        />
        <StatCard 
          title="Total Customers" 
          value={totalCustomers} 
          icon={<Users className="h-4 w-4" />}
          change={`${newCustomersToday} new today`}
          trend={newCustomersToday > 0 ? 'up' : 'neutral'}
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SalesChart data={salesData} />
      </div>
      
      {/* More data and alerts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <OrdersOverview orders={orders} />
        <InventoryAlerts items={inventoryItems} />
        <div className="space-y-4">
          <StatCard 
            title="Low Stock Items" 
            value={lowStockItems} 
            icon={<ShoppingBag className="h-4 w-4" />}
            className="h-[138px]"
          />
          <StatCard 
            title="Peak Hours" 
            value="11 AM - 2 PM" 
            icon={<Clock className="h-4 w-4" />}
            className="h-[138px]"
          />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <HourlyTrafficChart data={hourlyTraffic} />
        <PopularItems data={popularItems} />
      </div>
    </div>
  );
};

export default Dashboard;
