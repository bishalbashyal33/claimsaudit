"""
Shared schemas for the APCA ClaimAudit system.
These define the contract between frontend and backend.
"""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Optional
from uuid import uuid4

from pydantic import BaseModel, Field, field_validator, model_validator


# ── Enums ──────────────────────────────────────────────────
class AuditDecision(str, Enum):
    APPROVE = "APPROVE"
    DENY = "DENY"
    PEND_INFO = "PEND_INFO"
    NEEDS_HUMAN = "NEEDS_HUMAN"


class FeedbackReason(str, Enum):
    WRONG_POLICY = "wrong_policy"
    MISSING_EVIDENCE = "missing_evidence"
    WRONG_RULE_PARSE = "wrong_rule_parse"
    CLAIM_MISSING_FIELDS = "claim_missing_fields"
    OTHER = "other"


# ── Claim Input ────────────────────────────────────────────
class ClaimInput(BaseModel):
    """Schema for incoming claim data."""
    claim_id: str = Field(default_factory=lambda: str(uuid4()))
    patient_id: str
    cpt_codes: list[str] = Field(min_length=1, description="At least one CPT/HCPCS code")
    icd_codes: list[str] = Field(default_factory=list, description="ICD-10 diagnosis codes")
    service_date: date
    payer: str
    provider_npi: str
    billed_amount: float = Field(gt=0)
    notes: Optional[str] = None
    policy_id: Optional[str] = None



# ── Citation ───────────────────────────────────────────────
class Citation(BaseModel):
    """A citation linking a decision back to source policy text."""
    policy_id: str
    policy_name: Optional[str] = None
    page: int
    section_path: str
    chunk_id: str
    text_excerpt: str = Field(description="The quoted policy text supporting the decision")
    start_char: Optional[int] = None
    end_char: Optional[int] = None


# ── Rule Applied ───────────────────────────────────────────
class RuleApplied(BaseModel):
    """An extracted rule that was evaluated during adjudication."""
    rule_id: str = Field(default_factory=lambda: str(uuid4()))
    rule_text: str
    satisfied: bool
    citation: Optional[Citation] = None
    explanation: Optional[str] = None


# ── Audit Output ──────────────────────────────────────────
class AuditOutput(BaseModel):
    """
    Schema for audit results.
    KEY INVARIANT: decision is invalid without citations
    for APPROVE/DENY. If citations are missing, decision
    MUST be PEND_INFO or NEEDS_HUMAN.
    """
    audit_id: str = Field(default_factory=lambda: str(uuid4()))
    claim_id: str
    decision: AuditDecision
    confidence: float = Field(ge=0.0, le=1.0)
    rules_applied: list[RuleApplied] = Field(default_factory=list)
    citations: list[Citation] = Field(default_factory=list)
    explanation: str
    missing_info: list[str] = Field(default_factory=list)
    prompt_version: str = Field(default="v1.0")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @model_validator(mode="after")
    def citations_required_for_approve_deny(self) -> "AuditOutput":
        """Enforce: APPROVE/DENY decisions must have at least one citation."""
        if self.decision in (AuditDecision.APPROVE, AuditDecision.DENY):
            if not self.citations:
                raise ValueError(
                    f"Decision '{self.decision.value}' is invalid without citations. "
                    "Use PEND_INFO or NEEDS_HUMAN if supporting evidence is missing."
                )
        return self


# ── Feedback ───────────────────────────────────────────────
class AuditorFeedback(BaseModel):
    """Feedback from a human auditor on an audit output."""
    feedback_id: str = Field(default_factory=lambda: str(uuid4()))
    audit_id: str
    is_correct: bool
    reason: Optional[FeedbackReason] = None
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Policy Metadata ───────────────────────────────────────
class PolicyMetadata(BaseModel):
    """Metadata for an ingested policy document."""
    policy_id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    payer: str
    effective_date: date
    expiration_date: Optional[date] = None
    file_url: Optional[str] = None
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ChunkRecord(BaseModel):
    """A chunked section of a policy document for retrieval."""
    chunk_id: str
    policy_id: str
    payer: str
    effective_date: date
    page: int
    section_path: str
    text: str
    start_char: int
    end_char: int
    embedding: Optional[list[float]] = None
