
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}
const backend_uri = import.meta.env.VITE_BACKEND_URL
export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.name.endsWith('.csv')) {
        onFileUpload(file);
      } else {
        alert('Please upload a CSV file');
      }
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleDownloadTestFile = async () => {
    try {
      const response = await fetch(`${backend_uri}/get-test/`);
      
      if (!response.ok) {
        throw new Error('Failed to download test file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'test.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Test file downloaded successfully",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error downloading test file:', error);
      toast({
        title: "Error",
        description: "Failed to download test file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isLoading} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the CSV file here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag & drop a CSV file here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              CSV must contain 'source' and 'log_message' columns
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleDownloadTestFile}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download Test CSV</span>
        </Button>
      </div>
      
      {isLoading && (
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800">Classifying logs...</span>
          </div>
        </div>
      )}
    </div>
  );
};
