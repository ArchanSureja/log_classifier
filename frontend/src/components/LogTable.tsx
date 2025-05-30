
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LogEntry } from '@/pages/Index';

interface LogTableProps {
  logs: LogEntry[];
}

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    'Critical Error': 'bg-red-100 text-red-800',
    'Security Alert': 'bg-orange-100 text-orange-800',
    'Error': 'bg-red-100 text-red-700',
    'HTTP Status': 'bg-blue-100 text-blue-800',
    'System Notification': 'bg-green-100 text-green-800',
    'Resource Usage': 'bg-purple-100 text-purple-800',
    'User Action': 'bg-cyan-100 text-cyan-800',
    'Workflow Error': 'bg-yellow-100 text-yellow-800',
    'Deprecation Warning': 'bg-gray-100 text-gray-800',
  };
  return colorMap[category] || 'bg-gray-100 text-gray-800';
};

export const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No logs match the selected filter
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Source</TableHead>
            <TableHead>Log Message</TableHead>
            <TableHead className="w-48">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium">{log.source}</TableCell>
              <TableCell className="max-w-md truncate" title={log.log_message}>
                {log.log_message}
              </TableCell>
              <TableCell>
                <Badge className={getCategoryColor(log.target_label)}>
                  {log.target_label}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
