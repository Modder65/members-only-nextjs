"use client"

import { PusherLikesProvider } from "@/app/context/PusherLikes";
import { PusherFriendsProvider } from "@/app/context/PusherFriends"; 
import { PusherPostDeleteProvider } from "@/app/context/PusherPostDelete";
import { PusherPostEditProvider } from "@/app/context/PusherPostEdit";
import { ReduxProvider } from '@/redux/provider';
import { ThemeProvider } from "@/app/context/ThemeContext";
import AuthContext from "@/app/context/AuthContext";

export function Providers({ children }) {
  return (
    <AuthContext>
      <ReduxProvider>
        <PusherPostDeleteProvider>
          <PusherPostEditProvider>
            <PusherLikesProvider>
              <PusherFriendsProvider>
                <ThemeProvider>
                  {children}
                </ThemeProvider>
              </PusherFriendsProvider>
            </PusherLikesProvider>
          </PusherPostEditProvider>
        </PusherPostDeleteProvider>
      </ReduxProvider>
    </AuthContext>
  );
}