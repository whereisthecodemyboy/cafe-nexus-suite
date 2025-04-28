
import React, { useState } from 'react';
import { PlusCircle, Search, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AppContext';
import ReservationCard from '@/components/reservations/ReservationCard';
import { Reservation } from '@/data/models';

const Reservations: React.FC = () => {
  const { reservations, updateReservation, deleteReservation } = useAppContext();
  const { toast } = useToast();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  
  // Process reservations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const processedReservations = reservations.filter(reservation => {
    // Apply search filter
    const matchesSearch = 
      reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reservation.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.customerPhone.includes(searchQuery);
    
    // Apply status filter
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    
    // Apply date filter
    const reservationDate = new Date(reservation.date);
    const matchesDate = !filterDate || format(reservationDate, 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd');
    
    // Apply tab filter
    if (selectedTab === 'upcoming') {
      const isInFuture = reservationDate >= today || 
        (reservationDate.getTime() === today.getTime() && reservation.status !== 'completed');
      return matchesSearch && matchesStatus && matchesDate && isInFuture && 
             reservation.status !== 'cancelled' && reservation.status !== 'no-show';
    } else if (selectedTab === 'past') {
      const isInPast = reservationDate < today || reservation.status === 'completed';
      return matchesSearch && matchesStatus && matchesDate && isInPast;
    } else if (selectedTab === 'cancelled') {
      return matchesSearch && matchesDate && (reservation.status === 'cancelled' || reservation.status === 'no-show');
    }
    
    return false;
  });
  
  // Sort by date and time
  processedReservations.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Handle reservation actions
  const handleAddReservation = () => {
    toast({
      title: "Add Reservation",
      description: "You clicked to add a new reservation.",
    });
  };
  
  const handleEditReservation = (reservation: Reservation) => {
    toast({
      title: "Edit Reservation",
      description: `You clicked to edit reservation for ${reservation.customerName}.`,
    });
  };

  const handleDeleteReservation = (reservationId: string) => {
    deleteReservation(reservationId);
    toast({
      title: "Delete Reservation",
      description: "The reservation has been deleted.",
    });
  };
  
  const handleStatusChange = (reservationId: string, newStatus: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;
    
    updateReservation({
      ...reservation,
      status: newStatus as any,
      updatedAt: new Date().toISOString()
    });
    
    toast({
      title: "Reservation Updated",
      description: `Reservation status changed to ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground">Manage table bookings</p>
        </div>
        <Button onClick={handleAddReservation}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Reservation
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reservations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filterDate ? format(filterDate, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filterDate}
                onSelect={setFilterDate}
                initialFocus
              />
              <div className="p-3 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setFilterDate(undefined)}
                >
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {selectedTab !== 'cancelled' && (
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {selectedTab === 'upcoming' ? (
                  <>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="seated">Seated</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      {/* Reservations */}
      {processedReservations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedReservations.map(reservation => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onEdit={handleEditReservation}
              onDelete={handleDeleteReservation}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-60">
          <p className="text-muted-foreground">No reservations match your filters</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
              setFilterDate(undefined);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Reservations;
