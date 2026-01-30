import { create } from 'zustand';

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  
  // Modals
  isSearchOpen: boolean;
  isCreatePostOpen: boolean;
  isCommandPaletteOpen: boolean;
  
  // Feed
  activeFeedTab: 'pulse' | 'learn' | 'following';
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setSearchOpen: (open: boolean) => void;
  setCreatePostOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setActiveFeedTab: (tab: 'pulse' | 'learn' | 'following') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  isSearchOpen: false,
  isCreatePostOpen: false,
  isCommandPaletteOpen: false,
  activeFeedTab: 'pulse',
  
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
  setCreatePostOpen: (isCreatePostOpen) => set({ isCreatePostOpen }),
  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
  setActiveFeedTab: (activeFeedTab) => set({ activeFeedTab }),
}));
