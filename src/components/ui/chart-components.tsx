
import React from 'react';
import { 
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      label?: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string;
      fill?: string;
    }[];
  };
}

// Bar Chart Component
export const BarChart: React.FC<ChartProps> = ({ data }) => {
  // Transform the data to recharts format
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = { name: label };
    data.datasets.forEach((dataset, datasetIndex) => {
      dataPoint[dataset.label || `Dataset ${datasetIndex + 1}`] = dataset.data[index];
    });
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={transformedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Bar 
            key={index} 
            dataKey={dataset.label || `Dataset ${index + 1}`} 
            fill={dataset.backgroundColor ? dataset.backgroundColor[0] : `#${Math.floor(Math.random()*16777215).toString(16)}`} 
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

// Line Chart Component
export const LineChart: React.FC<ChartProps> = ({ data }) => {
  // Transform the data to recharts format
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = { name: label };
    data.datasets.forEach((dataset, datasetIndex) => {
      dataPoint[dataset.label || `Dataset ${datasetIndex + 1}`] = dataset.data[index];
    });
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={transformedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={dataset.label || `Dataset ${index + 1}`}
            stroke={dataset.borderColor || `#${Math.floor(Math.random()*16777215).toString(16)}`}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

// Pie Chart Component
export const PieChart: React.FC<ChartProps> = ({ data }) => {
  // For pie charts, we typically use just one dataset
  const dataset = data.datasets[0];
  
  // Transform the data to recharts format
  const transformedData = data.labels.map((label, index) => ({
    name: label,
    value: dataset.data[index]
  }));

  const COLORS = dataset.backgroundColor || 
    ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FECACA'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={transformedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {transformedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
