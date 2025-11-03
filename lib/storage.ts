import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'training-data.json')
const SENT_REPLIES_FILE = path.join(DATA_DIR, 'sent-replies.json')
const FACEBOOK_CONFIG_FILE = path.join(DATA_DIR, 'facebook-config.json')
const WEBHOOK_LOGS_FILE = path.join(DATA_DIR, 'webhook-logs.json')

export interface TrainingDataItem {
  id: string
  message: string
  reply: string
  timestamp: string
}

export interface SentReplyItem {
  id: string
  message: string
  reply: string
  mode: 'ai' | 'manual'
  timestamp: string
}

export interface FacebookConfig {
  pageId: string
  pageName: string
  accessToken: string
  verifyToken: string
  webhookUrl: string
  isConnected: boolean
}

export interface WebhookLog {
  timestamp: string
  type: string
  data: any
}

export async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function getTrainingData(): Promise<TrainingDataItem[]> {
  await ensureDataDirectory()
  
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

export async function saveTrainingData(data: TrainingDataItem[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function getSentReplies(): Promise<SentReplyItem[]> {
  await ensureDataDirectory()
  
  try {
    const data = await fs.readFile(SENT_REPLIES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

export async function saveSentReplies(data: SentReplyItem[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(SENT_REPLIES_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function getFacebookConfig(): Promise<FacebookConfig | null> {
  await ensureDataDirectory()
  
  try {
    const data = await fs.readFile(FACEBOOK_CONFIG_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

export async function saveFacebookConfig(config: FacebookConfig): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(FACEBOOK_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
}

export async function getWebhookLogs(): Promise<WebhookLog[]> {
  await ensureDataDirectory()
  
  try {
    const data = await fs.readFile(WEBHOOK_LOGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export async function saveWebhookLog(log: WebhookLog): Promise<void> {
  await ensureDataDirectory()
  
  const logs = await getWebhookLogs()
  logs.unshift(log) // Add to beginning
  
  // Keep only last 100 logs
  const trimmedLogs = logs.slice(0, 100)
  
  await fs.writeFile(WEBHOOK_LOGS_FILE, JSON.stringify(trimmedLogs, null, 2), 'utf-8')
}
