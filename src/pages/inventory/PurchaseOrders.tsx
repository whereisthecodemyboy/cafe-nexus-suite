
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PurchaseOrders = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
        <p className="text-muted-foreground">Manage inventory purchase orders</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This feature is under development</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Purchase Orders functionality will allow you to create, track, and manage orders from suppliers.</p>
          <div className="mt-4">
            <Button>Request Early Access</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrders;
