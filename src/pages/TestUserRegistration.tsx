
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Users, UserPlus, CheckCircle } from 'lucide-react';

const TestUserRegistration = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: '',
    cafeId: ''
  });

  const predefinedUsers = [
    { name: 'Super Admin', email: 'superadmin@cafeplatform.com', role: 'superAdmin', cafeId: null },
    { name: 'Downtown Admin', email: 'admin@downtowncafe.com', role: 'admin', cafeId: '123e4567-e89b-12d3-a456-426614174001' },
    { name: 'Downtown Manager', email: 'manager@downtowncafe.com', role: 'manager', cafeId: '123e4567-e89b-12d3-a456-426614174001' },
    { name: 'Downtown Cashier', email: 'cashier@downtowncafe.com', role: 'cashier', cafeId: '123e4567-e89b-12d3-a456-426614174001' },
    { name: 'Downtown Waiter', email: 'waiter@downtowncafe.com', role: 'waiter', cafeId: '123e4567-e89b-12d3-a456-426614174001' },
    { name: 'Uptown Chef', email: 'chef@uptownbistro.com', role: 'chef', cafeId: '123e4567-e89b-12d3-a456-426614174002' },
    { name: 'Uptown Barista', email: 'barista@uptownbistro.com', role: 'barista', cafeId: '123e4567-e89b-12d3-a456-426614174002' }
  ];

  const cafes = [
    { id: '123e4567-e89b-12d3-a456-426614174001', name: 'Downtown Cafe' },
    { id: '123e4567-e89b-12d3-a456-426614174002', name: 'Uptown Bistro' },
    { id: '123e4567-e89b-12d3-a456-426614174003', name: 'VIP Lounge Cafe' }
  ];

  const roles = [
    'superAdmin', 'admin', 'manager', 'cashier', 'waiter', 'chef', 'barista'
  ];

  const createUser = async (userData: typeof formData) => {
    try {
      setLoading(true);

      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: userData.name,
            role: userData.role,
            cafe_id: userData.cafeId
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        toast({
          title: "Signup Error", 
          description: authError.message,
          variant: "destructive"
        });
        return false;
      }

      if (!authData.user) {
        toast({
          title: "Error", 
          description: "Failed to create user",
          variant: "destructive"
        });
        return false;
      }

      // Step 2: Insert user profile data
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as any,
          hire_date: new Date().toISOString().split('T')[0],
          status: 'active',
          cafe_id: userData.cafeId || null
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast({
          title: "Profile Error", 
          description: profileError.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success!", 
        description: `User ${userData.name} created successfully`,
      });
      return true;

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error", 
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Missing Fields", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    await createUser(formData);
  };

  const handleCreatePredefinedUser = async (user: typeof predefinedUsers[0]) => {
    await createUser({
      name: user.name,
      email: user.email,
      password: 'password123',
      role: user.role,
      cafeId: user.cafeId
    });
  };

  const createAllPredefinedUsers = async () => {
    setLoading(true);
    let successCount = 0;
    
    for (const user of predefinedUsers) {
      const success = await createUser({
        name: user.name,
        email: user.email,
        password: 'password123',
        role: user.role,
        cafeId: user.cafeId
      });
      
      if (success) successCount++;
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    toast({
      title: "Batch Creation Complete", 
      description: `Successfully created ${successCount} out of ${predefinedUsers.length} users`,
    });
    
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-serif font-bold">Test User Registration</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Quick Setup
            </CardTitle>
            <CardDescription>
              Create all predefined test users with one click
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={createAllPredefinedUsers} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Creating Users...' : 'Create All Test Users'}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">This will create:</p>
              <ul className="space-y-1 text-xs">
                {predefinedUsers.map((user, index) => (
                  <li key={index}>
                    • {user.name} ({user.email}) - {user.role}
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-medium">Default password: password123</p>
            </div>
          </CardContent>
        </Card>

        {/* Manual Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Manual User Creation
            </CardTitle>
            <CardDescription>
              Create individual users with custom details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            
            <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={formData.cafeId} onValueChange={(value) => setFormData({...formData, cafeId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select Cafe (Optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Cafe (Super Admin)</SelectItem>
                {cafes.map(cafe => (
                  <SelectItem key={cafe.id} value={cafe.id}>
                    {cafe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleCreateUser}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Individual Predefined Users */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Test Users</CardTitle>
          <CardDescription>
            Create specific test users one at a time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {predefinedUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCreatePredefinedUser(user)}
                  disabled={loading}
                >
                  Create
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestUserRegistration;
