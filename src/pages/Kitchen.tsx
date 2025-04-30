
import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, Bell, ChefHat } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/contexts/AppContext';
import { Order, OrderItem } from '@/data/models';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Kitchen: React.FC = () => {
  const { orders, updateOrderItem, updateOrder } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [timer, setTimer] = useState<number>(0);

  // Filter orders to show only 'confirmed' and 'preparing' orders
  const pendingOrders = orders.filter(order => 
    order.status === 'confirmed' && 
    order.items.some(item => item.status === 'pending')
  );

  const inProgressOrders = orders.filter(order => 
    (order.status === 'preparing' || order.status === 'confirmed') &&
    order.items.some(item => item.status === 'preparing')
  );

  const completedOrders = orders.filter(order => 
    order.items.every(item => item.status === 'ready' || item.status === 'served')
  );

  // Sort orders by createdAt timestamp
  const sortOrders = (orderList: Order[]) => {
    return [...orderList].sort((a, b) => (new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime());
  };

  const sortedPendingOrders = sortOrders(pendingOrders);
  const sortedInProgressOrders = sortOrders(inProgressOrders);
  const sortedCompletedOrders = sortOrders(completedOrders);

  // Set up timer to update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get time elapsed since order was created
  const getTimeElapsed = (createdAt: string) => {
    const start = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const diff = now - start;
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartPrep = (orderId: string, itemId: string) => {
    updateOrderItem(orderId, itemId, 'preparing');
    updateOrder({ 
      ...orders.find(o => o.id === orderId)!, 
      status: 'preparing' 
    });
    
    toast({
      title: "Item preparation started",
      description: "The item status has been updated to 'preparing'",
    });
  };

  const handleMarkReady = (orderId: string, itemId: string) => {
    updateOrderItem(orderId, itemId, 'ready');
    
    // Check if all items are ready
    const order = orders.find(o => o.id === orderId)!;
    const allReady = order.items.every(item => item.status === 'ready' || item.status === 'served');
    
    if (allReady) {
      updateOrder({ ...order, status: 'ready' });
      toast({
        title: "Order ready",
        description: "All items in the order are now ready for serving",
      });
    } else {
      toast({
        title: "Item ready",
        description: "The item status has been updated to 'ready'",
      });
    }
  };

  const handleCancelItem = (orderId: string, itemId: string) => {
    updateOrderItem(orderId, itemId, 'cancelled');
    toast({
      title: "Item cancelled",
      description: "The item has been marked as cancelled",
      variant: "destructive"
    });
  };

  const renderOrdersGrid = (orders: Order[]) => {
    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
          <Clock className="h-12 w-12 mb-2 opacity-20" />
          <p>No orders found</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {orders.map((order) => {
          // Filter items based on the active tab
          let items: OrderItem[] = [];
          
          if (activeTab === 'pending') {
            items = order.items.filter(item => item.status === 'pending');
          } else if (activeTab === 'in-progress') {
            items = order.items.filter(item => item.status === 'preparing');
          } else {
            items = order.items.filter(item => item.status === 'ready' || item.status === 'served');
          }

          if (items.length === 0) return null;

          const timeElapsed = getTimeElapsed(order.createdAt);
          const isUrgent = parseInt(timeElapsed.split(':')[0]) >= 10;

          return (
            <Card key={order.id} className={`${isUrgent ? 'border-red-500' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center text-lg">
                      Order #{order.orderNumber}
                      {isUrgent && <Bell className="h-4 w-4 ml-2 text-red-500" />}
                    </CardTitle>
                    <CardDescription>
                      {order.type === 'dine-in' ? `Table: ${order.tableId}` : `${order.type.charAt(0).toUpperCase() + order.type.slice(1)}`}
                      {order.status === 'ready' && (
                        <Badge className="ml-2 bg-green-500">Ready</Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className={`text-right ${isUrgent ? 'text-red-500' : 'text-muted-foreground'}`}>
                    <div className="text-sm font-medium">{timeElapsed}</div>
                    <div className="text-xs">Time Elapsed</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex flex-col p-3 rounded-md bg-muted">
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">
                            {item.productName} x {item.quantity}
                          </div>
                          {item.status === 'preparing' && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500">
                              Preparing
                            </Badge>
                          )}
                          {item.status === 'ready' && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">
                              Ready
                            </Badge>
                          )}
                        </div>
                        
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="text-xs text-muted-foreground mb-2">
                            {item.customizations.map((customization, index) => (
                              <div key={index}>
                                {customization.name}: {customization.option}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {item.notes && (
                          <div className="text-xs border-l-2 border-primary pl-2 mb-2">
                            {item.notes}
                          </div>
                        )}
                        
                        <div className="flex space-x-2 mt-1">
                          {item.status === 'pending' && (
                            <Button 
                              size="sm" 
                              className="w-full bg-blue-500 hover:bg-blue-600"
                              onClick={() => handleStartPrep(order.id, item.id)}
                            >
                              <ChefHat className="h-4 w-4 mr-2" />
                              Start Prep
                            </Button>
                          )}
                          {item.status === 'preparing' && (
                            <Button 
                              size="sm" 
                              className="w-full bg-green-500 hover:bg-green-600"
                              onClick={() => handleMarkReady(order.id, item.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Ready
                            </Button>
                          )}
                          {(item.status === 'pending' || item.status === 'preparing') && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="w-1/4"
                              onClick={() => handleCancelItem(order.id, item.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Kitchen Orders</h1>
        <div className="flex justify-between">
          <p className="text-muted-foreground">Manage incoming and ongoing orders</p>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Urgent</span>
            </div>
            <div className="flex items-center space-x-1 text-sm ml-4">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Preparing</span>
            </div>
            <div className="flex items-center space-x-1 text-sm ml-4">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="pending">
            Pending Orders
            {pendingOrders.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {pendingOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress
            {inProgressOrders.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {inProgressOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="pending" className="m-0">
            {renderOrdersGrid(sortedPendingOrders)}
          </TabsContent>
          
          <TabsContent value="in-progress" className="m-0">
            {renderOrdersGrid(sortedInProgressOrders)}
          </TabsContent>
          
          <TabsContent value="completed" className="m-0">
            {renderOrdersGrid(sortedCompletedOrders)}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Kitchen;
