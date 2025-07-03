
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Loader2, AlertCircle } from 'lucide-react';
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
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting login with:', email, password);
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the Cafe Management Platform!",
        });
        // Navigate to dashboard - the auth system will handle role-based routing
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Coffee className="w-12 h-12 mx-auto text-primary" />
          <h1 className="mt-4 text-3xl font-serif font-bold tracking-tight text-foreground">
            Cafe Management Platform
          </h1>
          <span className="text-muted-foreground">Multi-Cafe Management System</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-sm text-right">
                <a
                  href="#"
                  className="text-primary hover:text-primary/90"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Reset Password",
                      description: "Please contact your cafe administrator to reset your password.",
                    });
                  }}
                >
                  Forgot password?
                </a>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login to System'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <span>Your login credentials are provided by your administrator.</span>
          <div className="mt-4">
            <a 
              href="/test-users"
              className="text-primary hover:text-primary/90 underline"
            >
              Create Test Users
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
