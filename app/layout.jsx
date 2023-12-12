import './globals.css'
import ToasterContext from './context/ToasterContext'
import AuthContext from './context/AuthContext';
import { Nunito } from 'next/font/google'
import { ReduxProvider } from '@/redux/provider';

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
            <ToasterContext />
            {children}
          </AuthContext>
        </ReduxProvider>
      </body>
    </html>
  )
}
