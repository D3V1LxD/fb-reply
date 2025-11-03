'use client'

import { useState, useEffect } from 'react'
import { replyAPI, sendReplyAPI } from '@/lib/api'

interface SentReply {
  id: string
  message: string
  reply: string
  timestamp: string
  mode: 'ai' | 'manual'
}

export default function SendPage() {
  const [inputMessage, setInputMessage] = useState('')
  const [customReply, setCustomReply] = useState('')
  const [mode, setMode] = useState<'ai' | 'manual'>('manual')
  const [aiReply, setAiReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null)
  const [sentHistory, setSentHistory] = useState<SentReply[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (showHistory) {
      loadHistory()
    }
  }, [showHistory])

  const loadHistory = async () => {
    try {
      const history = await sendReplyAPI.getHistory()
      setSentHistory(history)
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const handleGetAiSuggestion = async () => {
    if (!inputMessage.trim()) {
      setAlert({ type: 'error', message: 'Please enter a message first.' })
      return
    }

    setLoading(true)
    setAlert(null)
    setAiReply('')

    try {
      const reply = await replyAPI.generate(inputMessage)
      setAiReply(reply)
      setCustomReply(reply) // Auto-fill the custom reply field
    } catch (err) {
      setAlert({ type: 'error', message: err instanceof Error ? err.message : 'An error occurred. Please check your API key.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSendReply = async () => {
    if (!inputMessage.trim()) {
      setAlert({ type: 'error', message: 'Please enter a message.' })
      return
    }

    if (mode === 'manual' && !customReply.trim()) {
      setAlert({ type: 'error', message: 'Please enter a custom reply.' })
      return
    }

    if (mode === 'ai' && !aiReply.trim()) {
      setAlert({ type: 'error', message: 'Please get AI suggestion first.' })
      return
    }

    const replyToSend = mode === 'manual' ? customReply : aiReply

    try {
      const data = await sendReplyAPI.send(inputMessage, replyToSend, mode)
      setAlert({ type: 'success', message: 'Reply sent successfully!' })
      
      // Add to history
      setSentHistory([data.data, ...sentHistory])
      
      // Clear form
      setInputMessage('')
      setCustomReply('')
      setAiReply('')
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => setAlert(null), 3000)
    } catch (error) {
      setAlert({ type: 'error', message: error instanceof Error ? error.message : 'An error occurred while sending the reply.' })
    }
  }

  const handleClear = () => {
    setInputMessage('')
    setCustomReply('')
    setAiReply('')
    setAlert(null)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Send Reply</h1>
        <p>Send custom replies manually or use AI suggestions</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Reply Mode</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setMode('manual')}
            className={`btn ${mode === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
          >
            ✍️ Manual Reply
          </button>
          <button
            onClick={() => setMode('ai')}
            className={`btn ${mode === 'ai' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🤖 AI Assisted
          </button>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="input-message">
            Received Message
          </label>
          <textarea
            id="input-message"
            className="form-textarea"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Enter the message you received..."
            style={{ minHeight: '100px' }}
          />
        </div>

        {mode === 'ai' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={handleGetAiSuggestion}
              className="btn btn-secondary"
              disabled={loading}
            >
              {loading ? 'Getting Suggestion...' : '💡 Get AI Suggestion'}
            </button>
          </div>
        )}

        {mode === 'ai' && aiReply && (
          <div className="result-box" style={{ marginBottom: '1.5rem' }}>
            <div className="result-label">AI Suggested Reply:</div>
            <div className="result-text">{aiReply}</div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="custom-reply">
            {mode === 'manual' ? 'Your Custom Reply' : 'Edit AI Reply (Optional)'}
          </label>
          <textarea
            id="custom-reply"
            className="form-textarea"
            value={customReply}
            onChange={(e) => setCustomReply(e.target.value)}
            placeholder={mode === 'manual' 
              ? 'Type your custom reply here...' 
              : 'Edit the AI suggestion or use as is...'}
            style={{ minHeight: '120px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleSendReply} className="btn btn-primary">
            📤 Send Reply
          </button>
          <button onClick={handleClear} className="btn btn-secondary">
            Clear
          </button>
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            className="btn btn-secondary"
          >
            {showHistory ? 'Hide History' : '📋 View History'}
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="card">
          <h2 className="card-title">Sent Replies History ({sentHistory.length})</h2>
          {sentHistory.length === 0 ? (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              color: 'var(--text-secondary)',
              border: '2px dashed var(--border-color)',
              borderRadius: '8px'
            }}>
              <p>No replies sent yet.</p>
            </div>
          ) : (
            <div className="training-list">
              {sentHistory.map((item) => (
                <div key={item.id} className="training-item">
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600',
                      color: item.mode === 'ai' ? '#7928ca' : '#0070f3',
                      textTransform: 'uppercase'
                    }}>
                      {item.mode === 'ai' ? '🤖 AI Assisted' : '✍️ Manual'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="training-message">📨 {item.message}</div>
                  <div className="training-reply">💬 {item.reply}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h2 className="card-title">How It Works</h2>
        <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          <p><strong>Manual Mode:</strong> Write your own custom reply from scratch.</p>
          <p style={{ marginTop: '0.5rem' }}>
            <strong>AI Assisted Mode:</strong> Get an AI-generated suggestion based on your training data, 
            then edit it or send as-is.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            All sent replies are tracked in the history for your reference.
          </p>
        </div>
      </div>
    </div>
  )
}
