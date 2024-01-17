"use client"

import './globals.css'
import ToasterContext from './context/ToasterContext'
import { Nunito } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/components/Providers';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js

const FriendsModal = dynamic(() => import('./users/components/FriendModal'), { ssr: false });


const nunito = Nunito({ subsets: ['latin'] })

export default function RootLayout({ children }) {

  return (
    <Providers>
      <html lang="en">
        <head>
          <title>MembersOnly</title>
        </head>
        <body className={`custom-gradient ${nunito.className}`}>
          <ToasterContext />
          <Toaster />
          {children}
          <FriendsModal /> 
        </body>
      </html>
    </Providers>
  )
}
