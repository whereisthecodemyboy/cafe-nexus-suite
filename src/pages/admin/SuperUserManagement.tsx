
import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search,
  Shield,
  Lock,
  UserX,
  Mail,
  BadgeCheck,
  ArrowUpDown,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const SuperUserManagement: React.FC = () => {
  const { users, cafes } = useAppContext();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.cafeId && cafes.find(c => c.id === user.cafeId)?.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusChange = (userId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `User status has been changed to ${newStatus}.`,
    });
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    toast({
      title: "Role Updated",
      description: `User role has been changed to ${newRole}.`,
    });
  };

  const handleResetPassword = (userId: string) => {
    toast({
      title: "Password Reset Email Sent",
      description: "A password reset link has been sent to the user's email.",
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superAdmin':
        return <Badge variant="destructive" className="font-medium">Super Admin</Badge>;
      case 'admin':
        return <Badge variant="default" className="font-medium">Admin</Badge>;
      case 'manager':
        return <Badge variant="secondary" className="font-medium">Manager</Badge>;
      case 'staff':
        return <Badge variant="outline" className="font-medium">Staff</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Users className="h-6 w-6 text-destructive" />
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          User Management
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All system users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Currently active users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.filter(u => u.status === 'active').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Admins</CardTitle>
            <CardDescription>Total admin users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.filter(u => u.role === 'admin' || u.role === 'superAdmin').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage all users across the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex relative md:w-1/2">
              <Input
                placeholder="Search users by name, email or cafe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <SelectValue placeholder="Filter by role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="superAdmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" /> Sort
              </Button>
            </div>
            <div className="flex-grow flex justify-end">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" /> Add User
              </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Cafe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No users found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.cafeId ? (
                          <span className="text-sm">
                            {cafes.find(c => c.id === user.cafeId)?.name || '-'}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">System</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                              <Shield className="mr-2 h-4 w-4" /> Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                              <Mail className="mr-2 h-4 w-4" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                              <BadgeCheck className="mr-2 h-4 w-4 text-green-500" /> Set Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'suspended')} 
                              className="text-destructive">
                              <UserX className="mr-2 h-4 w-4" /> Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperUserManagement;
