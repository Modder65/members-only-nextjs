import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: {},
  comments: {},
  replies: {},
};

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const { postId, commentId, replyId, currentUserLiked, likeCount } = action.payload;

      // Determine the type and ID of the item
      let type, itemId;
      if (postId) {
        type = 'posts';
        itemId = postId;
      } else if (commentId) {
        type = 'comments';
        itemId = commentId;
      } else if (replyId) {
        type = 'replies';
        itemId = replyId;
      }

      if (!type || !itemId) return; // Exit if type or itemId is not determined

      // Initialize the state for the specific item if it doesn't exist
      if (!state[type][itemId]) {
        state[type][itemId] = { currentUserLiked: false, likeCount: 0 };
      }

      // Update the like status and count
      const item = state[type][itemId];
      item.likeCount = likeCount;
      item.currentUserLiked = currentUserLiked;
    },
    initializeLikes: (state, action) => {
      action.payload.forEach(({ type, itemId, currentUserLiked, likeCount }) => {
        if (!state[type]) state[type] = {};
    
        if (!state[type][itemId]) {
          state[type][itemId] = { currentUserLiked: false, likeCount: 0 };
        }
    
        state[type][itemId].currentUserLiked = currentUserLiked;
        state[type][itemId].likeCount = likeCount;
      });
    },
  },
});

// Export the action creators for the slice.
export const { toggleLike, initializeLikes } = likesSlice.actions;

// Export the reducer function for the slice.
export default likesSlice.reducer;
