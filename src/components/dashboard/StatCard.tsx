
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  trend = 'neutral',
  className 
}) => {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn(
            "mt-1 text-xs",
            trend === 'up' && "text-green-600 dark:text-green-500",
            trend === 'down' && "text-red-600 dark:text-red-500",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            {trend === 'up' && '↑ '}
            {trend === 'down' && '↓ '}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
