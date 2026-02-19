import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import localFont from 'next/font/local'
import './globals.css'

import AllProviders from '@/providers'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Shadcn Form Builder',
  description: 'Shadcn Form Builder',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <AllProviders>
          <main className="min-h-[70vh]">{children}</main>
        </AllProviders>
      </body>
    </html>
  )
}
