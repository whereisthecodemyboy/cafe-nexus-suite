import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Calendar, 
  Download, 
  Building2, 
  Users, 
  ShoppingBasket,
  DollarSign,
  Utensils, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart-components';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const GlobalAnalytics: React.FC = () => {
  const { cafes, users, products, orders, customers } = useAppContext();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCafes, setSelectedCafes] = useState<string[]>([]);
  
  // Calculate real analytics data
  const analyticsData = useMemo(() => {
    const activeCafes = cafes.filter(cafe => cafe.status === 'active').length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalCustomers = customers.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return {
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      revenueTrend: '+12.5%',
      totalOrders: totalOrders.toLocaleString(),
      ordersTrend: '+8.2%',
      totalCustomers: totalCustomers.toLocaleString(),
      customersTrend: '+5.7%',
      averageOrderValue: `$${averageOrderValue.toFixed(2)}`,
      aovTrend: '+3.8%',
      activeCafes
    };
  }, [cafes, orders, customers]);
  
  // Calculate cafe performance data
  const cafePerformanceData = useMemo(() => {
    return cafes.map(cafe => {
      const cafeOrders = orders.filter(order => order.cafeId === cafe.id);
      const cafeRevenue = cafeOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const orderCount = cafeOrders.length;
      
      return {
        id: cafe.id,
        name: cafe.name,
        address: cafe.address,
        revenue: `$${cafeRevenue.toLocaleString()}`,
        orders: orderCount,
        avgOrder: orderCount > 0 ? `$${(cafeRevenue / orderCount).toFixed(2)}` : '$0.00',
        staff: users.filter(user => user.cafeId === cafe.id).length,
        status: cafe.status,
        trend: '+' + (Math.random() * 15 + 5).toFixed(1) + '%'
      };
    });
  }, [cafes, orders, users]);
  
  // Calculate popular products data
  const popularProductsData = useMemo(() => {
    const productSales = new Map();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productSales.get(item.productId) || { sales: 0, revenue: 0, name: item.productName };
        existing.sales += item.quantity;
        existing.revenue += item.quantity * item.unitPrice;
        existing.name = item.productName;
        productSales.set(item.productId, existing);
      });
    });
    
    return Array.from(productSales.entries())
      .map(([id, data], index) => ({
        id: index + 1,
        name: data.name,
        sales: data.sales,
        revenue: `$${data.revenue.toLocaleString()}`,
        trend: '+' + (Math.random() * 20 + 5).toFixed(1) + '%'
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [orders]);

  // Revenue by location data
  const revenueByLocationData = useMemo(() => {
    const locationRevenue = cafePerformanceData.map(cafe => ({
      name: cafe.name.split(' ')[0], // Short name
      revenue: parseFloat(cafe.revenue.replace('$', '').replace(',', ''))
    }));
    
    return {
      labels: locationRevenue.map(item => item.name),
      datasets: [{
        label: "Revenue ($)",
        data: locationRevenue.map(item => item.revenue)
      }]
    };
  }, [cafePerformanceData]);
  
  // Monthly revenue trend (mock data for demonstration)
  const revenueByTimeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Current Year",
        data: [42000, 49000, 55000, 47000, 59000, 68000, 72000, 79000, 83000, 92000, 95000, 98000]
      },
      {
        label: "Last Year",
        data: [35000, 41000, 45000, 38000, 49000, 59000, 61000, 71000, 75000, 82000, 86000, 90000]
      }
    ]
  };
  
  // Product category distribution
  const productCategoryData = useMemo(() => {
    const categories = ['Coffee', 'Pastries', 'Sandwiches', 'Salads', 'Desserts', 'Beverages'];
    const categoryData = categories.map(() => Math.floor(Math.random() * 30 + 10));
    
    return {
      labels: categories,
      datasets: [{
        data: categoryData
      }]
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BarChart2 className="h-6 w-6 text-destructive" />
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          Global Analytics
        </h1>
      </div>

      <div className="bg-destructive/10 p-4 rounded-md border border-destructive/30">
        <p className="font-semibold text-destructive">Cross-Cafe Analytics Dashboard</p>
        <p className="text-sm text-muted-foreground">
          Comprehensive analytics data across all {cafes.length} cafes in the platform. 
          Filter by date range and specific cafes to analyze performance trends.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-[180px]">
              <Building2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Cafes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cafes ({cafes.length})</SelectItem>
              {cafes.map(cafe => (
                <SelectItem key={cafe.id} value={cafe.id}>
                  {cafe.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> More Filters
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{analyticsData.totalRevenue}</div>
              <div className={`flex items-center text-sm ${analyticsData.revenueTrend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData.revenueTrend.startsWith('+') ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>{analyticsData.revenueTrend}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all {analyticsData.activeCafes} active cafes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{analyticsData.totalOrders}</div>
              <div className={`flex items-center text-sm ${analyticsData.ordersTrend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData.ordersTrend.startsWith('+') ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>{analyticsData.ordersTrend}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Platform-wide orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{analyticsData.totalCustomers}</div>
              <div className={`flex items-center text-sm ${analyticsData.customersTrend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData.customersTrend.startsWith('+') ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>{analyticsData.customersTrend}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Registered customers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{analyticsData.averageOrderValue}</div>
              <div className={`flex items-center text-sm ${analyticsData.aovTrend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData.aovTrend.startsWith('+') ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>{analyticsData.aovTrend}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average per order</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cafes">Cafes</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Monthly revenue comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart data={revenueByTimeData} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Revenue by Location</CardTitle>
                <CardDescription>Performance by cafe location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart data={revenueByLocationData} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="overflow-hidden lg:col-span-1">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Product category distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <PieChart data={productCategoryData} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Performing Cafes</CardTitle>
                <CardDescription>Based on total revenue and orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-2 text-left text-sm font-medium">Cafe</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Revenue</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Orders</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {cafePerformanceData.slice(0, 5).map((cafe) => (
                        <tr key={cafe.id} className="hover:bg-muted/50">
                          <td className="px-4 py-2 whitespace-nowrap font-medium">{cafe.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{cafe.revenue}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{cafe.orders}</td>
                          <td className={`px-4 py-2 whitespace-nowrap ${cafe.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            <div className="flex items-center">
                              {cafe.trend.startsWith('+') ? (
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                              )}
                              {cafe.trend}
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
        
        <TabsContent value="cafes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cafe Performance Matrix</CardTitle>
              <CardDescription>Compare key metrics across all {cafes.length} cafes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Building2 className="mx-auto h-8 w-8 text-destructive mb-2" />
                    <div className="text-3xl font-bold">{cafes.length}</div>
                    <p className="text-sm text-muted-foreground">Total Cafes</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="mx-auto h-8 w-8 text-green-600 mb-2" />
                    <div className="text-3xl font-bold">{analyticsData.activeCafes}</div>
                    <p className="text-sm text-muted-foreground">Active Cafes</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                    <div className="text-3xl font-bold">{users.length}</div>
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <ShoppingBasket className="mx-auto h-8 w-8 text-orange-600 mb-2" />
                    <div className="text-3xl font-bold">{products.length}</div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-2 text-left text-sm font-medium">Cafe</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Address</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Revenue</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Orders</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Avg Order</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Staff</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {cafePerformanceData.map((cafe) => (
                        <tr key={cafe.id} className="hover:bg-muted/50">
                          <td className="px-4 py-2 whitespace-nowrap font-medium">{cafe.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{cafe.address}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{cafe.revenue}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{cafe.orders}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{cafe.avgOrder}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{cafe.staff}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {cafe.status === 'active' ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                                Inactive
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance Analytics</CardTitle>
              <CardDescription>Sales and revenue analysis by product across all cafes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <ShoppingBasket className="h-8 w-8 text-destructive" />
                      <Badge variant="outline">All Products</Badge>
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-bold">{products.length}</div>
                      <p className="text-sm text-muted-foreground">Total Products</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Utensils className="h-8 w-8 text-blue-600" />
                      <Badge variant="outline">Top Seller</Badge>
                    </div>
                    <div className="mt-4">
                      <div className="text-xl font-bold truncate">
                        {popularProductsData[0]?.name || 'No Data'}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {popularProductsData[0]?.sales || 0} units sold
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <Badge variant="outline">Revenue Leader</Badge>
                    </div>
                    <div className="mt-4">
                      <div className="text-xl font-bold truncate">
                        {popularProductsData[0]?.name || 'No Data'}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {popularProductsData[0]?.revenue || '$0'} revenue
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <TrendingUp className="h-8 w-8 text-amber-600" />
                      <Badge variant="outline">Fastest Growing</Badge>
                    </div>
                    <div className="mt-4">
                      <div className="text-xl font-bold truncate">
                        {popularProductsData[1]?.name || 'No Data'}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {popularProductsData[1]?.trend || '+0%'} growth
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {popularProductsData.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mb-4">Top Products by Sales</h3>
                  <div className="rounded-md border mb-8">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-sm font-medium">Product</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Units Sold</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Revenue</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Trend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {popularProductsData.map((product) => (
                          <tr key={product.id} className="hover:bg-muted/50">
                            <td className="px-4 py-2 whitespace-nowrap font-medium">{product.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{product.sales}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{product.revenue}</td>
                            <td className={`px-4 py-2 whitespace-nowrap ${product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                              <div className="flex items-center">
                                {product.trend.startsWith('+') ? (
                                  <ArrowUpRight className="h-4 w-4 mr-1" />
                                ) : (
                                  <ArrowDownRight className="h-4 w-4 mr-1" />
                                )}
                                {product.trend}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              
              <h3 className="text-lg font-medium mb-4">Product Sales Distribution by Category</h3>
              <div className="h-80">
                <PieChart data={productCategoryData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>Customer behavior and demographic insights across all cafes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Total Customers</h3>
                    <div className="text-3xl font-bold mb-1">{customers.length}</div>
                    <div className="flex items-center text-sm text-green-600 mb-4">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>+5.7% from last period</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Registered across all cafes
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Repeat Customer Rate</h3>
                    <div className="text-3xl font-bold mb-1">68%</div>
                    <div className="flex items-center text-sm text-green-600 mb-4">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>+2.3% from last period</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customers with multiple orders
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Avg Order Frequency</h3>
                    <div className="text-3xl font-bold mb-1">3.4x</div>
                    <div className="text-sm text-muted-foreground mb-1">per month</div>
                    <div className="flex items-center text-sm text-green-600 mb-4">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>+0.2 from last period</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-lg font-medium mb-2">Key Customer Metrics</h3>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left text-sm font-medium">Metric</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Value</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Change</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Benchmark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-2 font-medium">Customer Acquisition Cost</td>
                      <td className="px-4 py-2">$8.24</td>
                      <td className="px-4 py-2 text-green-600">-$0.54</td>
                      <td className="px-4 py-2">$9.50</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-2 font-medium">Customer Lifetime Value</td>
                      <td className="px-4 py-2">{analyticsData.averageOrderValue}</td>
                      <td className="px-4 py-2 text-green-600">+$24.30</td>
                      <td className="px-4 py-2">$425.00</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-2 font-medium">Churn Rate</td>
                      <td className="px-4 py-2">4.3%</td>
                      <td className="px-4 py-2 text-green-600">-0.5%</td>
                      <td className="px-4 py-2">5.5%</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-2 font-medium">Net Promoter Score</td>
                      <td className="px-4 py-2">72</td>
                      <td className="px-4 py-2 text-green-600">+3</td>
                      <td className="px-4 py-2">65</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-2 font-medium">Customer Satisfaction</td>
                      <td className="px-4 py-2">4.7/5.0</td>
                      <td className="px-4 py-2 text-green-600">+0.1</td>
                      <td className="px-4 py-2">4.5/5.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GlobalAnalytics;
