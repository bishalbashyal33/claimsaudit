"""
Tests for shared schemas — validates the contract.
"""

import sys
from pathlib import Path
import pytest
from datetime import date

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from shared.schemas import (
    ClaimInput, AuditOutput, AuditDecision,
    Citation, RuleApplied, AuditorFeedback
)


class TestClaimInput:
    def test_valid_claim(self):
        claim = ClaimInput(
            patient_id="P-001",
            cpt_codes=["99213"],
            icd_codes=["J06.9"],
            service_date=date(2024, 6, 15),
            payer="Medicare",
            provider_npi="1234567890",
            billed_amount=150.00
        )
        assert claim.patient_id == "P-001"
        assert claim.claim_id  # auto-generated

    def test_missing_cpt_codes(self):
        with pytest.raises(Exception):
            ClaimInput(
                patient_id="P-001",
                cpt_codes=[],
                service_date=date(2024, 6, 15),
                payer="Medicare",
                provider_npi="1234567890",
                billed_amount=150.00
            )

    def test_negative_billed_amount(self):
        with pytest.raises(Exception):
            ClaimInput(
                patient_id="P-001",
                cpt_codes=["99213"],
                service_date=date(2024, 6, 15),
                payer="Medicare",
                provider_npi="1234567890",
                billed_amount=-50.00
            )


class TestAuditOutput:
    def _make_citation(self):
        return Citation(
            policy_id="POL-001",
            page=1,
            section_path="Section 1",
            chunk_id="chunk-001",
            text_excerpt="Test policy text"
        )

    def test_approve_with_citations(self):
        output = AuditOutput(
            claim_id="C-001",
            decision=AuditDecision.APPROVE,
            confidence=0.95,
            citations=[self._make_citation()],
            explanation="Approved based on policy",
            prompt_version="v1.0"
        )
        assert output.decision == AuditDecision.APPROVE
        assert len(output.citations) == 1

    def test_approve_without_citations_fails(self):
        """KEY CONTRACT: APPROVE/DENY without citations is invalid."""
        with pytest.raises(ValueError, match="invalid without citations"):
            AuditOutput(
                claim_id="C-001",
                decision=AuditDecision.APPROVE,
                confidence=0.95,
                citations=[],
                explanation="No evidence",
                prompt_version="v1.0"
            )

    def test_deny_without_citations_fails(self):
        with pytest.raises(ValueError, match="invalid without citations"):
            AuditOutput(
                claim_id="C-001",
                decision=AuditDecision.DENY,
                confidence=0.85,
                citations=[],
                explanation="No evidence",
                prompt_version="v1.0"
            )

    def test_pend_info_without_citations_ok(self):
        output = AuditOutput(
            claim_id="C-001",
            decision=AuditDecision.PEND_INFO,
            confidence=0.3,
            citations=[],
            explanation="Insufficient evidence to decide",
            missing_info=["Fee schedule data"],
            prompt_version="v1.0"
        )
        assert output.decision == AuditDecision.PEND_INFO

    def test_needs_human_without_citations_ok(self):
        output = AuditOutput(
            claim_id="C-001",
            decision=AuditDecision.NEEDS_HUMAN,
            confidence=0.1,
            citations=[],
            explanation="Cannot determine automatically",
            prompt_version="v1.0"
        )
        assert output.decision == AuditDecision.NEEDS_HUMAN
