"""
Claims router — CRUD operations for claims.
"""

import sys
from pathlib import Path
from uuid import uuid4
from datetime import date
from fastapi import APIRouter, HTTPException

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from shared.schemas import ClaimInput

router = APIRouter(prefix="/claims", tags=["claims"])

# In-memory store for Phase 0 (replaced by Supabase in Phase 1)
_claims_store: dict[str, ClaimInput] = {}


@router.get("/")
async def list_claims():
    """List all claims."""
    return {"claims": list(_claims_store.values()), "total": len(_claims_store)}


@router.post("/", response_model=ClaimInput)
async def create_claim(claim: ClaimInput):
    """Create a new claim."""
    if not claim.claim_id:
        claim.claim_id = str(uuid4())
    _claims_store[claim.claim_id] = claim
    return claim


@router.get("/{claim_id}")
async def get_claim(claim_id: str):
    """Get a specific claim."""
    if claim_id not in _claims_store:
        raise HTTPException(status_code=404, detail="Claim not found")
    return _claims_store[claim_id]


@router.delete("/{claim_id}")
async def delete_claim(claim_id: str):
    """Delete a claim."""
    if claim_id not in _claims_store:
        raise HTTPException(status_code=404, detail="Claim not found")
    del _claims_store[claim_id]
    return {"deleted": True, "claim_id": claim_id}
