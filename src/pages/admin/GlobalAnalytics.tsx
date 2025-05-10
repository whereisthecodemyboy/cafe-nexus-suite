
import React, { useState } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
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
  const { cafes } = useAppContext();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCafes, setSelectedCafes] = useState<string[]>([]);
  
  const activeCafes = cafes.filter(cafe => cafe.status === 'active').length;
  
  // Mock analytics data
  const analyticsData = {
    totalRevenue: '$483,290',
    revenueTrend: '+12.5%',
    totalOrders: '24,853',
    ordersTrend: '+8.2%',
    totalCustomers: '7,296',
    customersTrend: '+5.7%',
    averageOrderValue: '$19.45',
    aovTrend: '+3.8%'
  };
  
  // Mock data for charts
  const revenueByLocationData = {
    labels: ["New York", "Chicago", "San Francisco", "Miami", "Los Angeles", "Boston", "Seattle"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [86500, 72400, 65300, 59800, 54200, 48900, 42500]
      }
    ]
  };
  
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
  
  const productCategoryData = {
    labels: ["Coffee", "Pastries", "Sandwiches", "Salads", "Desserts", "Beverages"],
    datasets: [
      {
        data: [35, 25, 15, 10, 8, 7]
      }
    ]
  };
  
  const cafePerformanceData = [
    { id: 1, name: "Downtown Cafe", revenue: "$87,950", orders: 4523, trend: "+12.4%" },
    { id: 2, name: "Westside Cafe", revenue: "$74,320", orders: 3897, trend: "+9.8%" },
    { id: 3, name: "Central Cafe", revenue: "$68,750", orders: 3542, trend: "+6.5%" },
    { id: 4, name: "Harbor Cafe", revenue: "$62,480", orders: 3201, trend: "+8.2%" },
    { id: 5, name: "Parkside Cafe", revenue: "$59,230", orders: 3087, trend: "+5.1%" }
  ];
  
  const popularProductsData = [
    { id: 1, name: "Caffe Latte", sales: 2845, revenue: "$12,802", trend: "+14.2%" },
    { id: 2, name: "Croissant", sales: 2534, revenue: "$7,602", trend: "+10.5%" },
    { id: 3, name: "Cappuccino", sales: 2187, revenue: "$9,841", trend: "+8.7%" },
    { id: 4, name: "Avocado Toast", sales: 1954, revenue: "$11,724", trend: "+12.3%" },
    { id: 5, name: "Americano", sales: 1842, revenue: "$7,368", trend: "+4.9%" }
  ];

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
          Comprehensive analytics data across all cafes in the platform. 
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
            <p className="text-xs text-muted-foreground mt-1">Compared to previous period</p>
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
            <p className="text-xs text-muted-foreground mt-1">Compared to previous period</p>
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
            <p className="text-xs text-muted-foreground mt-1">Compared to previous period</p>
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
            <p className="text-xs text-muted-foreground mt-1">Compared to previous period</p>
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
                  <LineChart 
                    data={revenueByTimeData}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Revenue by Location</CardTitle>
                <CardDescription>Top performing locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart 
                    data={revenueByLocationData}
                  />
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
                  <PieChart 
                    data={productCategoryData}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Performing Cafes</CardTitle>
                <CardDescription>Based on total revenue</CardDescription>
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
                      {cafePerformanceData.map((cafe) => (
                        <tr key={cafe.id} className="hover:bg-muted/50">
                          <td className="px-4 py-2 whitespace-nowrap font-medium">{cafe.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{cafe.revenue}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{cafe.orders.toLocaleString()}</td>
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
              <CardDescription>Compare key metrics across all cafes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium mb-2">Top Revenue Cafes</h3>
                  <div className="flex-1 flex flex-col space-y-2">
                    {cafePerformanceData.map((cafe, index) => (
                      <div key={cafe.id} className="flex items-center">
                        <span className="w-6 text-muted-foreground">{index + 1}</span>
                        <div className="flex-1">
                          <div className="h-9 flex items-center justify-between">
                            <span className="font-medium">{cafe.name}</span>
                            <span className="text-sm">{cafe.revenue}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full">
                            <div 
                              className="h-2 bg-destructive rounded-full" 
                              style={{ width: `${100 - (index * 10)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium mb-2">Top Order Volume Cafes</h3>
                  <div className="flex-1 flex flex-col space-y-2">
                    {cafePerformanceData.map((cafe, index) => (
                      <div key={cafe.id} className="flex items-center">
                        <span className="w-6 text-muted-foreground">{index + 1}</span>
                        <div className="flex-1">
                          <div className="h-9 flex items-center justify-between">
                            <span className="font-medium">{cafe.name}</span>
                            <span className="text-sm">{cafe.orders.toLocaleString()} orders</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full">
                            <div 
                              className="h-2 bg-blue-600 rounded-full" 
                              style={{ width: `${100 - (index * 8)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-lg font-medium mb-4">Cafe Status Overview</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <Card className="w-40">
                    <CardContent className="p-6 text-center">
                      <Building2 className="mx-auto h-8 w-8 text-destructive mb-2" />
                      <div className="text-3xl font-bold">{cafes.length}</div>
                      <p className="text-sm text-muted-foreground">Total Cafes</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="w-40">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="mx-auto h-8 w-8 text-green-600 mb-2" />
                      <div className="text-3xl font-bold">{activeCafes}</div>
                      <p className="text-sm text-muted-foreground">Active Cafes</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="w-40">
                    <CardContent className="p-6 text-center">
                      <Clock className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                      <div className="text-3xl font-bold">24.7</div>
                      <p className="text-sm text-muted-foreground">Avg Hours/Week</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="w-40">
                    <CardContent className="p-6 text-center">
                      <Users className="mx-auto h-8 w-8 text-orange-600 mb-2" />
                      <div className="text-3xl font-bold">614</div>
                      <p className="text-sm text-muted-foreground">Total Staff</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-2 text-left text-sm font-medium">Cafe</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Location</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Revenue (30d)</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Orders</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Avg Order</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Staff</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {cafes.map((cafe) => (
                        <tr key={cafe.id} className="hover:bg-muted/50">
                          <td className="px-4 py-2 whitespace-nowrap font-medium">{cafe.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{cafe.location}</td>
                          <td className="px-4 py-2 whitespace-nowrap">${(Math.random() * 80000 + 20000).toFixed(0)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{Math.floor(Math.random() * 3000 + 1000)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">${(Math.random() * 10 + 15).toFixed(2)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{Math.floor(Math.random() * 20 + 5)}</td>
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
              <CardDescription>Sales and revenue analysis by product</CardDescription>
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
                      <div className="text-3xl font-bold">2,487</div>
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
                      <div className="text-xl font-bold truncate">Caffe Latte</div>
                      <p className="text-sm text-muted-foreground">2,845 units sold</p>
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
                      <div className="text-xl font-bold truncate">Avocado Toast</div>
                      <p className="text-sm text-muted-foreground">$11,724 revenue</p>
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
                      <div className="text-xl font-bold truncate">Matcha Latte</div>
                      <p className="text-sm text-muted-foreground">+27.5% growth</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Top Products by Revenue</h3>
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
                        <td className="px-4 py-2 whitespace-nowrap">{product.sales.toLocaleString()}</td>
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
              
              <h3 className="text-lg font-medium mb-4">Product Sales Distribution by Category</h3>
              <div className="h-80">
                <PieChart 
                  data={productCategoryData}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>Customer behavior and demographic insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Customer Growth</h3>
                    <div className="text-3xl font-bold mb-1">7,296</div>
                    <div className="flex items-center text-sm text-green-600 mb-4">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>+5.7% from last period</span>
                    </div>
                    <div className="h-32">
                      <LineChart 
                        data={{
                          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                          datasets: [{
                            data: [6210, 6450, 6690, 6980, 7296]
                          }]
                        }}
                      />
                    </div>
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
                    <div className="h-32">
                      <LineChart 
                        data={{
                          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                          datasets: [{
                            data: [61, 64, 65, 67, 68]
                          }]
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Average Order Frequency</h3>
                    <div className="text-3xl font-bold mb-1">3.4x</div>
                    <div className="text-sm text-muted-foreground mb-1">per month</div>
                    <div className="flex items-center text-sm text-green-600 mb-4">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>+0.2 from last period</span>
                    </div>
                    <div className="h-32">
                      <LineChart 
                        data={{
                          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                          datasets: [{
                            data: [3.0, 3.1, 3.2, 3.3, 3.4]
                          }]
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Age Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <BarChart 
                        data={{
                          labels: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
                          datasets: [{
                            data: [15, 32, 28, 15, 7, 3]
                          }]
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Visit Time Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <BarChart 
                        data={{
                          labels: ["6-9 AM", "9-12 PM", "12-3 PM", "3-6 PM", "6-9 PM", "9-12 AM"],
                          datasets: [{
                            data: [24, 18, 22, 14, 16, 6]
                          }]
                        }}
                      />
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
                      <td className="px-4 py-2">$485.20</td>
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
