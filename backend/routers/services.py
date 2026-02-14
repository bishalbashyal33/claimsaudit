"""
Service management router for toggling integrations.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.config import get_service_config

router = APIRouter(prefix="/services", tags=["services"])

class ToggleRequest(BaseModel):
    """Request to toggle a service."""
    service: str
    enabled: bool

@router.get("/status")
async def get_services_status():
    """Get status of all services."""
    config = get_service_config()
    statuses = config.get_all_status()
    
    return {
        "services": {
            name: {
                "enabled": status.enabled,
                "available": status.available,
                "mode": status.mode,
                "error": status.error
            }
            for name, status in statuses.items()
        }
    }

@router.post("/toggle")
async def toggle_service(request: ToggleRequest):
    """Toggle a service between mock and real mode."""
    config = get_service_config()
    status = config.toggle_service(request.service, request.enabled)
    
    if status.error and request.enabled:
        raise HTTPException(status_code=400, detail=status.error)
    
    return {
        "service": status.name,
        "enabled": status.enabled,
        "available": status.available,
        "mode": status.mode,
        "message": f"{status.name.capitalize()} switched to {status.mode} mode"
    }
