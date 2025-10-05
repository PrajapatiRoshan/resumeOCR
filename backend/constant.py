import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

PORT = int(os.getenv("PORT") or "80")
OpenAIClient = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
