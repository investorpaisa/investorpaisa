
import React from 'react';
import { X } from 'lucide-react';

interface ImageUploaderProps {
  images: File[];
  onRemoveImage: (index: number) => void;
}

const ImageUploader = ({ images, onRemoveImage }: ImageUploaderProps) => {
  if (images.length === 0) return null;
  
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {images.map((file, index) => (
        <div key={index} className="relative group">
          <img
            src={URL.createObjectURL(file)}
            alt={`Upload ${index + 1}`}
            className="rounded-md w-full h-24 object-cover"
          />
          <button
            type="button"
            onClick={() => onRemoveImage(index)}
            className="absolute top-1 right-1 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageUploader;
