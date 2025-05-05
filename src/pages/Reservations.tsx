
import React, { useState } from 'react';
import { PlusCircle, Search, Filter, Calendar as CalendarIcon, X } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { format, addHours } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AppContext';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import ReservationCard from '@/components/reservations/ReservationCard';
import { Reservation } from '@/data/models';

const Reservations: React.FC = () => {
  const { reservations, tables, addReservation, updateReservation, deleteReservation } = useAppContext();
  const { toast } = useToast();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [newReservationOpen, setNewReservationOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('18:00');
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const form = useForm({
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      partySize: 2,
      duration: 2,
      notes: '',
      specialRequests: '',
      deposit: 0,
      depositPaid: false,
    }
  });
  
  // Available tables (not already reserved at the selected time)
  const getAvailableTables = () => {
    if (!selectedDate) return [];
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const conflictingReservations = reservations.filter(r => {
      // Check if reservation is on the same date
      if (r.date !== dateStr) return false;
      
      // Check if times overlap
      const reservationStartTime = new Date(`${r.date}T${r.time}`);
      const reservationEndTime = addHours(reservationStartTime, r.duration);
      const selectedStartTime = new Date(`${dateStr}T${selectedTime}`);
      const selectedEndTime = addHours(selectedStartTime, 2); // Default duration
      
      return (
        (selectedStartTime >= reservationStartTime && selectedStartTime < reservationEndTime) ||
        (selectedEndTime > reservationStartTime && selectedEndTime <= reservationEndTime) ||
        (selectedStartTime <= reservationStartTime && selectedEndTime >= reservationEndTime)
      );
    });
    
    const reservedTableIds = conflictingReservations.flatMap(r => r.tableIds);
    return tables.filter(table => !reservedTableIds.includes(table.id));
  };
  
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
    setNewReservationOpen(true);
  };
  
  const handleSubmitReservation = (values: any) => {
    if (selectedTables.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one table for the reservation.",
        variant: "destructive",
      });
      return;
    }
    
    const newReservation: Reservation = {
      id: uuidv4(),
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      customerEmail: values.customerEmail || undefined,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      duration: values.duration,
      partySize: values.partySize,
      tableIds: selectedTables,
      status: 'pending',
      notes: values.notes || undefined,
      specialRequests: values.specialRequests || undefined,
      deposit: values.deposit || undefined,
      depositPaid: values.depositPaid || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    addReservation(newReservation);
    setNewReservationOpen(false);
    setSelectedTables([]);
    form.reset();
    
    toast({
      title: "Success",
      description: "Reservation created successfully.",
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
  
  const toggleTableSelection = (tableId: string) => {
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter(id => id !== tableId));
    } else {
      setSelectedTables([...selectedTables, tableId]);
    }
  };
  
  const availableTables = getAvailableTables();

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
      
        <TabsContent value={selectedTab} className="mt-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
        </TabsContent>
      </Tabs>
      
      {/* New Reservation Dialog */}
      <Dialog open={newReservationOpen} onOpenChange={setNewReservationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Reservation</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitReservation)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name*</FormLabel>
                        <FormControl>
                          <Input required {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number*</FormLabel>
                        <FormControl>
                          <Input required type="tel" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormItem className="flex flex-col">
                    <FormLabel>Date*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date || new Date());
                            setSelectedTables([]);
                          }}
                          initialFocus
                          disabled={(date) => {
                            const now = new Date();
                            return date < now;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Time*</FormLabel>
                    <Select 
                      value={selectedTime}
                      onValueChange={(value) => {
                        setSelectedTime(value);
                        setSelectedTables([]);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Generate time slots from 11am to 10pm */}
                        {Array.from({ length: 12 }).map((_, i) => {
                          const hour = 11 + i;
                          const time24 = `${hour < 10 ? '0' + hour : hour}:00`;
                          const time12 = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                          return (
                            <SelectItem key={time24} value={time24}>{time12}</SelectItem>
                          );
                        })}
                        {Array.from({ length: 11 }).map((_, i) => {
                          const hour = 11 + i;
                          const time24 = `${hour < 10 ? '0' + hour : hour}:30`;
                          const time12 = `${hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? 'PM' : 'AM'}`;
                          return (
                            <SelectItem key={time24} value={time24}>{time12}</SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                  
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="partySize"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Party Size*</FormLabel>
                          <Select 
                            value={String(field.value)} 
                            onValueChange={(val) => field.onChange(parseInt(val))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(num => (
                                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Duration (hrs)*</FormLabel>
                          <Select 
                            value={String(field.value)} 
                            onValueChange={(val) => field.onChange(parseInt(val))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 1.5, 2, 2.5, 3, 4].map(num => (
                                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <FormLabel className="block mb-2">Available Tables*</FormLabel>
                {availableTables.length === 0 ? (
                  <div className="p-4 border rounded-md bg-muted">
                    <p className="text-center text-muted-foreground">No tables available at selected time</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {availableTables.map(table => (
                      <div
                        key={table.id}
                        className={cn(
                          "border rounded-md p-2 text-center cursor-pointer",
                          selectedTables.includes(table.id)
                            ? "border-primary bg-primary/10"
                            : "hover:border-primary/50"
                        )}
                        onClick={() => toggleTableSelection(table.id)}
                      >
                        <span className="text-sm">{table.name}</span>
                        <span className="block text-xs text-muted-foreground">{table.capacity} seats</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedTables.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedTables.map(id => {
                      const table = tables.find(t => t.id === id);
                      return (
                        <div key={id} className="inline-flex items-center bg-secondary text-secondary-foreground text-xs rounded-full px-2 py-1">
                          {table?.name}
                          <button
                            type="button"
                            onClick={() => toggleTableSelection(id)}
                            className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Internal notes about the reservation"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Customer special requests"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name="deposit"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Deposit Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="depositPaid"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Deposit paid
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setNewReservationOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Reservation</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reservations;
