"use client"

import { PusherLikesProvider } from "@/app/context/PusherLikes";
import { PusherFriendsProvider } from "@/app/context/PusherFriends"; 
import { PusherPostsProvider } from "@/app/context/PusherPosts";
import { ReduxProvider } from '@/redux/provider';
import AuthContext from "@/app/context/AuthContext";

export function Providers({ children }) {
  return (
    <AuthContext>
      <ReduxProvider>
        <PusherPostsProvider>
          <PusherLikesProvider>
            <PusherFriendsProvider>
              {children}
            </PusherFriendsProvider>
          </PusherLikesProvider>
        </PusherPostsProvider>
      </ReduxProvider>
    </AuthContext>
  );
}