
import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderItem } from '@/data/models';

interface OrderItemCardProps {
  item: OrderItem;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, onRemove, onQuantityChange }) => {
  const totalPrice = item.unitPrice * item.quantity;
  
  // Add price modifiers from variants and customizations
  const variantPrice = item.variantId ? item.customizations?.find(c => c.name === 'Variant')?.priceDelta || 0 : 0;
  const customizationPrice = item.customizations?.reduce((sum, c) => sum + (c.priceDelta || 0), 0) || 0;
  const finalPrice = (item.unitPrice + variantPrice + customizationPrice) * item.quantity;

  return (
    <div className="bg-card rounded-lg p-3 mb-2 shadow-sm">
      <div className="flex justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="font-medium">{item.productName}</span>
            {item.variantName && (
              <span className="text-xs ml-2 text-muted-foreground">
                ({item.variantName})
              </span>
            )}
          </div>
          
          {item.customizations && item.customizations.length > 0 && (
            <div className="mt-1">
              {item.customizations.map((customization, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {customization.name}: {customization.option}
                  {customization.priceDelta > 0 && ` (+$${customization.priceDelta.toFixed(2)})`}
                </div>
              ))}
            </div>
          )}
          
          {item.notes && (
            <div className="text-xs italic mt-1">Note: {item.notes}</div>
          )}
        </div>
        
        <div className="flex flex-col items-end">
          <span className="font-semibold">${finalPrice.toFixed(2)}</span>
          <div className="flex items-center mt-1 space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => item.quantity > 1 && onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center">{item.quantity}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs text-muted-foreground"
          onClick={() => onRemove(item.id)}
        >
          <X className="h-3 w-3 mr-1" />
          Remove
        </Button>
        
        <span className="text-xs text-muted-foreground">
          ${item.unitPrice.toFixed(2)} each
        </span>
      </div>
    </div>
  );
};

export default OrderItemCard;
