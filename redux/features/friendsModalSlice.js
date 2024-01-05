import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isModalOpen: false,
};

export const friendsModalSlice = createSlice({
  name: 'friendsModal',
  initialState,
  reducers: {
    // Reducer for opening the modal and setting the selected post.
    openModal: (state, action) => {
      state.isModalOpen = true;
    },

    // Reducer for closing the modal
    closeModal: (state) => {
      state.isModalOpen = false;
    },
  },

  // Reducer for sending friend requests
});

// Export the action creators for the slice
export const { openModal, closeModal } = friendsModalSlice.actions;

// Export the reducer function for the slice
export default friendsModalSlice.reducer;