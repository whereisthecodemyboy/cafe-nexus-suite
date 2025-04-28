
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PaymentDetails } from '@/data/models';
import { format } from 'date-fns';

interface UnpaidCustomerListProps {
  unpaidPayments: PaymentDetails[];
  onSelectCustomer: (customerId: string) => void;
}

const UnpaidCustomerList: React.FC<UnpaidCustomerListProps> = ({ unpaidPayments, onSelectCustomer }) => {
  const groupedByCustomer: Record<string, PaymentDetails[]> = {};
  
  // Group payments by customer name
  unpaidPayments.forEach(payment => {
    if (!payment.customerName) return;
    
    const customerKey = payment.customerName.toLowerCase();
    if (!groupedByCustomer[customerKey]) {
      groupedByCustomer[customerKey] = [];
    }
    groupedByCustomer[customerKey].push(payment);
  });
  
  // Calculate total for each customer
  const customerTotals = Object.keys(groupedByCustomer).map(key => {
    const payments = groupedByCustomer[key];
    const totalRemaining = payments.reduce((sum, payment) => sum + payment.remainingAmount, 0);
    const mostRecentPayment = [...payments].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
    
    return {
      customerName: payments[0].customerName,
      customerId: payments[0].id.split('-')[0], // Using part of the payment ID as customer ID for demo
      totalRemaining,
      lastUpdated: mostRecentPayment.updatedAt,
      paymentCount: payments.length
    };
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers with Unpaid Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Open Invoices</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Amount Due</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerTotals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No unpaid balances found</TableCell>
              </TableRow>
            ) : (
              customerTotals.map((customer) => (
                <TableRow key={customer.customerId}>
                  <TableCell className="font-medium">{customer.customerName}</TableCell>
                  <TableCell>{customer.paymentCount}</TableCell>
                  <TableCell>
                    {format(new Date(customer.lastUpdated), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right text-red-500 font-medium">
                    ${customer.totalRemaining.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onSelectCustomer(customer.customerId)}
                    >
                      View History
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UnpaidCustomerList;
