
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, X, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  circleId?: string;
  compact?: boolean;
}

export function CreatePostForm({ onSuccess, onCancel, circleId, compact = false }: CreatePostFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [loading, setLoading] = useState(false);

  // Mock categories
  const categories = [
    { id: '1', name: 'Investments' },
    { id: '2', name: 'Tax Planning' },
    { id: '3', name: 'Retirement' },
    { id: '4', name: 'Mutual Funds' },
    { id: '5', name: 'Stock Market' },
    { id: '6', name: 'Personal Finance' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages([...images, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please add a title to your post');
      return;
    }

    if (!content.trim()) {
      toast.error('Please add some content to your post');
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would be an API call to create the post
      setTimeout(() => {
        toast.success('Post created successfully');
        setTitle('');
        setContent('');
        setCategory('');
        setImages([]);
        setIsExpanded(false);
        if (onSuccess) onSuccess();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card className={`border ${!isExpanded ? 'hover:border-muted-foreground/50 transition-colors' : ''}`}>
      <CardContent className="p-4">
        {!isExpanded ? (
          <div 
            className="flex items-center gap-4 cursor-pointer" 
            onClick={() => setIsExpanded(true)}
          >
            <Avatar>
              <AvatarImage src={user?.avatar || '/placeholder.svg'} />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || 'IP'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-muted rounded-md px-4 py-2 text-muted-foreground">
              Share your financial knowledge or ask a question...
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.avatar || '/placeholder.svg'} />
                <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || 'IP'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">
                  {circleId ? 'Posting to circle' : 'Posting to your feed'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your post a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Share your financial insights, tips, or questions..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
            </div>

            {!circleId && (
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {images.length > 0 && (
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
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {isExpanded && (
        <CardFooter className="px-4 py-3 border-t flex justify-between">
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
                onChange={handleImageUpload}
              />
            </label>
          </div>
          
          <div className="flex gap-2">
            {compact && (
              <Button variant="outline" size="sm" onClick={() => {
                setIsExpanded(false);
                if (onCancel) onCancel();
              }}>
                Cancel
              </Button>
            )}
            <Button size="sm" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
