import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderItem } from '@/data/models';
import { Check, CreditCard, Printer, SendHorizontal } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PaymentDetailsDialog from './PaymentDetailsDialog';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  onProcessPayment: (paymentMethod: string, emailReceipt: boolean) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  items,
  subtotal,
  tax,
  total,
  onProcessPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashGiven, setCashGiven] = useState(total.toFixed(2));
  const [emailReceipt, setEmailReceipt] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const { toast } = useToast();

  const handlePayment = () => {
    if (emailReceipt && !customerEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a customer email to send the receipt.",
        variant: "destructive",
      });
      return;
    }
    
    if (paymentMethod === 'cash') {
      onProcessPayment(paymentMethod, emailReceipt);
    } else {
      setShowPaymentDetails(true);
    }
  };

  const handleSavePaymentDetails = (details: {
    customerName: string;
    paymentMethod: 'cash' | 'card' | 'mobile' | 'online';
    amountPaid: number;
    dueDate?: string;
    notes?: string;
  }) => {
    onProcessPayment(details.paymentMethod, emailReceipt);
    setShowPaymentDetails(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Complete the transaction by selecting a payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Order Summary</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value)}
              >
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="mobile">Mobile Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === 'cash' && (
              <div className="space-y-2">
                <Label htmlFor="cash-given">Cash Given</Label>
                <div className="flex space-x-2">
                  <Input
                    id="cash-given"
                    type="number"
                    step="0.01"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                  />
                  <Button 
                    variant="outline"
                    onClick={() => setCashGiven(total.toFixed(2))}
                  >
                    Exact
                  </Button>
                </div>
                
                <div className="flex justify-between mt-2">
                  <span>Change:</span>
                  <span className={change < 0 ? "text-destructive" : ""}>
                    ${change.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="email-receipt"
                  checked={emailReceipt}
                  onChange={(e) => setEmailReceipt(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="email-receipt">Email Receipt?</Label>
              </div>
              
              {emailReceipt && (
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="Customer Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              )}
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
            
            <Button onClick={handlePayment}>
              {paymentMethod === 'cash' ? (
                <Check className="mr-2 h-4 w-4" />
              ) : paymentMethod === 'card' ? (
                <CreditCard className="mr-2 h-4 w-4" />
              ) : (
                <SendHorizontal className="mr-2 h-4 w-4" />
              )}
              Complete Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <PaymentDetailsDialog
        open={showPaymentDetails}
        onOpenChange={setShowPaymentDetails}
        orderId=""
        total={total}
        onSavePayment={handleSavePaymentDetails}
      />
    </>
  );
};

export default PaymentDialog;
