
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
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Search } from 'lucide-react';

const Wastage = () => {
  const { inventoryItems, updateInventoryItem } = useAppContext();
  const { toast } = useToast();
  
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [wasteReason, setWasteReason] = useState('expired');
  const [wasteDetails, setWasteDetails] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Recent wastage activities (simulated)
  const [wasteActivities, setWasteActivities] = useState([
    { 
      id: "1", 
      itemName: "Milk", 
      quantity: 3, 
      unit: "liters", 
      reason: "expired",
      cost: 6.75,
      date: new Date().toISOString(),
      user: "John Doe"
    },
    { 
      id: "2", 
      itemName: "Pastries", 
      quantity: 8, 
      unit: "pieces", 
      reason: "damaged",
      cost: 12.00,
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      user: "Alice Smith"
    }
  ]);
  
  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleRecordWastage = () => {
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
    
    // Calculate cost of wasted items
    const wasteCost = item.cost * Number(quantity);
    
    // Add to waste activities
    const newActivity = {
      id: uuidv4(),
      itemName: item.name,
      quantity: Number(quantity),
      unit: item.unit,
      reason: wasteReason,
      cost: wasteCost,
      date: new Date().toISOString(),
      user: "Admin User", // Should be the current user in a real app
      details: wasteDetails
    };
    
    setWasteActivities([newActivity, ...wasteActivities]);
    
    toast({
      title: "Wastage recorded successfully",
      description: `Recorded ${quantity} ${item.unit} of ${item.name} as waste`
    });
    
    // Reset form
    setSelectedItem('');
    setQuantity('');
    setWasteReason('expired');
    setWasteDetails('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(value);
  };

  const wasteReasonLabels: Record<string, string> = {
    'expired': 'Expired',
    'damaged': 'Damaged/Spoiled',
    'preparation': 'Preparation Error',
    'quality': 'Quality Issues',
    'other': 'Other'
  };

  // Calculate total waste cost
  const totalWasteCost = wasteActivities.reduce((total, activity) => total + (activity.cost || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Wastage</h1>
        <p className="text-muted-foreground">Track and manage inventory loss and wastage</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Record Wastage</CardTitle>
              <CardDescription>Document wasted or lost inventory</CardDescription>
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
                <Select value={wasteReason} onValueChange={setWasteReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="damaged">Damaged/Spoiled</SelectItem>
                    <SelectItem value="preparation">Preparation Error</SelectItem>
                    <SelectItem value="quality">Quality Issues</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details">Details (optional)</Label>
                <Textarea
                  id="details"
                  placeholder="Provide additional details about the wastage"
                  value={wasteDetails}
                  onChange={e => setWasteDetails(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="pt-4">
                <Button onClick={handleRecordWastage} className="w-full" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Record Wastage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Wastage History</CardTitle>
                <CardDescription>Recent inventory waste records</CardDescription>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <p className="text-sm font-medium">Total Cost of Waste:</p>
                <p className="text-lg font-bold text-red-500">{formatCurrency(totalWasteCost)}</p>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Recorded By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wasteActivities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell>{formatDate(activity.date)}</TableCell>
                      <TableCell className="font-medium">{activity.itemName}</TableCell>
                      <TableCell>{activity.quantity} {activity.unit}</TableCell>
                      <TableCell>{wasteReasonLabels[activity.reason]}</TableCell>
                      <TableCell className="text-red-500">{formatCurrency(activity.cost || 0)}</TableCell>
                      <TableCell>{activity.user}</TableCell>
                    </TableRow>
                  ))}
                  {wasteActivities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No waste records found</TableCell>
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
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total Value</TableHead>
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
                  <TableCell>{formatCurrency(item.cost)}</TableCell>
                  <TableCell>{formatCurrency(item.cost * item.currentStock)}</TableCell>
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

export default Wastage;
