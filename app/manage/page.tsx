'use client'

import { useEffect, useState } from 'react'
import { trainingAPI } from '@/lib/api'

interface TrainingData {
  id: string
  message: string
  reply: string
  timestamp: string
}

export default function ManagePage() {
  const [trainingData, setTrainingData] = useState<TrainingData[]>([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editMessage, setEditMessage] = useState('')
  const [editReply, setEditReply] = useState('')

  useEffect(() => {
    fetchTrainingData()
  }, [])

  const fetchTrainingData = async () => {
    try {
      const data = await trainingAPI.getAll()
      setTrainingData(data || [])
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to fetch training data.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this training example?')) {
      return
    }

    try {
      await trainingAPI.delete(id)
      setAlert({ type: 'success', message: 'Training data deleted successfully!' })
      fetchTrainingData()
    } catch (error) {
      setAlert({ type: 'error', message: error instanceof Error ? error.message : 'An error occurred.' })
    }
  }

  const startEdit = (item: TrainingData) => {
    setEditingId(item.id)
    setEditMessage(item.message)
    setEditReply(item.reply)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditMessage('')
    setEditReply('')
  }

  const saveEdit = async (id: string) => {
    try {
      await trainingAPI.update(id, editMessage, editReply)
      setAlert({ type: 'success', message: 'Training data updated successfully!' })
      setEditingId(null)
      fetchTrainingData()
    } catch (error) {
      setAlert({ type: 'error', message: error instanceof Error ? error.message : 'An error occurred.' })
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Manage Training Data</h1>
        <p>View, edit, and delete your AI training examples</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-title" style={{ marginBottom: 0 }}>Training Examples ({trainingData.length})</h2>
          <button onClick={fetchTrainingData} className="btn btn-secondary btn-small">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : trainingData.length === 0 ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: 'var(--text-secondary)',
            border: '2px dashed var(--border-color)',
            borderRadius: '8px'
          }}>
            <p>No training data yet. Start by adding some examples on the Train page.</p>
          </div>
        ) : (
          <div className="training-list">
            {trainingData.map((item) => (
              <div key={item.id} className="training-item">
                {editingId === item.id ? (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-textarea"
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        style={{ minHeight: '80px' }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Reply</label>
                      <textarea
                        className="form-textarea"
                        value={editReply}
                        onChange={(e) => setEditReply(e.target.value)}
                        style={{ minHeight: '80px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => saveEdit(item.id)} className="btn btn-primary btn-small">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary btn-small">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="training-item-header">
                      <div style={{ flex: 1 }}>
                        <div className="training-message">📨 {item.message}</div>
                        <div className="training-reply">💬 {item.reply}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                          Added: {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="training-actions">
                        <button 
                          onClick={() => startEdit(item)} 
                          className="btn btn-secondary btn-small"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="btn btn-danger btn-small"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
