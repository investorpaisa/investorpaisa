
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useUserCircles } from '@/hooks/useCircles';
import { usePostForm } from '@/hooks/usePostForm';
import { useUserData } from '@/hooks/useUserData';
import PostFormHeader from './PostFormHeader';
import CircleSelector from './CircleSelector';
import UserSelector from './UserSelector';
import PostFormInputs from './PostFormInputs';
import ImageUploader from './ImageUploader';
import PostFormFooter from './PostFormFooter';
import CompactPostForm from './CompactPostForm';
import { mockUsers, categories } from '@/data/mockData';

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  circleId?: string;
  compact?: boolean;
  onPostCreated?: (newPost: any) => void;
}

export function CreatePostForm({ onSuccess, onCancel, circleId, compact = false, onPostCreated }: CreatePostFormProps) {
  const userData = useUserData();
  const {
    formData,
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

  const { data: userCircles = [] } = useUserCircles(userData?.id);

  return (
    <Card className={`border ${!isExpanded ? 'hover:border-muted-foreground/50 transition-colors' : ''}`}>
      <CardContent className="p-4">
        {!isExpanded ? (
          <CompactPostForm 
            userAvatar={userData?.avatar}
            userName={userData?.name}
            onExpand={handleExpand}
          />
        ) : (
          <div className="space-y-4">
            <PostFormHeader 
              userName={userData?.name}
              userAvatar={userData?.avatar}
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
