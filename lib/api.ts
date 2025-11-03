/**
 * API Client for Python Backend
 * Centralized API communication layer
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface TrainingDataItem {
  id: string;
  message: string;
  reply: string;
  timestamp: string;
}

export interface SentReplyItem {
  id: string;
  message: string;
  reply: string;
  mode: 'ai' | 'manual';
  timestamp: string;
}

export interface FacebookConfig {
  pageId: string;
  pageName?: string;
  accessToken: string;
  verifyToken: string;
  webhookUrl?: string;
  isConnected: boolean;
}

export interface Stats {
  totalTrainingData: number;
  lastUpdated: string;
}

/**
 * Training Data API
 */
export const trainingAPI = {
  add: async (message: string, reply: string) => {
    const res = await fetch(`${API_URL}/api/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, reply }),
    });
    if (!res.ok) throw new Error('Failed to add training data');
    return res.json();
  },

  getAll: async (): Promise<TrainingDataItem[]> => {
    const res = await fetch(`${API_URL}/api/training-data`);
    if (!res.ok) throw new Error('Failed to fetch training data');
    const data = await res.json();
    return data.data;
  },

  update: async (id: string, message: string, reply: string) => {
    const res = await fetch(`${API_URL}/api/training-data`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, message, reply }),
    });
    if (!res.ok) throw new Error('Failed to update training data');
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_URL}/api/training-data?id=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete training data');
    return res.json();
  },
};

/**
 * AI Reply API
 */
export const replyAPI = {
  generate: async (message: string): Promise<string> => {
    const res = await fetch(`${API_URL}/api/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error('Failed to generate reply');
    const data = await res.json();
    return data.reply;
  },

  // Streaming chat endpoint
  streamChat: async (messages: Array<{ role: string; content: string }>) => {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error('Failed to start chat stream');
    return res.body;
  },
};

/**
 * Send Reply API
 */
export const sendReplyAPI = {
  send: async (message: string, reply: string, mode: 'ai' | 'manual') => {
    const res = await fetch(`${API_URL}/api/send-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, reply, mode }),
    });
    if (!res.ok) throw new Error('Failed to send reply');
    return res.json();
  },

  getHistory: async (): Promise<SentReplyItem[]> => {
    const res = await fetch(`${API_URL}/api/send-reply`);
    if (!res.ok) throw new Error('Failed to fetch reply history');
    const data = await res.json();
    return data.data;
  },
};

/**
 * Facebook Integration API
 */
export const facebookAPI = {
  getConfig: async (): Promise<FacebookConfig | null> => {
    const res = await fetch(`${API_URL}/api/facebook/config`);
    if (!res.ok) throw new Error('Failed to fetch Facebook config');
    const data = await res.json();
    return data.config;
  },

  saveConfig: async (config: FacebookConfig) => {
    const res = await fetch(`${API_URL}/api/facebook/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Failed to save Facebook config');
    return res.json();
  },

  test: async () => {
    const res = await fetch(`${API_URL}/api/facebook/test`, {
      method: 'POST',
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to test Facebook connection');
    }
    return res.json();
  },
};

/**
 * Statistics API
 */
export const statsAPI = {
  get: async (): Promise<Stats> => {
    const res = await fetch(`${API_URL}/api/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },
};

/**
 * Health Check
 */
export const healthAPI = {
  check: async () => {
    const res = await fetch(`${API_URL}/`);
    if (!res.ok) throw new Error('Backend is not responding');
    return res.json();
  },
};
