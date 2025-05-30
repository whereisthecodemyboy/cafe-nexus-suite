
import React, { useState } from 'react';
import { 
  Globe, 
  Save, 
  RotateCcw, 
  Settings, 
  Shield, 
  Mail, 
  CreditCard, 
  Bell,
  Users,
  Database,
  Palette,
  Clock,
  MapPin,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

const GlobalSettings: React.FC = () => {
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // General Settings State
  const [platformName, setPlatformName] = useState('CafeNexus Platform');
  const [supportEmail, setSupportEmail] = useState('support@cafeplatform.com');
  const [defaultTimezone, setDefaultTimezone] = useState('America/New_York');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // Security Settings State
  const [passwordMinLength, setPasswordMinLength] = useState('8');
  const [sessionTimeout, setSessionTimeout] = useState('24');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  
  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Cafe Default Settings State
  const [defaultOperatingHours, setDefaultOperatingHours] = useState('09:00-22:00');
  const [defaultServiceCharge, setDefaultServiceCharge] = useState('10');
  const [defaultTaxRate, setDefaultTaxRate] = useState('8.5');
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(true);
  
  // Payment Settings State
  const [paymentGateway, setPaymentGateway] = useState('stripe');
  const [acceptCash, setAcceptCash] = useState(true);
  const [acceptCards, setAcceptCards] = useState(true);
  const [acceptDigitalWallets, setAcceptDigitalWallets] = useState(true);
  
  const handleSaveSettings = () => {
    setHasUnsavedChanges(false);
    toast({
      title: "Settings Saved Successfully",
      description: "All global platform settings have been updated and applied across all cafes.",
    });
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setPlatformName('CafeNexus Platform');
    setSupportEmail('support@cafeplatform.com');
    setDefaultTimezone('America/New_York');
    setDefaultCurrency('USD');
    setMaintenanceMode(false);
    setPasswordMinLength('8');
    setSessionTimeout('24');
    setTwoFactorRequired(false);
    setMaxLoginAttempts('5');
    setEmailNotifications(true);
    setSmsNotifications(false);
    setPushNotifications(true);
    setMarketingEmails(false);
    setDefaultOperatingHours('09:00-22:00');
    setDefaultServiceCharge('10');
    setDefaultTaxRate('8.5');
    setAutoAcceptOrders(true);
    setPaymentGateway('stripe');
    setAcceptCash(true);
    setAcceptCards(true);
    setAcceptDigitalWallets(true);
    
    setHasUnsavedChanges(false);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their default values.",
    });
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => {
    return (value: any) => {
      setter(value);
      setHasUnsavedChanges(true);
    };
  };

  const handleSwitchChange = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    return (checked: boolean) => {
      setter(checked);
      setHasUnsavedChanges(true);
    };
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
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Unsaved Changes
            </Badge>
          )}
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="bg-destructive/10 p-4 rounded-md border border-destructive/30">
        <p className="font-semibold text-destructive">Platform-Wide Configuration</p>
        <p className="text-sm text-muted-foreground">
          These settings apply to all cafes in the platform. Changes here will affect all existing and new cafe accounts.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="cafe-defaults">Cafe Defaults</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-destructive" />
                General Platform Settings
              </CardTitle>
              <CardDescription>
                Basic configuration for the entire platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={platformName}
                    onChange={(e) => handleInputChange(setPlatformName)(e.target.value)}
                    placeholder="Platform Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => handleInputChange(setSupportEmail)(e.target.value)}
                    placeholder="support@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select value={defaultTimezone} onValueChange={handleInputChange(setDefaultTimezone)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CST)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MST)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={defaultCurrency} onValueChange={handleInputChange(setDefaultCurrency)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Maintenance Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable maintenance mode to temporarily disable all cafe operations
                  </div>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={handleSwitchChange(setMaintenanceMode)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-destructive" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies for all platform users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordLength">Minimum Password Length</Label>
                  <Input
                    id="passwordLength"
                    type="number"
                    min="6"
                    max="32"
                    value={passwordMinLength}
                    onChange={(e) => handleInputChange(setPasswordMinLength)(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="1"
                    max="168"
                    value={sessionTimeout}
                    onChange={(e) => handleInputChange(setSessionTimeout)(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={maxLoginAttempts}
                    onChange={(e) => handleInputChange(setMaxLoginAttempts)(e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Require Two-Factor Authentication</Label>
                  <div className="text-sm text-muted-foreground">
                    Force all admin users to enable 2FA
                  </div>
                </div>
                <Switch
                  checked={twoFactorRequired}
                  onCheckedChange={handleSwitchChange(setTwoFactorRequired)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-destructive" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure default notification preferences for all users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable email notifications for system events
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={handleSwitchChange(setEmailNotifications)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable SMS notifications for urgent alerts
                    </div>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={handleSwitchChange(setSmsNotifications)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable browser push notifications
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={handleSwitchChange(setPushNotifications)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <div className="text-sm text-muted-foreground">
                      Allow marketing and promotional emails
                    </div>
                  </div>
                  <Switch
                    checked={marketingEmails}
                    onCheckedChange={handleSwitchChange(setMarketingEmails)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cafe-defaults" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-destructive" />
                Default Cafe Settings
              </CardTitle>
              <CardDescription>
                Default settings applied to new cafes when they join the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="operatingHours">Default Operating Hours</Label>
                  <Input
                    id="operatingHours"
                    value={defaultOperatingHours}
                    onChange={(e) => handleInputChange(setDefaultOperatingHours)(e.target.value)}
                    placeholder="09:00-22:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceCharge">Default Service Charge (%)</Label>
                  <Input
                    id="serviceCharge"
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    value={defaultServiceCharge}
                    onChange={(e) => handleInputChange(setDefaultServiceCharge)(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="30"
                    step="0.1"
                    value={defaultTaxRate}
                    onChange={(e) => handleInputChange(setDefaultTaxRate)(e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Accept Orders</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically accept incoming orders for new cafes
                  </div>
                </div>
                <Switch
                  checked={autoAcceptOrders}
                  onCheckedChange={handleSwitchChange(setAutoAcceptOrders)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-destructive" />
                Payment Settings
              </CardTitle>
              <CardDescription>
                Configure payment processing and accepted payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="paymentGateway">Primary Payment Gateway</Label>
                <Select value={paymentGateway} onValueChange={handleInputChange(setPaymentGateway)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="authorize">Authorize.Net</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Accepted Payment Methods</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cash Payments</Label>
                    <div className="text-sm text-muted-foreground">
                      Allow cash payments for in-store orders
                    </div>
                  </div>
                  <Switch
                    checked={acceptCash}
                    onCheckedChange={handleSwitchChange(setAcceptCash)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Credit/Debit Cards</Label>
                    <div className="text-sm text-muted-foreground">
                      Accept card payments (Visa, MasterCard, etc.)
                    </div>
                  </div>
                  <Switch
                    checked={acceptCards}
                    onCheckedChange={handleSwitchChange(setAcceptCards)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Digital Wallets</Label>
                    <div className="text-sm text-muted-foreground">
                      Accept Apple Pay, Google Pay, Samsung Pay
                    </div>
                  </div>
                  <Switch
                    checked={acceptDigitalWallets}
                    onCheckedChange={handleSwitchChange(setAcceptDigitalWallets)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GlobalSettings;
