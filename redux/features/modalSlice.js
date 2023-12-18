import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isModalOpen: false,
  selectedPost: null,
  comments: [],
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    // Reducer for opening the modal and setting the selected post.
    openModal: (state, action) => {
      const { post, comments } = action.payload;
      state.isModalOpen = true;
      state.selectedPost = post;
      state.comments = comments;
    },

    // Reducer for closing the modal
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedPost = null;
      state.comments = [];
    },
  },
});

// Export the action creators for the slice
export const { openModal, closeModal } = modalSlice.actions;

// Export the reducer function for the slice
export default modalSlice.reducer;