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
      // Assuming the payload contains the complete friendship object including user and friend details
      const newFriendship = {
        id: action.payload.id,  // Friendship ID
        senderId: action.payload.senderId,
        receiverId: action.payload.receiverId,
        status: action.payload.status,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
        user: action.payload.user,  // User who sent the request
        friend: action.payload.friend,  // Friend who received the request
      };
    
      // Check if the friendship already exists in the state
      const existingFriendshipIndex = state.friends.findIndex(friend => friend.id === newFriendship.id);
    
      // Update the existing friendship or add a new one
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