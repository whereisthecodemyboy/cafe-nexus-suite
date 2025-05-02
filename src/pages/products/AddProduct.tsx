import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription
} from '@/components/ui/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { Image, Package, Plus, Trash } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  cost: z.coerce.number().min(0.01, 'Cost must be greater than 0'),
  preparationTime: z.coerce.number().int().min(1, 'Preparation time is required'),
  available: z.boolean().default(true),
  isSpecial: z.boolean().default(false),
  // Optional fields
  image: z.string().optional(),
  allergens: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

type CustomizationOption = {
  id: string;
  name: string;
  priceDelta: number;
};

type Customization = {
  id: string;
  name: string;
  required: boolean;
  multiSelect: boolean;
  options: CustomizationOption[];
};

const AddProduct = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { products, addProduct, inventoryItems } = useAppContext();
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [selectedInventoryItems, setSelectedInventoryItems] = useState<string[]>([]);
  const [newCustomization, setNewCustomization] = useState({
    name: '',
    required: false,
    multiSelect: false,
  });
  const [newOption, setNewOption] = useState({
    name: '',
    priceDelta: 0,
  });
  const [activeCustomizationId, setActiveCustomizationId] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState('');
  
  // Extract existing categories and add "Other" for custom input
  const existingCategories = [...new Set(products.map(p => p.category))];
  const categories = existingCategories.length > 0 ? existingCategories : ['Coffee', 'Tea', 'Desserts', 'Breakfast', 'Lunch'];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: 0,
      cost: 0,
      preparationTime: 5,
      available: true,
      isSpecial: false,
      image: '',
      allergens: [],
    }
  });

  const onSubmit = (data: FormValues) => {
    try {
      // Use custom category if selected
      const finalCategory = data.category === 'custom' ? customCategory : data.category;
      
      if (data.category === 'custom' && !customCategory) {
        toast({
          title: "Category required",
          description: "Please enter a custom category name",
          variant: "destructive"
        });
        return;
      }

      const newProduct = {
        id: uuidv4(),
        name: data.name,
        description: data.description,
        category: finalCategory,
        price: data.price,
        cost: data.cost,
        image: data.image || '/placeholder.svg',
        available: data.available,
        preparationTime: data.preparationTime,
        allergens: data.allergens,
        variants: [],
        customizations: customizations,
        isSpecial: data.isSpecial,
        inventoryItems: selectedInventoryItems
      };

      addProduct(newProduct);
      
      toast({
        title: "Product added successfully",
        description: `${data.name} has been added to the menu`,
      });
      
      navigate('/menu');
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddCustomization = () => {
    if (!newCustomization.name) {
      toast({
        title: "Invalid customization",
        description: "Customization name is required",
        variant: "destructive"
      });
      return;
    }

    const customization: Customization = {
      id: uuidv4(),
      name: newCustomization.name,
      required: newCustomization.required,
      multiSelect: newCustomization.multiSelect,
      options: []
    };

    setCustomizations([...customizations, customization]);
    setActiveCustomizationId(customization.id);
    setNewCustomization({
      name: '',
      required: false,
      multiSelect: false,
    });
  };

  const handleAddOption = () => {
    if (!activeCustomizationId) return;
    if (!newOption.name) {
      toast({
        title: "Invalid option",
        description: "Option name is required",
        variant: "destructive"
      });
      return;
    }

    setCustomizations(customizations.map(c => {
      if (c.id === activeCustomizationId) {
        return {
          ...c,
          options: [...c.options, { ...newOption, id: uuidv4() }]
        };
      }
      return c;
    }));

    setNewOption({ name: '', priceDelta: 0 });
  };

  const handleDeleteCustomization = (id: string) => {
    setCustomizations(customizations.filter(c => c.id !== id));
    if (activeCustomizationId === id) {
      setActiveCustomizationId(null);
    }
  };

  const handleDeleteOption = (customizationId: string, optionId: string) => {
    setCustomizations(customizations.map(c => {
      if (c.id === customizationId) {
        return {
          ...c,
          options: c.options.filter(o => o.id !== optionId)
        };
      }
      return c;
    }));
  };

  const toggleInventoryItem = (id: string) => {
    if (selectedInventoryItems.includes(id)) {
      setSelectedInventoryItems(selectedInventoryItems.filter(item => item !== id));
    } else {
      setSelectedInventoryItems([...selectedInventoryItems, id]);
    }
  };

  const handleCategoryChange = (value: string) => {
    form.setValue('category', value);
    if (value !== 'custom') {
      setCustomCategory('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
        <Button variant="outline" onClick={() => navigate('/menu')}>
          Back to Menu
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package size={20} />
            Product Information
          </CardTitle>
          <CardDescription>Enter the details of the new menu item</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="customizations">Customizations</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Cappuccino" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={handleCategoryChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                              <SelectItem value="custom">
                                <div className="flex items-center">
                                  <Plus className="w-4 h-4 mr-2" />
                                  <span>Add New Category</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('category') === 'custom' && (
                      <FormItem className="col-span-2">
                        <FormLabel>Custom Category Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter new category name" 
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                          />
                        </FormControl>
                        <FormDescription>
                          Create a new category for your menu items
                        </FormDescription>
                      </FormItem>
                    )}
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preparationTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preparation Time (minutes)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-end space-x-4">
                      <FormField
                        control={form.control}
                        name="available"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Available</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isSpecial"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Special Item</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your product..." 
                                className="min-h-32"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="customizations" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="md:col-span-1">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Add Customization</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Customization Name</label>
                          <Input 
                            value={newCustomization.name}
                            onChange={(e) => setNewCustomization({...newCustomization, name: e.target.value})}
                            placeholder="Size, Milk Type, etc."
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium">Required:</label>
                          <Switch 
                            checked={newCustomization.required} 
                            onCheckedChange={(checked) => setNewCustomization({...newCustomization, required: checked})}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium">Multi-select:</label>
                          <Switch 
                            checked={newCustomization.multiSelect} 
                            onCheckedChange={(checked) => setNewCustomization({...newCustomization, multiSelect: checked})}
                          />
                        </div>
                        <Button 
                          onClick={handleAddCustomization} 
                          className="w-full"
                          type="button"
                        >
                          Add Customization
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Customization Options</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        {customizations.length === 0 ? (
                          <div className="text-center p-4 text-muted-foreground">
                            No customizations added yet
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {customizations.map(customization => (
                              <div 
                                key={customization.id} 
                                className={`border rounded-md p-4 ${activeCustomizationId === customization.id ? 'border-primary' : ''}`}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-semibold">{customization.name}</h4>
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => setActiveCustomizationId(customization.id)}
                                    >
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => handleDeleteCustomization(customization.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-sm">
                                  {customization.required ? 'Required' : 'Optional'} • 
                                  {customization.multiSelect ? ' Multi-select' : ' Single-select'}
                                </div>
                                {customization.options.length > 0 && (
                                  <div className="mt-2">
                                    <div className="text-xs font-medium mb-1">Options:</div>
                                    <ul className="text-sm">
                                      {customization.options.map(option => (
                                        <li key={option.id} className="flex justify-between py-1 border-t">
                                          <span>{option.name}</span>
                                          <div className="flex items-center space-x-2">
                                            <span>${option.priceDelta.toFixed(2)}</span>
                                            <Button 
                                              variant="ghost" 
                                              size="sm"
                                              onClick={() => handleDeleteOption(customization.id, option.id)}
                                            >
                                              <Trash className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {activeCustomizationId === customization.id && (
                                  <div className="mt-4 space-y-4 border-t pt-4">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-sm font-medium">Option Name</label>
                                        <Input 
                                          value={newOption.name}
                                          onChange={(e) => setNewOption({...newOption, name: e.target.value})}
                                          placeholder="Small, Medium, etc."
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Price Addition ($)</label>
                                        <Input 
                                          type="number"
                                          step="0.01"
                                          value={newOption.priceDelta}
                                          onChange={(e) => setNewOption({...newOption, priceDelta: parseFloat(e.target.value)})}
                                          placeholder="0.00"
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>
                                    <Button 
                                      onClick={handleAddOption} 
                                      className="w-full"
                                      type="button"
                                    >
                                      Add Option
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="inventory" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Link Inventory Items</CardTitle>
                      <CardDescription>Select which inventory items are used for this product</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {inventoryItems.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No inventory items available
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {inventoryItems.map(item => (
                            <div 
                              key={item.id} 
                              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                                selectedInventoryItems.includes(item.id) ? 'bg-primary/10 border-primary' : ''
                              }`}
                              onClick={() => toggleInventoryItem(item.id)}
                            >
                              <div className="flex items-center space-x-2">
                                <Switch checked={selectedInventoryItems.includes(item.id)} />
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.currentStock} {item.unit} available
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="image" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <FormLabel>Product Image</FormLabel>
                            <div className="text-sm text-muted-foreground">(Optional)</div>
                          </div>
                          
                          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-muted/50">
                            <div className="mb-4">
                              <Image className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-1 text-center">
                              <p className="text-sm text-muted-foreground">
                                Drag & drop an image here, or click to select a file
                              </p>
                              <p className="text-xs text-muted-foreground">
                                JPG, PNG or GIF up to 2MB
                              </p>
                            </div>
                            <Button type="button" variant="outline" className="mt-4">
                              Upload Image
                            </Button>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="url" 
                                placeholder="Or enter an image URL" 
                                className="mt-4"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <div className="flex justify-end mt-6">
                  <Button type="submit">Create Product</Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
