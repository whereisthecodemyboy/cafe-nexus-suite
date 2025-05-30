
import React, { useState } from 'react';
import { 
  ServerCog, 
  Play, 
  Square, 
  RefreshCw, 
  Trash2, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Zap,
  Database,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

const SystemMaintenance: React.FC = () => {
  const { toast } = useToast();
  const [isMaintenanceRunning, setIsMaintenanceRunning] = useState(false);
  const [lastMaintenanceRun, setLastMaintenanceRun] = useState('2024-01-15 03:00:00');

  // System status data
  const systemStatus = {
    cpu: { usage: 35, status: 'healthy' },
    memory: { usage: 68, status: 'warning' },
    disk: { usage: 42, status: 'healthy' },
    database: { status: 'healthy', size: '24.7 MB' },
    uptime: '15 days, 8 hours',
    lastReboot: '2024-01-01 06:00:00'
  };

  // Maintenance tasks
  const maintenanceTasks = [
    {
      id: 'cache_clear',
      name: 'Clear System Cache',
      description: 'Clear all cached data to free up memory',
      icon: <RefreshCw className="h-4 w-4" />,
      status: 'ready',
      lastRun: '2024-01-15 03:00:00',
      duration: '2 minutes'
    },
    {
      id: 'db_optimize',
      name: 'Optimize Database',
      description: 'Optimize database tables and rebuild indexes',
      icon: <Database className="h-4 w-4" />,
      status: 'ready',
      lastRun: '2024-01-14 03:00:00',
      duration: '15 minutes'
    },
    {
      id: 'log_cleanup',
      name: 'Clean System Logs',
      description: 'Remove old log files to free up disk space',
      icon: <Trash2 className="h-4 w-4" />,
      status: 'ready',
      lastRun: '2024-01-13 03:00:00',
      duration: '5 minutes'
    },
    {
      id: 'backup_verify',
      name: 'Verify Backups',
      description: 'Check integrity of recent backup files',
      icon: <Shield className="h-4 w-4" />,
      status: 'ready',
      lastRun: '2024-01-15 03:00:00',
      duration: '10 minutes'
    },
    {
      id: 'security_scan',
      name: 'Security Scan',
      description: 'Run security vulnerability scan',
      icon: <Activity className="h-4 w-4" />,
      status: 'ready',
      lastRun: '2024-01-12 03:00:00',
      duration: '30 minutes'
    }
  ];

  const handleRunTask = (taskId: string, taskName: string) => {
    toast({
      title: "Task Started",
      description: `${taskName} has been initiated and is running in the background.`,
    });
  };

  const handleRunAllMaintenance = () => {
    setIsMaintenanceRunning(true);
    setLastMaintenanceRun(new Date().toLocaleString());
    
    toast({
      title: "Full Maintenance Started",
      description: "All maintenance tasks have been initiated. This may take up to 1 hour to complete.",
    });
    
    // Simulate maintenance completion
    setTimeout(() => {
      setIsMaintenanceRunning(false);
      toast({
        title: "Maintenance Completed",
        description: "All maintenance tasks have been completed successfully.",
      });
    }, 5000);
  };

  const handleEmergencyRestart = () => {
    toast({
      title: "Emergency Restart Initiated",
      description: "System restart has been initiated. All users will be disconnected.",
      variant: "destructive"
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "System cache has been cleared successfully.",
    });
  };

  const handleExportLogs = () => {
    toast({
      title: "Logs Exported",
      description: "System logs have been exported and are ready for download.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Healthy</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Warning</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'running':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Running</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'bg-green-500';
    if (usage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ServerCog className="h-6 w-6 text-destructive" />
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            System Maintenance
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                Emergency Actions
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Emergency System Actions
                </DialogTitle>
                <DialogDescription>
                  These actions should only be used in emergency situations. They may cause service interruption.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Button variant="destructive" className="w-full" onClick={handleEmergencyRestart}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Emergency System Restart
                </Button>
                <Button variant="outline" className="w-full" onClick={handleClearCache}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Force Clear All Cache
                </Button>
              </div>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{systemStatus.cpu.usage}%</span>
              {getStatusBadge(systemStatus.cpu.status)}
            </div>
            <Progress 
              value={systemStatus.cpu.usage} 
              className={`h-2 ${getUsageColor(systemStatus.cpu.usage)}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <MemoryStick className="h-4 w-4" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{systemStatus.memory.usage}%</span>
              {getStatusBadge(systemStatus.memory.status)}
            </div>
            <Progress 
              value={systemStatus.memory.usage} 
              className={`h-2 ${getUsageColor(systemStatus.memory.usage)}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Disk Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">{systemStatus.disk.usage}%</span>
              {getStatusBadge(systemStatus.disk.status)}
            </div>
            <Progress 
              value={systemStatus.disk.usage} 
              className={`h-2 ${getUsageColor(systemStatus.disk.usage)}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              System Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{systemStatus.uptime}</div>
            <p className="text-xs text-muted-foreground">
              Last reboot: {systemStatus.lastReboot}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Status */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Status</CardTitle>
          <CardDescription>
            Current maintenance schedule and last run information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Last Full Maintenance</p>
              <p className="text-sm text-muted-foreground">{lastMaintenanceRun}</p>
            </div>
            <Button 
              onClick={handleRunAllMaintenance}
              disabled={isMaintenanceRunning}
              className="min-w-[200px]"
            >
              {isMaintenanceRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running Maintenance...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Full Maintenance
                </>
              )}
            </Button>
          </div>

          {isMaintenanceRunning && (
            <Alert className="mb-4">
              <Activity className="h-4 w-4" />
              <AlertDescription>
                Maintenance is currently running. Some system features may be temporarily unavailable.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Individual Maintenance Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Tasks</CardTitle>
          <CardDescription>
            Individual maintenance tasks that can be run separately
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-muted rounded-md">
                    {task.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{task.name}</h4>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        Duration: {task.duration}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Last run: {task.lastRun}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(task.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRunTask(task.id, task.name)}
                    disabled={isMaintenanceRunning}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
            <CardDescription>Current database health and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Status</span>
                {getStatusBadge(systemStatus.database.status)}
              </div>
              <div className="flex items-center justify-between">
                <span>Size</span>
                <span className="font-medium">{systemStatus.database.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Optimization</span>
                <span className="text-sm text-muted-foreground">2024-01-14 03:00:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tables</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system maintenance activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cache Cleared</p>
                  <p className="text-xs text-muted-foreground">2024-01-15 03:00:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Database Optimized</p>
                  <p className="text-xs text-muted-foreground">2024-01-14 03:00:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Logs Cleaned</p>
                  <p className="text-xs text-muted-foreground">2024-01-13 03:00:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Security Scan Completed</p>
                  <p className="text-xs text-muted-foreground">2024-01-12 03:00:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemMaintenance;
