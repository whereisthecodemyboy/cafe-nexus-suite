
import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Globe, 
  PenBox, 
  Clock, 
  Paintbrush, 
  Mail, 
  BellRing, 
  Lock,
  Check,
  ListTodo,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Currency options
const currencies = [
  { value: "usd", label: "USD - US Dollar ($)" },
  { value: "eur", label: "EUR - Euro (€)" },
  { value: "gbp", label: "GBP - British Pound (£)" },
  { value: "jpy", label: "JPY - Japanese Yen (¥)" },
  { value: "cad", label: "CAD - Canadian Dollar (C$)" },
  { value: "aud", label: "AUD - Australian Dollar (A$)" },
];

// Timezone options (sample)
const timezones = [
  { value: "UTC-12:00", label: "(GMT-12:00) International Date Line West" },
  { value: "UTC-11:00", label: "(GMT-11:00) Midway Island, Samoa" },
  { value: "UTC-10:00", label: "(GMT-10:00) Hawaii" },
  { value: "UTC-09:00", label: "(GMT-09:00) Alaska" },
  { value: "UTC-08:00", label: "(GMT-08:00) Pacific Time (US & Canada)" },
  { value: "UTC-07:00", label: "(GMT-07:00) Mountain Time (US & Canada)" },
  { value: "UTC-06:00", label: "(GMT-06:00) Central Time (US & Canada)" },
  { value: "UTC-05:00", label: "(GMT-05:00) Eastern Time (US & Canada)" },
  { value: "UTC-04:00", label: "(GMT-04:00) Atlantic Time (Canada)" },
  { value: "UTC-03:00", label: "(GMT-03:00) Brazil, Buenos Aires" },
  { value: "UTC-02:00", label: "(GMT-02:00) Mid-Atlantic" },
  { value: "UTC-01:00", label: "(GMT-01:00) Cape Verde Islands" },
  { value: "UTC+00:00", label: "(GMT+00:00) London, Lisbon, Dublin" },
  { value: "UTC+01:00", label: "(GMT+01:00) Berlin, Paris, Rome, Madrid" },
  { value: "UTC+02:00", label: "(GMT+02:00) Athens, Istanbul, Cairo" },
  { value: "UTC+03:00", label: "(GMT+03:00) Moscow, Baghdad" },
  { value: "UTC+04:00", label: "(GMT+04:00) Dubai, Baku" },
  { value: "UTC+05:00", label: "(GMT+05:00) Islamabad, Karachi" },
  { value: "UTC+05:30", label: "(GMT+05:30) Mumbai, New Delhi" },
  { value: "UTC+06:00", label: "(GMT+06:00) Dhaka" },
  { value: "UTC+07:00", label: "(GMT+07:00) Bangkok, Jakarta" },
  { value: "UTC+08:00", label: "(GMT+08:00) Singapore, Hong Kong" },
  { value: "UTC+09:00", label: "(GMT+09:00) Tokyo, Seoul" },
  { value: "UTC+10:00", label: "(GMT+10:00) Sydney, Melbourne" },
  { value: "UTC+11:00", label: "(GMT+11:00) Solomon Islands" },
  { value: "UTC+12:00", label: "(GMT+12:00) Auckland, Fiji" },
];

