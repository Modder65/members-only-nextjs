"use client"

import './globals.css'
import ToasterContext from './context/ToasterContext'
import { Nunito } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/components/Providers';

const nunito = Nunito({ subsets: ['latin'] })

export default function RootLayout({ children }) {

  return (
    <Providers>
      <html lang="en">
        <head>
          <title>MembersOnly</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </head>
        {/* margin and overflowY properties are needed to prevent gap and removed scrollbar when opening shadcnui user dropdown menu*/}
        <body className={`custom-gradient ${nunito.className}`} style={{ margin: '0px !important', overflowY: 'scroll !important' }}>
          <ToasterContext />
          <Toaster />
          {children}
        </body>
      </html>
    </Providers>
  )
}
