"""
Ingestion service stub.
Phase 2: will implement PDF parsing, chunking, and embedding.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from shared.schemas import PolicyMetadata, ChunkRecord


async def ingest_policy(policy: PolicyMetadata, pdf_bytes: bytes) -> list[ChunkRecord]:
    """
    Process a policy PDF: extract text, chunk, embed, store.
    Phase 0: returns empty list (stub).
    Phase 2: full ingestion pipeline.
    """
    return []
