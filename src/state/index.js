import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  chats: null,
  notifications: null,
  message: {
    text: '',
    success: false,
  },
  isLoading: true,
  currentChat: null,
  searchTerm: '',
};

export const reducer = createSlice({
  name: 'init',
  initialState,
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
    },

    setChats: (state, { payload }) => {
      state.chats = payload;
    },

    setMessage: (state, { payload }) => {
      state.message = payload;
    },

    setIsLoading(state, { payload }) {
      state.isLoading = payload;
    },

    setCurrentChat(state, { payload }) {
      state.currentChat = payload;
    },

    setSearchTerm(state, { payload }) {
      state.searchTerm = payload;
    },

    resetState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setCurrentUser,
  setChats,
  setMessage,
  setIsLoading,
  setCurrentChat,
  setSearchTerm,
  resetState,
} = reducer.actions;
export default reducer.reducer;
