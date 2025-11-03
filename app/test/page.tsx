'use client'

import { useState } from 'react'
import { replyAPI } from '@/lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function TestPage() {
  const [inputMessage, setInputMessage] = useState('')
  const [aiReply, setAiReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useStreaming, setUseStreaming] = useState(false)

  // Streaming state
  const [streamMessages, setStreamMessages] = useState<Message[]>([])
  const [streamInput, setStreamInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const handleTest = async () => {
    if (!inputMessage.trim()) {
      setError('Please enter a message to test.')
      return
    }

    setLoading(true)
    setError(null)
    setAiReply('')

    try {
      const reply = await replyAPI.generate(inputMessage)
      setAiReply(reply)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setInputMessage('')
    setAiReply('')
    setError(null)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Test AI Responses</h1>
        <p>See how your trained AI responds to messages</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setUseStreaming(false)}
            className={`btn ${!useStreaming ? 'btn-primary' : 'btn-secondary'}`}
          >
            Standard Mode
          </button>
          <button
            onClick={() => setUseStreaming(true)}
            className={`btn ${useStreaming ? 'btn-primary' : 'btn-secondary'}`}
          >
            Streaming Mode
          </button>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {useStreaming 
            ? '🔄 Streaming mode shows AI response in real-time as it generates'
            : '⚡ Standard mode shows complete response at once'}
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {!useStreaming ? (
        <div className="test-container">
          <div className="test-input-section">
            <h2 className="card-title">Input Message</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="test-message">
                Enter a message to test
              </label>
              <textarea
                id="test-message"
                className="form-textarea"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                disabled={loading}
                style={{ minHeight: '200px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleTest} 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Getting Reply...' : 'Get AI Reply'}
              </button>
              <button 
                onClick={handleClear} 
                className="btn btn-secondary"
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="test-result-section">
            <h2 className="card-title">AI Response</h2>
            
            {loading && (
              <div className="loading-spinner"></div>
            )}

            {!loading && aiReply && (
              <div className="result-box">
                <div className="result-label">AI Generated Reply:</div>
                <div className="result-text">{aiReply}</div>
              </div>
            )}

            {!loading && !aiReply && !error && (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                color: 'var(--text-secondary)',
                border: '2px dashed var(--border-color)',
                borderRadius: '8px'
              }}>
                <p>Your AI response will appear here</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <h2 className="card-title">Streaming Chat</h2>
          <div style={{ 
            maxHeight: '400px', 
            overflowY: 'auto', 
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            {streamMessages.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                Start a conversation to see streaming responses
              </p>
            ) : (
              streamMessages.map((m) => (
                <div key={m.id} style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    fontWeight: 'bold',
                    color: m.role === 'user' ? 'var(--primary-color)' : 'var(--secondary-color)',
                    marginBottom: '0.25rem'
                  }}>
                    {m.role === 'user' ? '👤 You:' : '🤖 AI:'}
                  </div>
                  <div style={{ 
                    whiteSpace: 'pre-wrap',
                    padding: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '6px'
                  }}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {isStreaming && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                ⏳ AI is typing...
              </div>
            )}
          </div>
          
          <form onSubmit={async (e) => {
            e.preventDefault()
            if (!streamInput.trim()) return
            
            setIsStreaming(true)
            const userMessage: Message = {
              id: Date.now().toString(),
              role: 'user',
              content: streamInput
            }
            setStreamMessages(prev => [...prev, userMessage])
            setStreamInput('')
            
            try {
              const apiMessages = [
                ...streamMessages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: streamInput }
              ]
              
              const stream = await replyAPI.streamChat(apiMessages as any)
              if (!stream) throw new Error('No stream returned')
              
              const reader = stream.getReader()
              const decoder = new TextDecoder()
              let aiResponse = ''
              
              const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: ''
              }
              setStreamMessages(prev => [...prev, aiMessage])
              
              while (true) {
                const { done, value } = await reader.read()
                if (done) break
                
                const chunk = decoder.decode(value)
                aiResponse += chunk
                
                setStreamMessages(prev => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = {
                    ...aiMessage,
                    content: aiResponse
                  }
                  return newMessages
                })
              }
            } catch (err) {
              console.error('Streaming error:', err)
              const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, an error occurred while generating the response.'
              }
              setStreamMessages(prev => [...prev, errorMessage])
            } finally {
              setIsStreaming(false)
            }
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={streamInput}
                onChange={(e) => setStreamInput(e.target.value)}
                placeholder="Type your message..."
                className="input"
                style={{ flex: 1 }}
                disabled={isStreaming}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isStreaming}
              >
                {isStreaming ? 'Sending...' : 'Send'}
              </button>
              <button
                type="button"
                onClick={() => setStreamMessages([])}
                className="btn btn-secondary"
                disabled={isStreaming}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">How It Works</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          The AI uses GitHub Models API (GPT-4o) along with your training data to generate contextually 
          appropriate replies. It analyzes your input message and compares it with the training 
          examples you've provided to generate the most suitable response.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginTop: '1rem' }}>
          <strong>Streaming Mode:</strong> Experience real-time AI responses with the streaming chat interface, 
          showing responses as they generate in real-time.
        </p>
      </div>
    </div>
  )
}
