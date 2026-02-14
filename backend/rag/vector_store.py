"""
Qdrant Vector Store Service.
Handles indexed storage and semantic retrieval of policy chunks.
"""

from typing import List, Dict, Any, Optional
from uuid import uuid4
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from backend.config import settings
from backend.rag.embeddings import LocalEmbeddings

class VectorStore:
    def __init__(self):
        # Fallback to local memory if url not set, or connect to cloud/docker
        if settings.QDRANT_URL:
            self.client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY)
        else:
            self.client = QdrantClient(":memory:")
        
        self.encoder = LocalEmbeddings()
        self.collection_name = settings.QDRANT_COLLECTION
        self._ensure_collection_exists()

    def _ensure_collection_exists(self):
        """Idempotent check to ensure collection exists with correct config."""
        try:
            collections = self.client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)
            
            if not exists:
                # 384 dim for all-MiniLM-L6-v2
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
                )
                print(f"✓ Created Qdrant collection: {self.collection_name}")
        except Exception as e:
            print(f"Warning: Could not verify/create collection: {e}")

    def add_chunks(self, chunks: List[Dict[str, Any]]):
        """
        Embed and upsert chunks into Qdrant.
        Process:
        1. Embed the text content.
        2. Create PointStructs with payload metadata.
        3. Upsert into collection.
        """
        if not chunks:
            return

        texts = [c["text"] for c in chunks]
        embeddings = self.encoder.embed_documents(texts)
        
        points = []
        for i, chunk in enumerate(chunks):
            # Use chunk_id if provided, otherwise generate UUID
            chunk_id_str = chunk.get("chunk_id", str(uuid4()))
            
            payload = {
                "text": chunk["text"],
                "source": chunk.get("source", ""),
                "section": chunk.get("section", ""),
                "full_metadata": chunk.get("metadata", {})
            }
            
            points.append(PointStruct(
                id=chunk_id_str,  # Qdrant accepts string IDs
                vector=embeddings[i], 
                payload=payload
            ))

        try:
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            print(f"✓ Upserted {len(points)} chunks to Qdrant")
        except Exception as e:
            print(f"Error upserting to Qdrant: {e}")
            raise

    def search(self, query: str, limit: int = 5, filter_metadata: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Semantic search for relevant chunks with optional metadata filtering.
        """
        from qdrant_client.models import Filter, FieldCondition, MatchValue

        try:
            query_vector = self.encoder.embed_query(query)
            
            # Construct Qdrant filter if provided
            qdrant_filter = None
            if filter_metadata:
                must_conditions = []
                for key, value in filter_metadata.items():
                    if value:
                        # Full metadata is nested in the payload
                        must_conditions.append(FieldCondition(
                            key=f"full_metadata.{key}",
                            match=MatchValue(value=value)
                        ))
                
                if must_conditions:
                    qdrant_filter = Filter(must=must_conditions)

            hits = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                query_filter=qdrant_filter,
                limit=limit
            )

            results = []
            for hit in hits:
                results.append({
                    "score": hit.score,
                    "text": hit.payload.get("text"),
                    "metadata": hit.payload.get("full_metadata")
                })
            return results

        except Exception as e:
            print(f"Error searching Qdrant: {e}")
            return []
