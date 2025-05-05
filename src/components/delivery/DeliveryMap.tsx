
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Order } from '@/data/models';

interface DeliveryMapProps {
  activeDeliveries: Order[];
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ activeDeliveries }) => {
  return (
    <Card className="min-h-[400px]">
      <CardHeader>
        <CardTitle>Delivery Map</CardTitle>
        <CardDescription>
          {activeDeliveries.length} active deliveries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[300px] bg-muted/30 rounded-md border border-dashed">
          <MapPin className="h-10 w-10 mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Map view not available in demo</p>
          <p className="text-sm text-muted-foreground">
            {activeDeliveries.length} delivery locations would be shown here
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryMap;
