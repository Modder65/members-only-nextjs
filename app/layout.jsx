"use client"

import './globals.css'
import ToasterContext from './context/ToasterContext'
import AuthContext from './context/AuthContext';
import { Nunito } from 'next/font/google'
import { ReduxProvider } from '@/redux/provider';
import { RealTimeProvider } from './context/PusherContext';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js

const FriendsModal = dynamic(() => import('./users/components/FriendModal'), { ssr: false });


const nunito = Nunito({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>MembersOnly</title>
      </head>
      <body className={`bg-neutral-100 ${nunito.className}`}>
        <ReduxProvider>
          <AuthContext>
            <RealTimeProvider>
              <ToasterContext />
              {children}
              <FriendsModal /> 
            </RealTimeProvider>
          </AuthContext>
        </ReduxProvider>
      </body>
    </html>
  )
}
