
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Save, X } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Reservation } from '@/data/models';

const AddReservation: React.FC = () => {
  const { reservations, tables, addReservation } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State
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
  
  const availableTables = getAvailableTables();
  
  const toggleTableSelection = (tableId: string) => {
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter(id => id !== tableId));
    } else {
      setSelectedTables([...selectedTables, tableId]);
    }
  };

  const handleCancel = () => {
    navigate('/reservations');
  };
  
  const handleSubmit = (values: any) => {
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
    
    toast({
      title: "Success",
      description: "Reservation created successfully.",
    });
    
    navigate('/reservations');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">New Reservation</h1>
          <p className="text-muted-foreground">Create a new table booking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="p-3 pointer-events-auto"
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Create Reservation
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddReservation;
