"""
Audit pipeline service.
Executes the real RAG pipeline for claim auditing.
Falls back to mock data with clear messaging if external services fail.
"""

import sys
from pathlib import Path
from datetime import datetime
from uuid import uuid4

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from shared.schemas import (
    ClaimInput, AuditOutput, AuditDecision,
    Citation, RuleApplied
)
from backend.config import settings
from backend.rag.pipeline import run_rag_pipeline


async def run_audit_pipeline(claim: ClaimInput) -> AuditOutput:
    """
    Execute the audit pipeline on a claim using the real RAG implementation.
    
    This calls the actual RAG pipeline which:
    1. Retrieves relevant policy chunks from Qdrant vector store
    2. Uses Groq LLM (Llama 3.3 70B) to analyze the claim
    3. Returns structured audit decision with citations
    
    If external services fail (e.g., Groq rate limit), returns mock data
    with clear messaging to inform the user.
    
    Raises:
        ValueError: If GROQ_API_KEY is not set or no policies are uploaded
    """
    if not settings.GOOGLE_API_KEY and not settings.GROQ_API_KEY:
        raise ValueError(
            "No LLM provider configured. Please set GOOGLE_API_KEY or GROQ_API_KEY in your environment."
        )
    
    # Try to call the real RAG pipeline
    try:
        result = await run_rag_pipeline(claim)
        print(f"✓ RAG Pipeline executed successfully for claim {claim.claim_id}")
        return result
    except ValueError as e:
        # Re-raise ValueError (like missing policies) - these are user errors
        print(f"✗ RAG Pipeline validation error: {e}")
        raise
    except Exception as e:
        # External service failure (Groq rate limit, network error, etc.)
        error_msg = str(e).lower()
        
        # Check if it's a rate limit or service unavailability error
        is_rate_limit = any(keyword in error_msg for keyword in [
            "rate limit", "quota", "429", "too many requests", 
            "daily limit", "service unavailable", "503"
        ])
        
        if is_rate_limit:
            print(f"⚠️  External service rate limit hit: {e}")
            print(f"⚠️  Returning mock data with clear user notification")
            
            # Return mock data with VERY CLEAR messaging
            return _generate_mock_fallback(claim, reason="rate_limit")
        else:
            # Other errors - re-raise
            print(f"✗ RAG Pipeline error: {e}")
            raise Exception(f"RAG pipeline execution failed: {str(e)}")


def _generate_mock_fallback(claim: ClaimInput, reason: str = "rate_limit") -> AuditOutput:
    """
    Generate mock audit output when external services are unavailable.
    Includes CLEAR messaging to inform the user this is mock data.
    """
    # Determine the reason message
    if reason == "rate_limit":
        reason_msg = "⚠️ MOCK DATA: External service (Groq LLM) daily rate limit exceeded. This is simulated data for demonstration purposes only."
    else:
        reason_msg = "⚠️ MOCK DATA: External services temporarily unavailable. This is simulated data for demonstration purposes only."
    
    # Generate mock citations with clear labeling
    mock_citations = [
        Citation(
            policy_id="MOCK-FALLBACK-001",
            policy_name=f"[MOCK] {claim.payer} Coverage Policy",
            page=1,
            section_path="Mock Section > Fallback Data",
            chunk_id=f"mock-{uuid4().hex[:8]}",
            text_excerpt="[MOCK CITATION] This is simulated policy text returned due to external service unavailability.",
            start_char=0,
            end_char=100
        )
    ]
    
    # Generate mock rules
    mock_rules = [
        RuleApplied(
            rule_id=str(uuid4()),
            rule_text="[MOCK] CPT code validation",
            satisfied=True,
            citation=mock_citations[0],
            explanation=f"[MOCK] CPT codes {', '.join(claim.cpt_codes)} - simulated validation."
        )
    ]
    
    explanation = (
        f"{reason_msg}\n\n"
        f"Claim {claim.claim_id} for patient {claim.patient_id} - "
        f"This audit result is SIMULATED and should not be used for actual claim adjudication. "
        f"Please try again later when external services are available, or contact support if the issue persists."
    )
    
    return AuditOutput(
        audit_id=str(uuid4()),
        claim_id=claim.claim_id,
        decision=AuditDecision.PEND_INFO,  # Always PEND_INFO for mock data
        confidence=0.0,  # Zero confidence for mock data
        rules_applied=mock_rules,
        citations=mock_citations,
        explanation=explanation,
        missing_info=["Real audit pending - external service unavailable"],
        prompt_version="v1.0-mock-fallback",
        created_at=datetime.utcnow()
    )
