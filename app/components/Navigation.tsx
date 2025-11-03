'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { auth } from '@/lib/auth'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const user = auth.getUser()
    setUsername(user?.username || null)
  }, [pathname])

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          AI Reply System
        </Link>
        <ul className="nav-links">
          <li>
            <Link href="/" className={pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/train" className={pathname === '/train' ? 'active' : ''}>
              Train
            </Link>
          </li>
          <li>
            <Link href="/test" className={pathname === '/test' ? 'active' : ''}>
              Test
            </Link>
          </li>
          <li>
            <Link href="/send" className={pathname === '/send' ? 'active' : ''}>
              Send Reply
            </Link>
          </li>
          <li>
            <Link href="/facebook" className={pathname === '/facebook' ? 'active' : ''}>
              Facebook
            </Link>
          </li>
          <li>
            <Link href="/manage" className={pathname === '/manage' ? 'active' : ''}>
              Manage
            </Link>
          </li>
        </ul>
        
        {username && (
          <div className="nav-user">
            <span className="nav-username">👤 {username}</span>
            <button 
              onClick={() => auth.logout()}
              className="nav-logout"
              style={{
                marginLeft: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
