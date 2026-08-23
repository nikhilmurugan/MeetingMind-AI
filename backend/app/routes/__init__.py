from app.routes.health import router as health_router
from app.routes.upload import router as upload_router
from app.routes.meetings import router as meetings_router
from app.routes.history import router as history_router

__all__ = ["health_router", "upload_router", "meetings_router", "history_router"]
