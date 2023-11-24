import './globals.css'
import { Providers } from "../components/Providers.jsx";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>MembersOnly</title>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
