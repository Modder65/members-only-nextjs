import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    appendPosts: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
    },
    prependPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
  },
});

export const {
  setPosts,
  appendPosts,
  prependPost,
  addPost 
} = postsSlice.actions;

export default postsSlice.reducer;