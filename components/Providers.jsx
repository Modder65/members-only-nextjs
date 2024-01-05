"use client"

import { PusherLikesProvider } from "@/app/context/PusherLikes";
import { PusherFriendsProvider } from "@/app/context/PusherFriends"; 
import { ReduxProvider } from '@/redux/provider';
import AuthContext from "@/app/context/AuthContext";

export function Providers({ children }) {
  return (
    <AuthContext>
      <ReduxProvider>
        <PusherLikesProvider>
          <PusherFriendsProvider>
            {children}
          </PusherFriendsProvider>
        </PusherLikesProvider>
      </ReduxProvider>
    </AuthContext>
  );
}