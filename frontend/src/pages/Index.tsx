
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { LogVisualization } from '@/components/LogVisualization';
import { LogFilter } from '@/components/LogFilter';
import { LogTable } from '@/components/LogTable';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export interface LogEntry {
  source: string;
  log_message: string;
  target_label: string;
}

const backend_uri = import.meta.env.VITE_BACKEND_URL 
const Index = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${backend_uri}/classify/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to classify logs');
      }

      // Since the backend returns a CSV file, we need to parse it
      const csvText = await response.text();
      const parsedLogs = parseCsvToLogs(csvText);
      setLogs(parsedLogs);
      
      toast({
        title: "Success",
        description: `Classified ${parsedLogs.length} log entries`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to classify logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseCsvToLogs = (csvText: string): LogEntry[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        source: values[0] || '',
        log_message: values[1] || '',
        target_label: values[2] || '',
      };
    });
  };

  const filteredLogs = selectedCategory === 'all' 
    ? logs 
    : logs.filter(log => log.target_label === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Log Compass
          </h1>
          <p className="text-lg text-gray-600">
            Intelligent log classification and analysis
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Panel - Upload */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Upload CSV File
            </h2>
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
          </Card>

          {/* Right Panel - Visualization */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Log Categories
            </h2>
            {logs.length > 0 ? (
              <LogVisualization logs={logs} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Upload a CSV file to see the classification results
              </div>
            )}
          </Card>
        </div>

        {/* Filter and Table */}
        {logs.length > 0 && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Log Entries ({filteredLogs.length})
              </h2>
              <LogFilter 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
            <LogTable logs={filteredLogs} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
