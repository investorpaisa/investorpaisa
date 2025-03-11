
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useUserCircles } from '@/hooks/useCircles';
import { usePostForm } from '@/hooks/usePostForm';
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
  const {
    formData,
    user,
    isExpanded,
    loading,
    handleImageUpload,
    removeImage,
    handleUserSelect,
    clearUserSelection,
    handleShareModeChange,
    handleCircleChange,
    handleTitleChange,
    handleContentChange,
    handleCategoryChange,
    handleSearchChange,
    handleSubmit,
    handleExpand,
    handleCancel,
  } = usePostForm({
    onSuccess,
    onCancel,
    circleId,
    onPostCreated,
  });

  const { data: userCircles = [] } = useUserCircles(user?.id);

  return (
    <Card className={`border ${!isExpanded ? 'hover:border-muted-foreground/50 transition-colors' : ''}`}>
      <CardContent className="p-4">
        {!isExpanded ? (
          <CompactPostForm 
            userAvatar={user?.avatar}
            userName={user?.name}
            onExpand={handleExpand}
          />
        ) : (
          <div className="space-y-4">
            <PostFormHeader 
              userName={user?.name}
              userAvatar={user?.avatar}
              shareMode={formData.shareMode}
              onShareModeChange={handleShareModeChange}
            />

            {formData.shareMode === 'circle' && (
              <CircleSelector 
                userCircles={userCircles}
                selectedCircle={formData.selectedCircle}
                onCircleChange={handleCircleChange}
              />
            )}

            {formData.shareMode === 'user' && (
              <UserSelector 
                users={mockUsers}
                searchTerm={formData.searchTerm}
                selectedUser={formData.selectedUser}
                onSearchChange={handleSearchChange}
                onUserSelect={handleUserSelect}
                onUserClear={clearUserSelection}
              />
            )}

            <PostFormInputs 
              title={formData.title}
              content={formData.content}
              category={formData.category}
              categories={categories}
              showCategory={formData.shareMode === 'public'}
              onTitleChange={handleTitleChange}
              onContentChange={handleContentChange}
              onCategoryChange={handleCategoryChange}
            />

            <ImageUploader 
              images={formData.images}
              onRemoveImage={removeImage}
            />
          </div>
        )}
      </CardContent>
      
      {isExpanded && (
        <CardFooter className="px-0 py-0">
          <PostFormFooter 
            loading={loading}
            shareMode={formData.shareMode}
            compact={compact}
            onImageUpload={handleImageUpload}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </CardFooter>
      )}
    </Card>
  );
}
