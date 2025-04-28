
import React from 'react';
import { ChevronRight, Edit, Trash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/models';

interface MenuCategorySectionProps {
  category: string;
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const MenuCategorySection: React.FC<MenuCategorySectionProps> = ({
  category,
  products,
  onEditProduct,
  onDeleteProduct,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif font-semibold">{category}</h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-40">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  No Image
                </div>
              )}
              {!product.available && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-medium">
                  Unavailable
                </div>
              )}
              {product.isSpecial && (
                <div className="absolute top-2 right-2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Special
                  </span>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium line-clamp-1">{product.name}</h3>
                <span className="font-semibold">${product.price.toFixed(2)}</span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {product.description}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex text-xs text-muted-foreground">
                  {product.preparationTime > 0 && (
                    <span className="mr-4">{product.preparationTime} min</span>
                  )}
                  {product.allergens && product.allergens.length > 0 && (
                    <span>
                      Allergens: {product.allergens.join(", ")}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEditProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onDeleteProduct(product.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuCategorySection;
