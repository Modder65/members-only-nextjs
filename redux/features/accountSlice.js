import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  friends: [],
  pendingRequests: [],
  userData: null,
  friendshipStatus: null,
  friendButtonText: 'Friend',
  userRequestsLoaded: false,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
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
  setFriends, 
  setPendingRequests, 
  setUserData, 
  setFriendshipStatus,
  setFriendButtonText,
  setUserRequestsLoaded,
  addPendingRequest,
  removePendingRequest,
  addFriend,
  removeFriend
 } = accountSlice.actions;

export default accountSlice.reducer;