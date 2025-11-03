import httpx
from typing import Optional
import storage
from ai_service import ai_service
from models import WebhookLog
from datetime import datetime


async def test_facebook_connection(page_id: str, access_token: str) -> dict:
    """Test Facebook API connection"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://graph.facebook.com/v18.0/{page_id}",
                params={
                    "fields": "name,id",
                    "access_token": access_token
                }
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                error_data = response.json()
                raise Exception(f"Facebook API Error: {error_data.get('error', {}).get('message', 'Unknown error')}")
    
    except Exception as e:
        raise Exception(f"Failed to connect to Facebook: {str(e)}")


async def send_facebook_message(recipient_id: str, message_text: str, access_token: str) -> dict:
    """Send a message via Facebook Messenger"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://graph.facebook.com/v18.0/me/messages",
                params={"access_token": access_token},
                json={
                    "recipient": {"id": recipient_id},
                    "message": {"text": message_text}
                }
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                error_data = response.json()
                raise Exception(f"Failed to send message: {error_data}")
    
    except Exception as e:
        print(f"Error sending Facebook message: {e}")
        raise


async def handle_facebook_message(sender_id: str, message_text: str, access_token: str):
    """Handle incoming Facebook message and send AI reply"""
    try:
        # Generate AI reply
        reply = await ai_service.generate_reply(message_text)
        
        # Send reply
        await send_facebook_message(sender_id, reply, access_token)
        
        # Log the interaction
        await storage.save_webhook_log(WebhookLog(
            timestamp=datetime.utcnow().isoformat(),
            type="reply",
            data={
                "senderId": sender_id,
                "message": message_text,
                "reply": reply
            }
        ))
        
        print(f"Replied to {sender_id}: {reply}")
    
    except Exception as e:
        print(f"Error handling Facebook message: {e}")
