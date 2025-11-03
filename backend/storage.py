import json
import os
import aiofiles
from typing import List, Optional
from datetime import datetime
from models import TrainingDataItem, SentReplyItem, FacebookConfig, WebhookLog

DATA_DIR = "data"
TRAINING_DATA_FILE = os.path.join(DATA_DIR, "training-data.json")
SENT_REPLIES_FILE = os.path.join(DATA_DIR, "sent-replies.json")
FACEBOOK_CONFIG_FILE = os.path.join(DATA_DIR, "facebook-config.json")
WEBHOOK_LOGS_FILE = os.path.join(DATA_DIR, "webhook-logs.json")


def ensure_data_directory():
    """Ensure data directory exists"""
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)


async def get_training_data() -> List[TrainingDataItem]:
    """Get all training data"""
    ensure_data_directory()
    
    if not os.path.exists(TRAINING_DATA_FILE):
        return []
    
    async with aiofiles.open(TRAINING_DATA_FILE, 'r', encoding='utf-8') as f:
        content = await f.read()
        data = json.loads(content)
        return [TrainingDataItem(**item) for item in data]


async def save_training_data(data: List[TrainingDataItem]):
    """Save training data"""
    ensure_data_directory()
    
    json_data = [item.model_dump() for item in data]
    async with aiofiles.open(TRAINING_DATA_FILE, 'w', encoding='utf-8') as f:
        await f.write(json.dumps(json_data, indent=2, ensure_ascii=False))


async def get_sent_replies() -> List[SentReplyItem]:
    """Get all sent replies"""
    ensure_data_directory()
    
    if not os.path.exists(SENT_REPLIES_FILE):
        return []
    
    async with aiofiles.open(SENT_REPLIES_FILE, 'r', encoding='utf-8') as f:
        content = await f.read()
        data = json.loads(content)
        return [SentReplyItem(**item) for item in data]


async def save_sent_replies(data: List[SentReplyItem]):
    """Save sent replies"""
    ensure_data_directory()
    
    json_data = [item.model_dump() for item in data]
    async with aiofiles.open(SENT_REPLIES_FILE, 'w', encoding='utf-8') as f:
        await f.write(json.dumps(json_data, indent=2, ensure_ascii=False))


async def get_facebook_config() -> Optional[FacebookConfig]:
    """Get Facebook configuration"""
    ensure_data_directory()
    
    if not os.path.exists(FACEBOOK_CONFIG_FILE):
        return None
    
    async with aiofiles.open(FACEBOOK_CONFIG_FILE, 'r', encoding='utf-8') as f:
        content = await f.read()
        data = json.loads(content)
        return FacebookConfig(**data)


async def save_facebook_config(config: FacebookConfig):
    """Save Facebook configuration"""
    ensure_data_directory()
    
    async with aiofiles.open(FACEBOOK_CONFIG_FILE, 'w', encoding='utf-8') as f:
        await f.write(json.dumps(config.model_dump(), indent=2, ensure_ascii=False))


async def get_webhook_logs() -> List[WebhookLog]:
    """Get webhook logs"""
    ensure_data_directory()
    
    if not os.path.exists(WEBHOOK_LOGS_FILE):
        return []
    
    async with aiofiles.open(WEBHOOK_LOGS_FILE, 'r', encoding='utf-8') as f:
        content = await f.read()
        data = json.loads(content)
        return [WebhookLog(**item) for item in data]


async def save_webhook_log(log: WebhookLog):
    """Save a webhook log entry"""
    ensure_data_directory()
    
    logs = await get_webhook_logs()
    logs.insert(0, log)  # Add to beginning
    
    # Keep only last 100 logs
    logs = logs[:100]
    
    json_data = [item.model_dump() for item in logs]
    async with aiofiles.open(WEBHOOK_LOGS_FILE, 'w', encoding='utf-8') as f:
        await f.write(json.dumps(json_data, indent=2, ensure_ascii=False))
