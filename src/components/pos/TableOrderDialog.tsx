
import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Trash2, CreditCard } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Order, Table as TableType, OrderItem } from '@/data/models';
import { Separator } from '@/components/ui/separator';
import OrderItemCard from '@/components/pos/OrderItemCard';
import PaymentDialog from '@/components/pos/PaymentDialog';

interface TableOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: TableType | null;
  onAddItems: () => void;
}

const TableOrderDialog: React.FC<TableOrderDialogProps> = ({
  open,
  onOpenChange,
  table,
  onAddItems,
}) => {
  const { orders, updateOrder, deleteOrder, updateTable } = useAppContext();
  const { toast } = useToast();
  
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
  // Calculate order totals
  const subtotal = orderItems.reduce((sum, item) => {
    const itemPrice = item.unitPrice * item.quantity;
    const customizationPrice = item.customizations?.reduce((sum, c) => sum + (c.priceDelta || 0), 0) || 0;
    return sum + ((itemPrice + customizationPrice * item.quantity));
  }, 0);
  
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  // Load current order for the table
  useEffect(() => {
    if (table && table.currentOrderId) {
      const order = orders.find(o => o.id === table.currentOrderId);
      if (order) {
        setCurrentOrder(order);
        setOrderItems(order.items);
      }
    } else {
      setCurrentOrder(null);
      setOrderItems([]);
    }
  }, [table, orders]);
  
  // Handle remove item from order
  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
    
    // Update the order with removed item
    if (currentOrder) {
      const updatedOrder = {
        ...currentOrder,
        items: orderItems.filter(item => item.id !== id),
        subtotal: subtotal - (orderItems.find(item => item.id === id)?.unitPrice || 0),
        tax: tax - (orderItems.find(item => item.id === id)?.unitPrice || 0) * taxRate,
        total: total - (orderItems.find(item => item.id === id)?.unitPrice || 0) * (1 + taxRate),
        updatedAt: new Date().toISOString(),
      };
      
      updateOrder(updatedOrder);
      
      toast({
        title: "Item Removed",
        description: "Item has been removed from the order.",
      });
    }
  };
  
  // Handle change quantity of item in order
  const handleQuantityChange = (id: string, newQuantity: number) => {
    const updatedItems = orderItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setOrderItems(updatedItems);
    
    // Update the order with new quantity
    if (currentOrder) {
      const updatedOrder = {
        ...currentOrder,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
      };
      
      // Recalculate the totals
      const newSubtotal = updatedItems.reduce((sum, item) => {
        const itemPrice = item.unitPrice * item.quantity;
        const customizationPrice = item.customizations?.reduce((sum, c) => sum + (c.priceDelta || 0), 0) || 0;
        return sum + ((itemPrice + customizationPrice * item.quantity));
      }, 0);
      
      const newTax = newSubtotal * taxRate;
      
      updatedOrder.subtotal = newSubtotal;
      updatedOrder.tax = newTax;
      updatedOrder.total = newSubtotal + newTax;
      
      updateOrder(updatedOrder);
    }
  };
  
  // Cancel entire order
  const handleCancelOrder = () => {
    if (!currentOrder || !table) return;
    
    deleteOrder(currentOrder.id);
    updateTable({
      ...table,
      status: 'available',
      currentOrderId: undefined,
    });
    
    toast({
      title: "Order Cancelled",
      description: `Order #${currentOrder.orderNumber} has been cancelled.`,
    });
    
    onOpenChange(false);
  };
  
  // Process payment
  const handleProcessPayment = (paymentMethod: string, emailReceipt: boolean) => {
    if (!currentOrder || !table) return;
    
    // Update order status
    const updatedOrder = {
      ...currentOrder,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: paymentMethod as 'cash' | 'card' | 'mobile' | 'online',
      updatedAt: new Date().toISOString(),
      items: orderItems,
      subtotal,
      tax,
      total,
    };
    
    updateOrder(updatedOrder);
    
    // Update table status
    updateTable({
      ...table,
      status: 'available',
      currentOrderId: undefined,
    });
    
    toast({
      title: "Payment Processed",
      description: `Order #${currentOrder.orderNumber} has been completed.`,
    });
    
    setPaymentDialogOpen(false);
    onOpenChange(false);
  };
  
  if (!table) return null;
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentOrder ? `Order #${currentOrder.orderNumber} - ${table.name}` : `${table.name}`}
            </DialogTitle>
            <DialogDescription>
              {currentOrder 
                ? `Manage the current order for ${table.name}.` 
                : `No active order for ${table.name}.`}
            </DialogDescription>
          </DialogHeader>
          
          {currentOrder ? (
            <>
              <div className="space-y-4">
                <h3 className="font-medium">Order Items</h3>
                
                {orderItems.length > 0 ? (
                  <div className="max-h-[400px] overflow-y-auto">
                    <div className="space-y-2 pr-4">
                      {orderItems.map((item) => (
                        <OrderItemCard
                          key={item.id}
                          item={item}
                          onRemove={handleRemoveItem}
                          onQuantityChange={handleQuantityChange}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No items in this order.
                  </div>
                )}
                
                <Separator />
                
                {/* Order Summary */}
                <div className="space-y-1">
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
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button variant="outline" onClick={onAddItems} className="flex-1">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add More Items
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleCancelOrder}
                    className="flex-1"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>
                  <Button 
                    onClick={() => setPaymentDialogOpen(true)}
                    className="flex-1"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Process Payment
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="mb-4 text-muted-foreground">This table doesn't have an active order.</p>
              <Button onClick={onAddItems}>Create New Order</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Payment Dialog */}
      {currentOrder && (
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          items={orderItems}
          subtotal={subtotal}
          tax={tax}
          total={total}
          onProcessPayment={handleProcessPayment}
        />
      )}
    </>
  );
};

export default TableOrderDialog;
