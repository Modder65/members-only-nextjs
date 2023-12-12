import './globals.css'
import ToasterContext from './context/ToasterContext'
import AuthContext from './context/AuthContext';
import { Nunito } from 'next/font/google'

const nunito = Nunito({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>MembersOnly</title>
      </head>
      <body className={`bg-neutral-100 ${nunito.className}`}>
        <AuthContext>
          <ToasterContext />
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
