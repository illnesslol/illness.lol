import type { Metadata } from 'next'
import './globals.css'
import { PageTransitionProvider } from '../components/PageTransition'

export const metadata: Metadata = {
  title: 'illness.lol',
  description: 'your corner of the internet.',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  )
}