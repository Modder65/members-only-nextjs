import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userPosts: [],
  friends: [],
  pendingRequests: [],
  userData: null,
  friendshipStatus: null,
  friendButtonText: 'Friend',
  userPostsLoaded: false,
  userRequestsLoaded: false,
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
    setFriendButtonText: (state, action) => {
      state.friendButtonText = action.payload;
    },
    setUserPostsLoaded: (state, action) => {
      state.userPostsLoaded = action.payload;
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
      const newFriendship = {
        id: action.payload.friendshipId,
        sender: action.payload.sender,
        receiver: action.payload.receiver,
        status: 'ACCEPTED', // Assuming 'ACCEPTED' is the status for new friends
      };
    
      const existingFriendshipIndex = state.friends.findIndex(
        friend => friend.id === newFriendship.id
      );
    
      if (existingFriendshipIndex === -1) {
        state.friends.push(newFriendship);
      } else {
        state.friends[existingFriendshipIndex] = newFriendship;
      }
    }
  },
});

export const { 
  setUserPosts, 
  setFriends, 
  setPendingRequests, 
  setUserData, 
  setFriendshipStatus,
  setFriendButtonText,
  setUserPostsLoaded,
  setUserRequestsLoaded,
  addPendingRequest,
  removePendingRequest,
  addFriend
 } = accountSlice.actions;

export default accountSlice.reducer;