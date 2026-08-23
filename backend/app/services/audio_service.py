import os
import uuid
from fastapi import UploadFile, HTTPException
from config import settings

ALLOWED_EXTENSIONS = {".mp3", ".wav", ".m4a", ".mp4", ".webm"}

class AudioService:
    @staticmethod
    def validate_audio_file(file: UploadFile) -> str:
        filename = file.filename or ""
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{ext}'. Allowed formats: MP3, WAV, M4A, MP4, WEBM."
            )
        return ext

    @staticmethod
    async def save_audio_file(file: UploadFile) -> str:
        os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
        ext = AudioService.validate_audio_file(file)
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(settings.UPLOADS_DIR, unique_filename)
        
        contents = await file.read()
        if len(contents) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )
            
        with open(filepath, "wb") as f:
            f.write(contents)
            
        return unique_filename

    @staticmethod
    def delete_audio_file(filename: str) -> bool:
        if not filename:
            return False
        filepath = os.path.join(settings.UPLOADS_DIR, filename)
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
                return True
            except Exception:
                return False
        return False
