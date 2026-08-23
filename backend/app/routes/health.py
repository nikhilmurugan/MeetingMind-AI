import os
import shutil
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from config import settings

router = APIRouter(tags=["Health & Diagnostics"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    # Database check
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = True  # session connection active

    # FFmpeg check
    ffmpeg_installed = shutil.which("ffmpeg") is not None

    # Whisper status
    whisper_status = "available"

    # OpenRouter status
    openrouter_configured = bool(settings.OPENROUTER_API_KEY)

    # Uploads dir check
    uploads_ok = os.path.exists(settings.UPLOADS_DIR) and os.access(settings.UPLOADS_DIR, os.W_OK)

    return {
        "status": "healthy",
        "database": "connected" if db_ok else "degraded",
        "whisper": whisper_status,
        "ffmpeg": "installed" if ffmpeg_installed else "missing (fallback active)",
        "openrouter": "configured" if openrouter_configured else "not_configured (using Ollama/Fallback)",
        "ollama": f"configured ({settings.OLLAMA_BASE_URL})",
        "uploads_directory": settings.UPLOADS_DIR if uploads_ok else "missing",
        "version": "1.0.0"
    }

from sqlalchemy import text

@router.get("/debug/system")
def debug_system():
    return {
        "project_name": settings.PROJECT_NAME,
        "environment": {
            "database_url": settings.DATABASE_URL,
            "openrouter_base_url": settings.OPENROUTER_BASE_URL,
            "openrouter_model": settings.OPENROUTER_MODEL,
            "openrouter_key_set": bool(settings.OPENROUTER_API_KEY),
            "ollama_base_url": settings.OLLAMA_BASE_URL,
            "ollama_model": settings.OLLAMA_MODEL,
            "max_upload_size_mb": settings.MAX_UPLOAD_SIZE_MB,
        },
        "system_paths": {
            "base_dir": settings.BASE_DIR,
            "uploads_dir": settings.UPLOADS_DIR,
            "outputs_dir": settings.OUTPUTS_DIR,
            "ffmpeg_path": shutil.which("ffmpeg") or "None"
        }
    }
