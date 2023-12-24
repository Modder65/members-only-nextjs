import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userPosts: [],
  friends: [],
  pendingRequests: [],
  userData: null,
  friendshipStatus: null,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUserPosts: (state, action) => {
      state.userPosts = action.payload;
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setPendingRequests: (state, action) => {
      state.pendingRequests = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setFriendshipStatus: (state, action) => {
      state.friendshipStatus = action.payload;
    },
  },
});

export const { setUserPosts, setFriends, setPendingRequests, setUserData, setFriendshipStatus } = accountSlice.actions;

export default accountSlice.reducer;