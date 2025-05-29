import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image, Lock, User, UserCheck, Pencil, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ModeToggle } from '@/components/layouts/ModeToggle';

const Settings = () => {
  const { toast } = useToast();
  const { currentCafe, updateCafe, taxSettings, updateTaxSettings, users } = useAppContext();
  
  // Cafe information state - now based on current cafe
  const [cafeName, setCafeName] = useState(currentCafe?.name || '');
  const [cafeLogo, setCafeLogo] = useState(currentCafe?.logo || '');
  const [cafeAddress, setCafeAddress] = useState(currentCafe?.address || '');
  const [cafePhone, setCafePhone] = useState(currentCafe?.phone || '');
  const [cafeEmail, setCafeEmail] = useState(currentCafe?.email || '');
  
  // Update state when current cafe changes
  useEffect(() => {
    if (currentCafe) {
      setCafeName(currentCafe.name);
      setCafeLogo(currentCafe.logo || '');
      setCafeAddress(currentCafe.address);
      setCafePhone(currentCafe.phone || '');
      setCafeEmail(currentCafe.email || '');
    }
  }, [currentCafe]);
  
  // Tax settings state
  const [taxRate, setTaxRate] = useState(taxSettings.taxRate);
  const [taxIncluded, setTaxIncluded] = useState(taxSettings.taxIncluded);
  
  // Role permissions state
  const [permissions, setPermissions] = useState({
    admin: {
      all: true,
      settings: true,
      reports: true,
      inventory: true,
      employees: true,
      customers: true,
      financials: true,
    },
    manager: {
      all: false,
      settings: false, 
      reports: true,
      inventory: true,
      employees: true,
      customers: true,
      financials: true,
    },
    cashier: {
      all: false,
      settings: false,
      reports: false,
      inventory: false,
      employees: false,
      customers: true,
      financials: true,
    },
    waiter: {
      all: false,
      settings: false,
      reports: false,
      inventory: false,
      employees: false,
      customers: false,
      financials: false,
    },
    chef: {
      all: false,
      settings: false,
      reports: false,
      inventory: true,
      employees: false,
      customers: false,
      financials: false,
    },
    barista: {
      all: false, 
      settings: false,
      reports: false,
      inventory: true,
      employees: false,
      customers: false,
      financials: false,
    },
  });

  const [receiptMessage, setReceiptMessage] = useState("Thank you for dining with us!");
  const [enabledNotifications, setEnabledNotifications] = useState({
    lowInventory: true,
    newOrders: true,
    customerFeedback: true,
    dailyReport: true,
  });
  
  const handleSaveCafeInfo = () => {
    if (!currentCafe) {
      toast({
        title: "Error",
        description: "No cafe selected. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    const updatedCafe = {
      ...currentCafe,
      name: cafeName,
      logo: cafeLogo,
      address: cafeAddress,
      phone: cafePhone,
      email: cafeEmail,
    };

    updateCafe(updatedCafe);
    
    toast({
      title: "Cafe information updated",
      description: `${cafeName} details have been saved successfully`,
    });
  };
  
  const handleSaveTaxSettings = () => {
    updateTaxSettings({
      taxRate,
      taxIncluded,
    });
    
    toast({
      title: "Tax settings updated",
      description: "Your changes have been saved successfully",
    });
  };
  
  const handleSavePermissions = () => {
    toast({
      title: "Permissions updated",
      description: "The role permissions have been updated successfully",
    });
  };

  const handleSaveReceipt = () => {
    toast({
      title: "Receipt settings updated",
      description: "Your changes have been saved successfully",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved",
    });
  };

  const togglePermission = (role: string, permission: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role as keyof typeof prev],
        [permission]: value,
        all: permission === 'all' ? value : 
          (permission !== 'all' && value === false) ? 
            false : prev[role as keyof typeof prev].all
      }
    }));

    // If 'all' is toggled, update all other permissions
    if (permission === 'all') {
      setPermissions(prev => {
        const updatedRole = {...prev[role as keyof typeof prev]};
        Object.keys(updatedRole).forEach(key => {
          updatedRole[key as keyof typeof updatedRole] = value;
        });
        return {
          ...prev,
          [role]: updatedRole
        };
      });
    }
  };

  if (!currentCafe) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">No cafe selected. Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage {currentCafe.name} settings and preferences</p>
      </div>
      
      <Tabs defaultValue="business">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="business">Cafe Info</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="receipts">Receipts & Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Cafe Information</CardTitle>
              <CardDescription>Update {currentCafe.name} details and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Cafe Name</Label>
                    <Input 
                      id="name"
                      value={cafeName}
                      onChange={(e) => setCafeName(e.target.value)}
                      placeholder="Enter cafe name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address"
                      value={cafeAddress}
                      onChange={(e) => setCafeAddress(e.target.value)}
                      placeholder="Enter cafe address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone"
                        value={cafePhone}
                        onChange={(e) => setCafePhone(e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={cafeEmail}
                        onChange={(e) => setCafeEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="border rounded-md p-4 flex flex-col items-center">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={cafeLogo} alt={cafeName} />
                        <AvatarFallback className="text-2xl">{cafeName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Image className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setCafeLogo('')}>
                          Remove
                        </Button>
                      </div>
                      <Input 
                        className="mt-4"
                        placeholder="Or enter image URL"
                        value={cafeLogo}
                        onChange={(e) => setCafeLogo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveCafeInfo}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>Configure tax rates and calculation methods for {currentCafe.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input 
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the percentage value (e.g., 8.5 for 8.5%)
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="taxIncluded"
                      checked={taxIncluded}
                      onCheckedChange={setTaxIncluded}
                    />
                    <Label htmlFor="taxIncluded">Prices include tax</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, menu prices will be displayed with tax included.
                    Otherwise, tax will be calculated and added at checkout.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveTaxSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Tax Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Theme Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark mode
                    </p>
                  </div>
                  <ModeToggle />
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <Label className="text-base">Font Size</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline">Small</Button>
                    <Button variant="default">Medium</Button>
                    <Button variant="outline">Large</Button>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <Label className="text-base">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full md:w-1/2">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure what each role can access in {currentCafe.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Permission</th>
                      {Object.keys(permissions).map(role => (
                        <th key={role} className="text-center py-2 px-4">
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="text-left py-2 px-4 font-medium">All Permissions</td>
                      {Object.entries(permissions).map(([role, perms]) => (
                        <td key={role} className="text-center py-2 px-4">
                          <Switch 
                            checked={perms.all} 
                            onCheckedChange={(value) => togglePermission(role, 'all', value)}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="text-left py-2 px-4">Settings</td>
                      {Object.entries(permissions).map(([role, perms]) => (
                        <td key={role} className="text-center py-2 px-4">
                          <Switch 
                            checked={perms.settings} 
                            onCheckedChange={(value) => togglePermission(role, 'settings', value)}
                            disabled={perms.all}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="text-left py-2 px-4">Reports</td>
                      {Object.entries(permissions).map(([role, perms]) => (
                        <td key={role} className="text-center py-2 px-4">
                          <Switch 
                            checked={perms.reports} 
                            onCheckedChange={(value) => togglePermission(role, 'reports', value)}
                            disabled={perms.all}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="text-left py-2 px-4">Inventory</td>
                      {Object.entries(permissions).map(([role, perms]) => (
                        <td key={role} className="text-center py-2 px-4">
                          <Switch 
                            checked={perms.inventory} 
                            onCheckedChange={(value) => togglePermission(role, 'inventory', value)}
                            disabled={perms.all}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="text-left py-2 px-4">Employees</td>
                      {Object.entries(permissions).map(([role, perms]) => (
                        <td key={role} className="text-center py-2 px-4">
                          <Switch 
                            checked={perms.employees} 
                            onCheckedChange={(value) => togglePermission(role, 'employees', value)}
                            disabled={perms.all}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="text-left py-2 px-4">Customers</td>
                      {Object.entries(permissions).map(([role, perms]) => (
                        <td key={role} className="text-center py-2 px-4">
                          <Switch 
                            checked={perms.customers} 
                            onCheckedChange={(value) => togglePermission(role, 'customers', value)}
                            disabled={perms.all}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="text-left py-2 px-4">Financials</td>
                      {Object.entries(permissions).map(([role, perms]) => (
                        <td key={role} className="text-center py-2 px-4">
                          <Switch 
                            checked={perms.financials} 
                            onCheckedChange={(value) => togglePermission(role, 'financials', value)}
                            disabled={perms.all}
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={handleSavePermissions}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="receipts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Settings</CardTitle>
                <CardDescription>Configure how receipts are formatted for {currentCafe.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="receiptMessage">Receipt Message</Label>
                  <Textarea 
                    id="receiptMessage"
                    value={receiptMessage}
                    onChange={(e) => setReceiptMessage(e.target.value)}
                    placeholder="Thank you message to be printed on receipts"
                    className="min-h-24"
                  />
                </div>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="showLogo" defaultChecked />
                    <Label htmlFor="showLogo">Show Logo on Receipt</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="emailReceipt" defaultChecked />
                    <Label htmlFor="emailReceipt">Email Receipt Option</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="printOrder" defaultChecked />
                    <Label htmlFor="printOrder">Auto-print Orders</Label>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveReceipt}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Receipt Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure system notifications and alerts for {currentCafe.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lowInventory">Low Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when items are running low</p>
                    </div>
                    <Switch 
                      id="lowInventory" 
                      checked={enabledNotifications.lowInventory}
                      onCheckedChange={(checked) => 
                        setEnabledNotifications({...enabledNotifications, lowInventory: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newOrders">New Order Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new orders come in</p>
                    </div>
                    <Switch 
                      id="newOrders" 
                      checked={enabledNotifications.newOrders}
                      onCheckedChange={(checked) => 
                        setEnabledNotifications({...enabledNotifications, newOrders: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="customerFeedback">Customer Feedback</Label>
                      <p className="text-sm text-muted-foreground">Get notified when customers leave feedback</p>
                    </div>
                    <Switch 
                      id="customerFeedback" 
                      checked={enabledNotifications.customerFeedback}
                      onCheckedChange={(checked) => 
                        setEnabledNotifications({...enabledNotifications, customerFeedback: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dailyReport">Daily Report</Label>
                      <p className="text-sm text-muted-foreground">Receive daily summary reports</p>
                    </div>
                    <Switch 
                      id="dailyReport" 
                      checked={enabledNotifications.dailyReport}
                      onCheckedChange={(checked) => 
                        setEnabledNotifications({...enabledNotifications, dailyReport: checked})
                      }
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveNotifications}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
