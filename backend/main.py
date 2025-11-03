import os
from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, PlainTextResponse
from dotenv import load_dotenv
from datetime import datetime
import time

from models import (
    TrainingDataCreate, TrainingDataUpdate, TrainingDataItem,
    ReplyRequest, ReplyResponse, SentReplyCreate, SentReplyItem,
    FacebookConfig, StatsResponse, ChatRequest, WebhookLog
)
import storage
from ai_service import ai_service
from facebook_service import test_facebook_connection, handle_facebook_message

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="FB Reply AI Backend",
    description="Python backend for AI-powered Facebook reply system",
    version="1.0.0"
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Training endpoints
@app.post("/api/train")
async def add_training_data(data: TrainingDataCreate):
    """Add new training data"""
    training_data = await storage.get_training_data()
    
    new_entry = TrainingDataItem(
        id=str(int(time.time() * 1000)),
        message=data.message.strip(),
        reply=data.reply.strip(),
        timestamp=datetime.utcnow().isoformat()
    )
    
    training_data.append(new_entry)
    await storage.save_training_data(training_data)
    
    return {
        "success": True,
        "message": "Training data added successfully",
        "data": new_entry
    }


@app.get("/api/training-data")
async def get_training_data():
    """Get all training data"""
    data = await storage.get_training_data()
    return {"data": data}


@app.put("/api/training-data")
async def update_training_data(data: TrainingDataUpdate):
    """Update training data"""
    training_data = await storage.get_training_data()
    
    for i, item in enumerate(training_data):
        if item.id == data.id:
            training_data[i] = TrainingDataItem(
                id=data.id,
                message=data.message.strip(),
                reply=data.reply.strip(),
                timestamp=datetime.utcnow().isoformat()
            )
            await storage.save_training_data(training_data)
            return {
                "success": True,
                "message": "Training data updated successfully",
                "data": training_data[i]
            }
    
    raise HTTPException(status_code=404, detail="Training data not found")


@app.delete("/api/training-data")
async def delete_training_data(id: str = Query(...)):
    """Delete training data"""
    training_data = await storage.get_training_data()
    filtered_data = [item for item in training_data if item.id != id]
    
    if len(filtered_data) == len(training_data):
        raise HTTPException(status_code=404, detail="Training data not found")
    
    await storage.save_training_data(filtered_data)
    return {"success": True, "message": "Training data deleted successfully"}


# AI Reply endpoints
@app.post("/api/reply", response_model=ReplyResponse)
async def generate_reply(request: ReplyRequest):
    """Generate AI reply (non-streaming)"""
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")
    
    reply = await ai_service.generate_reply(request.message)
    return ReplyResponse(reply=reply)


@app.post("/api/chat")
async def generate_chat_reply(request: ChatRequest):
    """Generate AI reply (streaming)"""
    async def stream_response():
        async for chunk in ai_service.generate_reply_stream(request.messages):
            yield chunk
    
    return StreamingResponse(stream_response(), media_type="text/plain")


# Send Reply endpoints
@app.post("/api/send-reply")
async def send_reply(data: SentReplyCreate):
    """Send custom reply"""
    sent_replies = await storage.get_sent_replies()
    
    new_entry = SentReplyItem(
        id=str(int(time.time() * 1000)),
        message=data.message.strip(),
        reply=data.reply.strip(),
        mode=data.mode,
        timestamp=datetime.utcnow().isoformat()
    )
    
    sent_replies.insert(0, new_entry)
    await storage.save_sent_replies(sent_replies)
    
    return {
        "success": True,
        "message": "Reply sent successfully",
        "data": new_entry
    }


@app.get("/api/send-reply")
async def get_sent_replies():
    """Get sent replies history"""
    data = await storage.get_sent_replies()
    return {"data": data}


# Facebook Integration endpoints
@app.get("/api/facebook/config")
async def get_facebook_config():
    """Get Facebook configuration"""
    config = await storage.get_facebook_config()
    return {"config": config}


@app.post("/api/facebook/config")
async def save_facebook_config(config: FacebookConfig):
    """Save Facebook configuration"""
    if not config.pageId or not config.accessToken or not config.verifyToken:
        raise HTTPException(
            status_code=400,
            detail="Page ID, Access Token, and Verify Token are required"
        )
    
    await storage.save_facebook_config(config)
    return {"success": True, "message": "Configuration saved successfully"}


@app.post("/api/facebook/test")
async def test_facebook_webhook():
    """Test Facebook connection"""
    config = await storage.get_facebook_config()
    
    if not config or not config.pageId or not config.accessToken:
        raise HTTPException(
            status_code=400,
            detail="Facebook integration not configured"
        )
    
    try:
        page_data = await test_facebook_connection(config.pageId, config.accessToken)
        return {
            "success": True,
            "message": "Webhook is configured correctly",
            "pageData": page_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Facebook Webhook endpoints
@app.get("/api/webhook/facebook")
async def verify_facebook_webhook(
    request: Request,
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge")
):
    """Facebook webhook verification"""
    print(f"Webhook verification: mode={hub_mode}, token={hub_verify_token}")
    
    if hub_mode == "subscribe":
        config = await storage.get_facebook_config()
        
        if config and hub_verify_token == config.verifyToken:
            print("Webhook verified successfully")
            return PlainTextResponse(content=hub_challenge)
        else:
            print("Verification failed: token mismatch")
            raise HTTPException(status_code=403, detail="Verification token mismatch")
    
    raise HTTPException(status_code=400, detail="Invalid verification request")


@app.post("/api/webhook/facebook")
async def handle_facebook_webhook(request: Request):
    """Handle Facebook webhook events"""
    body = await request.json()
    print(f"Webhook received: {body}")
    
    # Log webhook event
    await storage.save_webhook_log(WebhookLog(
        timestamp=datetime.utcnow().isoformat(),
        type="incoming",
        data=body
    ))
    
    if body.get("object") == "page":
        for entry in body.get("entry", []):
            for event in entry.get("messaging", []):
                # Handle message
                if "message" in event and not event["message"].get("is_echo"):
                    sender_id = event["sender"]["id"]
                    message_text = event["message"].get("text", "")
                    
                    if message_text:
                        config = await storage.get_facebook_config()
                        if config and config.accessToken:
                            await handle_facebook_message(
                                sender_id,
                                message_text,
                                config.accessToken
                            )
    
    return {"status": "ok"}


# Statistics endpoint
@app.get("/api/stats", response_model=StatsResponse)
async def get_stats():
    """Get system statistics"""
    training_data = await storage.get_training_data()
    
    last_updated = "Never"
    if training_data:
        last_item = training_data[-1]
        try:
            dt = datetime.fromisoformat(last_item.timestamp)
            last_updated = dt.strftime("%Y-%m-%d")
        except:
            last_updated = "Unknown"
    
    return StatsResponse(
        totalTrainingData=len(training_data),
        lastUpdated=last_updated
    )


# Health check endpoint
@app.get("/")
async def root():
    """API health check"""
    return {
        "status": "ok",
        "message": "FB Reply AI Backend is running",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print(f"Starting server on {host}:{port}")
    print(f"Debug mode: {debug}")
    print(f"API docs: http://localhost:{port}/docs")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug
    )
