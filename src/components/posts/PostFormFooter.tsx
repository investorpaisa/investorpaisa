
import React from 'react';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';

interface PostFormFooterProps {
  loading: boolean;
  shareMode: 'public' | 'circle' | 'user';
  compact: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const PostFormFooter = ({
  loading,
  shareMode,
  compact,
  onImageUpload,
  onCancel,
  onSubmit
}: PostFormFooterProps) => {
  return (
    <div className="px-4 py-3 border-t flex justify-between">
      <div className="flex items-center">
        <label htmlFor="upload-images" className="cursor-pointer">
          <div className="flex items-center text-muted-foreground hover:text-foreground">
            <Image className="h-5 w-5 mr-1" />
            <span className="text-sm">Add Images</span>
          </div>
          <input
            id="upload-images"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onImageUpload}
          />
        </label>
      </div>
      
      <div className="flex gap-2">
        {compact && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button size="sm" onClick={onSubmit} disabled={loading}>
          {loading ? 'Posting...' : (
            <>
              {shareMode === 'public' ? 'Post' : shareMode === 'circle' ? 'Post to Circle' : 'Send Message'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PostFormFooter;
