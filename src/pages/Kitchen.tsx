
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import KitchenOrderCard from '@/components/kitchen/KitchenOrderCard';
import { Order } from '@/data/models';

const Kitchen: React.FC = () => {
  const { orders, updateOrder } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  
  // Filter orders that are in preparation
  const pendingOrders = orders.filter(
    order => order.status === 'pending' || order.status === 'confirmed'
  );
  
  const preparingOrders = orders.filter(
    order => order.status === 'preparing'
  );
  
  const readyOrders = orders.filter(
    order => order.status === 'ready'
  );
  
  const handleMarkItemReady = (orderId: string, itemId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const updatedItems = order.items.map(item =>
      item.id === itemId ? { ...item, status: 'ready' } : item
    );
    
    // If order was pending or confirmed, update it to preparing
    const newStatus = order.status === 'pending' || order.status === 'confirmed'
      ? 'preparing'
      : order.status;
    
    updateOrder({
      ...order,
      status: newStatus,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
    
    toast({
      title: "Item Ready",
      description: `Item marked as ready.`,
    });
  };
  
  const handleMarkOrderReady = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Mark all items as ready
    const updatedItems = order.items.map(item => ({ ...item, status: 'ready' }));
    
    updateOrder({
      ...order,
      status: 'ready',
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
    
    toast({
      title: "Order Ready",
      description: `Order #${order.orderNumber} is ready for service.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Kitchen Display</h1>
        <p className="text-muted-foreground">View and manage food preparation</p>
      </div>
      
      {/* Kitchen Tabs */}
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingOrders.length > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {pendingOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="preparing" className="relative">
            Preparing
            {preparingOrders.length > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {preparingOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="ready" className="relative">
            Ready
            {readyOrders.length > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {readyOrders.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          {pendingOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingOrders.map(order => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onMarkItemReady={handleMarkItemReady}
                  onMarkOrderReady={handleMarkOrderReady}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60">
              <p className="text-muted-foreground">No pending orders</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="preparing" className="mt-6">
          {preparingOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {preparingOrders.map(order => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onMarkItemReady={handleMarkItemReady}
                  onMarkOrderReady={handleMarkOrderReady}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60">
              <p className="text-muted-foreground">No orders in preparation</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="ready" className="mt-6">
          {readyOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {readyOrders.map(order => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onMarkItemReady={handleMarkItemReady}
                  onMarkOrderReady={handleMarkOrderReady}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60">
              <p className="text-muted-foreground">No orders ready for service</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Kitchen;
