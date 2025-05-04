import React, { useState } from 'react';
import {
  Table2,
  Plus,
  Trash2,
  Link,
  Link2Off,
  ArrowLeft,
  Grid3X3,
  List,
} from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TableLayout from '@/components/tables/TableLayout';

const TableManagement: React.FC = () => {
  const { tables, addTable, updateTable, deleteTable } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // This is the initial state that will be used when adding a new table
  const [newTable, setNewTable] = useState({
    name: '',
    capacity: 4,
    section: 'Main',
    shape: 'square' as 'square' | 'rectangle' | 'circle' | 'custom',
  });
  
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [tableAction, setTableAction] = useState<'combine' | 'separate' | null>(null);
  const [activeTab, setActiveTab] = useState('visual');
  
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
      shape: newTable.shape,
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Table Management</h1>
          <p className="text-muted-foreground">Manage tables, their layout and combinations</p>
        </div>
        <Button onClick={() => navigate('/pos')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to POS
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Table Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5 text-primary" /> 
              Add New Table
            </CardTitle>
            <CardDescription>Create a new table in your restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="table-name">Table Name</Label>
                <Input
                  id="table-name"
                  placeholder="e.g., Table 1"
                  value={newTable.name}
                  onChange={(e) => setNewTable({...newTable, name: e.target.value})}
                  className="bg-background"
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
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="table-section">Section</Label>
                <Select 
                  value={newTable.section} 
                  onValueChange={(value) => setNewTable({...newTable, section: value})}
                >
                  <SelectTrigger className="bg-background">
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
                  <SelectTrigger className="bg-background">
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
            <Button className="w-full mt-4" onClick={handleAddTable}>
              <Plus className="mr-2 h-4 w-4" />
              Add Table
            </Button>
          </CardContent>
        </Card>
        
        {/* Table Actions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link className="mr-2 h-5 w-5 text-primary" />
              Table Actions
            </CardTitle>
            <CardDescription>Combine or separate tables as needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
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
                <Link2Off className="mr-2 h-4 w-4" />
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
                <div className="flex gap-2 flex-wrap max-h-48 overflow-y-auto p-2 border rounded-md bg-background">
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
                        className="mb-2"
                      >
                        {table.name}
                      </Button>
                    );
                  })}
                  
                  {tableAction === 'combine' && tables.filter(t => t.status === 'available').length === 0 && (
                    <p className="text-sm text-muted-foreground p-2">No available tables to combine</p>
                  )}
                  
                  {tableAction === 'separate' && tables.filter(t => t.combinedWith && t.combinedWith.length > 0).length === 0 && (
                    <p className="text-sm text-muted-foreground p-2">No combined tables to separate</p>
                  )}
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
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Table2 className="mr-2 h-5 w-5 text-primary" />
              Table Overview
            </CardTitle>
            <CardDescription>Summary of your restaurant tables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-md p-4 text-center">
                <p className="text-3xl font-bold">{tables.length}</p>
                <p className="text-sm text-muted-foreground">Total Tables</p>
              </div>
              <div className="bg-muted rounded-md p-4 text-center">
                <p className="text-3xl font-bold">{tables.filter(t => t.status === 'available').length}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
              <div className="bg-muted rounded-md p-4 text-center">
                <p className="text-3xl font-bold">{tables.filter(t => t.status === 'occupied').length}</p>
                <p className="text-sm text-muted-foreground">Occupied</p>
              </div>
              <div className="bg-muted rounded-md p-4 text-center">
                <p className="text-3xl font-bold">{tables.filter(t => t.combinedWith && t.combinedWith.length > 0).length}</p>
                <p className="text-sm text-muted-foreground">Combined</p>
              </div>
            </div>
            <Separator />
            <div className="text-sm text-muted-foreground">
              <p>Sections: {Array.from(new Set(tables.map(t => t.section))).join(', ') || 'None'}</p>
              <p>Total Capacity: {tables.reduce((sum, table) => sum + table.capacity, 0)} guests</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Existing Tables With Tabs for Different Views */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Table2 className="mr-2 h-5 w-5 text-primary" />
            Existing Tables
          </CardTitle>
          <CardDescription className="flex justify-between items-center">
            <span>View and manage all your restaurant tables</span>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="visual" className="flex items-center">
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center">
                  <List className="h-4 w-4 mr-1" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsContent value="visual" className="mt-0">
            {tables.length > 0 ? (
              <TableLayout 
                tables={tables} 
                selectedTable={selectedTables.length === 1 ? selectedTables[0] : null}
                onSelectTable={(tableId) => handleTableSelection(tableId)}
              />
            ) : (
              <div className="w-full p-8 text-center text-muted-foreground border rounded-md">
                No tables available. Add your first table above.
              </div>
            )}
          </TabsContent>
          <TabsContent value="list" className="mt-0">
            <div className="rounded-md border overflow-hidden">
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
                      <TableCell className="font-medium">{table.name}</TableCell>
                      <TableCell>{table.capacity}</TableCell>
                      <TableCell>{table.section}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={`${
                            table.status === 'available' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : table.status === 'occupied'
                              ? 'bg-red-100 text-red-800 hover:bg-red-100'
                              : table.status === 'reserved'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                          }`}
                        >
                          {table.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {table.combinedWith && table.combinedWith.length > 0 ? (
                          <div className="flex gap-1 flex-wrap">
                            {table.combinedWith.map(tableId => {
                              const combinedTable = tables.find(t => t.id === tableId);
                              return combinedTable ? (
                                <Badge key={tableId} variant="secondary" className="text-xs">
                                  {combinedTable.name}
                                </Badge>
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
                          className={table.status === 'occupied' || Boolean(table.currentOrderId) ? 
                            "cursor-not-allowed opacity-50" : "text-red-500 hover:text-red-700 hover:bg-red-50"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tables.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No tables available. Add your first table above.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default TableManagement;
