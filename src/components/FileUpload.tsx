
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, FileImage, FileVideo, Link } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File, type: 'image' | 'video' | 'document') => void;
  onUrlAdd?: (url: string) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUrlAdd,
  acceptedTypes = "image/*,video/*,.pdf,.doc,.docx",
  maxSize = 10,
  className = ""
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Determine file type
    let fileType: 'image' | 'video' | 'document' = 'document';
    if (file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type.startsWith('video/')) {
      fileType = 'video';
    }

    setSelectedFile(file);
    
    // Create preview for images
    if (fileType === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onFileSelect(file, fileType);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FileImage className="h-6 w-6" />;
    if (file.type.startsWith('video/')) return <FileVideo className="h-6 w-6" />;
    return <Upload className="h-6 w-6" />;
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!selectedFile ? (
        <Card
          className={`rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${
            isDragging 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-slate-300 hover:border-emerald-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <CardContent className="p-8 text-center">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload File</h3>
            <p className="text-slate-600 mb-4">
              Drag and drop a file here, or click to browse
            </p>
            <p className="text-sm text-slate-500">
              Supports images, videos, and documents up to {maxSize}MB
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(selectedFile)}
                <div>
                  <p className="font-medium text-slate-900">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {preview && (
              <div className="mt-4">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-w-full max-h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {onUrlAdd && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) onUrlAdd(url);
            }}
            className="w-full rounded-2xl"
          >
            <Link className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
      )}
    </div>
  );
};
