'use client'

import { useState, useEffect } from 'react'
import { facebookAPI } from '@/lib/api'

interface WebhookConfig {
  pageId: string
  pageName: string
  accessToken: string
  verifyToken: string
  webhookUrl: string
  isConnected: boolean
}

export default function FacebookPage() {
  const [config, setConfig] = useState<WebhookConfig>({
    pageId: '',
    pageName: '',
    accessToken: '',
    verifyToken: '',
    webhookUrl: '',
    isConnected: false
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null)
  const [webhookStatus, setWebhookStatus] = useState<string>('Not configured')
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    loadConfig()
    generateWebhookUrl()
  }, [])

  const generateWebhookUrl = () => {
    if (typeof window !== 'undefined') {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      setConfig(prev => ({ ...prev, webhookUrl: `${API_URL}/api/webhook/facebook` }))
    }
  }

  const loadConfig = async () => {
    try {
      const data = await facebookAPI.getConfig()
      if (data) {
        setConfig(prev => ({ ...prev, ...data }))
        setWebhookStatus(data.isConnected ? 'Connected' : 'Not connected')
      }
    } catch (error) {
      console.error('Error loading config:', error)
    }
  }

  const handleSaveConfig = async () => {
    if (!config.pageId || !config.accessToken || !config.verifyToken) {
      setAlert({ type: 'error', message: 'Please fill in all required fields.' })
      return
    }

    setLoading(true)
    setAlert(null)

    try {
      await facebookAPI.saveConfig(config)
      setAlert({ type: 'success', message: 'Configuration saved successfully!' })
      setWebhookStatus('Configured (awaiting connection)')
      await loadConfig()
    } catch (error) {
      setAlert({ type: 'error', message: error instanceof Error ? error.message : 'Failed to save configuration.' })
    } finally {
      setLoading(false)
    }
  }

  const handleTestWebhook = async () => {
    setLoading(true)
    setAlert(null)

    try {
      const data = await facebookAPI.test()
      setAlert({ type: 'success', message: 'Webhook is working correctly!' })
      setWebhookStatus('Connected and verified')
      setConfig(prev => ({ ...prev, isConnected: true }))
    } catch (error) {
      setAlert({ type: 'error', message: error instanceof Error ? error.message : 'Failed to test webhook.' })
    } finally {
      setLoading(false)
    }
  }

  const generateVerifyToken = () => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setConfig(prev => ({ ...prev, verifyToken: token }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setAlert({ type: 'success', message: 'Copied to clipboard!' })
    setTimeout(() => setAlert(null), 2000)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Facebook Integration</h1>
        <p>Connect your Facebook Page to receive and reply to messages</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="card-title" style={{ marginBottom: 0 }}>Connection Status</h2>
          <span style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600',
            backgroundColor: config.isConnected ? '#d1fae5' : '#fee2e2',
            color: config.isConnected ? '#065f46' : '#991b1b'
          }}>
            {webhookStatus}
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          {config.isConnected 
            ? '✅ Your Facebook page is connected and ready to receive messages.'
            : '⚠️ Configure and connect your Facebook page to start receiving messages.'}
        </p>
      </div>

      <div className="card">
        <h2 className="card-title">Webhook Configuration</h2>
        
        <div className="form-group">
          <label className="form-label">Webhook URL (Read-only)</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              value={config.webhookUrl}
              readOnly
              style={{ backgroundColor: '#f9fafb' }}
            />
            <button 
              onClick={() => copyToClipboard(config.webhookUrl)}
              className="btn btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              📋 Copy
            </button>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Use this URL in your Facebook App webhook settings
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Verify Token *</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              value={config.verifyToken}
              onChange={(e) => setConfig({ ...config, verifyToken: e.target.value })}
              placeholder="Enter or generate a verify token"
            />
            <button 
              onClick={generateVerifyToken}
              className="btn btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              🔄 Generate
            </button>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Use this token to verify your webhook in Facebook Developer Console
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="page-id">Facebook Page ID *</label>
          <input
            id="page-id"
            type="text"
            className="form-input"
            value={config.pageId}
            onChange={(e) => setConfig({ ...config, pageId: e.target.value })}
            placeholder="Enter your Facebook Page ID"
          />
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Find this in your Facebook Page settings or About section
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="page-name">Page Name (Optional)</label>
          <input
            id="page-name"
            type="text"
            className="form-input"
            value={config.pageName}
            onChange={(e) => setConfig({ ...config, pageName: e.target.value })}
            placeholder="Enter your Facebook Page name"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="access-token">Page Access Token *</label>
          <input
            id="access-token"
            type="password"
            className="form-input"
            value={config.accessToken}
            onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
            placeholder="Enter your Page Access Token"
          />
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Generate this token from Facebook Developer Console
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleSaveConfig}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : '💾 Save Configuration'}
          </button>
          <button 
            onClick={handleTestWebhook}
            className="btn btn-secondary"
            disabled={loading || !config.pageId}
          >
            🧪 Test Webhook
          </button>
          <button 
            onClick={() => setShowInstructions(!showInstructions)}
            className="btn btn-secondary"
          >
            {showInstructions ? '👆 Hide' : '📖 Show'} Instructions
          </button>
        </div>
      </div>

      {showInstructions && (
        <div className="card">
          <h2 className="card-title">Setup Instructions</h2>
          
          <div style={{ lineHeight: '1.8' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
              Step 1: Create a Facebook App
            </h3>
            <ol style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
              <li>Go to <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>Facebook Developers</a></li>
              <li>Click "My Apps" → "Create App"</li>
              <li>Select "Business" as app type</li>
              <li>Fill in app details and create the app</li>
            </ol>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
              Step 2: Add Messenger Product
            </h3>
            <ol style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
              <li>In your app dashboard, click "Add Product"</li>
              <li>Find "Messenger" and click "Set Up"</li>
              <li>In the Messenger settings, find "Access Tokens"</li>
              <li>Add or select your Facebook Page</li>
              <li>Generate a Page Access Token and copy it</li>
              <li>Paste the token in the "Page Access Token" field above</li>
            </ol>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
              Step 3: Configure Webhook
            </h3>
            <ol style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
              <li>Click "Generate" to create a Verify Token above</li>
              <li>Copy the Webhook URL and Verify Token</li>
              <li>In Messenger settings, find "Webhooks" section</li>
              <li>Click "Add Callback URL"</li>
              <li>Paste the Webhook URL and Verify Token</li>
              <li>Click "Verify and Save"</li>
              <li>Subscribe to webhook fields: <code>messages</code>, <code>messaging_postbacks</code>, <code>message_echoes</code></li>
            </ol>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
              Step 4: Subscribe to Page Events
            </h3>
            <ol style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
              <li>In the Webhooks section, find your page</li>
              <li>Click "Subscribe" to subscribe the webhook to your page</li>
              <li>Make sure the following events are selected:
                <ul style={{ marginTop: '0.5rem' }}>
                  <li>messages</li>
                  <li>messaging_postbacks</li>
                  <li>message_deliveries</li>
                  <li>message_reads</li>
                </ul>
              </li>
            </ol>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
              Step 5: Test Your Integration
            </h3>
            <ol style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
              <li>Fill in all fields on this page (Page ID, Access Token, Verify Token)</li>
              <li>Click "Save Configuration"</li>
              <li>Click "Test Webhook" to verify the connection</li>
              <li>Send a test message to your Facebook Page</li>
              <li>The webhook should receive the message and auto-reply based on your training data</li>
            </ol>

            <div className="alert alert-warning">
              <strong>Important:</strong> Make sure your app is in "Development Mode" for testing. 
              To receive messages from other users, you'll need to submit your app for Facebook review 
              and get the <code>pages_messaging</code> permission approved.
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">How It Works</h2>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          Once configured, when someone sends a message to your Facebook Page:
        </p>
        <ol style={{ paddingLeft: '1.5rem', lineHeight: '2', marginTop: '1rem' }}>
          <li>Facebook sends the message to your webhook URL</li>
          <li>The system analyzes the message using your training data</li>
          <li>AI generates an appropriate reply based on your training examples</li>
          <li>The reply is automatically sent back to the user via Facebook Messenger</li>
          <li>All interactions are logged for your reference</li>
        </ol>
      </div>
    </div>
  )
}
