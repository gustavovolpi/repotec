import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarExpanded: boolean;
  mobileMenuOpen: boolean;
  isMobile: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarExpanded: false,
  mobileMenuOpen: false,
  isMobile: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarExpanded = !state.sidebarExpanded;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, toggleMobileMenu, setMobile, setTheme } = uiSlice.actions;
export default uiSlice.reducer; 