
import { useState, useEffect } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { useProfileData } from '@/hooks/useProfileData';
import { toast } from 'sonner';
import { mockUsers, categories } from '@/data/mockData';

interface PostFormData {
  title: string;
  content: string;
  category: string;
  images: File[];
  shareMode: 'public' | 'circle' | 'user';
  selectedCircle: string | null;
  selectedUser: string | null;
  searchTerm: string;
}

interface UsePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  circleId?: string;
  onPostCreated?: (newPost: any) => void;
}

export const usePostForm = ({ onSuccess, onCancel, circleId, onPostCreated }: UsePostFormProps) => {
  const userData = useUserData();
  const { addPostToProfile } = useProfileData();
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    category: '',
    images: [],
    shareMode: 'public',
    selectedCircle: circleId || null,
    selectedUser: null,
    searchTerm: '',
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (circleId) {
      setFormData(prev => ({
        ...prev,
        shareMode: 'circle',
        selectedCircle: circleId,
      }));
    }
  }, [circleId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const handleUserSelect = (userId: string, userName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedUser: userId,
      searchTerm: userName,
    }));
  };

  const clearUserSelection = () => {
    setFormData(prev => ({
      ...prev,
      selectedUser: null,
      searchTerm: '',
    }));
  };

  const handleShareModeChange = (mode: 'public' | 'circle' | 'user') => {
    setFormData(prev => ({
      ...prev,
      shareMode: mode,
    }));
  };

  const handleCircleChange = (circleId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCircle: circleId,
    }));
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
    }));
  };

  const handleContentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      content: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value,
    }));
  };

  const handleSearchChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      searchTerm: value,
    }));
  };

  const handleSubmit = async () => {
    const { title, content, category, shareMode, selectedCircle, selectedUser } = formData;
    
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
          // In a real implementation, we would get the circle name from the circles data
          successMessage = `Post shared to circle`;
        } else if (shareMode === 'user' && selectedUser) {
          const userName = mockUsers.find(u => u.id === selectedUser)?.name || 'user';
          successMessage = `Post sent to ${userName}`;
        }
        
        const categoryName = category ? categories.find(c => c.id === category)?.name : undefined;
        
        const newPost = {
          id: Math.floor(Math.random() * 1000).toString(),
          author: {
            name: userData?.name || 'User',
            username: userData?.username || 'user',
            avatar: userData?.avatar || '/placeholder.svg',
            role: userData?.role || 'user',
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
    setFormData({
      title: '',
      content: '',
      category: '',
      images: [],
      shareMode: 'public',
      selectedCircle: null,
      selectedUser: null,
      searchTerm: '',
    });
    setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    if (onCancel) onCancel();
  };

  return {
    formData,
    userData,
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
  };
};
