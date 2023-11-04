'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthContextProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={inter.className}>
        <AuthContextProvider>
            {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}
