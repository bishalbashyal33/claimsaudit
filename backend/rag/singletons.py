"""
Singleton instances for RAG components.
Ensures vector store and ingestion pipeline are shared across the application.
"""
from backend.rag.vector_store import VectorStore
from backend.rag.ingestion import IngestionPipeline

# Global singleton instances
_vector_store_instance = None
_ingestion_pipeline_instance = None

def get_vector_store() -> VectorStore:
    """Get or create the global vector store instance."""
    global _vector_store_instance
    if _vector_store_instance is None:
        _vector_store_instance = VectorStore()
    return _vector_store_instance

def get_ingestion_pipeline() -> IngestionPipeline:
    """Get or create the global ingestion pipeline instance."""
    global _ingestion_pipeline_instance
    if _ingestion_pipeline_instance is None:
        _ingestion_pipeline_instance = IngestionPipeline(get_vector_store())
    return _ingestion_pipeline_instance
