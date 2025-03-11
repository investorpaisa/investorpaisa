
import { create } from 'zustand';
import { useState, useCallback } from 'react';

interface CommentsEntity {
  id: string;
  title: string;
  content: string;
  entityType: 'news' | 'post' | 'comment';
  commentsCount: number;
  onCommentAdded?: () => void;
}

interface CommentsDialogStore {
  isOpen: boolean;
  entity: CommentsEntity | null;
  openComments: (entity: CommentsEntity) => void;
  closeComments: () => void;
}

export const useCommentsDialogStore = create<CommentsDialogStore>((set) => ({
  isOpen: false,
  entity: null,
  openComments: (entity) => set({ isOpen: true, entity }),
  closeComments: () => set({ isOpen: false })
}));

export const useCommentsDialog = () => {
  const { isOpen, entity, openComments, closeComments } = useCommentsDialogStore();

  return {
    isOpen,
    entity,
    openComments,
    closeComments
  };
};
