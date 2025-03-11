import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useUserCircles } from '@/hooks/useCircles';
import { useProfileData } from '@/hooks/useProfileData';
import PostFormHeader from './PostFormHeader';
import CircleSelector from './CircleSelector';
import UserSelector from './UserSelector';
import PostFormInputs from './PostFormInputs';
import ImageUploader from './ImageUploader';
import PostFormFooter from './PostFormFooter';
import CompactPostForm from './CompactPostForm';

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

const categories = [
  { id: '1', name: 'Investments' },
  { id: '2', name: 'Tax Planning' },
  { id: '3', name: 'Retirement' },
  { id: '4', name: 'Mutual Funds' },
  { id: '5', name: 'Stock Market' },
  { id: '6', name: 'Personal Finance' },
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

  const handleUserSelect = (userId: string, userName: string) => {
    setSelectedUser(userId);
    setSearchTerm(userName);
  };

  const clearUserSelection = () => {
    setSelectedUser(null);
    setSearchTerm('');
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
        
        resetForm();
        if (onSuccess) onSuccess();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setImages([]);
    setIsExpanded(false);
    setShareMode('public');
    setSelectedCircle(null);
    setSelectedUser(null);
  };

  return (
    <Card className={`border ${!isExpanded ? 'hover:border-muted-foreground/50 transition-colors' : ''}`}>
      <CardContent className="p-4">
        {!isExpanded ? (
          <CompactPostForm 
            userAvatar={user?.avatar}
            userName={user?.name}
            onExpand={() => setIsExpanded(true)}
          />
        ) : (
          <div className="space-y-4">
            <PostFormHeader 
              userName={user?.name}
              userAvatar={user?.avatar}
              shareMode={shareMode}
              onShareModeChange={setShareMode}
            />

            {shareMode === 'circle' && (
              <CircleSelector 
                userCircles={userCircles}
                selectedCircle={selectedCircle}
                onCircleChange={setSelectedCircle}
              />
            )}

            {shareMode === 'user' && (
              <UserSelector 
                users={mockUsers}
                searchTerm={searchTerm}
                selectedUser={selectedUser}
                onSearchChange={setSearchTerm}
                onUserSelect={handleUserSelect}
                onUserClear={clearUserSelection}
              />
            )}

            <PostFormInputs 
              title={title}
              content={content}
              category={category}
              categories={categories}
              showCategory={shareMode === 'public'}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onCategoryChange={setCategory}
            />

            <ImageUploader 
              images={images}
              onRemoveImage={removeImage}
            />
          </div>
        )}
      </CardContent>
      
      {isExpanded && (
        <CardFooter className="px-0 py-0">
          <PostFormFooter 
            loading={loading}
            shareMode={shareMode}
            compact={compact}
            onImageUpload={handleImageUpload}
            onCancel={() => {
              setIsExpanded(false);
              if (onCancel) onCancel();
            }}
            onSubmit={handleSubmit}
          />
        </CardFooter>
      )}
    </Card>
  );
}
