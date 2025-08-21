from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.router import router as api_router
from .core.config import settings
import os

app = FastAPI(title="LLM Response Analyzer API")

# CORS (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "LLM Response Analyzer API"}

app.include_router(api_router)

@app.on_event("startup")
def ensure_storage_dirs():
    for path in [settings.storage_dir, settings.uploads_dir, settings.reports_dir]:
        os.makedirs(path, exist_ok=True)
