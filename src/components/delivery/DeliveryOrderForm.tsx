
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { OrderItem, Order, Product } from '@/data/models';
import OrderItemCard from '@/components/pos/OrderItemCard';

interface DeliveryOrderFormProps {
  products: Product[];
  onOrderSubmit: (order: Order) => void;
}

const DeliveryOrderForm: React.FC<DeliveryOrderFormProps> = ({
  products,
  onOrderSubmit
}) => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('30');

  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.unitPrice * item.quantity;
    const customizationPrice = item.customizations?.reduce((sum, c) => sum + (c.priceDelta || 0), 0) || 0;
    return sum + ((itemPrice + customizationPrice * item.quantity));
  }, 0);
  
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const deliveryFee = 5.00; // Fixed delivery fee
  const total = subtotal + tax + deliveryFee;

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;
    
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += 1;
      setCartItems(newCartItems);
    } else {
      // Add new item to cart
      const newItem: OrderItem = {
        id: uuidv4(),
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        status: 'pending',
      };
      setCartItems([...cartItems, newItem]);
    }
    
    setSelectedProduct('');
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add items to the order before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    if (!customerName || !customerPhone || !customerAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all customer details.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new order
    const newOrder: Order = {
      id: uuidv4(),
      orderNumber: `DEL-${Date.now().toString().slice(-6)}`,
      type: 'delivery',
      status: 'confirmed',
      employeeId: "u1", // In a real app, this would be the logged-in employee
      items: cartItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentStatus: 'pending',
      paymentMethod: 'card', // Default to card for deliveries
      subtotal,
      tax,
      deliveryFee,
      total,
      deliveryInfo: {
        customerName,
        phone: customerPhone,
        address: customerAddress,
        estimatedDeliveryTime: parseInt(estimatedTime)
      }
    };
    
    onOrderSubmit(newOrder);
    
    // Reset form
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setCartItems([]);
    setEstimatedTime('30');
    
    toast({
      title: "Order Created",
      description: `Delivery order #${newOrder.orderNumber} has been created.`,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>New Delivery Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Information */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input 
                  id="customerName" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  placeholder="Customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input 
                  id="customerPhone" 
                  value={customerPhone} 
                  onChange={(e) => setCustomerPhone(e.target.value)} 
                  placeholder="Phone number"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerAddress">Delivery Address</Label>
              <Textarea 
                id="customerAddress" 
                value={customerAddress} 
                onChange={(e) => setCustomerAddress(e.target.value)} 
                placeholder="Delivery address"
                className="resize-none"
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Delivery Time (minutes)</Label>
              <Input 
                id="estimatedTime" 
                type="number" 
                value={estimatedTime} 
                onChange={(e) => setEstimatedTime(e.target.value)} 
                min="15"
                max="120"
              />
            </div>
          </div>
          
          {/* Product Selection */}
          <div className="space-y-2 border-t border-border pt-4">
            <Label htmlFor="productSelect">Add Products</Label>
            <div className="flex gap-2">
              <select 
                id="productSelect" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price.toFixed(2)}
                  </option>
                ))}
              </select>
              <Button 
                type="button" 
                onClick={handleAddProduct}
                disabled={!selectedProduct}
              >
                Add
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClearCart}
                disabled={cartItems.length === 0}
              >
                Clear
              </Button>
            </div>
          </div>
          
          {/* Cart Items */}
          <div className="border border-border rounded-md p-4">
            <h3 className="font-medium mb-2">Order Items</h3>
            {cartItems.length > 0 ? (
              <ScrollArea className="h-60 pr-4">
                <div className="space-y-2">
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
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <ShoppingCart className="h-8 w-8 mb-2 opacity-20" />
                <p>Your cart is empty</p>
              </div>
            )}
            
            {/* Order Summary */}
            <div className="space-y-1 mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee:</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={cartItems.length === 0}>
            Create Delivery Order
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default DeliveryOrderForm;
