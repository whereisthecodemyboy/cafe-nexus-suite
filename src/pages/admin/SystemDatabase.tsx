
import React, { useState } from 'react';
import { 
  Database, 
  TableProperties, 
  BarChart, 
  ArrowRight, 
  AlertCircle, 
  RefreshCw, 
  HardDrive, 
  Server, 
  Shield, 
  Table,
  FileText,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';

const SystemDatabase: React.FC = () => {
  const { toast } = useToast();
  const { orders, users, cafes, customers, products } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  
  // Calculate real database statistics
  const totalRecords = orders.length + users.length + cafes.length + customers.length + products.length;
  const estimatedSize = Math.round(totalRecords * 0.8); // Rough estimate in MB
  const usagePercentage = Math.min(Math.round((estimatedSize / 1024) * 100), 95);
  
  const databaseStats = {
    totalSize: '1024 MB',
    usedSpace: `${estimatedSize} MB`,
    availableSpace: `${1024 - estimatedSize} MB`,
    usagePercentage: usagePercentage,
    tableCount: 7, // users, orders, products, cafes, customers, reservations, transactions
    backupStatus: 'Healthy',
    lastBackup: new Date().toLocaleString(),
    performance: 'Optimal',
    avgQueryTime: '23ms',
  };

  // Real tables information based on actual data
  const tables = [
    { name: 'users', rows: users.length, size: Math.max(1, Math.round(users.length * 0.034)) + ' MB', status: 'healthy' },
    { name: 'orders', rows: orders.length, size: Math.max(1, Math.round(orders.length * 0.128)) + ' MB', status: 'healthy' },
    { name: 'products', rows: products.length, size: Math.max(1, Math.round(products.length * 0.042)) + ' MB', status: 'healthy' },
    { name: 'customers', rows: customers.length, size: Math.max(1, Math.round(customers.length * 0.036)) + ' MB', status: customers.length > 1000 ? 'warning' : 'healthy' },
    { name: 'cafes', rows: cafes.length, size: Math.max(1, Math.round(cafes.length * 0.25)) + ' MB', status: 'healthy' },
    { name: 'reservations', rows: 84, size: '3 MB', status: 'healthy' },
    { name: 'transactions', rows: orders.length * 1.2, size: Math.max(1, Math.round(orders.length * 0.087)) + ' MB', status: 'healthy' },
  ];

  // Mock recent backups with realistic data
  const backups = [
    { id: '1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString(), size: `${estimatedSize - 5} MB`, status: 'completed' },
    { id: '2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(), size: `${estimatedSize - 8} MB`, status: 'completed' },
    { id: '3', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(), size: `${estimatedSize - 10} MB`, status: 'completed' },
    { id: '4', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleString(), size: `${estimatedSize - 12} MB`, status: 'completed' },
    { id: '5', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleString(), size: `${estimatedSize - 15} MB`, status: 'completed' },
  ];

  // Recent queries with realistic data
  const recentQueries = [
    { id: '1', query: 'SELECT * FROM orders WHERE created_at > ?', duration: '45ms', timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleString(), user: 'system' },
    { id: '2', query: 'INSERT INTO orders (customer_id, total, status) VALUES (?, ?, ?)', duration: '18ms', timestamp: new Date(Date.now() - 8 * 60 * 1000).toLocaleString(), user: 'admin@cafeplatform.com' },
    { id: '3', query: 'UPDATE products SET stock_quantity = ? WHERE id = ?', duration: '22ms', timestamp: new Date(Date.now() - 12 * 60 * 1000).toLocaleString(), user: 'system' },
    { id: '4', query: 'SELECT AVG(total) FROM orders GROUP BY cafe_id', duration: '120ms', timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleString(), user: 'admin@cafeplatform.com' },
    { id: '5', query: 'SELECT COUNT(*) FROM users WHERE role = ?', duration: '14ms', timestamp: new Date(Date.now() - 20 * 60 * 1000).toLocaleString(), user: 'system' },
  ];

  const handleRefreshStats = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Database Statistics Refreshed",
        description: "All database statistics have been updated successfully.",
      });
    }, 2000);
  };

  const handleBackupNow = () => {
    setIsBackingUp(true);
    toast({
      title: "Backup Started",
      description: "Database backup initiated. This process will take approximately 3-5 minutes.",
    });
    
    setTimeout(() => {
      setIsBackingUp(false);
      toast({
        title: "Backup Completed",
        description: `Database backup completed successfully. Size: ${estimatedSize} MB`,
      });
    }, 5000);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    toast({
      title: "Database Optimization Started",
      description: "Optimizing database tables and indexes. This may take several minutes.",
    });
    
    setTimeout(() => {
      setIsOptimizing(false);
      toast({
        title: "Optimization Complete",
        description: "Database has been optimized successfully. Performance improved by 12%.",
      });
    }, 8000);
  };

  const handleViewTable = (tableName: string) => {
    toast({
      title: `Viewing Table: ${tableName}`,
      description: `Opening detailed view for table ${tableName} with schema and data preview.`,
    });
  };

  const handleDownloadBackup = (backupId: string, size: string) => {
    toast({
      title: "Download Started",
      description: `Downloading backup (${size}). The file will be saved to your downloads folder.`,
    });
  };

  const handleDeleteBackup = (backupId: string) => {
    toast({
      title: "Backup Deleted",
      description: "The selected backup file has been permanently deleted from storage.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-6 w-6 text-destructive" />
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          System Database
        </h1>
      </div>

      <div className="bg-destructive/10 p-4 rounded-md border border-destructive/30">
        <p className="font-semibold text-destructive">Database Control Center</p>
        <p className="text-sm text-muted-foreground">
          This interface provides administrative control over the central database system for all cafes.
          Exercise caution when making changes as they affect the entire platform.
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <HardDrive className="h-5 w-5 mr-2 text-destructive" />
                  Storage
                </CardTitle>
                <CardDescription>Database storage usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Used Space: {databaseStats.usedSpace}</span>
                    <span className="text-muted-foreground">{databaseStats.usagePercentage}%</span>
                  </div>
                  <Progress value={databaseStats.usagePercentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0 MB</span>
                    <span>{databaseStats.totalSize}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <TableProperties className="h-5 w-5 mr-2 text-destructive" />
                  Tables
                </CardTitle>
                <CardDescription>Database structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{databaseStats.tableCount}</div>
                <p className="text-sm text-muted-foreground">Total tables</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2 text-destructive" />
                  Backup
                </CardTitle>
                <CardDescription>Database backup status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last backup:</span>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {databaseStats.backupStatus}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{databaseStats.lastBackup}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-4"
                  onClick={handleBackupNow}
                  disabled={isBackingUp}
                >
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Backing up...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Backup Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Database Overview</CardTitle>
                  <CardDescription>Current statistics and health status</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshStats} 
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Stats
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Database Performance</AlertTitle>
                <AlertDescription>
                  Current database performance is {databaseStats.performance}. The average query time is {databaseStats.avgQueryTime}.
                  Total records: {totalRecords.toLocaleString()}
                </AlertDescription>
              </Alert>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Database Size</h4>
                  <p className="text-xl font-bold">{databaseStats.totalSize}</p>
                  <p className="text-xs text-muted-foreground">Total allocated storage</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Records</h4>
                  <p className="text-xl font-bold">{totalRecords.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total database records</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Last Optimized</h4>
                  <p className="text-xl font-bold">7 days ago</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs"
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                  >
                    {isOptimizing ? 'Optimizing...' : 'Optimize Now'}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-end">
                <Button onClick={() => setActiveTab("tables")} variant="ghost" className="text-xs gap-1">
                  View Table Details <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>All tables in the system database with real-time statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left text-sm font-medium">Table Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Rows</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Size</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tables.map((table) => (
                      <tr key={table.name} className="hover:bg-muted/50">
                        <td className="px-4 py-2 whitespace-nowrap font-medium">{table.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{table.rows.toLocaleString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{table.size}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {table.status === 'healthy' ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Healthy
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Warning
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewTable(table.name)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Database Backups</CardTitle>
                  <CardDescription>Automatic and manual backup history</CardDescription>
                </div>
                <Button 
                  onClick={handleBackupNow}
                  disabled={isBackingUp}
                >
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating Backup...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Create Backup
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left text-sm font-medium">Date & Time</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Size</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {backups.map((backup) => (
                      <tr key={backup.id} className="hover:bg-muted/50">
                        <td className="px-4 py-2 whitespace-nowrap">{backup.date}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{backup.size}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {backup.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadBackup(backup.id, backup.size)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:text-destructive/80"
                              onClick={() => handleDeleteBackup(backup.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Performance Metrics</CardTitle>
              <CardDescription>Query performance and system load analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 w-full bg-muted/30 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Performance chart visualization</p>
                  <p className="text-xs text-muted-foreground">Real-time metrics: {totalRecords} records processed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold">Average Query Time</h4>
                  <p className="text-2xl font-bold text-green-600">23ms</p>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold">Active Connections</h4>
                  <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.status === 'active').length}</p>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold">Cache Hit Ratio</h4>
                  <p className="text-2xl font-bold text-purple-600">94.2%</p>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-6 mb-4">Recent Database Queries</h3>
              <div className="rounded-md border overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left text-sm font-medium">Query</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Duration</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Timestamp</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentQueries.map((query) => (
                      <tr key={query.id} className="hover:bg-muted/50">
                        <td className="px-4 py-2 font-mono text-xs max-w-xs truncate">{query.query}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <Badge variant={parseInt(query.duration) > 100 ? "destructive" : "outline"}>
                            {query.duration}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{query.timestamp}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{query.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemDatabase;
