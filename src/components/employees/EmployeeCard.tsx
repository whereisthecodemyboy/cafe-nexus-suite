
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Phone, Mail } from 'lucide-react';
import { User } from '@/data/models';

interface EmployeeCardProps {
  employee: User;
  onEdit: (employee: User) => void;
  onDelete: (employeeId: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEdit, onDelete }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="h-10 bg-primary" />
      </CardHeader>
      <CardContent className="pt-0 p-6">
        <div className="flex flex-col items-center -mt-8 mb-4">
          <Avatar className="h-16 w-16 border-4 border-background">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback className="text-lg">{getInitials(employee.name)}</AvatarFallback>
          </Avatar>
          <h3 className="font-medium mt-2 text-center">{employee.name}</h3>
          <Badge className="mt-1">
            {formatRole(employee.role)}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{employee.email}</span>
          </div>
          
          {employee.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{employee.phone}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <Badge variant="outline" className={employee.status === 'active' ? 'text-green-500' : 'text-red-500'}>
              {employee.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
            <span className="ml-2 text-muted-foreground">
              Since {new Date(employee.hireDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => onEdit(employee)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-destructive" onClick={() => onDelete(employee.id)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
