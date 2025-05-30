
import React from 'react';
import { AlertTriangle, CreditCard, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';

const SubscriptionExpired: React.FC = () => {
  const { currentCafe, logout } = useAppContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-destructive">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive">Subscription Expired</CardTitle>
          <CardDescription>
            Your cafe's subscription has expired and needs renewal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{currentCafe?.name}</h3>
            <p className="text-muted-foreground">
              Your subscription has expired and all features are currently disabled. 
              Please contact your cafe administrator or renew your subscription to continue using the system.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              To restore access:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Contact your cafe manager for payment renewal</li>
              <li>• Ensure all outstanding payments are completed</li>
              <li>• Wait for system reactivation after payment</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Support Contact:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-blue-700 dark:text-blue-300">
                <Mail className="h-4 w-4 mr-2" />
                support@cafeplatform.com
              </div>
              <div className="flex items-center text-blue-700 dark:text-blue-300">
                <Phone className="h-4 w-4 mr-2" />
                +1 (555) 100-2000
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionExpired;
