
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
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { Package, Plus, Search } from 'lucide-react';

const StockIn = () => {
  const { inventoryItems, addInventoryItem, updateInventoryItem } = useAppContext();
  const { toast } = useToast();
  
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  
  // States for new item form
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemMinStock, setNewItemMinStock] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const [newItemSupplier, setNewItemSupplier] = useState('');
  
  // Recent stock in activities (simulated)
  const [recentActivities, setRecentActivities] = useState([
    { 
      id: "1", 
      itemName: "Coffee Beans", 
      quantity: 10, 
      unit: "kg", 
      date: new Date().toISOString(),
      user: "John Doe"
    },
    { 
      id: "2", 
      itemName: "Milk", 
      quantity: 20, 
      unit: "liters", 
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      user: "Alice Smith"
    },
    { 
      id: "3", 
      itemName: "Sugar", 
      quantity: 15, 
      unit: "kg", 
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      user: "Robert Johnson"
    }
  ]);
  
  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleStockIn = () => {
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
    
    // Update the inventory item with new stock
    const updatedItem = {
      ...item,
      currentStock: item.currentStock + Number(quantity),
      lastRestockDate: new Date().toISOString()
    };
    
    updateInventoryItem(updatedItem);
    
    // Add to recent activities
    const newActivity = {
      id: uuidv4(),
      itemName: item.name,
      quantity: Number(quantity),
      unit: item.unit,
      date: new Date().toISOString(),
      user: "Admin User" // Should be the current user in a real app
    };
    
    setRecentActivities([newActivity, ...recentActivities]);
    
    toast({
      title: "Stock added successfully",
      description: `Added ${quantity} ${item.unit} of ${item.name}`
    });
    
    // Reset form
    setSelectedItem('');
    setQuantity('');
  };
  
  const handleAddNewItem = () => {
    if (!newItemName || !newItemCategory || !newItemUnit || !newItemMinStock || !newItemCost) {
      toast({
        title: "Invalid input",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newItem = {
      id: uuidv4(),
      name: newItemName,
      category: newItemCategory,
      unit: newItemUnit,
      currentStock: 0,
      minimumStock: Number(newItemMinStock),
      cost: Number(newItemCost),
      supplier: newItemSupplier,
      location: "",
      lastRestockDate: new Date().toISOString(),
      expiryDate: undefined,
      barcode: undefined
    };
    
    addInventoryItem(newItem);
    
    toast({
      title: "Item added successfully",
      description: `${newItemName} has been added to inventory`
    });
    
    // Reset form and close dialog
    setNewItemName('');
    setNewItemCategory('');
    setNewItemUnit('');
    setNewItemMinStock('');
    setNewItemCost('');
    setNewItemSupplier('');
    setShowNewItemDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock In</h1>
        <p className="text-muted-foreground">Add stock to your inventory</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Stock</CardTitle>
              <CardDescription>Record incoming inventory</CardDescription>
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
                  min="0"
                />
              </div>
              
              <div className="pt-4 flex space-x-2">
                <Button onClick={handleStockIn} className="flex-1">
                  <Package className="mr-2 h-4 w-4" />
                  Add Stock
                </Button>
                
                <Dialog open={showNewItemDialog} onOpenChange={setShowNewItemDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      New Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Inventory Item</DialogTitle>
                      <DialogDescription>
                        Create a new item to add to your inventory
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                          id="name"
                          value={newItemName}
                          onChange={e => setNewItemName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Input
                          id="category"
                          value={newItemCategory}
                          onChange={e => setNewItemCategory(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="unit" className="text-right">Unit</Label>
                        <Input
                          id="unit"
                          value={newItemUnit}
                          onChange={e => setNewItemUnit(e.target.value)}
                          placeholder="kg, liters, etc."
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="minStock" className="text-right">Min Stock</Label>
                        <Input
                          id="minStock"
                          type="number"
                          value={newItemMinStock}
                          onChange={e => setNewItemMinStock(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cost" className="text-right">Cost</Label>
                        <Input
                          id="cost"
                          type="number"
                          step="0.01"
                          value={newItemCost}
                          onChange={e => setNewItemCost(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="supplier" className="text-right">Supplier</Label>
                        <Input
                          id="supplier"
                          value={newItemSupplier}
                          onChange={e => setNewItemSupplier(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowNewItemDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddNewItem}>
                        Add Item
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Stock In Activities</CardTitle>
              <CardDescription>Recent inventory additions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Added By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell>{formatDate(activity.date)}</TableCell>
                      <TableCell className="font-medium">{activity.itemName}</TableCell>
                      <TableCell>{activity.quantity} {activity.unit}</TableCell>
                      <TableCell>{activity.user}</TableCell>
                    </TableRow>
                  ))}
                  {recentActivities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No recent activities</TableCell>
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
                <TableHead>Supplier</TableHead>
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
                  <TableCell>{item.supplier || 'N/A'}</TableCell>
                </TableRow>
              ))}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No items found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockIn;
