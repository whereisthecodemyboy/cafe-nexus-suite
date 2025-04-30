
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Wastage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Wastage</h1>
        <p className="text-muted-foreground">Track and manage inventory loss and wastage</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This feature is under development</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The Wastage tracking functionality will allow you to record inventory that has been wasted, expired, or damaged.</p>
          <div className="mt-4">
            <Button>Request Early Access</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wastage;
