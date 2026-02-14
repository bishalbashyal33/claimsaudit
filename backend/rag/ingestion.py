"""
Ingestion Pipeline.
Responsible for Structure-Aware Chunking of policy documents.
Uses MarkdownHeaderTextSplitter to preserve semantic structure.
"""
from typing import List, Dict, Any
from langchain.text_splitter import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from backend.rag.vector_store import VectorStore

class IngestionPipeline:
    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store
        
        # Headers to split on - preserving policy hierarchy
        self.headers_to_split_on = [
            ("#", "Policy"),
            ("##", "Section"),
            ("###", "Subsection"),
        ]
        self.markdown_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=self.headers_to_split_on
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, 
            chunk_overlap=200
        )

    def process_policy_markdown(self, markdown_text: str, policy_id: str, policy_name: str) -> int:
        """
        Structure-Aware Chunking:
        1. Split by headers (Structure awareness: Policy > Section > Subsection).
        2. Recursively split large chunks (Boundary detection: 1000 chars).
        3. Add metadata (Citation info).
        
        Returns:
            Number of chunks created
        """
        try:
            # 1. Structure Split
            header_splits = self.markdown_splitter.split_text(markdown_text)
            
            # 2. Size Split
            if header_splits:
                final_chunks = self.text_splitter.split_documents(header_splits)
            else:
                # Fallback: if no headers found, just do text splitting
                print("No markdown headers found, using simple text splitting")
                doc = Document(page_content=markdown_text, metadata={})
                final_chunks = self.text_splitter.split_documents([doc])
            
        except Exception as e:
            print(f"Markdown splitting failed: {e}, falling back to simple text splitting")
            # Fallback to simple text splitting
            doc = Document(page_content=markdown_text, metadata={})
            final_chunks = self.text_splitter.split_documents([doc])
        
        # 3. Standardization for Vector Store
        chunk_docs = []
        for i, split in enumerate(final_chunks):
            metadata = split.metadata if hasattr(split, 'metadata') else {}
            path = " > ".join([v for k, v in metadata.items() if k in ["Policy", "Section", "Subsection"]])
            
            if not path:
                path = "General"
            
            # Use hash of policy_id + index for unique integer ID
            chunk_id = abs(hash(f"{policy_id}-{i}")) % (10 ** 10)
            
            chunk_docs.append({
                "chunk_id": chunk_id,
                "text": split.page_content,
                "source": policy_name,
                "section": path,
                "metadata": {
                    "policy_id": policy_id, 
                    "policy_name": policy_name,
                    "section_path": path,
                    "page": 1  # Placeholder for PDF page num
                }
            })

        if chunk_docs:
            self.vector_store.add_chunks(chunk_docs)
            print(f"✓ Processed {len(chunk_docs)} chunks for policy '{policy_name}'")
        else:
            print(f"Warning: No chunks created for policy '{policy_name}'")
            
        return len(chunk_docs)
