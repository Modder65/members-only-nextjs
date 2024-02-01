"use client"

import { PusherLikesProvider } from "@/app/context/PusherLikes";
import { PusherFriendsProvider } from "@/app/context/PusherFriends"; 
import { PusherPostDeleteProvider } from "@/app/context/PusherPostDelete";
import { PusherPostEditProvider } from "@/app/context/PusherPostEdit";
import { ReduxProvider } from '@/redux/provider';
import AuthContext from "@/app/context/AuthContext";

export function Providers({ children }) {
  return (
    <AuthContext>
      <ReduxProvider>
        <PusherPostDeleteProvider>
          <PusherPostEditProvider>
            <PusherLikesProvider>
              <PusherFriendsProvider>
                {children}
              </PusherFriendsProvider>
            </PusherLikesProvider>
          </PusherPostEditProvider>
        </PusherPostDeleteProvider>
      </ReduxProvider>
    </AuthContext>
  );
}