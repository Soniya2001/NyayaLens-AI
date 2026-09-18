import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("nyayalens.llm")

class LLMService:
    """
    Interface to Google GenAI SDK (Gemini 2.5) with fallback extraction engine.
    """
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Initialized Google GenAI Client with Gemini SDK.")
            except Exception as e:
                logger.warning(f"Failed to initialize GenAI client: {e}")

    def generate_json(self, prompt: str, system_instruction: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Generates structured JSON response using Gemini model or fallback.
        """
        if self.client:
            try:
                config = {}
                if system_instruction:
                    config["system_instruction"] = system_instruction
                config["response_mime_type"] = "application/json"

                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=config
                )
                if response.text:
                    return json.loads(response.text)
            except Exception as e:
                logger.error(f"Gemini API call failed: {e}")

        return None
