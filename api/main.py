import requests
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Define the list of allowed origins
origins = [
    # "http://localhost",
    # "http://localhost:8000",
    # "http://example.com",  # Add the domains that should be allowed
    "*" # to allow any domain (use with caution)
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins (you can also use ["*"] for all origins)
    allow_credentials=True,  # Allow cookies and authentication credentials
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, etc.)
    allow_headers=["*"],  # Allow all headers
)

def get_api_key():
    return "UyM6XKhHW6as1fBMegnQjBiAO72Lx9LDqNJ77g70"

def call_bedrock_agent_api(api_url: str, api_key: str, input_text: str, session_id: str):
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key
    }

    payload = {
        'input': input_text,
        'sessionId': session_id
    }

    response = requests.post(api_url, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail=f"API call failed: {response.text}")

@app.get("/")
def hi():
    return {"success": True, "data": 'hi'}


class BedrockAgentRequest(BaseModel):
    input_text: str
    session_id: str

@app.post("/bedrock-agent/")
def bedrock_agent(
    request: BedrockAgentRequest,
    api_key: str = Depends(get_api_key),):
    api_url = "https://s265bgagqa.execute-api.us-west-2.amazonaws.com/default/monical-api"

    try:
        result = call_bedrock_agent_api(api_url, api_key, request.input_text, request.session_id)
        return {"success": True, "data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")