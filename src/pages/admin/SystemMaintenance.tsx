
import React, { useState } from 'react';
import { 
  ServerCog, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  Clock, 
  Search, 
  FileText, 
  AlertCircle,
  ShieldAlert,
  Check,
  DownloadCloud,
  XCircle,
  History,
  Repeat
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("updates");

  // Mock system information
  const systemInfo = {
    version: "4.5.2",
    latestVersion: "4.5.3",
    lastUpdated: "2025-04-30",
    updateAvailable: true,
    diskSpace: {
      total: "512 GB",
      used: "187 GB",
      free: "325 GB",
      usagePercent: 36
    },
    memory: {
      total: "16 GB",
      used: "6.4 GB",
      free: "9.6 GB",
      usagePercent: 40
    },
    uptime: "43 days, 12 hours",
    lastMaintenance: "2025-04-15"
  };

  // Mock logs
  const systemLogs = [
    { id: 1, timestamp: "2025-05-10 14:32:45", level: "info", message: "User admin@cafenexus.com logged in", source: "auth" },
    { id: 2, timestamp: "2025-05-10 14:25:12", level: "warning", message: "High memory usage detected (78%)", source: "system" },
    { id: 3, timestamp: "2025-05-10 14:12:33", level: "info", message: "Database backup completed successfully", source: "database" },
    { id: 4, timestamp: "2025-05-10 13:58:01", level: "error", message: "Failed to connect to email server", source: "mail" },
    { id: 5, timestamp: "2025-05-10 13:45:29", level: "info", message: "Cafe 'Downtown Cafe' was updated", source: "admin" },
    { id: 6, timestamp: "2025-05-10 13:32:17", level: "info", message: "Scheduled tasks completed", source: "scheduler" },
    { id: 7, timestamp: "2025-05-10 13:15:45", level: "warning", message: "Slow database query detected (query_id: 24568)", source: "database" },
    { id: 8, timestamp: "2025-05-10 12:59:23", level: "info", message: "System check completed with no errors", source: "system" },
  ];

  // Mock update history
  const updateHistory = [
    { 
      id: 1, 
      version: "4.5.2", 
      date: "2025-04-30", 
      type: "minor", 
      description: "Bug fixes and performance improvements",
      changes: [
        "Fixed issue with reservation calendar display",
        "Improved database query performance for inventory management",
        "Added support for new payment processor integration",
        "Updated security protocols for user authentication",
        "Fixed mobile responsive design issues"
      ]
    },
    { 
      id: 2, 
      version: "4.5.1", 
      date: "2025-04-15", 
      type: "patch", 
      description: "Security patch and minor fixes",
      changes: [
        "Security fixes for user authentication",
        "Fixed issue with report generation",
        "Performance improvements for dashboard analytics"
      ]
    },
    { 
      id: 3, 
      version: "4.5.0", 
      date: "2025-04-01", 
      type: "feature", 
      description: "New features and improvements",
      changes: [
        "Added new analytics dashboard",
        "Introduced customer loyalty features",
        "Improved inventory tracking system",
        "Enhanced reservation management interface",
        "Added API support for third-party integrations"
      ]
    }
  ];

  // Mock scheduled tasks
  const scheduledTasks = [
    { id: 1, name: "Database Backup", schedule: "Daily at 3:00 AM", lastRun: "2025-05-10 03:00 AM", status: "success", nextRun: "2025-05-11 03:00 AM" },
    { id: 2, name: "System Log Rotation", schedule: "Weekly on Sunday", lastRun: "2025-05-05 12:00 AM", status: "success", nextRun: "2025-05-12 12:00 AM" },
    { id: 3, name: "Cache Clearing", schedule: "Daily at 2:00 AM", lastRun: "2025-05-10 02:00 AM", status: "success", nextRun: "2025-05-11 02:00 AM" },
    { id: 4, name: "Email Reports", schedule: "Weekly on Monday", lastRun: "2025-05-06 06:00 AM", status: "failed", nextRun: "2025-05-13 06:00 AM" },
    { id: 5, name: "Analytics Aggregation", schedule: "Daily at 4:00 AM", lastRun: "2025-05-10 04:00 AM", status: "success", nextRun: "2025-05-11 04:00 AM" }
  ];

  const handleSystemCheck = () => {
    setIsChecking(true);
    // Simulate system check
    setTimeout(() => {
      setIsChecking(false);
      toast({
        title: "System Check Complete",
        description: "All systems are functioning properly.",
      });
    }, 2000);
  };

  const handleSystemUpdate = () => {
    setIsUpdating(true);
    setUpdateProgress(0);
    
    // Simulate update process with progress
    const interval = setInterval(() => {
      setUpdateProgress(prevProgress => {
        const nextProgress = prevProgress + 10;
        if (nextProgress >= 100) {
          clearInterval(interval);
          setIsUpdating(false);
          toast({
            title: "Update Complete",
            description: "System has been updated to version 4.5.3",
          });
          return 100;
        }
        return nextProgress;
      });
    }, 500);
  };

  const handlePurgeCache = () => {
    toast({
      title: "Cache Purged",
      description: "System cache has been successfully cleared.",
    });
  };

  const runTask = (taskId: number) => {
    toast({
      title: "Task Started",
      description: `Task #${taskId} has been manually triggered.`,
    });
  };

  const getLogBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Warning</Badge>;
      case 'info':
        return <Badge variant="secondary">Info</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Running</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
        <p className="font-semibold text-destructive">Maintenance Tools</p>
        <p className="text-sm text-muted-foreground">
          This interface provides access to system maintenance and update tools. 
          Use caution when performing maintenance operations as they may affect system availability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ServerCog className="h-5 w-5 mr-2 text-destructive" /> 
              System Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemInfo.version}</div>
            <p className="text-xs text-muted-foreground">
              Last updated: {systemInfo.lastUpdated}
            </p>
            {systemInfo.updateAvailable && (
              <div className="mt-2">
                <Badge>Update Available: {systemInfo.latestVersion}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-destructive" /> 
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemInfo.uptime}</div>
            <p className="text-xs text-muted-foreground">
              Last maintenance: {systemInfo.lastMaintenance}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2 text-destructive" /> 
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{systemInfo.diskSpace.used} used</span>
                <span className="text-muted-foreground">{systemInfo.diskSpace.usagePercent}%</span>
              </div>
              <Progress value={systemInfo.diskSpace.usagePercent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {systemInfo.diskSpace.free} free of {systemInfo.diskSpace.total}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="tasks">Scheduled Tasks</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="updates" className="space-y-4">
          {systemInfo.updateAvailable ? (
            <Alert variant="default" className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertTitle>Update Available</AlertTitle>
              <AlertDescription>
                A new version ({systemInfo.latestVersion}) is available for installation.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="default" className="border-green-300 bg-green-50 dark:bg-green-900/20">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>System Up To Date</AlertTitle>
              <AlertDescription>
                You are running the latest version ({systemInfo.version}) of the system.
              </AlertDescription>
            </Alert>
          )}

          {systemInfo.updateAvailable && (
            <Card>
              <CardHeader>
                <CardTitle>New Update: Version {systemInfo.latestVersion}</CardTitle>
                <CardDescription>
                  Release date: May 5, 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">What's New</h4>
                    <ul className="space-y-1 text-sm list-disc pl-5">
                      <li>Improved performance for reporting dashboard</li>
                      <li>Fixed security vulnerability in user authentication</li>
                      <li>Added support for new payment gateways</li>
                      <li>Enhanced mobile responsiveness across the platform</li>
                      <li>Updated third-party dependencies</li>
                    </ul>
                  </div>
                  
                  {isUpdating && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Installing update...</span>
                        <span>{updateProgress}%</span>
                      </div>
                      <Progress value={updateProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {}}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Release Notes
                </Button>
                <Button 
                  disabled={isUpdating} 
                  onClick={handleSystemUpdate}
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="h-4 w-4 mr-2" />
                      Install Update
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Update History</CardTitle>
              <CardDescription>
                Past system updates and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {updateHistory.map((update) => (
                  <div key={update.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Version {update.version}</h3>
                      <Badge 
                        variant={update.type === 'feature' ? 'default' : (update.type === 'minor' ? 'secondary' : 'outline')}
                      >
                        {update.type === 'feature' ? 'Feature Update' : (update.type === 'minor' ? 'Minor Update' : 'Patch')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Released on {update.date}</p>
                    <p className="text-sm mb-2">{update.description}</p>
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold mb-1">Changes:</h4>
                      <ul className="space-y-1 text-sm list-disc pl-5">
                        {update.changes.map((change, idx) => (
                          <li key={idx}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Scheduled Tasks</CardTitle>
                  <CardDescription>
                    Manage automated system tasks
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left text-sm font-medium">Task Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Schedule</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Last Run</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Next Run</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {scheduledTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-muted/50">
                        <td className="px-4 py-2 whitespace-nowrap font-medium">{task.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{task.schedule}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{task.lastRun}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {getTaskStatusBadge(task.status)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{task.nextRun}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => runTask(task.id)}
                          >
                            <Repeat className="h-4 w-4 mr-1" />
                            Run Now
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
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>
                    View and search system activity logs
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4 border-b bg-muted/50">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search logs..." 
                      className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    />
                  </div>
                </div>
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left text-sm font-medium">Timestamp</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Level</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Source</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {systemLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{log.timestamp}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {getLogBadge(log.level)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{log.source}</td>
                        <td className="px-4 py-2 text-sm">{log.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health Check</CardTitle>
                <CardDescription>
                  Run diagnostics to verify system integrity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-md p-4">
                  <p className="text-sm">
                    Running a system health check will verify all components 
                    of the system are working properly. This includes database 
                    connections, API endpoints, and core services.
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleSystemCheck} 
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Run System Check
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cache Management</CardTitle>
                <CardDescription>
                  Clear system cache to free up resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-md p-4">
                  <p className="text-sm">
                    Clearing the system cache can help resolve performance issues 
                    or data inconsistencies. This operation will temporarily slow 
                    down the system as caches rebuild.
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handlePurgeCache}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Purge Cache
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Advanced Maintenance</CardTitle>
              <CardDescription>
                Specialized system maintenance tools
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium">Database Optimization</h3>
                    <p className="text-sm text-muted-foreground">
                      Optimize database tables and indexes
                    </p>
                  </div>
                  <Button variant="outline">
                    Optimize
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium">Export System Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Export all system data to a backup file
                    </p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium">Import System Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Import data from a previous backup
                    </p>
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium text-destructive">Factory Reset</h3>
                    <p className="text-sm text-muted-foreground">
                      Reset system to default settings (cannot be undone)
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently reset all system data and configurations to factory defaults.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3 text-sm">
                        <p className="font-semibold text-destructive">Warning</p>
                        <p className="mt-1">All data will be permanently deleted, including:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>User accounts and preferences</li>
                          <li>Cafe configurations</li>
                          <li>System settings</li>
                          <li>All operational data</li>
                        </ul>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Proceed with Reset
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
