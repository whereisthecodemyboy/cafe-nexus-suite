
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Order } from '@/data/models';
import DeliveryOrderForm from '@/components/delivery/DeliveryOrderForm';
import DeliveryOrderCard from '@/components/delivery/DeliveryOrderCard';
import DeliveryMap from '@/components/delivery/DeliveryMap';

const Delivery: React.FC = () => {
  const { toast } = useToast();
  const { products, orders, addOrder, updateOrder } = useAppContext();
  const [currentTab, setCurrentTab] = useState('new');
  
  // Filter products that are available
  const availableProducts = products.filter(product => product.available);
  
  // Filter delivery orders
  const deliveryOrders = orders.filter(order => order.type === 'delivery');
  
  const pendingDeliveries = deliveryOrders.filter(order => 
    order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready'
  );
  
  const activeDeliveries = deliveryOrders.filter(order => 
    order.status === 'out-for-delivery'
  );
  
  const completedDeliveries = deliveryOrders.filter(order => 
    order.status === 'delivered' || order.status === 'cancelled'
  );

  // Handle order submission
  const handleOrderSubmit = (newOrder: Order) => {
    addOrder(newOrder);
    toast({
      title: "Order Created",
      description: `Delivery order #${newOrder.orderNumber} has been created.`,
    });
    setCurrentTab('pending');
  };

  // Handle assigning delivery
  const handleAssignDelivery = (orderId: string) => {
    const targetOrder = orders.find(order => order.id === orderId);
    if (!targetOrder) return;
    
    const updatedOrder = {
      ...targetOrder,
      status: 'out-for-delivery',
      updatedAt: new Date().toISOString(),
    };
    
    updateOrder(updatedOrder);
    
    toast({
      title: "Delivery Assigned",
      description: `Order #${targetOrder.orderNumber} has been assigned for delivery.`,
    });
  };
  
  // Handle marking as delivered
  const handleMarkDelivered = (orderId: string) => {
    const targetOrder = orders.find(order => order.id === orderId);
    if (!targetOrder) return;
    
    const updatedOrder = {
      ...targetOrder,
      status: 'delivered',
      paymentStatus: 'paid', // Assuming payment is completed upon delivery
      updatedAt: new Date().toISOString(),
    };
    
    updateOrder(updatedOrder);
    
    toast({
      title: "Delivery Completed",
      description: `Order #${targetOrder.orderNumber} has been marked as delivered.`,
    });
  };
  
  // Handle cancelling order
  const handleCancelOrder = (orderId: string) => {
    const targetOrder = orders.find(order => order.id === orderId);
    if (!targetOrder) return;
    
    const updatedOrder = {
      ...targetOrder,
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    };
    
    updateOrder(updatedOrder);
    
    toast({
      title: "Order Cancelled",
      description: `Order #${targetOrder.orderNumber} has been cancelled.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Delivery Management</h1>
        <p className="text-muted-foreground">Manage delivery orders for your restaurant</p>
      </div>
      
      <Tabs defaultValue="new" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="new">New Order</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {pendingDeliveries.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {activeDeliveries.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="mt-6">
          <DeliveryOrderForm 
            products={availableProducts} 
            onOrderSubmit={handleOrderSubmit}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          {pendingDeliveries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingDeliveries.map(order => (
                <DeliveryOrderCard
                  key={order.id}
                  order={order}
                  onAssignDelivery={handleAssignDelivery}
                  onMarkDelivered={handleMarkDelivered}
                  onCancelOrder={handleCancelOrder}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
              <p>No pending delivery orders</p>
              <Button 
                variant="link" 
                onClick={() => setCurrentTab('new')}
              >
                Create a new delivery order
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          {activeDeliveries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeDeliveries.map(order => (
                <DeliveryOrderCard
                  key={order.id}
                  order={order}
                  onAssignDelivery={handleAssignDelivery}
                  onMarkDelivered={handleMarkDelivered}
                  onCancelOrder={handleCancelOrder}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
              <p>No active deliveries</p>
              <Button 
                variant="link" 
                onClick={() => setCurrentTab('pending')}
              >
                Check pending orders
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {completedDeliveries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedDeliveries.map(order => (
                <DeliveryOrderCard
                  key={order.id}
                  order={order}
                  onAssignDelivery={handleAssignDelivery}
                  onMarkDelivered={handleMarkDelivered}
                  onCancelOrder={handleCancelOrder}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
              <p>No completed deliveries</p>
              <Button 
                variant="link" 
                onClick={() => setCurrentTab('new')}
              >
                Create a new delivery order
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          <DeliveryMap activeDeliveries={activeDeliveries} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Delivery;
