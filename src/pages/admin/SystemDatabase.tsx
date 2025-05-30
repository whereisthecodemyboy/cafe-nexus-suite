
import React, { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Square,
  Copy
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const SystemDatabase: React.FC = () => {
  const { users, cafes, orders, products, customers } = useAppContext();
  const { toast } = useToast();
  const [selectedTable, setSelectedTable] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQueryDialogOpen, setIsQueryDialogOpen] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any[]>([]);

  const databaseTables = [
    { name: 'users', count: users.length, status: 'healthy' },
    { name: 'cafes', count: cafes.length, status: 'healthy' },
    { name: 'orders', count: orders.length, status: 'healthy' },
    { name: 'products', count: products.length, status: 'healthy' },
    { name: 'customers', count: customers.length, status: 'healthy' },
  ];

  const handleBackup = () => {
    toast({
      title: "Database Backup Started",
      description: "Full database backup has been initiated. You'll receive a notification when complete.",
    });
  };

  const handleRestore = () => {
    toast({
      title: "Database Restore",
      description: "Please select a backup file to restore from.",
    });
  };

  const handleOptimize = () => {
    toast({
      title: "Database Optimization Started",
      description: "Database optimization process is running. This may take a few minutes.",
    });
  };

  const handleRunQuery = () => {
    if (!sqlQuery.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a SQL query to execute.",
        variant: "destructive"
      });
      return;
    }

    // Simulate query execution
    setQueryResult([
      { id: 1, result: 'Query executed successfully' },
      { id: 2, result: `Affected rows: ${Math.floor(Math.random() * 100)}` }
    ]);
    
    toast({
      title: "Query Executed",
      description: "SQL query has been executed successfully.",
    });
  };

  const handleExportTable = (tableName: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${tableName} table data to CSV format.`,
    });
  };

  const getTableData = () => {
    switch (selectedTable) {
      case 'users': return users;
      case 'cafes': return cafes;
      case 'orders': return orders;
      case 'products': return products;
      case 'customers': return customers;
      default: return [];
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Healthy</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredData = getTableData().filter((item: any) => {
    const searchableFields = Object.values(item).join(' ').toLowerCase();
    return searchQuery === '' || searchableFields.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-6 w-6 text-destructive" />
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          System Database
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Tables</CardTitle>
            <CardDescription>Database tables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{databaseTables.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All operational</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Records</CardTitle>
            <CardDescription>Across all tables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {databaseTables.reduce((sum, table) => sum + table.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active records</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Database Size</CardTitle>
            <CardDescription>Estimated size</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24.7 MB</div>
            <p className="text-xs text-muted-foreground mt-1">Within limits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Health Status</CardTitle>
            <CardDescription>Overall system health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-lg font-semibold text-green-600">Healthy</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Database Operations</CardTitle>
            <CardDescription>Manage database backup, restore, and optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Button onClick={handleBackup} className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Create Backup
              </Button>
              <Button onClick={handleRestore} variant="outline" className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                Restore from Backup
              </Button>
              <Button onClick={handleOptimize} variant="outline" className="w-full justify-start">
                <RefreshCw className="mr-2 h-4 w-4" />
                Optimize Database
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Tables</CardTitle>
            <CardDescription>Overview of all database tables and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {databaseTables.map((table) => (
                <div key={table.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{table.name}</p>
                      <p className="text-sm text-muted-foreground">{table.count} records</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(table.status)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportTable(table.name)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Browser</CardTitle>
          <CardDescription>Browse and search database records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select table" />
              </SelectTrigger>
              <SelectContent>
                {databaseTables.map((table) => (
                  <SelectItem key={table.name} value={table.name}>
                    {table.name} ({table.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex relative flex-1">
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Dialog open={isQueryDialogOpen} onOpenChange={setIsQueryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Play className="mr-2 h-4 w-4" />
                  Run Query
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Execute SQL Query</DialogTitle>
                  <DialogDescription>
                    Run custom SQL queries against the database. Use with caution.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="SELECT * FROM users WHERE status = 'active';"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className="min-h-[100px]"
                  />
                  {queryResult.length > 0 && (
                    <div className="border rounded-md p-3 bg-muted">
                      <h4 className="font-medium mb-2">Query Result:</h4>
                      <pre className="text-sm">{JSON.stringify(queryResult, null, 2)}</pre>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsQueryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRunQuery}>
                    Execute Query
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name/Title</TableHead>
                  <TableHead>Type/Status</TableHead>
                  <TableHead>Created/Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No records found in {selectedTable} table
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.slice(0, 10).map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-sm">{record.id}</TableCell>
                      <TableCell className="font-medium">
                        {record.name || record.title || record.orderNumber || record.email || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {record.status || record.role || record.type || 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.createdAt || record.hireDate || record.joinDate || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Record
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
          
          {filteredData.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {Math.min(10, filteredData.length)} of {filteredData.length} records
              </span>
              <span>
                Table: {selectedTable}
                {searchQuery && ` • Filtered by: "${searchQuery}"`}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDatabase;
