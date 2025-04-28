
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Reservation } from '@/data/models';

interface ReservationCardProps {
  reservation: Reservation;
  onEdit: (reservation: Reservation) => void;
  onDelete: (reservationId: string) => void;
  onStatusChange: (reservationId: string, status: string) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ 
  reservation, 
  onEdit, 
  onDelete,
  onStatusChange
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 hover:bg-green-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'seated':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'completed':
        return 'bg-gray-500 hover:bg-gray-600';
      case 'cancelled':
      case 'no-show':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return '';
    }
  };
  
  // Format date and time for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };
  
  // Check if the reservation is for today
  const isToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return reservation.date === today;
  };
  
  // Status options based on current status
  const getNextStatusOptions = () => {
    switch (reservation.status) {
      case 'pending':
        return [
          { value: 'confirmed', label: 'Confirm' },
          { value: 'cancelled', label: 'Cancel' }
        ];
      case 'confirmed':
        return [
          { value: 'seated', label: 'Seat' },
          { value: 'no-show', label: 'No Show' }
        ];
      case 'seated':
        return [
          { value: 'completed', label: 'Complete' }
        ];
      default:
        return [];
    }
  };
  
  const nextStatusOptions = getNextStatusOptions();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{reservation.customerName}</h3>
          <Badge className={getStatusColor(reservation.status)}>
            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 space-y-3">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{formatDate(reservation.date)}</span>
          {isToday() && <Badge variant="outline" className="ml-2">Today</Badge>}
        </div>
        
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{formatTime(reservation.time)} ({reservation.duration} min)</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{reservation.partySize} {reservation.partySize === 1 ? 'guest' : 'guests'}</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span>Table {reservation.tableIds.map(id => id.substring(1)).join(', ')}</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`tel:${reservation.customerPhone}`} className="hover:underline">
              {reservation.customerPhone}
            </a>
          </div>
          
          {reservation.customerEmail && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`mailto:${reservation.customerEmail}`} className="hover:underline">
                {reservation.customerEmail}
              </a>
            </div>
          )}
        </div>
        
        {reservation.notes && (
          <div className="text-sm">
            <span className="font-medium">Notes: </span>
            <span className="text-muted-foreground">{reservation.notes}</span>
          </div>
        )}
        
        {reservation.specialRequests && (
          <div className="text-sm">
            <span className="font-medium">Special Requests: </span>
            <span className="text-muted-foreground">{reservation.specialRequests}</span>
          </div>
        )}
        
        {reservation.preOrders && reservation.preOrders.length > 0 && (
          <div className="text-sm">
            <span className="font-medium">Pre-orders: </span>
            <ul className="list-disc ml-5 text-muted-foreground">
              {reservation.preOrders.map((item, index) => (
                <li key={index}>
                  {item.quantity}× {item.productName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-1 flex flex-wrap justify-between gap-2">
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => onEdit(reservation)}>
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-destructive" onClick={() => onDelete(reservation.id)}>
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
        
        {nextStatusOptions.length > 0 && (
          <div className="flex gap-1">
            {nextStatusOptions.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={option.value === 'cancelled' || option.value === 'no-show' ? 'destructive' : 'default'}
                onClick={() => onStatusChange(reservation.id, option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReservationCard;
