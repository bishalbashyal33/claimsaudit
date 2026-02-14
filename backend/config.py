"""
Backend configuration — loads from .env with sensible defaults.
All external service keys are optional; the app runs in mock mode without them.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")


class Settings:
    # Environment
    ENV: str = os.getenv("ENV", "development")
    IS_DEV: bool = ENV == "development"

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")

    # Groq
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # Google (Gemini Fallback)
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")

    # Qdrant
    QDRANT_URL: str = os.getenv("QDRANT_URL", "")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    QDRANT_COLLECTION: str = os.getenv("QDRANT_COLLECTION", "policy_chunks")

    # R2
    R2_ACCOUNT_ID: str = os.getenv("R2_ACCOUNT_ID", "")
    R2_ACCESS_KEY_ID: str = os.getenv("R2_ACCESS_KEY_ID", "")
    R2_SECRET_ACCESS_KEY: str = os.getenv("R2_SECRET_ACCESS_KEY", "")
    R2_BUCKET_NAME: str = os.getenv("R2_BUCKET_NAME", "claimaudit-policies")
    R2_ENDPOINT: str = os.getenv("R2_ENDPOINT", "")

    # Upstash Redis
    UPSTASH_REDIS_URL: str = os.getenv("UPSTASH_REDIS_URL", "")
    UPSTASH_REDIS_TOKEN: str = os.getenv("UPSTASH_REDIS_TOKEN", "")

    # App limits
    MAX_TOKENS: int = int(os.getenv("MAX_TOKENS", "4096"))
    MAX_RETRIEVAL_CHUNKS: int = int(os.getenv("MAX_RETRIEVAL_CHUNKS", "10"))
    AUDIT_TIMEOUT_SECONDS: int = int(os.getenv("AUDIT_TIMEOUT_SECONDS", "30"))

    @property
    def has_supabase(self) -> bool:
        return bool(self.SUPABASE_URL and self.SUPABASE_ANON_KEY)

    @property
    def has_groq(self) -> bool:
        return bool(self.GROQ_API_KEY)

    @property
    def has_qdrant(self) -> bool:
        return bool(self.QDRANT_URL)

    @property
    def has_redis(self) -> bool:
        return bool(self.UPSTASH_REDIS_URL)

    @property
    def has_r2(self) -> bool:
        return bool(self.R2_ENDPOINT and self.R2_ACCESS_KEY_ID)


settings = Settings()
