import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/contexts/AppContext';
import { Order, OrderItem } from '@/data/models';

const Kitchen: React.FC = () => {
  const { orders, updateOrderItem } = useAppContext();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  // Filter orders to show only 'confirmed' and 'preparing' orders
  const filteredOrders = orders.filter(order => order.status === 'confirmed' || order.status === 'preparing');

  // Sort orders by createdAt timestamp
  const sortedOrders = [...filteredOrders].sort((a, b) => (new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Kitchen Orders</h1>
        <p className="text-muted-foreground">Manage incoming and ongoing orders</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none ${activeTab === 'pending'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-foreground hover:bg-muted'
            }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Orders
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none ${activeTab === 'completed'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-foreground hover:bg-muted'
            }`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Orders
        </button>
      </div>

      <Separator />

      {/* Order List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedOrders.map((order) => {
          // Filter items based on the active tab
          const pendingItems = order.items.filter(
            (item) => item.status === "pending" || item.status === "preparing"
          ) as OrderItem[];

          const completedItems = order.items.filter(
            (item) => item.status === "ready" || item.status === "served"
          ) as OrderItem[];

          const itemsToShow = activeTab === 'pending' ? pendingItems : completedItems;

          if (itemsToShow.length === 0) {
            return null; // Skip rendering if there are no items to show for the current tab
          }

          return (
            <div key={order.id} className="bg-card rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-2">Order #{order.orderNumber}</h2>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-3 pr-4">
                  {itemsToShow.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-md bg-muted">
                      <span>{item.productName} x {item.quantity}</span>
                      <div>
                        {item.status === 'pending' && (
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                            onClick={() => updateOrderItem(order.id, item.id, 'preparing')}
                          >
                            Start Prep
                          </button>
                        )}
                        {item.status === 'preparing' && (
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                            onClick={() => updateOrderItem(order.id, item.id, 'ready')}
                          >
                            Ready
                          </button>
                        )}
                        {item.status === 'ready' && (
                          <CheckCircle className="text-green-500 w-5 h-5" />
                        )}
                        {item.status === 'served' && (
                          <CheckCircle className="text-green-500 w-5 h-5" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
      {sortedOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
          <Clock className="h-12 w-12 mb-2 opacity-20" />
          <p>No orders found</p>
        </div>
      )}
    </div>
  );
};

export default Kitchen;
