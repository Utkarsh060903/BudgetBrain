# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import google.generativeai as genai
# import os
# from dotenv import load_dotenv
# import re

# # Load environment variables from .env file
# load_dotenv()

# app = FastAPI()

# # Allow Vite frontend at port 5173
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # Adjust to match your frontend
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load API key from environment
# api_key = os.getenv("GOOGLE_API_KEY")
# if not api_key:
#     raise ValueError("GOOGLE_API_KEY environment variable is not set!")

# # Configure the Google Generative AI API
# genai.configure(api_key=api_key)

# class PromptRequest(BaseModel):
#     prompt: str
#     context: dict

# @app.get("/")
# async def root():
#     return {"message": "Gemini API backend is live!"}

# def is_greeting(text):
#     greetings = ["hi", "hello", "hey", "good morning", "good evening", "what's up", "greetings"]
#     text = text.lower().strip()
#     return any(re.match(rf"\b{greet}\b", text) for greet in greetings)


# @app.post("/api/chatbot")
# async def generate_content(request: PromptRequest):
#     try:
#         user_context = request.context
#         prompt = request.prompt

#         if is_greeting(prompt):
#             return {"answer": "Hello! How can I assist you with your finances today?"}

#         # Build the context text based on user profile
#         context_text = f"""
#         User Info:
#         Name: {user_context['name']}
#         Income: {user_context['income']}
#         Expense: {user_context['expense']}
#         Balance: {user_context['balance']}
#         IncomeCategories: {user_context['balance']}
#         """

        

#         # Full prompt for the Gemini model
#         full_prompt = f"""
#         Act as a professional financial assistant.
#         Use the user's financial data below only if relevant to their question.
#         Be brief and to the point in your responses, providing only essential information.
#         {context_text}
#         Answer the following question:
#         {prompt}
#         Respond with short, bullet-point answers and avoid any unnecessary details.
#         """

#         model = genai.GenerativeModel("gemini-2.0-flash")
#         response = model.generate_content(full_prompt)

#         if response and response.text:
#             return {"answer": response.text}
#         else:
#             raise HTTPException(status_code=500, detail="No response from Gemini.")
#     except Exception as e:
#         print(f"Gemini API Error: {e}")
#         raise HTTPException(status_code=500, detail="Failed to generate response")


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
import re
from datetime import datetime
from typing import Dict, List, Any, Optional

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

class Transaction(BaseModel):
    _id: str
    userId: str
    amount: float
    date: str
    type: Optional[str] = None
    icon: Optional[str] = None
    source: Optional[str] = None
    category: Optional[str] = None
    createdAt: str
    updatedAt: str

class DashboardData(BaseModel):
    totalBalance: float
    totalIncome: float
    totalExpense: float
    last30DaysIncome: Dict[str, Any]
    last30DaysExpenses: Dict[str, Any]
    last60DaysIncome: Dict[str, Any]
    last60DaysExpenses: Dict[str, Any]
    recentTransactions: List[Dict[str, Any]]

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

