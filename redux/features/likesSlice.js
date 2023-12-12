import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: {},
}

export const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    togglePostLike: (state, action) => {
      const { postId, isLiked, likeCount } = action.payload;
      state.posts[postId] = { isLiked, likeCount };
    },
  },
});

export const { togglePostLike } = likesSlice.actions;
export default likesSlice.reducer;