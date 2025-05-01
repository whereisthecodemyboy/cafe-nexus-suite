
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from 'uuid';
import { Truck, Plus, Package, Search, FileText, ShoppingCart } from 'lucide-react';

// Define types for our purchase orders
type PurchaseOrderStatus = 'draft' | 'pending' | 'ordered' | 'received' | 'cancelled';

interface PurchaseOrderItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
  expectedDelivery?: string;
  receivedDate?: string;
  totalAmount: number;
  notes?: string;
}

// Mock suppliers
const suppliers = [
  { id: '1', name: 'Beans & Brews Coffee Co.' },
  { id: '2', name: 'Dairy Fresh Inc.' },
  { id: '3', name: 'Sweet Treats Bakery' },
  { id: '4', name: 'Organic Produce Supplies' },
];

const PurchaseOrders = () => {
  const { inventoryItems, updateInventoryItem } = useAppContext();
  const { toast } = useToast();
  
  // States for purchase order list
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      orderNumber: 'PO-2023-001',
      supplierId: '1',
      supplierName: 'Beans & Brews Coffee Co.',
      status: 'received',
      items: [
        {
          id: '1',
          itemId: '1',
          itemName: 'Coffee Beans',
          quantity: 10,
          unit: 'kg',
          unitCost: 15.50,
          totalCost: 155.00
        }
      ],
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      expectedDelivery: new Date(Date.now() - 2 * 86400000).toISOString(),
      receivedDate: new Date(Date.now() - 1 * 86400000).toISOString(),
      totalAmount: 155.00
    },
    {
      id: '2',
      orderNumber: 'PO-2023-002',
      supplierId: '2',
      supplierName: 'Dairy Fresh Inc.',
      status: 'ordered',
      items: [
        {
          id: '1',
          itemId: '2',
          itemName: 'Milk',
          quantity: 20,
          unit: 'liters',
          unitCost: 2.25,
          totalCost: 45.00
        },
        {
          id: '2',
          itemId: '3',
          itemName: 'Cream',
          quantity: 5,
          unit: 'liters',
          unitCost: 3.50,
          totalCost: 17.50
        }
      ],
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      expectedDelivery: new Date(Date.now() + 2 * 86400000).toISOString(),
      totalAmount: 62.50
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  
  // States for new purchase order form
  const [newOrderSupplier, setNewOrderSupplier] = useState('');
  const [newOrderItems, setNewOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [newOrderNotes, setNewOrderNotes] = useState('');
  const [newOrderExpectedDelivery, setNewOrderExpectedDelivery] = useState('');
  
  // States for adding items to purchase order
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemQuantity, setSelectedItemQuantity] = useState('');
  const [selectedItemCost, setSelectedItemCost] = useState('');
  
  // Filter purchase orders based on the active tab and search query
  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') {
      return matchesSearch;
    } else {
      return order.status === activeTab && matchesSearch;
    }
  });
  
  const addItemToOrder = () => {
    if (!selectedItemId || !selectedItemQuantity || !selectedItemCost) {
      toast({
        title: "Missing information",
        description: "Please select an item and enter quantity and cost",
        variant: "destructive"
      });
      return;
    }
    
    const item = inventoryItems.find(i => i.id === selectedItemId);
    if (!item) return;
    
    const quantity = Number(selectedItemQuantity);
    const unitCost = Number(selectedItemCost);
    
    if (isNaN(quantity) || quantity <= 0 || isNaN(unitCost) || unitCost <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter valid quantity and cost values",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: PurchaseOrderItem = {
      id: uuidv4(),
      itemId: item.id,
      itemName: item.name,
      quantity: quantity,
      unit: item.unit,
      unitCost: unitCost,
      totalCost: quantity * unitCost
    };
    
    setNewOrderItems([...newOrderItems, newItem]);
    
    // Reset form
    setSelectedItemId('');
    setSelectedItemQuantity('');
    setSelectedItemCost('');
  };
  
  const removeItemFromOrder = (itemId: string) => {
    setNewOrderItems(newOrderItems.filter(item => item.id !== itemId));
  };
  
  const createPurchaseOrder = () => {
    if (!newOrderSupplier || newOrderItems.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select a supplier and add at least one item",
        variant: "destructive"
      });
      return;
    }
    
    const supplier = suppliers.find(s => s.id === newOrderSupplier);
    if (!supplier) return;
    
    const totalAmount = newOrderItems.reduce((sum, item) => sum + item.totalCost, 0);
    
    const newPurchaseOrder: PurchaseOrder = {
      id: uuidv4(),
      orderNumber: `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      status: 'draft',
      items: newOrderItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalAmount: totalAmount,
      notes: newOrderNotes,
      expectedDelivery: newOrderExpectedDelivery || undefined
    };
    
    setPurchaseOrders([newPurchaseOrder, ...purchaseOrders]);
    
    toast({
      title: "Purchase order created",
      description: `Purchase order ${newPurchaseOrder.orderNumber} has been created`
    });
    
    // Reset form
    setNewOrderSupplier('');
    setNewOrderItems([]);
    setNewOrderNotes('');
    setNewOrderExpectedDelivery('');
    setShowNewOrderDialog(false);
  };
  
  const updateOrderStatus = (orderId: string, newStatus: PurchaseOrderStatus) => {
    setPurchaseOrders(purchaseOrders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { 
          ...order, 
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
        
        // If status is received, set received date and update inventory
        if (newStatus === 'received') {
          updatedOrder.receivedDate = new Date().toISOString();
          
          // Update inventory for each item
          order.items.forEach(item => {
            const inventoryItem = inventoryItems.find(i => i.id === item.itemId);
            if (inventoryItem) {
              updateInventoryItem({
                ...inventoryItem,
                currentStock: inventoryItem.currentStock + item.quantity,
                lastRestockDate: new Date().toISOString()
              });
            }
          });
        }
        
        return updatedOrder;
      }
      return order;
    }));
    
    toast({
      title: "Status updated",
      description: `Order status changed to ${newStatus}`
    });
    
    // Close the dialog if it's open
    if (showOrderDetailsDialog) {
      setShowOrderDetailsDialog(false);
    }
  };
  
  const viewOrderDetails = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setShowOrderDetailsDialog(true);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };
  
  const getStatusColor = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'draft': return 'bg-slate-200 text-slate-700';
      case 'pending': return 'bg-yellow-200 text-yellow-700';
      case 'ordered': return 'bg-blue-200 text-blue-700';
      case 'received': return 'bg-green-200 text-green-700';
      case 'cancelled': return 'bg-red-200 text-red-700';
      default: return 'bg-slate-200 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage inventory purchase orders</p>
        </div>
        <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Purchase Order</DialogTitle>
              <DialogDescription>
                Add items to your purchase order and select a supplier
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={newOrderSupplier} onValueChange={setNewOrderSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={newOrderExpectedDelivery}
                  onChange={e => setNewOrderExpectedDelivery(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Order Items</Label>
                <div className="flex gap-2">
                  <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} ({item.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={selectedItemQuantity}
                    onChange={e => setSelectedItemQuantity(e.target.value)}
                    className="w-24"
                    min="1"
                  />
                  <Input
                    type="number"
                    placeholder="Unit cost"
                    value={selectedItemCost}
                    onChange={e => setSelectedItemCost(e.target.value)}
                    className="w-32"
                    min="0.01"
                    step="0.01"
                  />
                  <Button type="button" variant="outline" onClick={addItemToOrder}>
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Cost</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newOrderItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.quantity} {item.unit}</TableCell>
                          <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                          <TableCell>{formatCurrency(item.totalCost)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeItemFromOrder(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              &times;
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {newOrderItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No items added
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Add notes about this purchase order"
                  value={newOrderNotes}
                  onChange={e => setNewOrderNotes(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <p className="text-lg font-semibold">
                  Total: {formatCurrency(newOrderItems.reduce((sum, item) => sum + item.totalCost, 0))}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNewOrderDialog(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={createPurchaseOrder}>
                Create Purchase Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>View and manage your purchase orders</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="ordered">Ordered</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.supplierName}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>{formatDate(order.expectedDelivery)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => viewOrderDetails(order)}>
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No purchase orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Order Details Dialog */}
      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        <DialogContent className="max-w-3xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>Purchase Order: {selectedOrder.orderNumber}</span>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Created on {formatDate(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <h4 className="font-semibold">Supplier</h4>
                  <p>{selectedOrder.supplierName}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Expected Delivery</h4>
                  <p>{formatDate(selectedOrder.expectedDelivery)}</p>
                </div>
                {selectedOrder.receivedDate && (
                  <>
                    <div>
                      <h4 className="font-semibold">Received Date</h4>
                      <p>{formatDate(selectedOrder.receivedDate)}</p>
                    </div>
                    <div></div>
                  </>
                )}
                {selectedOrder.notes && (
                  <div className="col-span-2">
                    <h4 className="font-semibold">Notes</h4>
                    <p>{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.quantity} {item.unit}</TableCell>
                        <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                        <TableCell>{formatCurrency(item.totalCost)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end mt-2">
                <p className="text-lg font-semibold">
                  Total: {formatCurrency(selectedOrder.totalAmount)}
                </p>
              </div>
              
              <DialogFooter>
                <div className="flex w-full justify-between">
                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'received' && (
                    <Button 
                      variant="destructive" 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    >
                      Cancel Order
                    </Button>
                  )}
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowOrderDetailsDialog(false)}
                    >
                      Close
                    </Button>
                    
                    {selectedOrder.status === 'draft' && (
                      <Button onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Submit for Approval
                      </Button>
                    )}
                    
                    {selectedOrder.status === 'pending' && (
                      <Button onClick={() => updateOrderStatus(selectedOrder.id, 'ordered')}>
                        <Truck className="mr-2 h-4 w-4" />
                        Mark as Ordered
                      </Button>
                    )}
                    
                    {selectedOrder.status === 'ordered' && (
                      <Button onClick={() => updateOrderStatus(selectedOrder.id, 'received')}>
                        <Package className="mr-2 h-4 w-4" />
                        Mark as Received
                      </Button>
                    )}
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrders;
