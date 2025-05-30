
import React, { useState } from 'react';
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Calendar,
  DollarSign,
  Search,
  Filter,
  Eye,
  Ban,
  Power
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Cafe } from '@/data/models';

const SubscriptionManagement: React.FC = () => {
  const { cafes, updateCafe } = useAppContext();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isEnableDialogOpen, setIsEnableDialogOpen] = useState(false);

  // Initialize cafes with subscription data if not present
  const cafesWithSubscription = cafes.map(cafe => ({
    ...cafe,
    subscription: cafe.subscription || {
      isActive: true,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      plan: 'basic' as const,
      lastPaymentDate: new Date().toISOString(),
      amount: 99
    }
  }));

  // Filter cafes
  const filteredCafes = cafesWithSubscription.filter(cafe => {
    const matchesSearch = 
      cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cafe.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cafe.email && cafe.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesStatus = true;
    if (filterStatus === 'active') {
      matchesStatus = cafe.subscription?.isActive === true;
    } else if (filterStatus === 'expired') {
      matchesStatus = cafe.subscription?.isActive === false || 
        new Date(cafe.subscription?.expiryDate || '') < new Date();
    } else if (filterStatus === 'expiring') {
      const expiryDate = new Date(cafe.subscription?.expiryDate || '');
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      matchesStatus = expiryDate <= sevenDaysFromNow && expiryDate > new Date();
    }
    
    return matchesSearch && matchesStatus;
  });

  const getSubscriptionStatus = (cafe: Cafe) => {
    if (!cafe.subscription?.isActive) return 'disabled';
    const expiryDate = new Date(cafe.subscription.expiryDate);
    const now = new Date();
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    if (expiryDate < now) return 'expired';
    if (expiryDate <= sevenDaysFromNow) return 'expiring';
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'disabled':
        return <Badge variant="destructive">Disabled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDisableCafe = () => {
    if (!selectedCafe) return;
    
    const updatedCafe = {
      ...selectedCafe,
      subscription: {
        ...selectedCafe.subscription!,
        isActive: false
      }
    };
    
    updateCafe(updatedCafe);
    toast({
      title: "Cafe Disabled",
      description: `${selectedCafe.name} has been disabled due to non-payment.`,
      variant: "destructive"
    });
    
    setIsDisableDialogOpen(false);
    setSelectedCafe(null);
  };

  const handleEnableCafe = () => {
    if (!selectedCafe) return;
    
    const updatedCafe = {
      ...selectedCafe,
      subscription: {
        ...selectedCafe.subscription!,
        isActive: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastPaymentDate: new Date().toISOString()
      }
    };
    
    updateCafe(updatedCafe);
    toast({
      title: "Cafe Enabled",
      description: `${selectedCafe.name} subscription has been reactivated.`,
    });
    
    setIsEnableDialogOpen(false);
    setSelectedCafe(null);
  };

  const openDetailsDialog = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setIsDetailsDialogOpen(true);
  };

  const openDisableDialog = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setIsDisableDialogOpen(true);
  };

  const openEnableDialog = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setIsEnableDialogOpen(true);
  };

  // Summary stats
  const totalCafes = cafesWithSubscription.length;
  const activeCafes = cafesWithSubscription.filter(c => getSubscriptionStatus(c) === 'active').length;
  const expiredCafes = cafesWithSubscription.filter(c => ['expired', 'disabled'].includes(getSubscriptionStatus(c))).length;
  const expiringCafes = cafesWithSubscription.filter(c => getSubscriptionStatus(c) === 'expiring').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CreditCard className="h-6 w-6 text-destructive" />
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          Subscription Management
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Cafes</CardTitle>
            <CardDescription>All registered cafes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCafes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Subscriptions</CardTitle>
            <CardDescription>Cafes with active payment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeCafes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Expiring Soon</CardTitle>
            <CardDescription>Within 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{expiringCafes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Expired/Disabled</CardTitle>
            <CardDescription>Payment required</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{expiredCafes}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cafe name, address, or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired/Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cafe Subscriptions</CardTitle>
          <CardDescription>Manage cafe subscriptions and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cafe Name</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Last Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCafes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No cafes found matching the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCafes.map((cafe) => {
                    const status = getSubscriptionStatus(cafe);
                    return (
                      <TableRow key={cafe.id}>
                        <TableCell className="font-medium">{cafe.name}</TableCell>
                        <TableCell className="capitalize">
                          {cafe.subscription?.plan || 'Basic'}
                        </TableCell>
                        <TableCell>{getStatusBadge(status)}</TableCell>
                        <TableCell>
                          {new Date(cafe.subscription?.expiryDate || '').toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {cafe.subscription?.lastPaymentDate 
                            ? new Date(cafe.subscription.lastPaymentDate).toLocaleDateString()
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDetailsDialog(cafe)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {cafe.subscription?.isActive ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openDisableDialog(cafe)}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => openEnableDialog(cafe)}
                              >
                                <Power className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Subscription Details - {selectedCafe?.name}</DialogTitle>
            <DialogDescription>
              View detailed subscription information for this cafe
            </DialogDescription>
          </DialogHeader>
          
          {selectedCafe && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(getSubscriptionStatus(selectedCafe))}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Plan</Label>
                  <div className="mt-1 capitalize">{selectedCafe.subscription?.plan || 'Basic'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Expiry Date</Label>
                  <div className="mt-1">
                    {new Date(selectedCafe.subscription?.expiryDate || '').toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Payment</Label>
                  <div className="mt-1">
                    {selectedCafe.subscription?.lastPaymentDate 
                      ? new Date(selectedCafe.subscription.lastPaymentDate).toLocaleDateString()
                      : 'N/A'
                    }
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                  <div className="mt-1">${selectedCafe.subscription?.amount || 0}/month</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Cafe Email</Label>
                  <div className="mt-1">{selectedCafe.email || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Dialog */}
      <AlertDialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Cafe Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disable <strong>{selectedCafe?.name}</strong>?
              <br /><br />
              This will immediately prevent all users in this cafe from accessing the system. 
              They will see a subscription expired message until payment is made.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDisableCafe} className="bg-destructive">
              Disable Cafe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enable Dialog */}
      <AlertDialog open={isEnableDialogOpen} onOpenChange={setIsEnableDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enable Cafe Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reactivate <strong>{selectedCafe?.name}</strong>?
              <br /><br />
              This will restore full access to all users in this cafe and extend their subscription by 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEnableCafe}>
              Enable Cafe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionManagement;
