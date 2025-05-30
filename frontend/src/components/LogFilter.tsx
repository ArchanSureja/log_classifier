
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface LogFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const LOG_CATEGORIES = [
  'HTTP Status', 'Critical Error', 'Security Alert', 'Error',
  'System Notification', 'Resource Usage', 'User Action',
  'Workflow Error', 'Deprecation Warning'
];

export const LogFilter: React.FC<LogFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Filter className="h-4 w-4 text-gray-500" />
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">All Categories</SelectItem>
          {LOG_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
