
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  tableId?: string;
  total: number;
  onSavePayment: (details: {
    customerName: string;
    paymentMethod: 'cash' | 'card' | 'mobile' | 'online';
    amountPaid: number;
    dueDate?: string;
    notes?: string;
  }) => void;
}

const PaymentDetailsDialog: React.FC<PaymentDetailsDialogProps> = ({
  open,
  onOpenChange,
  orderId,
  tableId,
  total,
  onSavePayment,
}) => {
  const [customerName, setCustomerName] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState<'cash' | 'card' | 'mobile' | 'online'>('cash');
  const [amountPaid, setAmountPaid] = React.useState(total.toString());
  const [dueDate, setDueDate] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmountPaid = parseFloat(amountPaid);
    if (isNaN(parsedAmountPaid)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      });
      return;
    }

    onSavePayment({
      customerName,
      paymentMethod,
      amountPaid: parsedAmountPaid,
      dueDate: parsedAmountPaid < total ? dueDate : undefined,
      notes,
    });
  };

  const remainingAmount = total - parseFloat(amountPaid || '0');
  const showDueDate = remainingAmount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center">
                    <Banknote className="mr-2 h-4 w-4" />
                    Cash
                  </div>
                </SelectItem>
                <SelectItem value="card">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </div>
                </SelectItem>
                <SelectItem value="mobile">Mobile Payment</SelectItem>
                <SelectItem value="online">Online Banking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amountPaid">Amount Paid</Label>
            <Input
              id="amountPaid"
              type="number"
              step="0.01"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
            />
            <div className="text-sm text-muted-foreground">
              Total Amount: ${total.toFixed(2)}
            </div>
            {remainingAmount > 0 && (
              <div className="text-sm font-medium text-destructive">
                Remaining: ${remainingAmount.toFixed(2)}
              </div>
            )}
          </div>

          {showDueDate && (
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add payment notes"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Payment Details</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailsDialog;
