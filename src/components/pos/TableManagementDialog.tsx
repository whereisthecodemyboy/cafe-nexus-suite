import React, { useState } from 'react';
import { X, PlusCircle, Trash2, Link, LinkOff } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { Table as TableType } from '@/data/models';

interface TableManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TableManagementDialog: React.FC<TableManagementDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { tables, addTable, updateTable, deleteTable } = useAppContext();
  const { toast } = useToast();
  
  const [newTable, setNewTable] = useState({
    name: '',
    capacity: 4,
    section: 'Main',
    shape: 'square' as const,
  });
  
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [tableAction, setTableAction] = useState<'combine' | 'separate' | null>(null);
  
  // Get unique sections
  const sections = Array.from(new Set(tables.map(table => table.section)));
  
  // Handle adding new table
  const handleAddTable = () => {
    if (!newTable.name.trim()) {
      toast({
        title: "Error",
        description: "Table name is required",
        variant: "destructive",
      });
      return;
    }
    
    const existingTable = tables.find(
      (t) => t.name.toLowerCase() === newTable.name.toLowerCase()
    );
    
    if (existingTable) {
      toast({
        title: "Error",
        description: "A table with this name already exists",
        variant: "destructive",
      });
      return;
    }
    
    const newTableData: TableType = {
      id: uuidv4(),
      name: newTable.name,
      capacity: Number(newTable.capacity),
      status: 'available',
      shape: newTable.shape as 'square' | 'rectangle' | 'circle' | 'custom',
      positionX: 0,
      positionY: 0,
      width: 60,
      height: 60,
      section: newTable.section,
      combinedWith: [],
    };
    
    addTable(newTableData);
    
    toast({
      title: "Table Added",
      description: `${newTable.name} has been added successfully.`,
    });
    
    setNewTable({
      name: '',
      capacity: 4,
      section: 'Main',
      shape: 'square',
    });
  };
  
  // Handle table selection for combining/separating
  const handleTableSelection = (tableId: string) => {
    setSelectedTables(prev => 
      prev.includes(tableId) 
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
  };
  
  // Handle combining tables
  const handleCombineTables = () => {
    if (selectedTables.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least two tables to combine",
        variant: "destructive",
      });
      return;
    }
    
    // Check if any selected table is occupied or already combined
    const cannotCombine = selectedTables.some(tableId => {
      const table = tables.find(t => t.id === tableId);
      return table && (
        table.status === 'occupied' || 
        table.status === 'reserved' || 
        (table.combinedWith && table.combinedWith.length > 0)
      );
    });
    
    if (cannotCombine) {
      toast({
        title: "Error",
        description: "Cannot combine tables that are occupied, reserved, or already combined",
        variant: "destructive",
      });
      return;
    }
    
    // Update each table to be combined with others
    selectedTables.forEach(tableId => {
      const otherTableIds = selectedTables.filter(id => id !== tableId);
      const tableToUpdate = tables.find(t => t.id === tableId);
      
      if (tableToUpdate) {
        updateTable({
          ...tableToUpdate,
          combinedWith: otherTableIds,
          status: 'available',
        });
      }
    });
    
    toast({
      title: "Tables Combined",
      description: `${selectedTables.length} tables have been combined.`,
    });
    
    setSelectedTables([]);
    setTableAction(null);
  };
  
  // Handle separating tables
  const handleSeparateTables = () => {
    if (selectedTables.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one table to separate",
        variant: "destructive",
      });
      return;
    }
    
    // Update each table to remove combinations
    selectedTables.forEach(tableId => {
      const tableToUpdate = tables.find(t => t.id === tableId);
      
      if (tableToUpdate && tableToUpdate.combinedWith) {
        // Also update tables that were combined with this one
        tableToUpdate.combinedWith.forEach(combinedTableId => {
          const combinedTable = tables.find(t => t.id === combinedTableId);
          if (combinedTable) {
            updateTable({
              ...combinedTable,
              combinedWith: combinedTable.combinedWith?.filter(id => id !== tableId) || [],
            });
          }
        });
        
        updateTable({
          ...tableToUpdate,
          combinedWith: [],
          status: 'available',
        });
      }
    });
    
    toast({
      title: "Tables Separated",
      description: "The selected tables have been separated.",
    });
    
    setSelectedTables([]);
    setTableAction(null);
  };
  
  // Handle deleting a table
  const handleDeleteTable = (tableId: string) => {
    const tableToDelete = tables.find(t => t.id === tableId);
    
    if (!tableToDelete) return;
    
    if (tableToDelete.status === 'occupied' || tableToDelete.currentOrderId) {
      toast({
        title: "Cannot Delete",
        description: "This table is currently occupied or has an active order.",
        variant: "destructive",
      });
      return;
    }
    
    // If table is combined with others, separate them first
    if (tableToDelete.combinedWith && tableToDelete.combinedWith.length > 0) {
      tableToDelete.combinedWith.forEach(combinedTableId => {
        const combinedTable = tables.find(t => t.id === combinedTableId);
        if (combinedTable) {
          updateTable({
            ...combinedTable,
            combinedWith: combinedTable.combinedWith?.filter(id => id !== tableId) || [],
          });
        }
      });
    }
    
    deleteTable(tableId);
    
    toast({
      title: "Table Deleted",
      description: `${tableToDelete.name} has been removed.`,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Table Management</DialogTitle>
          <DialogDescription>
            Add new tables, combine or separate tables, and manage existing ones.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add New Table Section */}
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="text-lg font-medium">Add New Table</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="table-name">Table Name</Label>
                <Input
                  id="table-name"
                  placeholder="e.g., Table 1"
                  value={newTable.name}
                  onChange={(e) => setNewTable({...newTable, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="table-capacity">Capacity</Label>
                <Input
                  id="table-capacity"
                  type="number"
                  min="1"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value) || 1})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="table-section">Section</Label>
                <Select 
                  value={newTable.section} 
                  onValueChange={(value) => setNewTable({...newTable, section: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Include existing sections and option for new */}
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                    <SelectItem value="Main">Main</SelectItem>
                    <SelectItem value="Patio">Patio</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Bar">Bar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="table-shape">Shape</Label>
                <Select 
                  value={newTable.shape} 
                  onValueChange={(value: 'square' | 'rectangle' | 'circle' | 'custom') => 
                    setNewTable({...newTable, shape: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full" onClick={handleAddTable}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Table
            </Button>
          </div>
          
          {/* Table Actions Section */}
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="text-lg font-medium">Table Actions</h3>
            <div className="flex gap-4 mb-4">
              <Button 
                variant={tableAction === 'combine' ? 'default' : 'outline'} 
                className="flex-1"
                onClick={() => setTableAction(tableAction === 'combine' ? null : 'combine')}
              >
                <Link className="mr-2 h-4 w-4" />
                Combine Tables
              </Button>
              <Button 
                variant={tableAction === 'separate' ? 'default' : 'outline'} 
                className="flex-1"
                onClick={() => setTableAction(tableAction === 'separate' ? null : 'separate')}
              >
                <LinkOff className="mr-2 h-4 w-4" />
                Separate Tables
              </Button>
            </div>
            
            {tableAction && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {tableAction === 'combine' ? 
                    'Select tables to combine them for larger groups.' : 
                    'Select combined tables to separate them.'}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {tables.map((table) => {
                    // For combining, only show available tables
                    // For separating, show tables that are combined
                    const shouldShow = tableAction === 'combine' 
                      ? table.status === 'available'
                      : table.combinedWith && table.combinedWith.length > 0;
                    
                    if (!shouldShow) return null;
                    
                    return (
                      <Button
                        key={table.id}
                        size="sm"
                        variant={selectedTables.includes(table.id) ? "default" : "outline"}
                        onClick={() => handleTableSelection(table.id)}
                      >
                        {table.name}
                      </Button>
                    );
                  })}
                </div>
                
                <Button 
                  className="w-full"
                  disabled={selectedTables.length === 0}
                  onClick={tableAction === 'combine' ? handleCombineTables : handleSeparateTables}
                >
                  {tableAction === 'combine' ? 'Combine Selected Tables' : 'Separate Selected Tables'}
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Existing Tables List */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Existing Tables</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Combined With</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell>{table.name}</TableCell>
                  <TableCell>{table.capacity}</TableCell>
                  <TableCell>{table.section}</TableCell>
                  <TableCell>
                    <span 
                      className={`inline-block rounded-full px-2 text-xs ${
                        table.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : table.status === 'occupied'
                          ? 'bg-red-100 text-red-800'
                          : table.status === 'reserved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {table.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {table.combinedWith && table.combinedWith.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {table.combinedWith.map(tableId => {
                          const combinedTable = tables.find(t => t.id === tableId);
                          return combinedTable ? (
                            <span key={tableId} className="bg-gray-100 text-xs px-1 rounded">
                              {combinedTable.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTable(table.id)}
                      disabled={table.status === 'occupied' || Boolean(table.currentOrderId)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {tables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No tables available. Add your first table above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableManagementDialog;
