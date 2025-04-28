
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/hooks/use-theme';

interface HourlyTrafficChartProps {
  data: any[];
}

const HourlyTrafficChart: React.FC<HourlyTrafficChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  const textColor = isDarkTheme ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))';
  const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Traffic</CardTitle>
        <CardDescription>Customer traffic by hour</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="hour" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkTheme ? 'hsl(var(--card))' : 'white',
                  borderColor: isDarkTheme ? 'hsl(var(--border))' : '#ddd',
                  color: textColor
                }}
                formatter={(value) => [`${value} customers`, 'Traffic']}
              />
              <Bar dataKey="traffic" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyTrafficChart;
