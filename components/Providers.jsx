"use client"

import { SessionProvider } from "next-auth/react";
import { PusherProvider } from "@/lib/pusherContext";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <PusherProvider>
        {children}
      </PusherProvider>
    </SessionProvider>
  );
}