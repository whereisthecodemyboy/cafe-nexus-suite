
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ChevronDown, ChevronUp, Users, Clock, Wallet, Package } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ['#8B5CF6', '#D946EF', '#0EA5E9', '#F97316'];

const Analytics = () => {
  const { salesData, hourlyTraffic, popularItems, customers, orders, products, inventoryItems } = useAppContext();
  const [timeRange, setTimeRange] = useState('week');
  const [employeeTimeRange, setEmployeeTimeRange] = useState('week');
  const [inventoryTimeRange, setInventoryTimeRange] = useState('month');
  
  // Calculate some metrics for overview cards
  const totalSales = salesData.reduce((sum, day) => sum + day.total, 0);
  const totalCustomers = customers.length;
  const averageOrderValue = totalSales / orders.length;
  const totalOrders = orders.length;

  // Track week-over-week changes (simulated)
  const salesChange = 12.5; // 12.5% increase from last week
  const customersChange = 8.2; // 8.2% increase from last week
  const orderValueChange = 3.7; // 3.7% increase from last week
  const ordersChange = 6.1; // 6.1% increase from last week

  // Prepare employee performance data
  const employeePerformanceData = [
    { name: 'John', orders: 129, sales: 2340, rating: 4.7 },
    { name: 'Alice', orders: 98, sales: 1980, rating: 4.9 },
    { name: 'Robert', orders: 113, sales: 2150, rating: 4.5 },
    { name: 'Emma', orders: 107, sales: 2050, rating: 4.8 },
    { name: 'Michael', orders: 86, sales: 1720, rating: 4.6 },
  ];

  // Prepare inventory usage data
  const inventoryUsageData = inventoryItems
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      current: item.currentStock,
      minimum: item.minimumStock,
      usage: Math.floor(Math.random() * 50) + 10 // Random usage between 10-60
    }));

  // Customer demographics data (simulated)
  const customerDemographicsData = [
    { name: 'New', value: Math.floor(totalCustomers * 0.25) },
    { name: 'Regular', value: Math.floor(totalCustomers * 0.45) },
    { name: 'Frequent', value: Math.floor(totalCustomers * 0.20) },
    { name: 'VIP', value: Math.floor(totalCustomers * 0.10) },
  ];

  // Format dates for x-axis
  const formattedSalesData = salesData.map(day => ({
    ...day,
    date: format(new Date(day.date), 'MMM d')
  }));

  const formattedTrafficData = hourlyTraffic.map(hour => ({
    ...hour,
    hour: `${hour.hour}:00`
  }));

  // Custom tooltip formatters
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatNumber = (value: number) => value.toLocaleString();
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Insights and performance metrics for your café</p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-primary/20 p-2 rounded-full">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div className={`flex items-center ${salesChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {salesChange >= 0 ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                <span>{Math.abs(salesChange)}%</span>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold">${totalSales.toLocaleString()}</h2>
              <p className="text-muted-foreground">Total Sales</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-purple-500/20 p-2 rounded-full">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div className={`flex items-center ${customersChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {customersChange >= 0 ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                <span>{Math.abs(customersChange)}%</span>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold">{totalCustomers.toLocaleString()}</h2>
              <p className="text-muted-foreground">Total Customers</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <ArrowUpRight className="h-6 w-6 text-blue-500" />
              </div>
              <div className={`flex items-center ${orderValueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {orderValueChange >= 0 ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                <span>{Math.abs(orderValueChange)}%</span>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</h2>
              <p className="text-muted-foreground">Average Order</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-orange-500/20 p-2 rounded-full">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div className={`flex items-center ${ordersChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {ordersChange >= 0 ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                <span>{Math.abs(ordersChange)}%</span>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold">{totalOrders.toLocaleString()}</h2>
              <p className="text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Analytics Tabs */}
      <Tabs defaultValue="sales">
        <TabsList className="grid grid-cols-4 w-full max-w-lg mb-6">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sales Performance</h2>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Over Time */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sales Over Time</CardTitle>
                <CardDescription>Daily sales performance trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formattedSalesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={formatCurrency} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        name="Total Sales" 
                        stroke="#8B5CF6" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        name="Net Profit" 
                        stroke="#10B981" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Top-Selling Items */}
            <Card>
              <CardHeader>
                <CardTitle>Top-Selling Items</CardTitle>
                <CardDescription>Most popular menu items by sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={popularItems}
                      margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={formatNumber} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={formatNumber} />
                      <Legend />
                      <Bar dataKey="sold" name="Units Sold" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Hourly Traffic */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly Traffic</CardTitle>
                <CardDescription>Customer traffic by hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formattedTrafficData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis tickFormatter={formatNumber} />
                      <Tooltip formatter={formatNumber} />
                      <Legend />
                      <Bar dataKey="customers" name="Customers" fill="#D946EF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="employees" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Employee Performance</h2>
            <Select value={employeeTimeRange} onValueChange={setEmployeeTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales By Employee */}
            <Card>
              <CardHeader>
                <CardTitle>Sales By Employee</CardTitle>
                <CardDescription>Total sales per employee</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={employeePerformanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value, name) => [formatCurrency(value as number), name]} />
                      <Legend />
                      <Bar dataKey="sales" name="Total Sales" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Orders By Employee */}
            <Card>
              <CardHeader>
                <CardTitle>Orders By Employee</CardTitle>
                <CardDescription>Number of orders handled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={employeePerformanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={formatNumber} />
                      <Legend />
                      <Bar dataKey="orders" name="Orders Handled" fill="#0EA5E9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Employee Ratings Table */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Employee Performance Rating</CardTitle>
                <CardDescription>Average customer ratings and efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-6">Employee</th>
                        <th className="text-left py-4 px-6">Orders</th>
                        <th className="text-left py-4 px-6">Sales</th>
                        <th className="text-left py-4 px-6">Avg. Rating</th>
                        <th className="text-left py-4 px-6">Efficiency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeePerformanceData.map((employee) => (
                        <tr key={employee.name} className="border-b">
                          <td className="py-4 px-6 font-medium">{employee.name}</td>
                          <td className="py-4 px-6">{employee.orders}</td>
                          <td className="py-4 px-6">${employee.sales}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <span className="mr-2">{employee.rating}</span>
                              <div className="bg-yellow-100 h-2 w-20 rounded-full overflow-hidden">
                                <div 
                                  className="bg-yellow-400 h-full" 
                                  style={{ width: `${(employee.rating / 5) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className={`text-sm px-2 py-1 rounded-full inline-flex items-center
                              ${employee.orders > 100 ? 'bg-green-100 text-green-800' : 
                                employee.orders > 90 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`
                              }
                            >
                              {employee.orders > 100 ? 'Excellent' : 
                               employee.orders > 90 ? 'Good' : 'Average'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-6">
          <h2 className="text-xl font-semibold">Customer Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>Breakdown of customer types</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerDemographicsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerDemographicsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                  {customerDemographicsData.map((item, index) => (
                    <div key={item.name} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                      />
                      <div>
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.value} customers</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Customer Loyalty */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Loyalty</CardTitle>
                <CardDescription>Repeat visits and purchase frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { visits: "1", count: 145 },
                        { visits: "2-3", count: 98 },
                        { visits: "4-6", count: 63 },
                        { visits: "7-10", count: 42 },
                        { visits: "11+", count: 28 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="visits" label={{ value: 'Number of Visits', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Customer Count', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Bar dataKey="count" name="Customers" fill="#0EA5E9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Customer Spending */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Customer Spending Patterns</CardTitle>
                <CardDescription>Average spend by time of day and day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { day: "Monday", morning: 15.50, afternoon: 18.75, evening: 22.40 },
                        { day: "Tuesday", morning: 14.25, afternoon: 17.50, evening: 21.80 },
                        { day: "Wednesday", morning: 16.00, afternoon: 19.25, evening: 23.50 },
                        { day: "Thursday", morning: 16.75, afternoon: 20.50, evening: 24.75 },
                        { day: "Friday", morning: 17.25, afternoon: 22.75, evening: 28.50 },
                        { day: "Saturday", morning: 19.50, afternoon: 24.25, evening: 32.75 },
                        { day: "Sunday", morning: 22.75, afternoon: 26.50, evening: 29.25 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => [`$${value}`, 'Avg. Spend']} />
                      <Legend />
                      <Line type="monotone" dataKey="morning" name="Morning" stroke="#F97316" strokeWidth={2} />
                      <Line type="monotone" dataKey="afternoon" name="Afternoon" stroke="#8B5CF6" strokeWidth={2} />
                      <Line type="monotone" dataKey="evening" name="Evening" stroke="#0EA5E9" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Inventory Analytics</h2>
            <Select value={inventoryTimeRange} onValueChange={setInventoryTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Usage</CardTitle>
                <CardDescription>Units consumed per inventory item</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={inventoryUsageData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="usage" name="Units Used" fill="#0EA5E9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Stock Levels */}
            <Card>
              <CardHeader>
                <CardTitle>Current Stock Levels</CardTitle>
                <CardDescription>Current vs. minimum required stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={inventoryUsageData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="current" name="Current Stock" fill="#8B5CF6" />
                      <Bar dataKey="minimum" name="Minimum Stock" fill="#F97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Low Stock Alerts */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Low Stock Alerts</CardTitle>
                  <CardDescription>Items that need to be restocked soon</CardDescription>
                </div>
                <Button>
                  <Package className="mr-2 h-4 w-4" />
                  Order Supplies
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-6">Item</th>
                        <th className="text-left py-4 px-6">Current Stock</th>
                        <th className="text-left py-4 px-6">Minimum Required</th>
                        <th className="text-left py-4 px-6">Status</th>
                        <th className="text-left py-4 px-6">Last Restock</th>
                        <th className="text-left py-4 px-6">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryItems.slice(0, 5).map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-4 px-6 font-medium">{item.name}</td>
                          <td className="py-4 px-6">{item.currentStock} {item.unit}</td>
                          <td className="py-4 px-6">{item.minimumStock} {item.unit}</td>
                          <td className="py-4 px-6">
                            <div className={`text-sm px-2 py-1 rounded-full inline-flex items-center
                              ${item.currentStock > item.minimumStock * 2 ? 'bg-green-100 text-green-800' : 
                                item.currentStock > item.minimumStock ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`
                              }
                            >
                              {item.currentStock > item.minimumStock * 2 ? 'Good' : 
                               item.currentStock > item.minimumStock ? 'Low' : 'Critical'}
                            </div>
                          </td>
                          <td className="py-4 px-6">{format(new Date(item.lastRestockDate), 'MMM d, yyyy')}</td>
                          <td className="py-4 px-6">
                            <Button variant="outline" size="sm">
                              Order More
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
