'use client'

import { useState } from 'react'
import { trainingAPI } from '@/lib/api'

export default function TrainPage() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || !reply.trim()) {
      setAlert({ type: 'error', message: 'Please fill in both message and reply fields.' })
      return
    }

    setLoading(true)
    setAlert(null)

    try {
      await trainingAPI.add(message, reply)
      setAlert({ type: 'success', message: 'Training data added successfully!' })
      setMessage('')
      setReply('')
    } catch (error) {
      setAlert({ type: 'error', message: error instanceof Error ? error.message : 'Failed to add training data.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Train Your AI</h1>
        <p>Add examples to teach the AI how to respond to specific messages</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Add Training Example</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="message">
              Input Message
            </label>
            <textarea
              id="message"
              className="form-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter the message that should trigger this reply..."
              disabled={loading}
            />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              This is the message the AI will learn to recognize.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reply">
              Expected Reply
            </label>
            <textarea
              id="reply"
              className="form-textarea"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Enter the reply you want the AI to give..."
              disabled={loading}
            />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              This is the response the AI should provide for similar messages.
            </p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Training Data'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="card-title">Training Tips</h2>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '2', color: 'var(--text-secondary)' }}>
          <li>Add multiple examples with variations to improve AI understanding</li>
          <li>Be specific with your replies to get more accurate responses</li>
          <li>Include different phrasings of the same question</li>
          <li>The more training data you provide, the better the AI will perform</li>
        </ul>
      </div>
    </div>
  )
}
