
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LogEntry } from '@/pages/Index';

interface LogVisualizationProps {
  logs: LogEntry[];
}

const LOG_CATEGORIES = [
  'HTTP Status', 'Critical Error', 'Security Alert', 'Error',
  'System Notification', 'Resource Usage', 'User Action',
  'Workflow Error', 'Deprecation Warning'
];

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
  '#ff0000', '#00ff00', '#0088fe', '#00c49f',
  '#ffbb28'
];

export const LogVisualization: React.FC<LogVisualizationProps> = ({ logs }) => {
  const categoryCount = LOG_CATEGORIES.reduce((acc, category) => {
    acc[category] = logs.filter(log => log.target_label === category).length;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryCount)
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => ({
      name: category,
      value: count,
      percentage: ((count / logs.length) * 100).toFixed(1)
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">Count: {data.value}</p>
          <p className="text-gray-600">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No classified logs to display
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
