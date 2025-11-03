import os
from typing import List, AsyncIterator, cast, Any
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam
from models import ChatMessage
import storage


class AIService:
    def __init__(self):
        # Try GitHub token first, then OpenAI
        github_token = os.getenv("GITHUB_TOKEN")
        openai_key = os.getenv("OPENAI_API_KEY")
        
        if github_token:
            # Use GitHub Models
            self.client = AsyncOpenAI(
                api_key=github_token,
                base_url="https://models.inference.ai.azure.com"
            )
            self.model = "gpt-4o"
        elif openai_key:
            # Use OpenAI
            self.client = AsyncOpenAI(api_key=openai_key)
            self.model = "gpt-3.5-turbo"
        else:
            self.client = None
            self.model = None
    
    async def _get_system_prompt(self) -> str:
        """Generate system prompt with training data context"""
        training_data = await storage.get_training_data()
        
        training_context = "\n\n".join([
            f"User: {item.message}\nAssistant: {item.reply}"
            for item in training_data
        ])
        
        system_prompt = f"""You are a helpful AI assistant trained to respond to messages based on the following examples. Use these examples to understand the tone and style of responses expected, and generate appropriate replies for similar messages.

Training Examples:
{training_context}

When responding:
1. Use the training examples to understand the expected response style
2. Generate a response that matches the tone and format of the training data
3. Be helpful and contextually appropriate
4. If the message is similar to a training example, provide a similar style response
5. Keep responses concise and relevant"""
        
        return system_prompt
    
    async def generate_reply(self, message: str) -> str:
        """Generate a single reply (non-streaming)"""
        if not self.client or not self.model:
            return "Thank you for your message. AI service is not configured."
        
        try:
            system_prompt = await self._get_system_prompt()
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                temperature=0.7,
            )
            
            return response.choices[0].message.content or "I apologize, but I could not generate a response."
        
        except Exception as e:
            print(f"Error generating reply: {e}")
            return "Thank you for your message. We'll get back to you soon!"
    
    async def generate_reply_stream(self, messages: List[ChatMessage]) -> AsyncIterator[str]:
        """Generate streaming reply"""
        if not self.client or not self.model:
            yield "AI service is not configured."
            return
        
        try:
            system_prompt = await self._get_system_prompt()
            
            # Convert messages to OpenAI format
            api_messages: List[ChatCompletionMessageParam] = [
                cast(ChatCompletionMessageParam, {"role": "system", "content": system_prompt})
            ]
            api_messages.extend([
                cast(ChatCompletionMessageParam, {"role": msg.role, "content": msg.content})
                for msg in messages
            ])
            
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=api_messages,
                temperature=0.7,
                stream=True
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        
        except Exception as e:
            print(f"Error generating streaming reply: {e}")
            yield "An error occurred while generating the response."


# Global AI service instance
ai_service = AIService()
