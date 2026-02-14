"""
APCA ClaimAudit — FastAPI Backend
Main application entry point.
"""

import sys
from pathlib import Path

# Add project root to path for shared imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import audit, claims, policies, services
from backend.config import settings

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed default policy
    from backend.routers.policies import seed_default_policy
    seed_default_policy()
    yield
    # Shutdown logic (none needed yet)

app = FastAPI(
    title="APCA ClaimAudit API",
    description="Automated Prior Claim Audit — Policy-to-Claim adjudication engine",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS — allow frontend on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(audit.router, prefix="/api")
app.include_router(claims.router, prefix="/api")
app.include_router(policies.router, prefix="/api")
app.include_router(services.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "service": "APCA ClaimAudit API",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs",
        "environment": settings.ENV
    }


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "integrations": {
            "supabase": settings.has_supabase,
            "groq": settings.has_groq,
            "qdrant": settings.has_qdrant,
            "redis": settings.has_redis,
            "r2": settings.has_r2,
        }
    }
