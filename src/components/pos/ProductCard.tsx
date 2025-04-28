
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/data/models';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  isSelected?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, isSelected }) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md overflow-hidden h-full",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={() => onClick(product)}
    >
      <div className="aspect-square w-full overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover transition-all"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-secondary text-secondary-foreground">
            {product.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        {product.isSpecial && (
          <div className="absolute top-2 right-2">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
              Special
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {product.description.length > 30 
                ? `${product.description.substring(0, 30)}...` 
                : product.description}
            </p>
          </div>
          <p className="font-semibold">${product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
