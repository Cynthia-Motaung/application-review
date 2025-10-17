import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SchoolRegister Admin',
  description: 'Student Application Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}