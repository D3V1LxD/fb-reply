'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { statsAPI } from '@/lib/api'

interface Stats {
  totalTrainingData: number
  lastUpdated: string
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({ totalTrainingData: 0, lastUpdated: 'Never' })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await statsAPI.get()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>AI Reply Training System</h1>
        <p>Train your AI assistant to respond to messages with custom replies</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalTrainingData}</div>
          <div className="stat-label">Training Examples</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.lastUpdated}</div>
          <div className="stat-label">Last Updated</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Getting Started</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Welcome to the AI Reply Training System. This application allows you to train an AI assistant
          to respond to specific messages with custom replies.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/train" className="btn btn-primary">
            Start Training
          </Link>
          <Link href="/send" className="btn btn-primary">
            Send Reply
          </Link>
          <Link href="/facebook" className="btn btn-primary">
            Connect Facebook
          </Link>
          <Link href="/test" className="btn btn-secondary">
            Test Responses
          </Link>
          <Link href="/manage" className="btn btn-secondary">
            Manage Training Data
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">How It Works</h2>
        <ol style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
          <li><strong>Train:</strong> Add examples of messages and the replies you want the AI to give.</li>
          <li><strong>Test:</strong> Test how the AI responds to new messages based on your training.</li>
          <li><strong>Send Reply:</strong> Send custom replies manually or use AI suggestions.</li>
          <li><strong>Facebook:</strong> Connect your Facebook Page to auto-reply to messages.</li>
          <li><strong>Manage:</strong> View, edit, or delete your training data.</li>
        </ol>
      </div>

      <div className="card">
        <h2 className="card-title">Setup Instructions</h2>
        <div className="alert alert-warning">
          <strong>Important:</strong> Make sure to set up your OpenAI API key in the <code>.env.local</code> file
          before using the system.
        </div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Copy <code>.env.local.example</code> to <code>.env.local</code> and add your OpenAI API key.
        </p>
      </div>
    </div>
  )
}
