
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { PackageOpen, Search } from 'lucide-react';

const StockOut = () => {
  const { inventoryItems, updateInventoryItem } = useAppContext();
  const { toast } = useToast();
  
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('used');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Recent stock out activities (simulated)
  const [recentActivities, setRecentActivities] = useState([
    { 
      id: "1", 
      itemName: "Milk", 
      quantity: 5, 
      unit: "liters", 
      reason: "used",
      date: new Date().toISOString(),
      user: "John Doe"
    },
    { 
      id: "2", 
      itemName: "Coffee Beans", 
      quantity: 2, 
      unit: "kg", 
      reason: "expired",
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      user: "Alice Smith"
    }
  ]);
  
  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleStockOut = () => {
    if (!selectedItem || !quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please select an item and enter a valid quantity",
        variant: "destructive"
      });
      return;
    }
    
    const item = inventoryItems.find(i => i.id === selectedItem);
    if (!item) {
      toast({
        title: "Item not found",
        description: "The selected item could not be found",
        variant: "destructive"
      });
      return;
    }
    
    if (Number(quantity) > item.currentStock) {
      toast({
        title: "Insufficient stock",
        description: `You only have ${item.currentStock} ${item.unit} of ${item.name}`,
        variant: "destructive"
      });
      return;
    }
    
    // Update the inventory item with reduced stock
    const updatedItem = {
      ...item,
      currentStock: item.currentStock - Number(quantity)
    };
    
    updateInventoryItem(updatedItem);
    
    // Add to recent activities
    const newActivity = {
      id: uuidv4(),
      itemName: item.name,
      quantity: Number(quantity),
      unit: item.unit,
      reason: reason,
      date: new Date().toISOString(),
      user: "Admin User" // Should be the current user in a real app
    };
    
    setRecentActivities([newActivity, ...recentActivities]);
    
    toast({
      title: "Stock removed successfully",
      description: `Removed ${quantity} ${item.unit} of ${item.name}`
    });
    
    // Reset form
    setSelectedItem('');
    setQuantity('');
    setReason('used');
    setNotes('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const reasonLabels: Record<string, string> = {
    'used': 'Used in production',
    'expired': 'Expired',
    'damaged': 'Damaged',
    'returned': 'Returned to supplier',
    'other': 'Other'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Out</h1>
        <p className="text-muted-foreground">Record items removed from inventory</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Remove Stock</CardTitle>
              <CardDescription>Record outgoing inventory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item">Select Item</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.currentStock} {item.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="used">Used in production</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="returned">Returned to supplier</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Add additional notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
              
              <div className="pt-4">
                <Button onClick={handleStockOut} className="w-full">
                  <PackageOpen className="mr-2 h-4 w-4" />
                  Remove Stock
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Stock Out Activities</CardTitle>
              <CardDescription>Recent inventory removals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Recorded By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell>{formatDate(activity.date)}</TableCell>
                      <TableCell className="font-medium">{activity.itemName}</TableCell>
                      <TableCell>{activity.quantity} {activity.unit}</TableCell>
                      <TableCell>{reasonLabels[activity.reason]}</TableCell>
                      <TableCell>{activity.user}</TableCell>
                    </TableRow>
                  ))}
                  {recentActivities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No recent activities</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>Manage your inventory items</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Last Restock</TableHead>
                <TableHead>Unit Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={item.currentStock <= item.minimumStock ? 'text-red-500' : ''}>
                        {item.currentStock} {item.unit}
                      </span>
                      {item.currentStock <= item.minimumStock && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs">
                          Low
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.minimumStock} {item.unit}</TableCell>
                  <TableCell>{formatDate(item.lastRestockDate)}</TableCell>
                  <TableCell>${item.cost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No items found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockOut;
