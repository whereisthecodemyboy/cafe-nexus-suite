
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginType, setLoginType] = useState('cafe');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, users } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if the credentials match the expected role
      const potentialUser = users.find(user => 
        user.email === email && 
        ((loginType === 'super' && user.role === 'superAdmin') || 
         (loginType === 'cafe' && (user.role === 'admin' || user.role === 'manager'))) &&
        user.status === 'active'
      );
      
      if (!potentialUser) {
        setError('Invalid credentials or insufficient permissions.');
        setLoading(false);
        return;
      }
      
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: loginType === 'super' ? "Super Admin Login Successful" : "Café Admin Login Successful",
          description: "Welcome to the admin panel.",
        });
        
        // Clear the redirection logic here - ensure Super Admin and Cafe Admin go to different routes
        if (potentialUser.role === 'superAdmin') {
          // Super Admin should go to their special dashboard
          navigate('/admin/super/dashboard');
        } else {
          // Cafe Admin/Manager should go to the regular admin dashboard
          navigate('/admin/dashboard');
        }
      } else {
        setError('Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="bg-primary p-3 rounded-full">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-3xl font-serif font-bold tracking-tight text-foreground">
            {loginType === 'super' ? 'Super Admin Access' : 'Café Admin Access'}
          </h1>
          <p className="text-muted-foreground">Restricted Area - Authorized Personnel Only</p>
        </div>
        
        <Card>
          <CardHeader>
            <Tabs defaultValue="cafe" value={loginType} onValueChange={setLoginType} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cafe">Café Admin</TabsTrigger>
                <TabsTrigger value="super">Super Admin</TabsTrigger>
              </TabsList>
            </Tabs>
            <CardDescription className="mt-2">
              {loginType === 'super' 
                ? "Access the central management system for all cafés" 
                : "Access your café's management dashboard"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder={loginType === 'super' ? "admin@cafenexus.com" : "cafe@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {loginType === 'cafe' && (
                <div className="text-sm text-muted-foreground pt-2">
                  Contact the system administrator if you need access to your café's dashboard.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  loginType === 'super' ? 'Access Super Admin Panel' : 'Access Café Admin Panel'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {loginType === 'super' && (
          <div className="mt-4 p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
            <h3 className="font-semibold text-destructive">Super Admin Demo Credentials</h3>
            <p className="text-sm text-muted-foreground">Email: admin@cafenexus.com</p>
            <p className="text-sm text-muted-foreground">Password: admin123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
