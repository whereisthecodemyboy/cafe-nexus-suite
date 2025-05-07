
import React, { useState } from 'react';
import { Shield, Plus, Search, Building2, Edit, Trash2 } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';

const CafeManagement: React.FC = () => {
  const { cafes, addCafe, updateCafe, switchCafe, addUser } = useAppContext();
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
      // In a real app, this would handle proper deletion with data cleanup
      // For now, we just update the status to inactive
      const updatedCafe = { ...selectedCafe, status: 'inactive' as const };
      updateCafe(updatedCafe);
      
      toast({
        title: "Cafe Deactivated",
        description: `${selectedCafe.name} has been deactivated.`,
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
        <Button onClick={() => openEditDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Cafe
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cafes..."
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
          <Card key={cafe.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Building2 className="h-8 w-8 text-primary" />
                <Badge variant={cafe.status === 'active' ? 'default' : 'destructive'}>
                  {cafe.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardTitle className="mt-2">{cafe.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm">{cafe.address}</p>
                {cafe.phone && <p className="text-sm">{cafe.phone}</p>}
                {cafe.email && <p className="text-sm">{cafe.email}</p>}
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(cafe.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex justify-between gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAccessCafe(cafe)}>
                  Access
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(cafe)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive"
                    onClick={() => confirmDelete(cafe)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredCafes.length === 0 && (
          <div className="col-span-full flex justify-center items-center p-8 border rounded-lg">
            <p className="text-muted-foreground">No cafes found</p>
          </div>
        )}
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedCafe ? 'Edit Cafe' : 'Add New Cafe'}</DialogTitle>
            <DialogDescription>
              {selectedCafe 
                ? 'Update the cafe details below.' 
                : 'Enter the details for the new cafe and create an admin account.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Cafe Name *</Label>
              <Input
                id="name"
                value={cafeFormData.name}
                onChange={(e) => setCafeFormData({...cafeFormData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={cafeFormData.address}
                onChange={(e) => setCafeFormData({...cafeFormData, address: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
            
            {!selectedCafe && (
              <div className="space-y-4 mt-6 pt-6 border-t">
                <h3 className="text-lg font-medium">Admin Account</h3>
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
            <AlertDialogTitle>Are you sure you want to deactivate this cafe?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the cafe as inactive and restrict access to its data.
              All related staff accounts will also be deactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCafe} className="bg-destructive">
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CafeManagement;
