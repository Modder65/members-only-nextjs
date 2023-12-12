import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: {},
}

export const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    togglePostLike: (state, action) => {
      const { postId, userId, isLiked, likeCount } = action.payload;
      if (!state.posts[postId]) {
        state.posts[postId] = { userLikes: {}, likeCount: 0 };
      }
      state.posts[postId].userLikes[userId] = isLiked;
      state.posts[postId].likeCount = likeCount;
    },
  },
});

export const { togglePostLike } = likesSlice.actions;
export default likesSlice.reducer;