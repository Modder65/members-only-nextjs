import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  commentsByPostId: {},
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setCommentsForPost: (state, action) => {
      const { postId, comments } = action.payload;
      state.commentsByPostId[postId] = comments;
    },
    
    updateCommentForPost: (state, action) => {
      const { postId, comment } = action.payload;
      if (state.commentsByPostId[postId]) {
        // Create a new array with the new comment
        state.commentsByPostId[postId] = [...state.commentsByPostId[postId], comment];
      } else {
        state.commentsByPostId[postId] = [comment];
      }
    }    
  },
});

export const { setCommentsForPost, updateCommentForPost } = commentsSlice.actions;

export default commentsSlice.reducer;
