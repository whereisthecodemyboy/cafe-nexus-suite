
import React, { useState } from 'react';
import { Shield, Plus, Search, Building2, Edit, Trash2, ChevronDown } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { Cafe } from '@/data/models';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';

const CafeManagement: React.FC = () => {
  const { cafes, addCafe, updateCafe, deleteCafe, switchCafe, addUser } = useAppContext();
  const { toast } = useToast();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [cafeFormData, setCafeFormData] = useState<Partial<Cafe>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'active',
  });
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Filter cafes
  const filteredCafes = cafes.filter(cafe => {
    const matchesSearch = 
      cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cafe.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cafe.email && cafe.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || cafe.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Access cafe functionality
  const handleAccessCafe = (cafe: Cafe) => {
    switchCafe(cafe.id);
    toast({
      title: "Switched Cafe",
      description: `Now managing: ${cafe.name}`,
    });
  };
  
  // Open edit dialog
  const openEditDialog = (cafe?: Cafe) => {
    if (cafe) {
      setSelectedCafe(cafe);
      setCafeFormData({
        name: cafe.name,
        address: cafe.address,
        phone: cafe.phone || '',
        email: cafe.email || '',
        status: cafe.status,
      });
    } else {
      setSelectedCafe(null);
      setCafeFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        status: 'active',
      });
      setAdminFormData({
        name: '',
        email: '',
        password: '',
      });
    }
    setIsEditDialogOpen(true);
  };
  
  // Submit cafe form
  const handleSubmitCafe = () => {
    if (!cafeFormData.name || !cafeFormData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedCafe) {
      // Update existing cafe
      const updatedCafe: Cafe = {
        ...selectedCafe,
        name: cafeFormData.name || selectedCafe.name,
        address: cafeFormData.address || selectedCafe.address,
        phone: cafeFormData.phone || selectedCafe.phone,
        email: cafeFormData.email || selectedCafe.email,
        status: (cafeFormData.status as 'active' | 'inactive') || selectedCafe.status
      };
      updateCafe(updatedCafe);
      
      toast({
        title: "Cafe Updated",
        description: `${updatedCafe.name} has been updated successfully.`,
      });
    } else {
      // Create new cafe
      if (!adminFormData.name || !adminFormData.email || !adminFormData.password) {
        toast({
          title: "Missing Information",
          description: "Please provide admin details for the new cafe.",
          variant: "destructive"
        });
        return;
      }
      
      // Create cafe
      const newCafe: Cafe = {
        id: uuidv4(),
        name: cafeFormData.name || 'New Cafe',
        address: cafeFormData.address || 'Address Required',
        phone: cafeFormData.phone,
        email: cafeFormData.email,
        status: (cafeFormData.status as 'active' | 'inactive') || 'active',
        createdAt: new Date().toISOString(),
        logo: '/assets/logo.png'
      };
      addCafe(newCafe);
      
      // Create admin for this cafe
      const adminUser = {
        id: uuidv4(),
        name: adminFormData.name,
        email: adminFormData.email,
        role: 'admin' as const,
        hireDate: new Date().toISOString(),
        status: 'active' as const,
        cafeId: newCafe.id
      };
      addUser(adminUser, adminFormData.password);
      
      toast({
        title: "Cafe Created",
        description: `${newCafe.name} has been added with an admin account.`,
      });
    }
    
    setIsEditDialogOpen(false);
  };
  
  // Delete confirmation
  const confirmDelete = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteCafe = () => {
    if (selectedCafe) {
      deleteCafe(selectedCafe.id);
      
      toast({
        title: "Cafe Deleted",
        description: `${selectedCafe.name} has been removed from the system.`,
      });
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-serif font-bold tracking-tight">Cafe Management</h1>
        </div>
        <Button onClick={() => openEditDialog()} className="bg-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add New Cafe
        </Button>
      </div>

      <div className="bg-primary/10 p-4 rounded-md border border-primary/30 mb-6">
        <h2 className="font-semibold text-primary">Super Admin Controls</h2>
        <p className="text-sm text-muted-foreground">This panel allows you to create, manage, and access all cafes in the system</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cafe name, address, or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCafes.map(cafe => (
          <Card key={cafe.id} className={cn(
            "overflow-hidden transition-all hover:shadow-md",
            cafe.status === 'inactive' && "opacity-70"
          )}>
            <CardHeader className="pb-2 relative">
              <div className="flex justify-between items-start">
                <Building2 className="h-8 w-8 text-primary" />
                <Badge variant={cafe.status === 'active' ? 'default' : 'destructive'}>
                  {cafe.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardTitle className="mt-2 pr-16">{cafe.name}</CardTitle>
              
              {cafe.logo && (
                <div className="absolute top-4 right-4 h-16 w-16 rounded-md overflow-hidden bg-background">
                  <img 
                    src={cafe.logo} 
                    alt={`${cafe.name} logo`} 
                    className="h-full w-full object-contain" 
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="text-sm flex-1">{cafe.address}</span>
                </div>
                
                {cafe.phone && (
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="text-sm">{cafe.phone}</span>
                  </div>
                )}
                
                {cafe.email && (
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="text-sm">{cafe.email}</span>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-sm">{new Date(cafe.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={() => handleAccessCafe(cafe)}>
                  Access & Manage
                </Button>
                
                <div className="flex justify-between gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(cafe)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => confirmDelete(cafe)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredCafes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 border rounded-lg bg-background/50">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No cafes found.</p>
            <Button variant="outline" className="mt-4" onClick={() => openEditDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Cafe
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedCafe ? 'Edit Cafe' : 'Add New Cafe'}</DialogTitle>
            <DialogDescription>
              {selectedCafe 
                ? 'Update the cafe details below.' 
                : 'Enter the details for the new cafe and create an admin account.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cafe Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Cafe Name *</Label>
                  <Input
                    id="name"
                    value={cafeFormData.name}
                    onChange={(e) => setCafeFormData({...cafeFormData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={cafeFormData.status} 
                    onValueChange={(value) => setCafeFormData({...cafeFormData, status: value as 'active' | 'inactive'})}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={cafeFormData.address}
                  onChange={(e) => setCafeFormData({...cafeFormData, address: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={cafeFormData.phone}
                    onChange={(e) => setCafeFormData({...cafeFormData, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cafeFormData.email}
                    onChange={(e) => setCafeFormData({...cafeFormData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            {!selectedCafe && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Admin Account</h3>
                <p className="text-sm text-muted-foreground">
                  Create a cafe manager account that will have access to this cafe.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Admin Name *</Label>
                  <Input
                    id="admin-name"
                    value={adminFormData.name}
                    onChange={(e) => setAdminFormData({...adminFormData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email *</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={adminFormData.email}
                    onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password *</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminFormData.password}
                    onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCafe}>
              {selectedCafe ? 'Save Changes' : 'Create Cafe'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedCafe?.name}</strong>?
              <br /><br />
              This will permanently remove the cafe and all associated data including staff accounts, menu items, orders, and settings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCafe} className="bg-destructive">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CafeManagement;
