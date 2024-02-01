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
    removePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    editPost: (state, action) => {
      const { id, title, message } = action.payload;
      const existingPost = state.posts.find(post => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.message = message;
      }
    },
  },
});

export const {
  setPosts,
  appendPosts,
  prependPost,
  addPost,
  removePost,
  editPost,
} = postsSlice.actions;

export default postsSlice.reducer;