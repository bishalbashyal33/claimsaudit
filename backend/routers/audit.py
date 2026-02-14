"""
Audit router — POST /audit endpoint.
Phase 0: returns mocked structured response.
Phase 4: will wire to LangGraph pipeline.
"""

import sys
from pathlib import Path
from fastapi import APIRouter, HTTPException

# Add shared to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from shared.schemas import ClaimInput, AuditOutput
from backend.services.pipeline import run_audit_pipeline

router = APIRouter(prefix="/audit", tags=["audit"])


@router.post("/", response_model=AuditOutput)
async def run_audit(claim: ClaimInput) -> AuditOutput:
    """
    Run the full audit pipeline on a submitted claim.
    Returns a structured AuditOutput with decision + citations.
    """
    try:
        result = await run_audit_pipeline(claim)
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audit pipeline error: {str(e)}")


@router.get("/health")
async def health():
    return {"status": "ok", "service": "audit"}
