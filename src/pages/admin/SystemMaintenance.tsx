
import React, { useState } from 'react';
import { 
  ServerCog, 
  RefreshCw, 
  AlertTriangle, 
  Database, 
  Shield,
  FileCode,
  Terminal,
  Trash2,
  DownloadCloud,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Download,
  Save
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SystemMaintenance: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('tasks');
  const [taskRunning, setTaskRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Simulated task execution
  const runMaintenanceTask = (taskName: string) => {
    if (taskRunning) return;
    
    setTaskRunning(true);
    setProgress(0);
    
    toast({
      title: "Task started",
      description: `${taskName} is now running...`,
    });
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTaskRunning(false);
          toast({
            title: "Task completed",
            description: `${taskName} has been completed successfully.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
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
        <p className="font-semibold text-destructive">System Administration</p>
        <p className="text-sm text-muted-foreground">
          Perform maintenance tasks and monitor system health. 
          Take caution when performing these operations as they can affect system performance.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Maintenance Tasks</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          {taskRunning && (
            <Alert className="mb-6">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertTitle>Maintenance in Progress</AlertTitle>
              <AlertDescription>
                <div className="mt-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-right mt-1">{progress}% Complete</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Maintenance</CardTitle>
                <CardDescription>Optimize and maintain database performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Optimize Tables</h4>
                      <p className="text-xs text-muted-foreground">Reorganize database tables for improved performance</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => runMaintenanceTask("Database Optimization")}
                      disabled={taskRunning}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Repair Tables</h4>
                      <p className="text-xs text-muted-foreground">Check and repair corrupted tables</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runMaintenanceTask("Database Repair")}
                      disabled={taskRunning}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Clear Cache Tables</h4>
                      <p className="text-xs text-muted-foreground">Clear temporary cache data</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runMaintenanceTask("Clear Cache")}
                      disabled={taskRunning}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                </div>
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="text-sm">Attention</AlertTitle>
                  <AlertDescription className="text-xs">
                    Database optimization may temporarily impact system performance.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Cleanup</CardTitle>
                <CardDescription>Remove unnecessary files and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Clear Temporary Files</h4>
                      <p className="text-xs text-muted-foreground">Remove temporary files and uploads</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runMaintenanceTask("Clear Temporary Files")}
                      disabled={taskRunning}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Purge Old Logs</h4>
                      <p className="text-xs text-muted-foreground">Delete logs older than retention policy</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runMaintenanceTask("Log Purge")}
                      disabled={taskRunning}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Clear Session Data</h4>
                      <p className="text-xs text-muted-foreground">Remove expired user sessions</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runMaintenanceTask("Clear Sessions")}
                      disabled={taskRunning}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center bg-muted p-2 rounded-md">
                  <div className="text-xs">
                    <span className="font-medium">Last Cleanup:</span> 3 days ago
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security Maintenance</CardTitle>
                <CardDescription>Security-related maintenance tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Security Scan</h4>
                      <p className="text-xs text-muted-foreground">Scan for potential vulnerabilities</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runMaintenanceTask("Security Scan")}
                      disabled={taskRunning}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Reset Failed Login Attempts</h4>
                      <p className="text-xs text-muted-foreground">Clear account lockouts</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runMaintenanceTask("Reset Login Attempts")}
                      disabled={taskRunning}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Audit Permission Changes</h4>
                      <p className="text-xs text-muted-foreground">Review recent permission changes</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runMaintenanceTask("Permission Audit")}
                      disabled={taskRunning}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                </div>
                <div className="mt-4 bg-green-100 text-green-800 p-2 rounded-md text-xs">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Last security scan: No issues detected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Updates</CardTitle>
                <CardDescription>Manage system update packages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Check for Updates</h4>
                      <p className="text-xs text-muted-foreground">Look for new system updates</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runMaintenanceTask("Update Check")}
                      disabled={taskRunning}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Check
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Install Pending Updates</h4>
                      <p className="text-xs text-muted-foreground">Apply downloaded updates</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={true}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Install
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Update Dependencies</h4>
                      <p className="text-xs text-muted-foreground">Update third-party packages</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runMaintenanceTask("Update Dependencies")}
                      disabled={taskRunning}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                </div>
                <div className="mt-4 bg-blue-100 text-blue-800 p-2 rounded-md text-xs">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>System is up to date (v2.5.1)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>View and manage system log files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <Select defaultValue="error">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Log Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="all">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="system">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Log Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="access">Access</SelectItem>
                      <SelectItem value="application">Application</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
                  <div className="flex justify-between">
                    <span>Recent Log Entries</span>
                    <span className="text-muted-foreground text-xs">Today, 15:42:30</span>
                  </div>
                </div>
                <div className="h-72 overflow-auto bg-black text-green-400 font-mono text-xs p-4">
                  <div className="space-y-1">
                    <p>[15:42:30] [ERROR] Failed login attempt for user admin@example.com from IP 192.168.1.105</p>
                    <p>[15:40:12] [INFO] Database backup completed successfully</p>
                    <p>[15:38:45] [WARNING] High CPU usage detected: 87%</p>
                    <p>[15:37:22] [INFO] User john.smith@example.com logged in from IP 192.168.1.110</p>
                    <p>[15:35:01] [ERROR] Database query timeout: SELECT * FROM orders WHERE date > '2023-01-01'</p>
                    <p>[15:30:59] [INFO] Scheduled maintenance task started: Clear temporary files</p>
                    <p>[15:29:30] [WARNING] Low disk space on /var/log: 85% used</p>
                    <p>[15:25:47] [INFO] New user registered: sarah.johnson@example.com</p>
                    <p>[15:20:15] [ERROR] API rate limit exceeded for endpoint /api/orders</p>
                    <p>[15:18:03] [INFO] System update check completed: System is up to date</p>
                    <p>[15:15:22] [WARNING] Slow database query detected: execution time 3.5s</p>
                    <p>[15:10:45] [INFO] Cache cleared successfully</p>
                    <p>[15:05:33] [ERROR] Failed to connect to payment gateway: Connection timeout</p>
                    <p>[15:01:19] [INFO] User admin@example.com initiated system maintenance</p>
                    <p>[15:00:00] [INFO] Daily log rotation completed</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-2">
                <div className="text-muted-foreground">
                  Showing last 15 entries
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Log Settings</CardTitle>
              <CardDescription>Configure system logging behavior</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Log Level</h4>
                    <p className="text-xs text-muted-foreground">Minimum level of messages to log</p>
                  </div>
                  <Select defaultValue="info">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Log Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="error">Error Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Log Rotation</h4>
                    <p className="text-xs text-muted-foreground">When to create new log files</p>
                  </div>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Rotation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Retention Policy</h4>
                    <p className="text-xs text-muted-foreground">How long to keep log files</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Retention" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="rounded-md border p-4 space-y-2">
                  <h4 className="text-sm font-medium">Log File Location</h4>
                  <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                    /var/log/cafesystem/
                  </div>
                </div>
                
                <div className="rounded-md border p-4 space-y-2">
                  <h4 className="text-sm font-medium">Log Storage</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Used Space:</span>
                      <span>1.2 GB / 5 GB</span>
                    </div>
                    <Progress value={24} className="h-2" />
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  Save Log Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Backups</CardTitle>
              <CardDescription>Manage system database backups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between mb-4">
                <Button variant="outline" className="gap-2" onClick={() => runMaintenanceTask("Database Backup")}>
                  <Database className="h-4 w-4" />
                  Create Backup Now
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <DownloadCloud className="h-4 w-4" />
                    Download Latest
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Backup
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left text-xs font-medium">Backup Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium">Size</th>
                      <th className="px-4 py-2 text-left text-xs font-medium">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium">Status</th>
                      <th className="px-4 py-2 text-right text-xs font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2 text-xs">
                        <div className="font-medium">Today, 03:00 AM</div>
                        <div className="text-muted-foreground text-[10px]">Automatic</div>
                      </td>
                      <td className="px-4 py-2 text-xs">458.2 MB</td>
                      <td className="px-4 py-2 text-xs">Full</td>
                      <td className="px-4 py-2 text-xs">
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Complete
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <DownloadCloud className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-xs">
                        <div className="font-medium">Yesterday, 03:00 AM</div>
                        <div className="text-muted-foreground text-[10px]">Automatic</div>
                      </td>
                      <td className="px-4 py-2 text-xs">452.8 MB</td>
                      <td className="px-4 py-2 text-xs">Full</td>
                      <td className="px-4 py-2 text-xs">
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Complete
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <DownloadCloud className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-xs">
                        <div className="font-medium">2 days ago, 15:42 PM</div>
                        <div className="text-muted-foreground text-[10px]">Manual</div>
                      </td>
                      <td className="px-4 py-2 text-xs">451.5 MB</td>
                      <td className="px-4 py-2 text-xs">Full</td>
                      <td className="px-4 py-2 text-xs">
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Complete
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <DownloadCloud className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-xs">
                        <div className="font-medium">3 days ago, 03:00 AM</div>
                        <div className="text-muted-foreground text-[10px]">Automatic</div>
                      </td>
                      <td className="px-4 py-2 text-xs">448.9 MB</td>
                      <td className="px-4 py-2 text-xs">Full</td>
                      <td className="px-4 py-2 text-xs">
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Complete
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <DownloadCloud className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Backup Settings</CardTitle>
              <CardDescription>Configure automated backup settings</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Backup Schedule</h4>
                    <p className="text-xs text-muted-foreground">How often to create backups</p>
                  </div>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Backup Time</h4>
                    <p className="text-xs text-muted-foreground">When to run daily backups</p>
                  </div>
                  <Select defaultValue="3">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">12:00 AM</SelectItem>
                      <SelectItem value="3">3:00 AM</SelectItem>
                      <SelectItem value="6">6:00 AM</SelectItem>
                      <SelectItem value="12">12:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Retention Period</h4>
                    <p className="text-xs text-muted-foreground">How long to keep backups</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Retention" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="rounded-md border p-4 space-y-2">
                  <h4 className="text-sm font-medium">Backup Storage</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Used Space:</span>
                      <span>4.3 GB / 20 GB</span>
                    </div>
                    <Progress value={21.5} className="h-2" />
                  </div>
                </div>
                
                <div className="rounded-md border p-4 space-y-2">
                  <h4 className="text-sm font-medium">Remote Storage</h4>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs">Connected to AWS S3</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Backups are automatically synced to cloud storage
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  Save Backup Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diagnostics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">CPU Usage</span>
                    <span>32%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                  <p className="text-xs text-muted-foreground">4 cores, 3.5 GHz</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Memory Usage</span>
                    <span>47%</span>
                  </div>
                  <Progress value={47} className="h-2" />
                  <p className="text-xs text-muted-foreground">7.5 GB / 16 GB</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Disk Usage</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  <p className="text-xs text-muted-foreground">325 GB / 500 GB</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted px-4 py-2 font-medium text-sm">System Information</div>
                  <div className="p-4">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="py-2 font-medium">Operating System</td>
                          <td className="py-2 text-right">Ubuntu 22.04.2 LTS</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Web Server</td>
                          <td className="py-2 text-right">Nginx 1.18.0</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Database</td>
                          <td className="py-2 text-right">MySQL 8.0.32</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">PHP Version</td>
                          <td className="py-2 text-right">PHP 8.2.7</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Load Average</td>
                          <td className="py-2 text-right">0.74, 0.62, 0.59</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Uptime</td>
                          <td className="py-2 text-right">43 days, 7 hours</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="border rounded-md overflow-hidden mb-4">
                    <div className="bg-muted px-4 py-2 font-medium text-sm">Active Connections</div>
                    <div className="p-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Database Connections</span>
                          <span>28 / 100</span>
                        </div>
                        <Progress value={28} className="h-1.5" />
                      </div>
                      
                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between text-sm">
                          <span>Active Users</span>
                          <span>47</span>
                        </div>
                        <Progress value={47} className="h-1.5" />
                      </div>
                      
                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between text-sm">
                          <span>API Requests (per min)</span>
                          <span>123 / 1000</span>
                        </div>
                        <Progress value={12.3} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden flex-1">
                    <div className="bg-muted px-4 py-2 font-medium text-sm">System Status</div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Database: Operational</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Web Server: Operational</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Cache Server: Operational</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Queue Service: Operational</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Storage Service: Operational</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" className="gap-2" onClick={() => runMaintenanceTask("System Diagnostics")}>
                  <FileCode className="h-4 w-4" />
                  Run Diagnostics
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <Clock className="h-4 w-4" /> 
                  <span>Auto-refresh: </span> 
                  <span className="text-muted-foreground">Off</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Console</CardTitle>
              <CardDescription>Execute system commands</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-sm">Access Restricted</AlertTitle>
                <AlertDescription className="text-xs">
                  System console commands are restricted to super admin users. All commands are logged.
                </AlertDescription>
              </Alert>
              
              <div className="bg-black text-green-400 font-mono p-4 rounded-md text-sm h-40 overflow-y-auto mb-4">
                <div className="space-y-1">
                  <p>$ system status</p>
                  <p className="text-white">All services operational. System load: 0.74</p>
                  <p>$ check updates</p>
                  <p className="text-white">System is up to date (v2.5.1)</p>
                  <p>$ memory usage</p>
                  <p className="text-white">Memory: 7.5GB/16GB (47%) | Swap: 0.2GB/8GB (2.5%)</p>
                  <p>$ disk space</p>
                  <p className="text-white">Disk: 325GB/500GB (68%) | Available: 175GB</p>
                  <p>$</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-black text-white font-mono p-2 rounded-l-md">
                  $
                </div>
                <input 
                  type="text" 
                  placeholder="Type command..." 
                  className="flex-1 bg-black text-green-400 font-mono p-2 rounded-r-md border-0 focus:outline-none focus:ring-0" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMaintenance;
