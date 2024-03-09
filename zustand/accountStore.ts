import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { Friendship } from '@prisma/client';

interface AccountState {
  friends: Friendship[];
  pendingRequests: Friendship[];
  userData: any; // Assuming userData can be of any type for now; specify a more accurate type if possible
  friendshipStatus: string | null;
  friendButtonText: string;
  userRequestsLoaded: boolean;
  setFriends: (friends: Friendship[]) => void;
  setPendingRequests: (requests: Friendship[]) => void;
  setUserData: (userData: any) => void;
  setFriendshipStatus: (status: string | null) => void;
  setFriendButtonText: (text: string) => void;
  setUserRequestsLoaded: (loaded: boolean) => void;
  addPendingRequest: (request: Friendship) => void;
  removePendingRequest: (requestId: string) => void;
  addFriend: (friend: Friendship) => void;
  removeFriend: (friendId: string) => void;
}

const useAccountStore = create<AccountState>(
  combine({
    friends: [] as Friendship[],
    pendingRequests: [] as Friendship[],
    userData: null,
    friendshipStatus: null,
    friendButtonText: 'Friend',
    userRequestsLoaded: false,
  }, (set) => ({
    setFriends: (friends) => set({ friends }),
    setPendingRequests: (pendingRequests) => set({ pendingRequests }),
    setUserData: (userData) => set({ userData }),
    setFriendshipStatus: (friendshipStatus) => set({ friendshipStatus }),
    setFriendButtonText: (friendButtonText) => set({ friendButtonText }),
    setUserRequestsLoaded: (userRequestsLoaded) => set({ userRequestsLoaded }),
    addPendingRequest: (request) => set((state) => ({ pendingRequests: [...state.pendingRequests, request] })),
    removePendingRequest: (requestId) => set((state) => ({ pendingRequests: state.pendingRequests.filter((req) => req.id !== requestId) })),
    addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
    removeFriend: (friendId) => set((state) => ({ friends: state.friends.filter((friend) => friend.id !== friendId) })),
  }))
);

export default useAccountStore;