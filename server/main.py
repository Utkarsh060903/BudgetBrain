from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
import re

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Allow Vite frontend at port 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust to match your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API key from environment
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is not set!")

# Configure the Google Generative AI API
genai.configure(api_key=api_key)

class PromptRequest(BaseModel):
    prompt: str
    context: dict

@app.get("/")
async def root():
    return {"message": "Gemini API backend is live!"}

def is_greeting(text):
    greetings = ["hi", "hello", "hey", "good morning", "good evening", "what's up", "greetings"]
    text = text.lower().strip()
    return any(re.match(rf"\b{greet}\b", text) for greet in greetings)


@app.post("/api/chatbot")
async def generate_content(request: PromptRequest):
    try:
        user_context = request.context
        prompt = request.prompt

        if is_greeting(prompt):
            return {"answer": "Hello! How can I assist you with your finances today?"}

        # Build the context text based on user profile
        context_text = f"""
        User Info:
        Name: {user_context['name']}
        Income: {user_context['income']}
        Balance: {user_context['balance']}
        Expense: {user_context['expenses']}
        """

        # Full prompt for the Gemini model
        full_prompt = f"""
        Act as a professional financial assistant.
        Use the user's financial data below only if relevant to their question.
        {context_text}
        Answer their question:
        {prompt}
        Provide suggestions if relevant, answer only when applicable and answer in small bullet points.
        Also tell me when where to invest after searching the best solution on web when asked.
        """

        model = genai.GenerativeModel("gemini-2.0-flash") 
        response = model.generate_content(full_prompt)

        if response and response.text:
            return {"answer": response.text}
        else:
            raise HTTPException(status_code=500, detail="No response from Gemini.")
    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate response")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
