import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>MembersOnly</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
