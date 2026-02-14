"""
Policy router — upload and manage policy documents.
Handles document ingestion into the RAG pipeline.
"""

import sys
import shutil
import tempfile
from pathlib import Path
from uuid import uuid4
from datetime import date, datetime
from fastapi import APIRouter, HTTPException, UploadFile, File, Form

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from shared.schemas import PolicyMetadata
from backend.rag.singletons import get_vector_store, get_ingestion_pipeline
from backend.rag.pdf_utils import convert_pdf_to_markdown

router = APIRouter(prefix="/policies", tags=["policies"])

# Default Medicare NCD 240.4 Policy ID
DEFAULT_POLICY_ID = "medicare-ncd-240-4-cpap"

# In-memory store for Phase 0 (replaced by Supabase in Phase 2)
_policies_store: dict[str, PolicyMetadata] = {
    DEFAULT_POLICY_ID: PolicyMetadata(
        policy_id=DEFAULT_POLICY_ID,
        name="Medicare NCD 240.4 - CPAP for OSA",
        payer="Medicare",
        effective_date=date(2008, 3, 13),
        file_url="/mock-storage/medicare-ncd-240-4-cpap/medicare_ncd.pdf",
        status="active",
        created_at=datetime(2024, 1, 1)
    )
}


@router.get("/")
async def list_policies():
    """List all policies."""
    return {"policies": list(_policies_store.values()), "total": len(_policies_store)}


@router.post("/upload")
async def upload_policy(
    name: str = Form(...),
    payer: str = Form(...),
    effective_date: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload a new policy document (PDF).
    Triggers:
    1. Save temporarily.
    2. Convert PDF -> Markdown (Structure Preserving).
    3. Ingest into Vector Store (Chunking + Embedding).
    """
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    policy_id = str(uuid4())
    
    # Save to temp file for processing
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        shutil.copyfileobj(file.file, tmp_file)
        tmp_path = tmp_file.name

    chunks_count = 0
    try:
        # Get the shared ingestion pipeline instance
        ingestion_pipeline = get_ingestion_pipeline()
        
        # Simple conversion heuristic
        # In production, use layout-aware parser (e.g. LayoutParser, Unstructured) as per architecture diagram
        markdown_text = convert_pdf_to_markdown(tmp_path)
        
        # Run ingestion
        chunks_count = ingestion_pipeline.process_policy_markdown(
            markdown_text=markdown_text,
            policy_id=policy_id,
            policy_name=name
        )
        print(f"Ingested {chunks_count} chunks for policy {policy_id}")
    except Exception as e:
        print(f"Ingestion failed: {e}")
        # Non-blocking for demo, but we log it
        pass

    policy = PolicyMetadata(
        policy_id=policy_id,
        name=name,
        payer=payer,
        effective_date=date.fromisoformat(effective_date),
        file_url=f"/mock-storage/{policy_id}/{file.filename}",
        status="active",
        created_at=datetime.utcnow()
    )
    _policies_store[policy_id] = policy

    return {
        "policy": policy,
        "message": f"Policy uploaded and ingested ({chunks_count} chunks relevant for RAG).",
        "chunks_created": chunks_count
    }


@router.get("/{policy_id}")
async def get_policy(policy_id: str):
    """Get a specific policy."""
    if policy_id not in _policies_store:
        raise HTTPException(status_code=404, detail="Policy not found")
    return _policies_store[policy_id]


@router.delete("/{policy_id}")
async def delete_policy(policy_id: str):
    """Delete a specific policy."""
    if policy_id not in _policies_store:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    # In Phase 0, we only delete from memory. 
    # In a real system, we'd also delete from the vector store and storage.
    del _policies_store[policy_id]
    return {"message": "Policy deleted successfully", "policy_id": policy_id}


def seed_default_policy():
    """Helper to ensure the default policy exists in the vector store."""
    from backend.rag.singletons import get_ingestion_pipeline
    
    # Check if we should seed (we can just run it, it's fairly fast)
    ncd_text = """
National Coverage Determination (NCD)
Continuous Positive Airway Pressure (CPAP) Therapy For Obstructive Sleep Apnea (OSA) (240.4)

Publication Number: 100-3
Manual Section Title: Continuous Positive Airway Pressure (CPAP) Therapy For Obstructive Sleep Apnea (OSA)
Effective Date: 03/13/2008

Item/Service Description
Continuous Positive Airway Pressure (CPAP) is a non-invasive technique for providing single levels of air pressure from a flow generator. The apnea hypopnea index (AHI) is equal to the average number of episodes of apnea and hypopnea per hour.

Indications and Limitations of Coverage
1. The use of CPAP is covered under Medicare when used in adult patients with OSA. Coverage of CPAP is initially limited to a 12-week period.
2. The provider of CPAP must conduct education of the beneficiary prior to use.
3. A positive diagnosis of OSA for the coverage of CPAP must include a clinical evaluation and a positive: attended PSG, or unattended HST (Type II, III, or IV).
4. An initial 12-week period of CPAP is covered in adult patients with OSA if:
   a. AHI or RDI >= 15 events per hour, or
   b. AHI or RDI >= 5 and <= 14 events per hour with documented symptoms (excessive daytime sleepiness, impaired cognition, mood disorders, insomnia, hypertension, ischemic heart disease, or history of stroke).
"""
    try:
        pipeline = get_ingestion_pipeline()
        pipeline.process_policy_markdown(
            markdown_text=ncd_text,
            policy_id=DEFAULT_POLICY_ID,
            policy_name="Medicare NCD 240.4 - CPAP for OSA"
        )
        print(f"✓ Default policy {DEFAULT_POLICY_ID} auto-seeded in Vector Store.")
    except Exception as e:
        print(f"Failed to auto-seed default policy: {e}")

