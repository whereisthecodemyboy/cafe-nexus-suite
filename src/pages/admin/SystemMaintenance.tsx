
import React, { useState } from 'react';
import { 
  ServerCog, 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  HardDrive,
  Activity,
  Shield,
  FileText,
  Settings,
  Zap,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SystemMaintenance: React.FC = () => {
  const { toast } = useToast();
  const { orders, users, cafes, customers } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMaintenanceRunning, setIsMaintenanceRunning] = useState(false);
  const [maintenanceProgress, setMaintenanceProgress] = useState(0);
  const [lastMaintenance, setLastMaintenance] = useState('2025-05-23 03:00 AM');

  // System health metrics
  const systemHealth = {
    cpu: 23,
    memory: 67,
    disk: 45,
    network: 89,
    database: 91,
    cache: 95
  };

  // Maintenance tasks
  const maintenanceTasks = [
    {
      id: 'db-optimization',
      name: 'Database Optimization',
      description: 'Optimize database queries and rebuild indexes',
      lastRun: '2025-05-23',
      status: 'completed',
      duration: '15 minutes',
      automated: true
    },
    {
      id: 'cache-cleanup',
      name: 'Cache Cleanup',
      description: 'Clear expired cache entries and optimize memory',
      lastRun: '2025-05-29',
      status: 'completed',
      duration: '5 minutes',
      automated: true
    },
    {
      id: 'log-rotation',
      name: 'Log File Rotation',
      description: 'Archive old log files and clean up disk space',
      lastRun: '2025-05-29',
      status: 'completed',
      duration: '3 minutes',
      automated: true
    },
    {
      id: 'backup-verification',
      name: 'Backup Verification',
      description: 'Verify integrity of recent database backups',
      lastRun: '2025-05-28',
      status: 'warning',
      duration: '8 minutes',
      automated: false
    },
    {
      id: 'security-scan',
      name: 'Security Scan',
      description: 'Scan for security vulnerabilities and threats',
      lastRun: '2025-05-25',
      status: 'pending',
      duration: '20 minutes',
      automated: false
    }
  ];

  // System statistics
  const systemStats = {
    uptime: '15 days, 8 hours',
    totalRequests: orders.length * 15 + users.length * 8,
    errorRate: 0.02,
    avgResponseTime: '245ms',
    activeConnections: users.filter(u => u.status === 'active').length,
    totalStorage: '2.4 TB',
    usedStorage: '1.6 TB'
  };

  const handleRunMaintenance = (taskId: string, taskName: string) => {
    setIsMaintenanceRunning(true);
    setMaintenanceProgress(0);
    
    const duration = taskId === 'security-scan' ? 20000 : taskId === 'db-optimization' ? 15000 : 8000;
    const interval = duration / 100;
    
    toast({
      title: "Maintenance Started",
      description: `${taskName} has been initiated. This may take several minutes.`,
    });

    const progressInterval = setInterval(() => {
      setMaintenanceProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsMaintenanceRunning(false);
          setLastMaintenance(new Date().toLocaleString());
          toast({
            title: "Maintenance Completed",
            description: `${taskName} completed successfully.`,
          });
          return 100;
        }
        return prev + 1;
      });
    }, interval);
  };

  const handleSystemRestart = () => {
    toast({
      title: "System Restart Initiated",
      description: "The system will restart in 2 minutes. All users will be notified.",
      variant: "destructive"
    });
  };

  const handleEmergencyShutdown = () => {
    toast({
      title: "Emergency Shutdown Initiated",
      description: "System is shutting down immediately. All active sessions will be terminated.",
      variant: "destructive"
    });
  };

  const handleExportLogs = () => {
    toast({
      title: "Log Export Started",
      description: "System logs are being exported. The file will be available for download shortly.",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "All cache entries have been cleared. System performance may be temporarily affected.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getHealthColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ServerCog className="h-6 w-6 text-destructive" />
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          System Maintenance
        </h1>
      </div>

      <div className="bg-destructive/10 p-4 rounded-md border border-destructive/30">
        <p className="font-semibold text-destructive">System Maintenance Control</p>
        <p className="text-sm text-muted-foreground">
          Monitor system health and perform maintenance tasks. Exercise caution when performing system-wide operations.
        </p>
      </div>

      {isMaintenanceRunning && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertTitle>Maintenance in Progress</AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <Progress value={maintenanceProgress} className="h-2" />
              <p className="text-xs mt-1">Progress: {maintenanceProgress}%</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-destructive" />
                  System Health
                </CardTitle>
                <CardDescription>Overall system performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>CPU</span>
                    <span className={getHealthColor(systemHealth.cpu)}>{systemHealth.cpu}%</span>
                  </div>
                  <Progress value={systemHealth.cpu} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Memory</span>
                    <span className={getHealthColor(systemHealth.memory)}>{systemHealth.memory}%</span>
                  </div>
                  <Progress value={systemHealth.memory} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Disk</span>
                    <span className={getHealthColor(systemHealth.disk)}>{systemHealth.disk}%</span>
                  </div>
                  <Progress value={systemHealth.disk} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-destructive" />
                  Database Status
                </CardTitle>
                <CardDescription>Database performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Performance</span>
                    <span className="text-green-600">{systemHealth.database}%</span>
                  </div>
                  <Progress value={systemHealth.database} className="h-2" />
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Total Records: {(orders.length + users.length + customers.length + cafes.length).toLocaleString()}</p>
                    <p>Avg Query Time: 23ms</p>
                    <p>Active Connections: {systemStats.activeConnections}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <HardDrive className="h-5 w-5 mr-2 text-destructive" />
                  Storage
                </CardTitle>
                <CardDescription>Disk usage and capacity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Used: {systemStats.usedStorage}</span>
                    <span className="text-muted-foreground">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Total Capacity: {systemStats.totalStorage}</p>
                    <p>Available: 800 GB</p>
                    <p>Backup Size: 320 GB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Statistics</CardTitle>
              <CardDescription>Current system performance and usage metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold">Uptime</h4>
                  <p className="text-2xl font-bold text-green-600">{systemStats.uptime}</p>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold">Total Requests</h4>
                  <p className="text-2xl font-bold text-blue-600">{systemStats.totalRequests.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold">Error Rate</h4>
                  <p className="text-2xl font-bold text-green-600">{(systemStats.errorRate * 100).toFixed(2)}%</p>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold">Response Time</h4>
                  <p className="text-2xl font-bold text-purple-600">{systemStats.avgResponseTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance Tasks</CardTitle>
              <CardDescription>Automated and manual maintenance operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{task.name}</h4>
                        {getStatusBadge(task.status)}
                        {task.automated && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Auto
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>Last run: {task.lastRun}</span>
                        <span>Duration: {task.duration}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRunMaintenance(task.id, task.name)}
                        disabled={isMaintenanceRunning}
                      >
                        {isMaintenanceRunning ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            Running...
                          </>
                        ) : (
                          'Run Now'
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common maintenance operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={handleClearCache}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear System Cache
                </Button>
                <Button variant="outline" className="w-full" onClick={handleExportLogs}>
                  <Download className="h-4 w-4 mr-2" />
                  Export System Logs
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Configuration
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Last Maintenance</CardTitle>
                <CardDescription>Most recent maintenance activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Date:</span>
                    <span className="text-sm font-medium">{lastMaintenance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duration:</span>
                    <span className="text-sm font-medium">23 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Successful
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tasks:</span>
                    <span className="text-sm font-medium">5 completed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Network Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Network Load</span>
                    <span className="text-green-600">{systemHealth.network}%</span>
                  </div>
                  <Progress value={systemHealth.network} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Bandwidth: 850 Mbps / 1 Gbps
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Cache Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hit Rate</span>
                    <span className="text-green-600">{systemHealth.cache}%</span>
                  </div>
                  <Progress value={systemHealth.cache} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Cache Size: 2.4 GB / 4 GB
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{systemStats.activeConnections}</div>
                <p className="text-sm text-muted-foreground">Current active users</p>
                <div className="text-xs text-muted-foreground mt-2">
                  Peak today: {systemStats.activeConnections + 15}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Monitoring</CardTitle>
              <CardDescription>Live system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted/30 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Real-time monitoring dashboard</p>
                  <p className="text-xs text-muted-foreground">CPU: {systemHealth.cpu}% | Memory: {systemHealth.memory}% | Disk: {systemHealth.disk}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Emergency Controls</AlertTitle>
            <AlertDescription>
              These controls should only be used in emergency situations. They will affect all users and operations.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">System Restart</CardTitle>
                <CardDescription>
                  Gracefully restart the entire system with a 2-minute warning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restart System
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm System Restart</DialogTitle>
                      <DialogDescription>
                        This will restart the entire platform. All users will be logged out and operations will be temporarily suspended.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={handleSystemRestart}>
                        Confirm Restart
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Emergency Shutdown</CardTitle>
                <CardDescription>
                  Immediately shutdown the system without warning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Emergency Shutdown
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Emergency Shutdown</DialogTitle>
                      <DialogDescription>
                        This will immediately shutdown the system without warning. This should only be used in critical situations.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={handleEmergencyShutdown}>
                        Emergency Shutdown
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>
                Enable maintenance mode to temporarily disable all cafe operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertTitle>Maintenance Mode Status</AlertTitle>
                  <AlertDescription>
                    Maintenance mode is currently disabled. All cafe operations are running normally.
                  </AlertDescription>
                </Alert>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Enable Maintenance Mode
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMaintenance;
