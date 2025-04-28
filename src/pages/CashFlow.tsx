
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import StatCard from '@/components/dashboard/StatCard';
import { Order, PaymentDetails } from '@/data/models';
import UnpaidCustomerList from '@/components/cashflow/UnpaidCustomerList';
import CustomerPaymentHistory from '@/components/cashflow/CustomerPaymentHistory';

const CashFlow: React.FC = () => {
  const { orders, paymentDetails } = useAppContext();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  // Format selected date for display and filtering
  const formattedDate = format(date, 'yyyy-MM-dd');

  // Filter orders for the selected date
  const dailyOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return format(orderDate, 'yyyy-MM-dd') === formattedDate;
  });

  // Calculate daily sales data
  const dailyTotal = dailyOrders.reduce((sum, order) => sum + order.total, 0);
  const dailyCash = dailyOrders
    .filter(order => order.paymentMethod === 'cash')
    .reduce((sum, order) => sum + order.total, 0);
  const dailyCard = dailyOrders
    .filter(order => order.paymentMethod === 'card')
    .reduce((sum, order) => sum + order.total, 0);
  
  // Calculate unpaid amounts
  const unpaidPayments = paymentDetails.filter(payment => 
    payment.paymentStatus === 'due' || payment.paymentStatus === 'partially_paid'
  );
  const totalUnpaid = unpaidPayments.reduce((sum, payment) => 
    sum + payment.remainingAmount, 0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Cash Flow History</h1>
        <p className="text-muted-foreground">Track daily sales and customer payment history</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Date Picker */}
        <Card className="w-full md:w-auto">
          <CardHeader>
            <CardTitle className="text-lg">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
        
        {/* Daily Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <StatCard 
            title="Daily Total Sales" 
            value={`$${dailyTotal.toFixed(2)}`} 
            icon={<Calendar className="h-4 w-4" />} 
          />
          <StatCard 
            title="Cash Payments" 
            value={`$${dailyCash.toFixed(2)}`} 
            icon={<Calendar className="h-4 w-4" />} 
          />
          <StatCard 
            title="Card Payments" 
            value={`$${dailyCard.toFixed(2)}`} 
            icon={<Calendar className="h-4 w-4" />} 
          />
        </div>
      </div>
      
      {/* Tabs for different views */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList>
          <TabsTrigger value="daily">Daily Transactions</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid Amounts (${totalUnpaid.toFixed(2)})</TabsTrigger>
          <TabsTrigger value="history">Customer History</TabsTrigger>
        </TabsList>
        
        {/* Daily Transactions Tab */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions for {format(date, 'MMMM d, yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">No transactions found for this date</TableCell>
                    </TableRow>
                  ) : (
                    dailyOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{format(new Date(order.createdAt), 'h:mm a')}</TableCell>
                        <TableCell>{order.orderNumber}</TableCell>
                        <TableCell className="capitalize">{order.type}</TableCell>
                        <TableCell>{order.items.length}</TableCell>
                        <TableCell className="capitalize">{order.status}</TableCell>
                        <TableCell className="capitalize">{order.paymentStatus} ({order.paymentMethod})</TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Unpaid Amounts Tab */}
        <TabsContent value="unpaid">
          <UnpaidCustomerList 
            unpaidPayments={unpaidPayments} 
            onSelectCustomer={setSelectedCustomerId} 
          />
        </TabsContent>
        
        {/* Customer History Tab */}
        <TabsContent value="history">
          <CustomerPaymentHistory 
            selectedCustomerId={selectedCustomerId} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CashFlow;
