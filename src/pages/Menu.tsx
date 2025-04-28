
import React, { useState } from 'react';
import { PlusCircle, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import MenuCategorySection from '@/components/menu/MenuCategorySection';
import { Product } from '@/data/models';

const Menu: React.FC = () => {
  const { products, deleteProduct } = useAppContext();
  const { toast } = useToast();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('all');
  const [filterSpecials, setFilterSpecials] = useState('all');

  // Get unique categories
  const productsByCategory = products.reduce((acc: Record<string, Product[]>, product) => {
    // Apply filters
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAvailability = filterAvailable === 'all' ||
                              (filterAvailable === 'available' && product.available) ||
                              (filterAvailable === 'unavailable' && !product.available);
    
    const matchesSpecial = filterSpecials === 'all' ||
                          (filterSpecials === 'special' && product.isSpecial) ||
                          (filterSpecials === 'regular' && !product.isSpecial);
    
    if (matchesSearch && matchesAvailability && matchesSpecial) {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
    }
    
    return acc;
  }, {});

  // Handle product actions
  const handleEditProduct = (product: Product) => {
    // In a real app, this would open a modal for editing
    toast({
      title: "Edit Product",
      description: `You clicked to edit ${product.name}.`,
    });
  };

  const handleDeleteProduct = (productId: string) => {
    // In a real app, this would have a confirmation dialog
    deleteProduct(productId);
    toast({
      title: "Product Deleted",
      description: "The product has been removed from the menu.",
    });
  };

  const handleAddProduct = () => {
    // In a real app, this would open a modal for adding a new product
    toast({
      title: "Add Product",
      description: "You clicked to add a new product.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Manage your café's offerings</p>
        </div>
        <Button onClick={handleAddProduct}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterAvailable} onValueChange={setFilterAvailable}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterSpecials} onValueChange={setFilterSpecials}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="special">Specials</SelectItem>
              <SelectItem value="regular">Regular Menu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Menu Categories */}
      {Object.keys(productsByCategory).length > 0 ? (
        Object.entries(productsByCategory).map(([category, categoryProducts]) => (
          <MenuCategorySection
            key={category}
            category={category}
            products={categoryProducts}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-60">
          <p className="text-muted-foreground">No products match your filters</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery('');
              setFilterAvailable('all');
              setFilterSpecials('all');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Menu;
