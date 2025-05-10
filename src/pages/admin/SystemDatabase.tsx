
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
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const SystemDatabase: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Mock database statistics
  const databaseStats = {
    totalSize: '512 MB',
    usedSpace: '342 MB',
    availableSpace: '170 MB',
    usagePercentage: 67,
    tableCount: 24,
    backupStatus: 'Healthy',
    lastBackup: '2025-05-09 03:00 AM',
    performance: 'Optimal',
    avgQueryTime: '23ms',
  };

  // Mock tables information
  const tables = [
    { name: 'users', rows: 1243, size: '42 MB', status: 'healthy' },
    { name: 'orders', rows: 32584, size: '128 MB', status: 'healthy' },
    { name: 'products', rows: 567, size: '24 MB', status: 'healthy' },
    { name: 'inventory', rows: 984, size: '36 MB', status: 'warning' },
    { name: 'transactions', rows: 45210, size: '87 MB', status: 'healthy' },
    { name: 'cafes', rows: 32, size: '8 MB', status: 'healthy' },
    { name: 'reservations', rows: 7843, size: '17 MB', status: 'healthy' },
  ];

  // Mock recent backups
  const backups = [
    { id: '1', date: '2025-05-09 03:00 AM', size: '308 MB', status: 'completed' },
    { id: '2', date: '2025-05-08 03:00 AM', size: '307 MB', status: 'completed' },
    { id: '3', date: '2025-05-07 03:00 AM', size: '305 MB', status: 'completed' },
    { id: '4', date: '2025-05-06 03:00 AM', size: '302 MB', status: 'completed' },
    { id: '5', date: '2025-05-05 03:00 AM', size: '300 MB', status: 'completed' },
  ];

  // Mock recent queries
  const recentQueries = [
    { id: '1', query: 'SELECT * FROM orders WHERE date > ?', duration: '45ms', timestamp: '2025-05-10 14:23:45', user: 'system' },
    { id: '2', query: 'INSERT INTO transactions (order_id, amount) VALUES (?, ?)', duration: '18ms', timestamp: '2025-05-10 14:22:30', user: 'admin@cafenexus.com' },
    { id: '3', query: 'UPDATE inventory SET quantity = ? WHERE product_id = ?', duration: '22ms', timestamp: '2025-05-10 14:20:15', user: 'system' },
    { id: '4', query: 'SELECT AVG(amount) FROM transactions GROUP BY cafe_id', duration: '120ms', timestamp: '2025-05-10 14:15:05', user: 'admin@cafenexus.com' },
    { id: '5', query: 'SELECT COUNT(*) FROM users WHERE role = ?', duration: '14ms', timestamp: '2025-05-10 14:10:22', user: 'system' },
  ];

  const handleRefreshStats = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Database Statistics Refreshed",
        description: "All database statistics have been updated.",
      });
    }, 1500);
  };

  const handleBackupNow = () => {
    toast({
      title: "Backup Started",
      description: "A new database backup has been initiated. This may take several minutes.",
    });
  };

  const handleOptimize = () => {
    toast({
      title: "Optimization Started",
      description: "Database optimization has been initiated. This may take several minutes.",
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
                  <Badge>{databaseStats.backupStatus}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{databaseStats.lastBackup}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-4"
                  onClick={handleBackupNow}
                >
                  Backup Now
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Database Overview</CardTitle>
                  <CardDescription>Current statistics and health</CardDescription>
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
                </AlertDescription>
              </Alert>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Database Size</h4>
                  <p className="text-xl font-bold">{databaseStats.totalSize}</p>
                  <p className="text-xs text-muted-foreground">Total allocated storage</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tables</h4>
                  <p className="text-xl font-bold">{databaseStats.tableCount}</p>
                  <p className="text-xs text-muted-foreground">Total database tables</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Last Optimized</h4>
                  <p className="text-xl font-bold">7 days ago</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs"
                    onClick={handleOptimize}
                  >
                    Optimize Now
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
              <CardDescription>All tables in the system database</CardDescription>
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
                            <Badge className="bg-green-100 text-green-800 border-green-300">Healthy</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Warning</Badge>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <Button variant="ghost" size="sm">
                            <Table className="h-4 w-4 mr-1" />
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
                <Button onClick={handleBackupNow}>
                  <Shield className="h-4 w-4 mr-2" />
                  Create Backup
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
                            {backup.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
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
              <CardDescription>Query performance and system load</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 w-full bg-muted/30 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Performance chart would be displayed here</p>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-6 mb-4">Recent Queries</h3>
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
                        <td className="px-4 py-2 font-mono text-xs">{query.query}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{query.duration}</td>
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
