
import React, { useState } from 'react';
import { Shield, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
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
import { useAppContext } from '@/contexts/AppContext';
import { User } from '@/data/models';
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
import { v4 as uuidv4 } from 'uuid';

const StaffManagement: React.FC = () => {
  const { users, addUser, updateUser } = useAppContext();
  const { toast } = useToast();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter employees
  const filteredStaff = users.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Add New Staff Member (placeholder - would open a form dialog in a real implementation)
  const handleAddStaff = () => {
    const newUser: User = {
      id: uuidv4(),
      name: "New Staff Member",
      email: `staff${Math.floor(Math.random() * 1000)}@cafenexus.com`,
      role: "cashier",
      hireDate: new Date().toISOString(),
      status: "active" // Fixed: Using literal "active" instead of string type
    };
    
    addUser(newUser, "defaultpassword");
    
    toast({
      title: "Staff Added",
      description: "New staff member has been added successfully.",
    });
  };
  
  // Toggle Active Status
  const toggleUserStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const updatedUser = { ...user, status: newStatus };
    updateUser(updatedUser);
    
    toast({
      title: `Staff ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
      description: `${user.name}'s account has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
    });
  };
  
  // Delete Confirmation
  const confirmDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteUser = () => {
    if (selectedUser) {
      // In a real app, we would call a delete function
      // Instead we'll just mark them as inactive
      const updatedUser = { ...selectedUser, status: 'inactive' as const };
      updateUser(updatedUser);
      
      toast({
        title: "Staff Removed",
        description: `${selectedUser.name} has been removed from the system.`,
      });
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-serif font-bold tracking-tight">Staff Management</h1>
        </div>
        <Button onClick={handleAddStaff}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="superAdmin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
              <SelectItem value="waiter">Waiter</SelectItem>
              <SelectItem value="chef">Chef</SelectItem>
              <SelectItem value="barista">Barista</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
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
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map(staff => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>
                  <Badge variant={staff.role === 'superAdmin' ? 'default' : 'outline'}>
                    {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(staff.hireDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {/* Fix the variant type from "success" to "default" with custom colors */}
                  <Badge 
                    variant={staff.status === 'active' ? 'default' : 'destructive'}
                    className={staff.status === 'active' ? 'bg-green-500' : ''}
                  >
                    {staff.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleUserStatus(staff)}
                    >
                      {staff.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => confirmDelete(staff)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredStaff.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No staff members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this staff member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The staff member will be permanently removed
              from the system and will no longer have access to the café management system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffManagement;
