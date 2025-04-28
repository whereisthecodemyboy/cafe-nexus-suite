
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { InventoryItem } from '@/data/models';

interface InventoryAlertsProps {
  items: InventoryItem[];
}

const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ items }) => {
  const lowStockItems = items
    .filter(item => item.currentStock <= item.minimumStock)
    .sort((a, b) => (a.currentStock / a.minimumStock) - (b.currentStock / b.minimumStock));

  const nearExpiryItems = items
    .filter(item => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
    })
    .sort((a, b) => {
      const aExpiry = new Date(a.expiryDate!).getTime();
      const bExpiry = new Date(b.expiryDate!).getTime();
      return aExpiry - bExpiry;
    });

  const hasAlerts = lowStockItems.length > 0 || nearExpiryItems.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Inventory Alerts</CardTitle>
          <CardDescription>Low stock and expiry warnings</CardDescription>
        </div>
        {hasAlerts && (
          <Badge variant="destructive" className="ml-2">
            {lowStockItems.length + nearExpiryItems.length} Alerts
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {hasAlerts ? (
          <>
            {lowStockItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Low Stock</h4>
                {lowStockItems.slice(0, 3).map((item) => (
                  <Alert key={item.id} variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="ml-2">{item.name}</AlertTitle>
                    <AlertDescription className="ml-2">
                      Current: {item.currentStock} {item.unit} (Min: {item.minimumStock})
                    </AlertDescription>
                  </Alert>
                ))}
                {lowStockItems.length > 3 && (
                  <p className="text-xs text-muted-foreground text-right">
                    +{lowStockItems.length - 3} more low stock items
                  </p>
                )}
              </div>
            )}

            {nearExpiryItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Expiring Soon</h4>
                {nearExpiryItems.slice(0, 2).map((item) => {
                  const expiryDate = new Date(item.expiryDate!);
                  const today = new Date();
                  const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <Alert key={item.id} variant="warning" className="py-2 bg-amber-50 dark:bg-amber-950">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="ml-2">{item.name}</AlertTitle>
                      <AlertDescription className="ml-2">
                        Expires in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}
                      </AlertDescription>
                    </Alert>
                  );
                })}
                {nearExpiryItems.length > 2 && (
                  <p className="text-xs text-muted-foreground text-right">
                    +{nearExpiryItems.length - 2} more expiring items
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground">No inventory alerts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryAlerts;
