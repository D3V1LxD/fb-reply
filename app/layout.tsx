'use client'

import './globals.css'
import Navigation from './components/Navigation'
import { usePathname } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <html lang="en">
      <body>
        {!isLoginPage && <Navigation />}
        <main className={isLoginPage ? '' : 'main-content'}>
          {isLoginPage ? (
            children
          ) : (
            <ProtectedRoute>{children}</ProtectedRoute>
          )}
        </main>
      </body>
    </html>
  )
}
