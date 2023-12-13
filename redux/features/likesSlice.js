import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the likes slice.
// The posts object will store the like status and count for each post
const initialState = {
  posts: {},
  comments: {},
  replies: {},
}

export const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    // Reducer for toggling the like status of a post.
    togglePostLike: (state, action) => {
      // Extract postId, userId, isLiked, and likeCount from the action payload.
      const { postId, userId, isLiked, likeCount } = action.payload;

      // If the post does not exist in the state, initialize it with default values.
      if (!state.posts[postId]) {
        state.posts[postId] = { userLikes: {}, likeCount: 0 };
      }

      // Update the like status for the specific user on the specified post.
      state.posts[postId].userLikes[userId] = isLiked;

      // Update the total like count for the post.
      state.posts[postId].likeCount = likeCount;
    },

    // Reducer for toggling the like status of a comment
    toggleCommentLike: (state, action) => {
      const { commentId, userId, isLiked, likeCount } = action.payload;

      if (!state.comments[commentId]) {
        state.comments[commentId] = { userLikes: {}, Count: 0 };
      }

      state.comments[commentId].userLikes[userId] = isLiked;
      state.comments[commentId].likeCount = likeCount;
    },

    toggleReplyLike: (state, action) => {
      const { replyId, userId, isLiked, likeCount } = action.payload;

      if (!state.replies[replyId]) {
        state.replies[replyId] = { userLikes: {}, Count: 0 };
      }

      state.replies[replyId].userLikes[userId] = isLiked;
      state.replies[replyId].likeCount = likeCount;
    },
  },
});

// Export the action creators for the slice.
export const { togglePostLike, toggleCommentLike, toggleReplyLike } = likesSlice.actions;

// Export the reducer function for the slice.
export default likesSlice.reducer;