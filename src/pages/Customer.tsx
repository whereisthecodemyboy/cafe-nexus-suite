
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import UnpaidCustomerList from '@/components/cashflow/UnpaidCustomerList';
import CustomerPaymentHistory from '@/components/cashflow/CustomerPaymentHistory';
import { filter } from '@/lib/utils';

const Customer = () => {
  const { paymentDetails } = useAppContext();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  // Filter for unpaid payments
  const unpaidPayments = paymentDetails.filter(
    payment => payment.paymentStatus === 'pending' || payment.paymentStatus === 'partially_paid'
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
      </div>
      
      <Tabs defaultValue="unpaid" className="w-full">
        <TabsList>
          <TabsTrigger value="unpaid">Unpaid Balances</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unpaid" className="space-y-4">
          <UnpaidCustomerList 
            unpaidPayments={unpaidPayments}
            onSelectCustomer={setSelectedCustomerId}
          />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <CustomerPaymentHistory 
            selectedCustomerId={selectedCustomerId} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Customer;
