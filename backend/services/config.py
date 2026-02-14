"""
Service configuration and toggle management.
Allows runtime switching between mock and real services.
"""
from typing import Dict, Optional
from pydantic import BaseModel
from backend.config import settings

class ServiceStatus(BaseModel):
    """Status of a service integration."""
    name: str
    enabled: bool  # True = real service, False = mock
    available: bool  # Can the real service be reached?
    mode: str  # "real" or "mock"
    error: Optional[str] = None

class ServiceConfig:
    """Global service configuration state."""
    
    def __init__(self):
        # Initialize with current settings
        self._services = {
            "supabase": {"enabled": False, "available": settings.has_supabase},
            "qdrant": {"enabled": False, "available": settings.has_qdrant},
            "groq": {"enabled": settings.has_groq, "available": settings.has_groq},
            "redis": {"enabled": False, "available": settings.has_redis},
        }
    
    def get_status(self, service_name: str) -> ServiceStatus:
        """Get current status of a service."""
        if service_name not in self._services:
            return ServiceStatus(
                name=service_name,
                enabled=False,
                available=False,
                mode="mock",
                error="Unknown service"
            )
        
        svc = self._services[service_name]
        return ServiceStatus(
            name=service_name,
            enabled=svc["enabled"],
            available=svc["available"],
            mode="real" if svc["enabled"] else "mock",
            error=svc.get("error")
        )
    
    def get_all_status(self) -> Dict[str, ServiceStatus]:
        """Get status of all services."""
        return {
            name: self.get_status(name)
            for name in self._services.keys()
        }
    
    def toggle_service(self, service_name: str, enable: bool) -> ServiceStatus:
        """
        Toggle a service between mock and real mode.
        Returns the new status, or error if service not available.
        """
        if service_name not in self._services:
            return ServiceStatus(
                name=service_name,
                enabled=False,
                available=False,
                mode="mock",
                error="Unknown service"
            )
        
        svc = self._services[service_name]
        
        # If trying to enable, check if service is available
        if enable and not svc["available"]:
            return ServiceStatus(
                name=service_name,
                enabled=False,
                available=False,
                mode="mock",
                error=f"{service_name.capitalize()} service not available. Please configure credentials."
            )
        
        # Update the enabled state
        svc["enabled"] = enable
        
        return self.get_status(service_name)
    
    def is_enabled(self, service_name: str) -> bool:
        """Check if a service is enabled (real mode)."""
        return self._services.get(service_name, {}).get("enabled", False)

# Global singleton instance
_service_config = ServiceConfig()

def get_service_config() -> ServiceConfig:
    """Get the global service configuration instance."""
    return _service_config
