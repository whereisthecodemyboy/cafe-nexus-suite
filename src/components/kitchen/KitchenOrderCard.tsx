
import React, { useState } from 'react';
import { Check, Timer, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order, OrderItem } from '@/data/models';
import { formatDistanceToNow } from 'date-fns';

interface KitchenOrderCardProps {
  order: Order;
  onMarkItemReady: (orderId: string, itemId: string) => void;
  onMarkOrderReady: (orderId: string) => void;
}

const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({
  order,
  onMarkItemReady,
  onMarkOrderReady,
}) => {
  const [expanded, setExpanded] = useState(true);
  
  // Only show items that require preparation and aren't served or cancelled
  const foodItems = order.items.filter(
    item => item.status !== 'served' && 
            item.status !== 'cancelled'
  );
  
  // Check if all items are ready
  const allItemsReady = foodItems.every(item => item.status === 'ready');
  
  // Check if order has been pending too long
  const orderTime = new Date(order.createdAt);
  const now = new Date();
  const orderAgeMinutes = Math.floor((now.getTime() - orderTime.getTime()) / 60000);
  const isDelayed = orderAgeMinutes > 15;
  
  return (
    <Card className={`transition-all ${isDelayed ? 'border-destructive' : ''} ${allItemsReady ? 'bg-muted/50' : ''}`}>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{order.orderNumber}</h3>
              {isDelayed && (
                <Badge variant="destructive" className="ml-2">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Delayed
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</span>
              <span className="h-1 w-1 bg-muted-foreground rounded-full"></span>
              <span>
                {order.type === 'dine-in' ? `Table ${order.tableId?.substring(1)}` : order.type}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            {allItemsReady ? (
              <Button 
                size="sm" 
                className="h-7"
                onClick={() => onMarkOrderReady(order.id)}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Order Ready
              </Button>
            ) : (
              <Badge variant="outline" className="bg-card">
                <Timer className="h-3.5 w-3.5 mr-1" />
                {foodItems.filter(item => item.status === 'ready').length}/{foodItems.length} Ready
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-3">
        {foodItems.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-start justify-between py-2 border-b last:border-0 ${
              item.status === 'ready' ? 'opacity-70' : ''
            }`}
          >
            <div>
              <div className="flex items-baseline">
                <span className="font-medium">{item.quantity}×</span>
                <span className="ml-2">{item.productName}</span>
                {item.variantName && (
                  <span className="text-xs ml-1 text-muted-foreground">
                    ({item.variantName})
                  </span>
                )}
              </div>
              
              {item.customizations && item.customizations.length > 0 && (
                <div className="ml-6">
                  {item.customizations.map((customization, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      {customization.name}: {customization.option}
                    </div>
                  ))}
                </div>
              )}
              
              {item.notes && (
                <div className="ml-6 text-xs italic mt-1 text-amber-600 dark:text-amber-400">
                  Note: {item.notes}
                </div>
              )}
            </div>
            
            {item.status === 'ready' ? (
              <Badge className="bg-green-500">Ready</Badge>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7"
                onClick={() => onMarkItemReady(order.id, item.id)}
              >
                Mark Ready
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default KitchenOrderCard;
