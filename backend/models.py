from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime


class TrainingDataItem(BaseModel):
    id: str
    message: str
    reply: str
    timestamp: str


class TrainingDataCreate(BaseModel):
    message: str
    reply: str


class TrainingDataUpdate(BaseModel):
    id: str
    message: str
    reply: str


class ReplyRequest(BaseModel):
    message: str


class ReplyResponse(BaseModel):
    reply: str


class SentReplyItem(BaseModel):
    id: str
    message: str
    reply: str
    mode: Literal['ai', 'manual']
    timestamp: str


class SentReplyCreate(BaseModel):
    message: str
    reply: str
    mode: Literal['ai', 'manual']


class FacebookConfig(BaseModel):
    pageId: str
    pageName: Optional[str] = ""
    accessToken: str
    verifyToken: str
    webhookUrl: Optional[str] = ""
    isConnected: bool = False


class WebhookLog(BaseModel):
    timestamp: str
    type: str
    data: dict


class StatsResponse(BaseModel):
    totalTrainingData: int
    lastUpdated: str


class ChatMessage(BaseModel):
    role: Literal['user', 'assistant', 'system']
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
