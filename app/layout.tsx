import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'illness.lol',
  description: 'your corner of the internet.',
  icons: {
    icon: '/icon.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}