
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/data/models';
import { formatDistanceToNow } from 'date-fns';

interface OrdersOverviewProps {
  orders: Order[];
}

const OrdersOverview: React.FC<OrdersOverviewProps> = ({ orders }) => {
  // Get only recent orders that are not completed or cancelled
  const recentOrders = orders
    .filter((order) => 
      order.status !== 'completed' && 
      order.status !== 'cancelled'
    )
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'confirmed':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'preparing':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'ready':
        return 'bg-green-500 hover:bg-green-600';
      case 'serving':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Active Orders</CardTitle>
        <CardDescription>Recent orders that need attention</CardDescription>
      </CardHeader>
      <CardContent>
        {recentOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    {order.type === 'dine-in' ? 'Dine-in' : 
                     order.type === 'takeaway' ? 'Takeaway' : 
                     order.type === 'delivery' ? 'Delivery' : 'Online'}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No active orders</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersOverview;
