
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { format } from 'date-fns';

interface CustomerPaymentHistoryProps {
  selectedCustomerId: string | null;
}

const CustomerPaymentHistory: React.FC<CustomerPaymentHistoryProps> = ({ selectedCustomerId }) => {
  const { paymentDetails } = useAppContext();
  
  // Filter payments by customer ID
  const customerPayments = paymentDetails.filter(payment => {
    if (!selectedCustomerId) return false;
    return payment.id.startsWith(selectedCustomerId);
  });
  
  // Get customer name from first payment
  const customerName = customerPayments.length > 0 ? 
    customerPayments[0].customerName : 'Select a customer';
  
  // Calculate totals
  const totalAmount = customerPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amountPaid, 0);
  const totalRemaining = customerPayments.reduce((sum, payment) => sum + payment.remainingAmount, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{customerName || 'Customer Payment History'}</CardTitle>
        {customerPayments.length > 0 && (
          <CardDescription>
            Total billed: ${totalAmount.toFixed(2)} | 
            Paid: ${totalPaid.toFixed(2)} | 
            Remaining: ${totalRemaining.toFixed(2)}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {!selectedCustomerId ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Select a customer from the Unpaid Amounts tab to view their payment history</p>
          </div>
        ) : customerPayments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No payment records found for this customer</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{format(new Date(payment.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge className={
                      payment.paymentStatus === 'paid' ? 'bg-green-500' :
                      payment.paymentStatus === 'partially_paid' ? 'bg-amber-500' : 'bg-red-500'
                    }>
                      {payment.paymentStatus.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>${payment.amountPaid.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={payment.remainingAmount > 0 ? 'text-red-500 font-medium' : 'text-green-500'}>
                      ${payment.remainingAmount.toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerPaymentHistory;
