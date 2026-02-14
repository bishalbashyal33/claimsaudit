"""
Retrieval service stub.
Phase 3: will implement hybrid semantic + metadata search.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from shared.schemas import ChunkRecord


async def retrieve_evidence(
    payer: str,
    cpt_codes: list[str],
    service_date: str,
    top_k: int = 10
) -> list[ChunkRecord]:
    """
    Retrieve policy chunks relevant to the given claim parameters.
    Phase 0: returns empty list (stub).
    Phase 3: hybrid Qdrant + metadata search.
    """
    return []
