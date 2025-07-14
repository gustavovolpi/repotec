import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Usuario } from '../../services/usuarios.service';

interface UserState {
  currentUser: Usuario | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<Usuario>) => {
      state.currentUser = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<Usuario>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setCurrentUser, updateUserProfile, setLoading, setError, clearUser } = userSlice.actions;
export default userSlice.reducer; 