def get_user_financial_context(user, dashboard_data):
    """
    Generate a comprehensive financial context string for the chatbot based on user and dashboard data.
    
    Args:
        user (dict): User information containing at least fullName
        dashboard_data (dict): Financial dashboard data containing income, expense, transactions, etc.
    
    Returns:
        str: Formatted string with financial context for chatbot
    """
    # Calculate derived metrics
    try:
        savings_rate = (dashboard_data['totalIncome'] - dashboard_data['totalExpense']) / dashboard_data['totalIncome'] * 100
    except (ZeroDivisionError, KeyError):
        savings_rate = 0
    
    # Extract income categories/sources
    income_transactions = dashboard_data.get('last30DaysIncome', {}).get('transactions', [])
    income_categories = list(set(t.get('source', '') for t in income_transactions))
    
    # Find largest income source
    largest_income = {'source': '', 'amount': 0}
    for transaction in income_transactions:
        if transaction.get('amount', 0) > largest_income['amount']:
            largest_income = {
                'source': transaction.get('source', ''),
                'amount': transaction.get('amount', 0)
            }
    
    # Categorize expenses
    expense_transactions = dashboard_data.get('last30DaysExpenses', {}).get('transactions', [])
    categorized_expenses = {}
    for transaction in expense_transactions:
        category = transaction.get('category', 'Other')
        if category not in categorized_expenses:
            categorized_expenses[category] = 0
        categorized_expenses[category] += transaction.get('amount', 0)
    
    # Find largest expense category
    largest_expense = {'category': '', 'amount': 0}
    for category, amount in categorized_expenses.items():
        if amount > largest_expense['amount']:
            largest_expense = {
                'category': category,
                'amount': amount
            }
    
    # Format recent transactions
    recent_transactions = dashboard_data.get('recentTransactions', [])
    formatted_transactions = []
    for t in recent_transactions:
        transaction_type = t.get('type', '')
        prefix = '➕' if transaction_type == 'income' else '➖'
        label = t.get('source', '') if transaction_type == 'income' else t.get('category', '')
        try:
            date_str = datetime.strptime(t.get('date', ''), "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%m/%d/%Y")
        except (ValueError, TypeError):
            date_str = ''
        formatted_transactions.append(f"{prefix} ${t.get('amount', 0)} - {label} ({date_str})")
    
    # Calculate monthly trends
    monthly_income = dashboard_data.get('last60DaysIncome', {}).get('total', 0) / 2
    monthly_expenses = dashboard_data.get('last60DaysExpenses', {}).get('total', 0) / 2
    
    # Build the context string
    user_financial_context = f"""
User Info:
  Name: {user.get('fullName', '')}
  
Financial Summary:
  Current Balance: ${dashboard_data.get('totalBalance', 0)}
  Total Income (30 days): ${dashboard_data.get('totalIncome', 0)}
  Total Expenses (30 days): ${dashboard_data.get('totalExpense', 0)}
  Savings Rate: {savings_rate:.1f}%
  
Income Sources:
  {', '.join(income_categories)}
  Largest Income: {largest_income['source']} (${largest_income['amount']})
  
Expense Categories:
  {', '.join([f"{cat}: ${amt}" for cat, amt in categorized_expenses.items()])}
  Largest Expense: {largest_expense['category']} (${largest_expense['amount']})
  
Recent Activity:
  {chr(10).join(formatted_transactions)}
  
Monthly Averages:
  Avg. Monthly Income: ${monthly_income}
  Avg. Monthly Expenses: ${monthly_expenses}
"""
    
    return user_financial_context

@app.post("/api/chatbot")
async def generate_content(request: PromptRequest):
    try:
        # Extract user and financial data from the request
        user_data = {
            "fullName": request.context.get("name", "")
        }
        
        # Extract or create dashboard data
        dashboard_data = {
            "totalBalance": request.context.get("balance", 0),
            "totalIncome": request.context.get("income", 0),
            "totalExpense": request.context.get("expense", 0),
            "last30DaysIncome": request.context.get("last30DaysIncome", {"total": 0, "transactions": []}),
            "last30DaysExpenses": request.context.get("last30DaysExpenses", {"total": 0, "transactions": []}),
            "last60DaysIncome": request.context.get("last60DaysIncome", {"total": 0, "transactions": []}),
            "last60DaysExpenses": request.context.get("last60DaysExpenses", {"total": 0, "transactions": []}),
            "recentTransactions": request.context.get("recentTransactions", [])
        }
        
        prompt = request.prompt

        if is_greeting(prompt):
            return {"answer": f"Hello {user_data.get('fullName', '')}! How can I assist you with your finances today?"}

        # Build the detailed financial context
        context_text = get_user_financial_context(user_data, dashboard_data)

        # Full prompt for the Gemini model
        full_prompt = f"""
        Act as a professional financial assistant named FinHelp.
        You have access to the user's financial data below:
        {context_text}
        
        Guidelines for your responses:
        - Be concise and relevant
        - Personalize advice based on their actual financial data
        - Offer actionable insights based on spending patterns and income sources
        - Highlight unusual expenses or positive savings trends when relevant
        - Recommend specific improvements based on their financial situation
        - Use bullet points for clarity
        - Keep responses under 50 words unless detailed analysis is requested
        
        User's question: {prompt}
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