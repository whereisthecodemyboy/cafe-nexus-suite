
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, MapPin, Phone, User, Check, Truck, Ban } from 'lucide-react';
import { Order } from '@/data/models';
import { formatDistanceToNow } from 'date-fns';

interface DeliveryOrderCardProps {
  order: Order;
  onAssignDelivery: (orderId: string) => void;
  onMarkDelivered: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
}

const DeliveryOrderCard: React.FC<DeliveryOrderCardProps> = ({
  order,
  onAssignDelivery,
  onMarkDelivered,
  onCancelOrder
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Badge variant="secondary">Preparing</Badge>;
      case 'ready':
        return <Badge variant="outline">Ready for Delivery</Badge>;
      case 'out-for-delivery':
        return <Badge variant="default">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="default" className="bg-green-600">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getActions = () => {
    if (order.status === 'ready') {
      return (
        <>
          <Button onClick={() => onAssignDelivery(order.id)} className="flex-1">
            <Truck className="mr-2 h-4 w-4" />
            Assign for Delivery
          </Button>
          <Button variant="destructive" onClick={() => onCancelOrder(order.id)}>
            <Ban className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </>
      );
    } else if (order.status === 'out-for-delivery') {
      return (
        <Button onClick={() => onMarkDelivered(order.id)} className="w-full bg-green-600 hover:bg-green-700">
          <Check className="mr-2 h-4 w-4" />
          Mark as Delivered
        </Button>
      );
    }
    return null;
  };

  const timeAgo = order.createdAt
    ? formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })
    : 'Unknown time';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Order #{order.orderNumber}</CardTitle>
            <CardDescription>
              {timeAgo}
            </CardDescription>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {order.deliveryInfo && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{order.deliveryInfo.customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{order.deliveryInfo.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              <span className="text-sm">{order.deliveryInfo.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {order.deliveryInfo.estimatedDeliveryTime 
                  ? `Est. delivery: ${order.deliveryInfo.estimatedDeliveryTime} min`
                  : 'Delivery time not set'}
              </span>
            </div>
          </div>
        )}

        <div className="border-t border-border pt-2 pb-1">
          <h4 className="text-sm font-medium mb-2">Order Items</h4>
          <ScrollArea className="h-28 pr-4">
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>
                    <span className="font-medium">{item.quantity}x</span> {item.productName}
                  </span>
                  <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
        
        <div className="flex justify-between font-medium mt-4 pt-2 border-t">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 bg-muted/20 border-t">
        {getActions()}
      </CardFooter>
    </Card>
  );
};

export default DeliveryOrderCard;