const GlobalSettings: React.FC = () => {
  const { toast } = useToast();
  
  // App settings
  const [settings, setSettings] = useState({
    // General
    companyName: "Cafe Nexus International",
    platformName: "Cafe Nexus Management System",
    supportEmail: "support@cafenexus.com",
    
    // Regional
    defaultCurrency: "usd",
    defaultTimezone: "UTC-05:00",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: "sunday",
    
    // Appearance
    defaultTheme: "system",
    accentColor: "#FF5A5F",
    enableDarkMode: true,
    enableLightMode: true,
    
    // Security
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: true,
    mfaEnabled: true,
    sessionTimeout: 30,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    systemAlerts: true,
    marketingEmails: false,
    
    // Features
    enableReservations: true,
    enableDelivery: true,
    enableCustomers: true,
    enableAnalytics: true,
    enableInventory: true
  });
  
  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Global settings have been updated successfully.",
    });
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
        <p className="font-semibold text-destructive">System-Wide Configuration</p>
        <p className="text-sm text-muted-foreground">
          Changes made here will affect all cafes across the platform. 
          These are global defaults that can be overridden at the individual cafe level if needed.
        </p>
      </div>
      
      <Card>
        <Tabs defaultValue="general" className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure global system defaults</CardDescription>
              </div>
              <Button onClick={saveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="regional">Regional</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="space-y-8">
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      value={settings.companyName} 
                      onChange={(e) => handleChange('companyName', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">The legal name of your company</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input 
                      id="platformName" 
                      value={settings.platformName} 
                      onChange={(e) => handleChange('platformName', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Name displayed across the platform</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input 
                    id="supportEmail" 
                    type="email" 
                    value={settings.supportEmail} 
                    onChange={(e) => handleChange('supportEmail', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Global support email address</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Notification Settings</Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Send system notifications via email
                      </div>
                    </div>
                    <Switch 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
                    />
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-2">
                  <Label>System Updates</Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Automatic Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Enable automatic system updates
                      </div>
                    </div>
                    <Switch 
                      checked={true}
                      onCheckedChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="regional" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select 
                    value={settings.defaultCurrency} 
                    onValueChange={(value) => handleChange('defaultCurrency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Default currency for new cafes</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultTimezone">Default Timezone</Label>
                  <Select 
                    value={settings.defaultTimezone} 
                    onValueChange={(value) => handleChange('defaultTimezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a timezone" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {timezones.map((timezone) => (
                        <SelectItem key={timezone.value} value={timezone.value}>
                          {timezone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Default timezone for new cafes</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select 
                    value={settings.dateFormat} 
                    onValueChange={(value) => handleChange('dateFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">How dates are displayed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select 
                    value={settings.timeFormat} 
                    onValueChange={(value) => handleChange('timeFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24 hour</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">How times are displayed</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstDayOfWeek">First Day of Week</Label>
                <Select 
                  value={settings.firstDayOfWeek} 
                  onValueChange={(value) => handleChange('firstDayOfWeek', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select first day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">First day of week in calendars</p>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultTheme">Default Theme</Label>
                <Select 
                  value={settings.defaultTheme} 
                  onValueChange={(value) => handleChange('defaultTheme', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Default theme for new users</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="accentColor" 
                      type="color" 
                      value={settings.accentColor} 
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input 
                      value={settings.accentColor} 
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Primary color used for branding</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">Allow users to use dark mode</p>
                    </div>
                    <Switch 
                      checked={settings.enableDarkMode}
                      onCheckedChange={(checked) => handleChange('enableDarkMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Light Mode</Label>
                      <p className="text-xs text-muted-foreground">Allow users to use light mode</p>
                    </div>
                    <Switch 
                      checked={settings.enableLightMode}
                      onCheckedChange={(checked) => handleChange('enableLightMode', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-2">
                <Label>Password Requirements</Label>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Minimum Length</Label>
                      <Input 
                        id="passwordMinLength" 
                        type="number" 
                        min="6" 
                        max="20" 
                        value={settings.passwordMinLength} 
                        onChange={(e) => handleChange('passwordMinLength', parseInt(e.target.value, 10))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input 
                        id="sessionTimeout" 
                        type="number" 
                        min="5" 
                        value={settings.sessionTimeout} 
                        onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value, 10))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="passwordRequireUppercase" 
                        checked={settings.passwordRequireUppercase}
                        onCheckedChange={(checked) => handleChange('passwordRequireUppercase', checked)}
                      />
                      <Label htmlFor="passwordRequireUppercase">Require uppercase letter</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="passwordRequireNumber" 
                        checked={settings.passwordRequireNumber}
                        onCheckedChange={(checked) => handleChange('passwordRequireNumber', checked)}
                      />
                      <Label htmlFor="passwordRequireNumber">Require number</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="passwordRequireSpecial" 
                        checked={settings.passwordRequireSpecial}
                        onCheckedChange={(checked) => handleChange('passwordRequireSpecial', checked)}
                      />
                      <Label htmlFor="passwordRequireSpecial">Require special character</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Require MFA for Admin Users</div>
                    <div className="text-sm text-muted-foreground">
                      Force multi-factor authentication for all admin users
                    </div>
                  </div>
                  <Switch 
                    checked={settings.mfaEnabled}
                    onCheckedChange={(checked) => handleChange('mfaEnabled', checked)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Reservations
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Enable reservation management
                      </div>
                    </div>
                    <Switch 
                      checked={settings.enableReservations}
                      onCheckedChange={(checked) => handleChange('enableReservations', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium flex items-center">
                        <ListTodo className="h-4 w-4 mr-2" />
                        Delivery
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Enable delivery management
                      </div>
                    </div>
                    <Switch 
                      checked={settings.enableDelivery}
                      onCheckedChange={(checked) => handleChange('enableDelivery', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium flex items-center">
                        <PenBox className="h-4 w-4 mr-2" />
                        Inventory
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Enable inventory management
                      </div>
                    </div>
                    <Switch 
                      checked={settings.enableInventory}
                      onCheckedChange={(checked) => handleChange('enableInventory', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Customers
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Enable customer management
                      </div>
                    </div>
                    <Switch 
                      checked={settings.enableCustomers}
                      onCheckedChange={(checked) => handleChange('enableCustomers', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Analytics
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Enable analytics features
                      </div>
                    </div>
                    <Switch 
                      checked={settings.enableAnalytics}
                      onCheckedChange={(checked) => handleChange('enableAnalytics', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Card className="bg-muted/50 border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Feature Preview</CardTitle>
                  <CardDescription>Try new features before they're released to all users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Advanced Analytics</div>
                        <div className="text-xs text-muted-foreground">
                          Enhanced reporting with AI insights
                        </div>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Customer Loyalty Program</div>
                        <div className="text-xs text-muted-foreground">
                          Manage customer rewards and loyalty points
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </CardContent>
          <CardFooter className="border-t p-6 flex justify-end">
            <Button onClick={saveSettings} className="gap-2">
              <Save className="h-4 w-4" />
              Save All Settings
            </Button>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default GlobalSettings;
