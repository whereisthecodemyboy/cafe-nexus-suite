
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Coffee } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Coffee className="h-8 w-8 text-amber-600" />
            <h1 className="text-4xl font-serif font-bold text-gray-900">Cafe Management Platform</h1>
          </div>
          <p className="text-lg text-gray-600">Comprehensive solution for managing your cafe operations</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Admin Access
              </CardTitle>
              <CardDescription>
                Super admin and cafe management access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin-login">
                <Button className="w-full" variant="default">
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-amber-600" />
                Staff Access
              </CardTitle>
              <CardDescription>
                Staff and employee portal access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/login">
                <Button className="w-full" variant="outline">
                  Staff Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Setup
              </CardTitle>
              <CardDescription>
                Create test users for development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/test-users">
                <Button className="w-full" variant="secondary">
                  Create Test Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Access the test user registration to create demo accounts for testing the platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
