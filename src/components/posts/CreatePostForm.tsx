
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, X, PlusCircle, Users, User, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserCircles } from '@/hooks/useCircles';
import { useProfileData } from '@/hooks/useProfileData'; 
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  circleId?: string;
  compact?: boolean;
  onPostCreated?: (newPost: any) => void;
}

const mockUsers = [
  { id: '1', name: 'John Doe', username: 'johndoe', avatar: 'https://i.pravatar.cc/150?u=johndoe' },
  { id: '2', name: 'Jane Smith', username: 'janesmith', avatar: 'https://i.pravatar.cc/150?u=janesmith' },
  { id: '3', name: 'Alex Johnson', username: 'alexj', avatar: 'https://i.pravatar.cc/150?u=alexj' },
  { id: '4', name: 'Sam Wilson', username: 'samw', avatar: 'https://i.pravatar.cc/150?u=samw' },
  { id: '5', name: 'Taylor Green', username: 'tgreen', avatar: 'https://i.pravatar.cc/150?u=tgreen' },
];

export function CreatePostForm({ onSuccess, onCancel, circleId, compact = false, onPostCreated }: CreatePostFormProps) {
  const { user } = useAuth();
  const { addPostToProfile } = useProfileData();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [loading, setLoading] = useState(false);
  const [shareMode, setShareMode] = useState<'public' | 'circle' | 'user'>('public');
  const [selectedCircle, setSelectedCircle] = useState<string | null>(circleId || null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: userCircles = [] } = useUserCircles(user?.id);

  const categories = [
    { id: '1', name: 'Investments' },
    { id: '2', name: 'Tax Planning' },
    { id: '3', name: 'Retirement' },
    { id: '4', name: 'Mutual Funds' },
    { id: '5', name: 'Stock Market' },
    { id: '6', name: 'Personal Finance' },
  ];

  useEffect(() => {
    if (circleId) {
      setShareMode('circle');
      setSelectedCircle(circleId);
    }
  }, [circleId]);

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

  const filteredUsers = searchTerm
    ? mockUsers.filter(
        user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
        let successMessage = 'Post created successfully';
        
        if (shareMode === 'circle' && selectedCircle) {
          const circleName = userCircles.find(c => c.id === selectedCircle)?.name || 'circle';
          successMessage = `Post shared to ${circleName}`;
        } else if (shareMode === 'user' && selectedUser) {
          const userName = mockUsers.find(u => u.id === selectedUser)?.name || 'user';
          successMessage = `Post sent to ${userName}`;
        }
        
        const categoryName = category ? categories.find(c => c.id === category)?.name : undefined;
        
        const newPost = {
          id: Math.floor(Math.random() * 1000).toString(),
          author: {
            name: user?.name || 'User',
            username: user?.username || 'user',
            avatar: user?.avatar || '/placeholder.svg',
            role: user?.role || 'user',
            verified: false,
          },
          category: categoryName,
          title: title,
          content: content,
          timestamp: 'Just now',
          likes: 0,
          comments: 0,
          shares: 0,
          saved: false,
        };
        
        toast.success(successMessage);
        
        // Add post to feed via callback
        if (onPostCreated) {
          onPostCreated(newPost);
        }
        
        // Add post to profile
        if (addPostToProfile) {
          addPostToProfile(newPost);
        }
        
        setTitle('');
        setContent('');
        setCategory('');
        setImages([]);
        setIsExpanded(false);
        setShareMode('public');
        setSelectedCircle(null);
        setSelectedUser(null);
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
                <div className="text-xs text-muted-foreground">
                  <Tabs 
                    value={shareMode} 
                    onValueChange={(value) => setShareMode(value as 'public' | 'circle' | 'user')}
                    className="mt-1"
                  >
                    <TabsList className="h-7 bg-muted/50">
                      <TabsTrigger value="public" className="text-xs h-5 px-2">Public Post</TabsTrigger>
                      <TabsTrigger value="circle" className="text-xs h-5 px-2">Circle Post</TabsTrigger>
                      <TabsTrigger value="user" className="text-xs h-5 px-2">Direct Message</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>

            {shareMode === 'circle' && (
              <div className="space-y-2">
                <Label htmlFor="circle">Select Circle</Label>
                <Select 
                  value={selectedCircle || ''} 
                  onValueChange={setSelectedCircle}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a circle" />
                  </SelectTrigger>
                  <SelectContent>
                    {userCircles.map((circle) => (
                      <SelectItem key={circle.id} value={circle.id}>
                        {circle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {shareMode === 'user' && (
              <div className="space-y-2">
                <Label htmlFor="user">Send to User</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Input
                        id="user"
                        placeholder="Search by name or username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                      {selectedUser && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2" 
                            onClick={() => {
                              setSelectedUser(null);
                              setSearchTerm('');
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    {searchTerm && filteredUsers.length > 0 ? (
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user.id);
                              setSearchTerm(user.name);
                            }}
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        {searchTerm ? "No users found" : "Start typing to search users"}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            )}

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

            {shareMode === 'public' && (
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
              {loading ? 'Posting...' : (
                <>
                  {shareMode === 'public' ? 'Post' : shareMode === 'circle' ? 'Post to Circle' : 'Send Message'}
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
