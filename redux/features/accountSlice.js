import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userPosts: [],
  othersPosts: [],
  friends: [],
  pendingRequests: [],
  userData: null,
  friendshipStatus: null,
  friendButtonText: 'Friend',
  userPostsLoaded: false,
  othersPostsLoaded: false,
  userRequestsLoaded: false,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUserPosts: (state, action) => {
      state.userPosts = [...state.userPosts, ...action.payload];
    },
    setOthersPosts: (state, action) => {
      state.othersPosts = action.payload;
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
    setFriendButtonText: (state, action) => {
      state.friendButtonText = action.payload;
    },
    setUserPostsLoaded: (state, action) => {
      state.userPostsLoaded = action.payload;
    },
    setOthersPostsLoaded: (state, action) => {
      state.othersPostsLoaded = action.payload;
    },
    setUserRequestsLoaded: (state, action) => {
      state.userRequestsLoaded = action.payload;
    },
    addPendingRequest: (state, action) => {
      state.pendingRequests.push(action.payload);
    },
    removePendingRequest: (state, action) => {
      state.pendingRequests = state.pendingRequests.filter(req => req.id !== action.payload);
    },
    addFriend: (state, action) => {
      state.friends.push(action.payload);
    },
    removeFriend: (state, action) => {
      state.friends = state.friends.filter(friend => friend.id !== action.payload);
    }
  },
});

export const { 
  setUserPosts, 
  setOthersPosts,
  setFriends, 
  setPendingRequests, 
  setUserData, 
  setFriendshipStatus,
  setFriendButtonText,
  setUserPostsLoaded,
  setOthersPostsLoaded,
  setUserRequestsLoaded,
  addPendingRequest,
  removePendingRequest,
  addFriend,
  removeFriend
 } = accountSlice.actions;

export default accountSlice.reducer;