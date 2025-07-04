
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Search, ShoppingCart, Trash2, CreditCard, Settings, Clipboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import ProductCard from '@/components/pos/ProductCard';
import OrderItemCard from '@/components/pos/OrderItemCard';
import CategoryFilter from '@/components/pos/CategoryFilter';
import TableSelector from '@/components/pos/TableSelector';
import PaymentDialog from '@/components/pos/PaymentDialog';
import TableOrderDialog from '@/components/pos/TableOrderDialog';
import { Product, OrderItem, Order, Table } from '@/data/models';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import TableLayout from '@/components/tables/TableLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const POS: React.FC = () => {
  const { products, tables, orders, addOrder, updateTable, updateOrder, deleteOrder } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [tableOrderOpen, setTableOrderOpen] = useState(false);
  const [existingOrder, setExistingOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('new-order');
  
  // Get unique categories - ensure products is an array
  const safeProducts = Array.isArray(products) ? products : [];
  const categories = Array.from(new Set(safeProducts.map(product => product.category)));
  
  // Filter products based on search and category - with safety checks
  const filteredProducts = safeProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.available;
  });
  
  // Get occupied tables and their orders
  const occupiedTables = Array.isArray(tables) ? tables.filter(table => table.status === 'occupied' && table.currentOrderId) : [];
  const activeOrders = orders.filter(order => 
    order.status !== 'completed' && order.status !== 'cancelled' && order.type === 'dine-in'
  );
  
  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.unitPrice * item.quantity;
    const customizationPrice = item.customizations?.reduce((sum, c) => sum + (c.priceDelta || 0), 0) || 0;
    return sum + ((itemPrice + customizationPrice * item.quantity));
  }, 0);
  
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  // Check if selected table has an existing order
  useEffect(() => {
    if (selectedTable && selectedTable.currentOrderId) {
      const order = orders.find(o => o.id === selectedTable.currentOrderId);
      if (order) {
        setExistingOrder(order);
        return;
      }
    }
    setExistingOrder(null);
  }, [selectedTable, orders]);
  
  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    // For simplicity, just add to cart without customizations in this version
    const newItem: OrderItem = {
      id: uuidv4(),
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.price,
      status: 'pending',
    };
    setCartItems([...cartItems, newItem]);
    
    toast({
      title: "Item Added",
      description: `${product.name} added to order.`,
    });
  };
  
  // Handle remove item from cart
  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  // Handle change quantity of item in cart
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Clear the cart
  const handleClearCart = () => {
    if (cartItems.length > 0) {
      setCartItems([]);
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from the cart.",
      });
    }
  };
  
  // Process payment
  const handleProcessPayment = (paymentMethod: string, emailReceipt: boolean) => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add items to the order before processing payment.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new order
    const newOrder: Order = {
      id: uuidv4(),
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      type: selectedTable ? 'dine-in' : 'takeaway',
      status: 'confirmed',
      tableId: selectedTable?.id,
      employeeId: "u1", // In a real app, this would be the logged-in employee
      items: cartItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentStatus: 'paid',
      paymentMethod: paymentMethod as 'cash' | 'card' | 'mobile' | 'online',
      subtotal,
      tax,
      total,
    };
    
    // Add order
    addOrder(newOrder);
    
    // Update table status if dine-in
    if (selectedTable) {
      updateTable({
        ...selectedTable,
        status: 'occupied',
        currentOrderId: newOrder.id,
      });
    }
    
    // Show toast
    toast({
      title: "Payment Processed",
      description: `Order #${newOrder.orderNumber} has been completed.`,
    });
    
    // Close dialog and reset
    setPaymentDialogOpen(false);
    setCartItems([]);
    setSelectedTable(null);
  };
  
  // Handle table selection
  const handleTableSelect = (table: Table | null) => {
    setSelectedTable(table);
    
    // If table has existing order, show the order dialog
    if (table && table.currentOrderId) {
      setTableOrderOpen(true);
    }
  };
  
  // Handle adding more items to an existing order
  const handleAddToExistingOrder = () => {
    setTableOrderOpen(false);
    // Keep the selected table, but start a fresh cart for adding items
  };

  // Handle viewing an order
  const handleViewOrder = (order: Order) => {
    const table = tables.find(t => t.id === order.tableId);
    if (table) {
      setSelectedTable(table);
      setExistingOrder(order);
      setTableOrderOpen(true);
    } else {
      toast({
        title: "Table Not Found",
        description: "Could not find the table associated with this order.",
        variant: "destructive",
      });
    }
  };

  // Handle adding to an existing order directly
  const handleAddToOrder = (order: Order) => {
    const table = tables.find(t => t.id === order.tableId);
    if (table) {
      setSelectedTable(table);
      setExistingOrder(order);
      setTableOrderOpen(false);
      setActiveTab('new-order');
    }
  };

  // Handle cancelling an order
  const handleCancelOrder = (order: Order) => {
    if (!order.tableId) return;
    
    const table = tables.find(t => t.id === order.tableId);
    if (table) {
      // Update table status
      updateTable({
        ...table,
        status: 'available',
        currentOrderId: undefined,
      });
      
      // Update order status
      const updatedOrder: Order = {
        ...order,
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      };
      
      updateOrder(updatedOrder);
      
      toast({
        title: "Order Cancelled",
        description: `Order #${order.orderNumber} has been cancelled.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Point of Sale</h1>
          <p className="text-muted-foreground">Create and manage customer orders</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/table-management')}>
          <Settings className="mr-2 h-4 w-4" />
          Manage Tables
        </Button>
      </div>
      
      <Tabs defaultValue="new-order" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="new-order">New Order</TabsTrigger>
          <TabsTrigger value="current-orders">
            Current Orders
            <Badge variant="secondary" className="ml-2">
              {activeOrders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="table-view">Table View</TabsTrigger>
        </TabsList>

        {/* New Order Tab */}
        <TabsContent value="new-order" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search and Category Filter */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
              
              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleAddToCart}
                    isSelected={selectedProduct?.id === product.id}
                  />
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center h-60">
                    <p className="text-muted-foreground">No products found</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Section */}
            <div className="lg:col-span-1 bg-card rounded-lg border shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Current Order</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  disabled={cartItems.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              
              {/* Table selection - ensure tables is never undefined */}
              <div className="mb-4">
                <TableSelector
                  tables={Array.isArray(tables) ? tables : []}
                  selectedTable={selectedTable}
                  onSelectTable={handleTableSelect}
                />
                
                {existingOrder && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm">
                    <p className="font-medium text-amber-800">
                      This table has an active order ({existingOrder.orderNumber})
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1 w-full text-amber-800 border-amber-300 hover:bg-amber-100"
                      onClick={() => setTableOrderOpen(true)}
                    >
                      View Existing Order
                    </Button>
                  </div>
                )}
              </div>
              
              <Separator className="mb-4" />
              
              {/* Cart Items */}
              {cartItems.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-470px)]">
                  <div className="space-y-2 pr-4">
                    {cartItems.map((item) => (
                      <OrderItemCard
                        key={item.id}
                        item={item}
                        onRemove={handleRemoveItem}
                        onQuantityChange={handleQuantityChange}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
                  <p>Your cart is empty</p>
                  <p className="text-sm">Add products to create an order</p>
                </div>
              )}
              
              <Separator className="my-4" />
              
              {/* Order Summary */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Payment button */}
              <Button 
                className="w-full"
                size="lg"
                disabled={cartItems.length === 0 || existingOrder !== null}
                onClick={() => setPaymentDialogOpen(true)}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Process Payment
              </Button>
              
              {existingOrder && (
                <p className="text-center mt-2 text-sm text-muted-foreground">
                  You must manage the existing order before creating a new one.
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Current Orders Tab */}
        <TabsContent value="current-orders" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.length > 0 ? (
              activeOrders.map(order => {
                const orderTable = tables.find(t => t.id === order.tableId);
                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Order #{order.orderNumber}</CardTitle>
                          <CardDescription>
                            {orderTable ? `Table: ${orderTable.name}` : 'Takeaway'}
                          </CardDescription>
                        </div>
                        <Badge variant={
                          order.status === 'confirmed' ? 'default' :
                          order.status === 'preparing' ? 'secondary' :
                          order.status === 'ready' ? 'outline' :
                          'default'
                        }>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ScrollArea className="h-48 pr-4">
                        <ul className="space-y-2">
                          {order.items.map(item => (
                            <li key={item.id} className="flex justify-between border-b pb-2">
                              <span>
                                <span className="font-medium">{item.quantity}x</span> {item.productName}
                              </span>
                              <Badge variant={
                                item.status === 'pending' ? 'outline' :
                                item.status === 'preparing' ? 'secondary' :
                                item.status === 'ready' ? 'default' :
                                item.status === 'served' ? 'default' :
                                'destructive'
                              }>
                                {item.status}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                      <div className="flex justify-between font-medium mt-4">
                        <span>Total:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 bg-muted/20 border-t">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Clipboard className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleAddToOrder(order)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add Items
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => handleCancelOrder(order)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center h-60 text-muted-foreground">
                <Clipboard className="h-12 w-12 mb-2 opacity-20" />
                <p>No active orders</p>
                <p className="text-sm">All current orders will appear here</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Table View Tab */}
        <TabsContent value="table-view" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Table Status Overview</CardTitle>
              <CardDescription>
                See all tables and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableLayout 
                tables={Array.isArray(tables) ? tables : []} 
                onSelectTable={(tableId) => {
                  const table = tables.find(t => t.id === tableId);
                  if (table) {
                    handleTableSelect(table);
                    if (table.currentOrderId) {
                      setActiveTab('new-order');
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        items={cartItems}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onProcessPayment={handleProcessPayment}
      />
      
      {/* Table Order Dialog */}
      <TableOrderDialog
        open={tableOrderOpen}
        onOpenChange={setTableOrderOpen}
        table={selectedTable}
        onAddItems={handleAddToExistingOrder}
      />
    </div>
  );
};

export default POS;
