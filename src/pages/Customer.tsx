
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import UnpaidCustomerList from '@/components/cashflow/UnpaidCustomerList';
import CustomerPaymentHistory from '@/components/cashflow/CustomerPaymentHistory';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Customer = () => {
  const { paymentDetails } = useAppContext();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter for unpaid payments
  const unpaidPayments = paymentDetails.filter(
    payment => payment.paymentStatus === 'pending' || payment.paymentStatus === 'partially_paid'
  );
  
  // Filter payments based on search query
  const filteredPayments = searchQuery.trim() !== '' 
    ? unpaidPayments.filter(payment => 
        payment.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : unpaidPayments;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
      </div>
      
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      
      <Tabs defaultValue="unpaid" className="w-full">
        <TabsList>
          <TabsTrigger value="unpaid">Unpaid Balances</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unpaid" className="space-y-4">
          <UnpaidCustomerList 
            unpaidPayments={filteredPayments}
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
