
import React, { useState } from 'react';
import { 
  Globe, 
  Save, 
  RotateCcw, 
  Shield, 
  Bell, 
  Mail, 
  Database,
  Server,
  Key,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const GlobalSettings: React.FC = () => {
  const { toast } = useToast();
  
  // Platform settings state
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'Cafe Management Platform',
    supportEmail: 'support@cafeplatform.com',
    maxCafesPerAccount: 10,
    enableRegistration: true,
    requireEmailVerification: true,
    enableTwoFactorAuth: false,
    sessionTimeout: 24,
    maintenanceMode: false,
    allowDataExport: true,
    enableAnalytics: true,
  });

  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.platform.com',
    smtpPort: 587,
    smtpUsername: 'noreply@cafeplatform.com',
    smtpPassword: '••••••••••••',
    enableEmailNotifications: true,
    welcomeEmailEnabled: true,
    passwordResetEnabled: true,
    systemAlertsEnabled: true,
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    enableAuditLogs: true,
    enableIpWhitelist: false,
    enableSslOnly: true,
  });

  // API settings state
  const [apiSettings, setApiSettings] = useState({
    rateLimit: 1000,
    enableCors: true,
    apiVersion: 'v1',
    enableWebhooks: true,
    webhookRetries: 3,
    enableRateLimiting: true,
  });

  const handleSavePlatformSettings = () => {
    toast({
      title: "Platform Settings Saved",
      description: "Platform configuration has been updated successfully.",
    });
  };

  const handleSaveEmailSettings = () => {
    toast({
      title: "Email Settings Saved",
      description: "Email configuration has been updated successfully.",
    });
  };

  const handleSaveSecuritySettings = () => {
    toast({
      title: "Security Settings Saved",
      description: "Security configuration has been updated successfully.",
    });
  };

  const handleSaveApiSettings = () => {
    toast({
      title: "API Settings Saved",
      description: "API configuration has been updated successfully.",
    });
  };

  const handleResetToDefaults = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
      variant: "destructive"
    });
  };

  const handleTestEmailConfig = () => {
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to verify configuration.",
    });
  };

  const handleExportSettings = () => {
    toast({
      title: "Settings Exported",
      description: "Platform settings have been exported to configuration file.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="h-6 w-6 text-destructive" />
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            Global Settings
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportSettings}>
            Export Config
          </Button>
          <Button variant="destructive" onClick={handleResetToDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Platform Settings
            </CardTitle>
            <CardDescription>
              Configure global platform settings and behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={platformSettings.platformName}
                  onChange={(e) => setPlatformSettings({...platformSettings, platformName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={platformSettings.supportEmail}
                  onChange={(e) => setPlatformSettings({...platformSettings, supportEmail: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCafes">Max Cafes Per Account</Label>
                <Input
                  id="maxCafes"
                  type="number"
                  value={platformSettings.maxCafesPerAccount}
                  onChange={(e) => setPlatformSettings({...platformSettings, maxCafesPerAccount: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={platformSettings.sessionTimeout}
                  onChange={(e) => setPlatformSettings({...platformSettings, sessionTimeout: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Platform Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableRegistration">Enable New Registrations</Label>
                  <Switch
                    id="enableRegistration"
                    checked={platformSettings.enableRegistration}
                    onCheckedChange={(checked) => setPlatformSettings({...platformSettings, enableRegistration: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  <Switch
                    id="requireEmailVerification"
                    checked={platformSettings.requireEmailVerification}
                    onCheckedChange={(checked) => setPlatformSettings({...platformSettings, requireEmailVerification: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableTwoFactorAuth">Enable 2FA</Label>
                  <Switch
                    id="enableTwoFactorAuth"
                    checked={platformSettings.enableTwoFactorAuth}
                    onCheckedChange={(checked) => setPlatformSettings({...platformSettings, enableTwoFactorAuth: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="maintenanceMode"
                      checked={platformSettings.maintenanceMode}
                      onCheckedChange={(checked) => setPlatformSettings({...platformSettings, maintenanceMode: checked})}
                    />
                    {platformSettings.maintenanceMode && (
                      <Badge variant="destructive">Active</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSavePlatformSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Platform Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>
              Configure SMTP settings and email notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  value={emailSettings.smtpUsername}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Email Notifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableEmailNotifications">Enable Notifications</Label>
                  <Switch
                    id="enableEmailNotifications"
                    checked={emailSettings.enableEmailNotifications}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableEmailNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="welcomeEmailEnabled">Welcome Emails</Label>
                  <Switch
                    id="welcomeEmailEnabled"
                    checked={emailSettings.welcomeEmailEnabled}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, welcomeEmailEnabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="passwordResetEnabled">Password Reset Emails</Label>
                  <Switch
                    id="passwordResetEnabled"
                    checked={emailSettings.passwordResetEnabled}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, passwordResetEnabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="systemAlertsEnabled">System Alert Emails</Label>
                  <Switch
                    id="systemAlertsEnabled"
                    checked={emailSettings.systemAlertsEnabled}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, systemAlertsEnabled: checked})}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleTestEmailConfig}>
                Test Configuration
              </Button>
              <Button onClick={handleSaveEmailSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Email Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Configuration
            </CardTitle>
            <CardDescription>
              Configure security policies and authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">Min Password Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Security Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                  <Switch
                    id="requireSpecialChars"
                    checked={securitySettings.requireSpecialChars}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireSpecialChars: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableAuditLogs">Enable Audit Logs</Label>
                  <Switch
                    id="enableAuditLogs"
                    checked={securitySettings.enableAuditLogs}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableAuditLogs: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableIpWhitelist">Enable IP Whitelist</Label>
                  <Switch
                    id="enableIpWhitelist"
                    checked={securitySettings.enableIpWhitelist}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableIpWhitelist: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableSslOnly">Force SSL Only</Label>
                  <Switch
                    id="enableSslOnly"
                    checked={securitySettings.enableSslOnly}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableSslOnly: checked})}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveSecuritySettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure API settings and rate limiting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rateLimit">Rate Limit (req/hour)</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  value={apiSettings.rateLimit}
                  onChange={(e) => setApiSettings({...apiSettings, rateLimit: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiVersion">API Version</Label>
                <Select value={apiSettings.apiVersion} onValueChange={(value) => setApiSettings({...apiSettings, apiVersion: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">Version 1.0</SelectItem>
                    <SelectItem value="v2">Version 2.0</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhookRetries">Webhook Retries</Label>
                <Input
                  id="webhookRetries"
                  type="number"
                  value={apiSettings.webhookRetries}
                  onChange={(e) => setApiSettings({...apiSettings, webhookRetries: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">API Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableCors">Enable CORS</Label>
                  <Switch
                    id="enableCors"
                    checked={apiSettings.enableCors}
                    onCheckedChange={(checked) => setApiSettings({...apiSettings, enableCors: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableWebhooks">Enable Webhooks</Label>
                  <Switch
                    id="enableWebhooks"
                    checked={apiSettings.enableWebhooks}
                    onCheckedChange={(checked) => setApiSettings({...apiSettings, enableWebhooks: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableRateLimiting">Enable Rate Limiting</Label>
                  <Switch
                    id="enableRateLimiting"
                    checked={apiSettings.enableRateLimiting}
                    onCheckedChange={(checked) => setApiSettings({...apiSettings, enableRateLimiting: checked})}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveApiSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save API Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalSettings;
