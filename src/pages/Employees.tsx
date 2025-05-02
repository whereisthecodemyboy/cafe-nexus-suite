
import React, { useState } from 'react';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import EmployeeCard from '@/components/employees/EmployeeCard';
import { User } from '@/data/models';
import { Link, useNavigate } from 'react-router-dom';

const Employees: React.FC = () => {
  const { users } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Get unique roles
  const roles = Array.from(new Set(users.map(user => user.role)));
  
  // Filter employees
  const filteredEmployees = users.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle employee actions
  const handleAddEmployee = () => {
    navigate('/employees/add');
  };
  
  const handleEditEmployee = (employee: User) => {
    // In a real app, this would open a modal for editing
    toast({
      title: "Edit Employee",
      description: `You clicked to edit ${employee.name}.`,
    });
  };

  const handleDeleteEmployee = (employeeId: string) => {
    // In a real app, this would have a confirmation dialog
    toast({
      title: "Delete Employee",
      description: "You clicked to delete an employee.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your staff</p>
        </div>
        <Button onClick={handleAddEmployee}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
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
              {roles.map(role => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
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
      
      {/* Employee Grid */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-60">
          <p className="text-muted-foreground">No employees match your filters</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery('');
              setFilterRole('all');
              setFilterStatus('all');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Employees;
