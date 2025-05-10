
import React, { useState } from 'react';
import { 
  Globe, 
  Settings, 
  Save, 
  Trash, 
  AlertCircle, 
  CheckCircle,
  DatabaseBackup,
  Zap,
  RefreshCw,
  Languages,
  Mail,
  Lock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const GlobalSettings: React.FC = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const handleSaveSettings = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: "Your changes have been applied successfully.",
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Globe className="h-6 w-6 text-destructive" />
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          Global Settings
        </h1>
      </div>

      <div className="bg-destructive/10 p-4 rounded-md border border-destructive/30">
        <p className="font-semibold text-destructive">System Configuration</p>
        <p className="text-sm text-muted-foreground">
          Configure system-wide settings that affect all cafes and users. Changes made here will be applied globally.
          Exercise caution as these changes may impact system functionality and performance.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings} 
          className="gap-2"
          disabled={saving}
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Basic information about your system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input id="systemName" defaultValue="Cafe Management System" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="version">System Version</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="version" defaultValue="2.5.1" disabled className="bg-muted" />
                    <Badge variant="outline">Current</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select defaultValue="production">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="UTC-5">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="systemDescription">System Description</Label>
                <Textarea 
                  id="systemDescription" 
                  rows={3}
                  defaultValue="Enterprise cafe management system for multi-location coffee shops and restaurants."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="enableBeta" />
                <Label htmlFor="enableBeta">Enable beta features for all cafes</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure language and regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select defaultValue="en-US">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select defaultValue="MM/DD/YYYY">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Date Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
                      <SelectItem value="AUD">Australian Dollar (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select defaultValue="12h">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Time Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="allowCafeOverride" defaultChecked />
                <Label htmlFor="allowCafeOverride">Allow individual cafes to override regional settings</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>System administrator contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input id="adminEmail" type="email" defaultValue="admin@cafesystem.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input id="supportEmail" type="email" defaultValue="support@cafesystem.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input id="supportPhone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportHours">Support Hours</Label>
                  <Input id="supportHours" defaultValue="24/7" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>Configure system-wide password requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minLength">Minimum Password Length</Label>
                  <Select defaultValue="8">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Minimum Length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 characters</SelectItem>
                      <SelectItem value="8">8 characters</SelectItem>
                      <SelectItem value="10">10 characters</SelectItem>
                      <SelectItem value="12">12 characters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiration</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Expiration Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="block mb-2">Password Requirements</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="requireUppercase" defaultChecked />
                    <Label htmlFor="requireUppercase">Require uppercase letters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="requireNumbers" defaultChecked />
                    <Label htmlFor="requireNumbers">Require numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="requireSpecialChars" defaultChecked />
                    <Label htmlFor="requireSpecialChars">Require special characters</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="preventPasswordReuse" defaultChecked />
                <Label htmlFor="preventPasswordReuse">Prevent reuse of previous 5 passwords</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Login Security</CardTitle>
              <CardDescription>Configure login and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Failed Login Attempts</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Maximum Attempts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">Account Lockout Duration</Label>
                  <Select defaultValue="15">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Lockout Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="manual">Until manually unlocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="block mb-2">Two-Factor Authentication</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="twoFactorSuperAdmin" defaultChecked />
                    <Label htmlFor="twoFactorSuperAdmin">Require 2FA for Super Admins</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="twoFactorAdmin" defaultChecked />
                    <Label htmlFor="twoFactorAdmin">Require 2FA for Admins</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="twoFactorManager" />
                    <Label htmlFor="twoFactorManager">Require 2FA for Managers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="twoFactorStaff" />
                    <Label htmlFor="twoFactorStaff">Require 2FA for Staff</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="sessionTimeout" defaultChecked />
                <Label htmlFor="sessionTimeout">Auto-logout after 30 minutes of inactivity</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="border-b">
              <CardTitle>API Security</CardTitle>
              <CardDescription>Manage API access and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sensitive Settings</AlertTitle>
                <AlertDescription>
                  Changing these settings may impact system integrations and third-party access.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="apiThrottling">API Rate Limiting</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Rate Limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (1000 requests/min)</SelectItem>
                    <SelectItem value="medium">Medium (500 requests/min)</SelectItem>
                    <SelectItem value="high">High (100 requests/min)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Limits the number of API requests per minute to prevent abuse.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiTokenExpiry">API Token Expiration</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Token Expiration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="allowExternalAPI" defaultChecked />
                <Label htmlFor="allowExternalAPI">Allow third-party API access</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="enforceHttps" defaultChecked />
                <Label htmlFor="enforceHttps">Enforce HTTPS for all API requests</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure system email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <Input id="senderEmail" defaultValue="notifications@cafesystem.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderName">Sender Name</Label>
                  <Input id="senderName" defaultValue="Cafe Management System" />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input id="smtpServer" defaultValue="smtp.cafesystem.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" defaultValue="587" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpEncryption">Encryption</Label>
                  <Select defaultValue="tls">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="block mb-2">Email Notification Types</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyNewUser" defaultChecked />
                    <Label htmlFor="notifyNewUser">New user registration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyPasswordReset" defaultChecked />
                    <Label htmlFor="notifyPasswordReset">Password reset</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifySystemUpdates" defaultChecked />
                    <Label htmlFor="notifySystemUpdates">System updates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifySecurityAlerts" defaultChecked />
                    <Label htmlFor="notifySecurityAlerts">Security alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyNewCafe" defaultChecked />
                    <Label htmlFor="notifyNewCafe">New cafe creation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyDatabaseBackup" defaultChecked />
                    <Label htmlFor="notifyDatabaseBackup">Database backup status</Label>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="secondary" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Configure internal system alert settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="block mb-2">Admin Dashboard Alerts</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="alertFailedLogin" defaultChecked />
                    <Label htmlFor="alertFailedLogin">Multiple failed login attempts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="alertSystemError" defaultChecked />
                    <Label htmlFor="alertSystemError">System errors</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="alertDatabaseSpace" defaultChecked />
                    <Label htmlFor="alertDatabaseSpace">Low database space</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="alertPendingUpdates" defaultChecked />
                    <Label htmlFor="alertPendingUpdates">Pending system updates</Label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alertRetention">Alert Retention Period</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Retention Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alertPriority">Minimum Alert Priority</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Minimum Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>Configure database maintenance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <DatabaseBackup className="h-4 w-4" />
                <AlertTitle>Last Backup: Today at 3:00 AM</AlertTitle>
                <AlertDescription>
                  Automatic backups are enabled and running on schedule.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupSchedule">Backup Schedule</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Backup Retention</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Retention Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">365 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="encryptBackups" defaultChecked />
                <Label htmlFor="encryptBackups">Encrypt database backups</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="offSiteBackup" defaultChecked />
                <Label htmlFor="offSiteBackup">Enable off-site backup storage</Label>
              </div>
              
              <div className="pt-2 flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2">
                  <DatabaseBackup className="h-4 w-4" />
                  Create Manual Backup
                </Button>
                
                <Button variant="secondary" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Optimize Database
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Updates</CardTitle>
              <CardDescription>Manage system update settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>System is up to date</AlertTitle>
                <AlertDescription>
                  You are running the latest version (2.5.1).
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="updateSchedule">Update Schedule</Label>
                <Select defaultValue="auto">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Update Schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatic (recommended)</SelectItem>
                    <SelectItem value="manual">Manual approval required</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatic updates will be installed during the maintenance window.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maintenanceWindow">Maintenance Window</Label>
                <Select defaultValue="0">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Maintenance Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">12:00 AM - 4:00 AM</SelectItem>
                    <SelectItem value="1">1:00 AM - 5:00 AM</SelectItem>
                    <SelectItem value="2">2:00 AM - 6:00 AM</SelectItem>
                    <SelectItem value="3">3:00 AM - 7:00 AM</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Scheduled maintenance and updates will occur during this time.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="betaUpdates" />
                <Label htmlFor="betaUpdates">Include beta updates</Label>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Check for Updates
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Configure data retention and cleanup policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logRetention">System Log Retention</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Retention Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">365 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="auditLogRetention">Audit Log Retention</Label>
                  <Select defaultValue="365">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Retention Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">365 days</SelectItem>
                      <SelectItem value="730">2 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tempFiles">Temporary File Cleanup</Label>
                  <Select defaultValue="7">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Cleanup Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deletedItems">Deleted Items Retention</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Retention Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="forever">Forever (archive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-2 flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2 text-destructive border-destructive hover:bg-destructive/10">
                  <Trash className="h-4 w-4" />
                  Clear System Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Configure global branding settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="systemLogo">System Logo</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <div className="mx-auto w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                      <Lock className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        Upload Logo
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended size: 512x512px, PNG or SVG format
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="favicon">Favicon</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Lock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        Upload Favicon
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended size: 64x64px, ICO or PNG format
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-destructive border" />
                    <Input id="primaryColor" defaultValue="#E11D48" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary border" />
                    <Input id="secondaryColor" defaultValue="#0369A1" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch id="allowCafeBranding" defaultChecked />
                <Label htmlFor="allowCafeBranding">Allow cafes to customize their own branding</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interface Settings</CardTitle>
              <CardDescription>Configure global user interface settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultTheme">Default Theme</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Default Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="animationSetting">Animation</Label>
                  <Select defaultValue="enabled">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Animation Setting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="reduced">Reduced</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="block mb-2">Interface Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="enableDarkMode" defaultChecked />
                    <Label htmlFor="enableDarkMode">Allow users to switch between light and dark mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="compactMode" />
                    <Label htmlFor="compactMode">Enable compact mode option</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="showHelpTips" defaultChecked />
                    <Label htmlFor="showHelpTips">Show help tips for new users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="accessibilityFeatures" defaultChecked />
                    <Label htmlFor="accessibilityFeatures">Enhanced accessibility features</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>Configure language and localization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availableLanguages">Available Languages</Label>
                  <div className="border rounded-md p-4 max-h-36 overflow-y-auto space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="lang-en" defaultChecked className="rounded" />
                      <label htmlFor="lang-en">English (US)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="lang-es" defaultChecked className="rounded" />
                      <label htmlFor="lang-es">Spanish</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="lang-fr" defaultChecked className="rounded" />
                      <label htmlFor="lang-fr">French</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="lang-de" className="rounded" />
                      <label htmlFor="lang-de">German</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="lang-zh" className="rounded" />
                      <label htmlFor="lang-zh">Chinese (Simplified)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="lang-ja" className="rounded" />
                      <label htmlFor="lang-ja">Japanese</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="lang-pt" className="rounded" />
                      <label htmlFor="lang-pt">Portuguese</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="languagePriority">Language Selection Method</Label>
                  <Select defaultValue="browser">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="browser">Browser Preference</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                      <SelectItem value="user">User Selection</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    How to determine which language to show for new users.
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="gap-2">
                  <Languages className="h-4 w-4" />
                  Manage Translation Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Configure payment processing integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <span className="text-lg font-bold">S</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Stripe</h3>
                      <p className="text-xs text-muted-foreground">Credit card processing</p>
                    </div>
                  </div>
                  <Switch id="enableStripe" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <span className="text-lg font-bold">P</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">PayPal</h3>
                      <p className="text-xs text-muted-foreground">Online payments</p>
                    </div>
                  </div>
                  <Switch id="enablePaypal" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <span className="text-lg font-bold">S</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Square</h3>
                      <p className="text-xs text-muted-foreground">In-person payments</p>
                    </div>
                  </div>
                  <Switch id="enableSquare" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="testMode" defaultChecked />
                <Label htmlFor="testMode">Use test/sandbox mode for all payment gateways</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>External Services</CardTitle>
              <CardDescription>Configure third-party service integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      <span className="text-lg font-bold">G</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Google Maps</h3>
                      <p className="text-xs text-muted-foreground">Location and delivery services</p>
                    </div>
                  </div>
                  <Switch id="enableGoogleMaps" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <span className="text-lg font-bold">T</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Twilio</h3>
                      <p className="text-xs text-muted-foreground">SMS notifications</p>
                    </div>
                  </div>
                  <Switch id="enableTwilio" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                      <span className="text-lg font-bold">S</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Slack</h3>
                      <p className="text-xs text-muted-foreground">Team notifications</p>
                    </div>
                  </div>
                  <Switch id="enableSlack" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Configure API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Single Sign-On</CardTitle>
              <CardDescription>Configure SSO authentication providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <span className="text-lg font-bold">G</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Google</h3>
                      <p className="text-xs text-muted-foreground">Google Workspace accounts</p>
                    </div>
                  </div>
                  <Switch id="enableGoogleSSO" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <span className="text-lg font-bold">M</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Microsoft</h3>
                      <p className="text-xs text-muted-foreground">Microsoft 365 accounts</p>
                    </div>
                  </div>
                  <Switch id="enableMicrosoftSSO" />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                      <span className="text-lg font-bold">A</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Apple</h3>
                      <p className="text-xs text-muted-foreground">Sign in with Apple</p>
                    </div>
                  </div>
                  <Switch id="enableAppleSSO" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="forceSSO" />
                <Label htmlFor="forceSSO">Force SSO for all users (disable password login)</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GlobalSettings;
