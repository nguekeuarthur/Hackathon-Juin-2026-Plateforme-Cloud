from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import requests, auth, vms

app = FastAPI(title="GIT VM Platform API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(requests.router, prefix="/requests", tags=["requests"])
app.include_router(vms.router, prefix="/vms", tags=["vms"])

@app.get("/health")
def health():
    return {"status": "ok"}
