
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@/hooks/use-theme';

interface SalesChartProps {
  data: any[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  const textColor = isDarkTheme ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))';
  const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>View daily sales by category over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="date" 
                stroke={textColor} 
                tickFormatter={(value) => {
                  // Format date to show day and month only
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis stroke={textColor} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkTheme ? 'hsl(var(--card))' : 'white',
                  borderColor: isDarkTheme ? 'hsl(var(--border))' : '#ddd',
                  color: textColor
                }} 
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Coffee"
                stroke="#8b5cf6"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="Food" 
                stroke="#10b981" 
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Bakery"
                stroke="#f59e0b"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Drinks"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
