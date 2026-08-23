from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from app.services.audio_service import AudioService
from app.services.meeting_service import MeetingService
from app.schemas.meeting import MeetingResponse

router = APIRouter(tags=["Upload"])

@router.post("/upload-audio")
async def upload_audio(
    request: Request,
    file: UploadFile = File(...),
    title: str = Form(...),
    participants: str = Form(""),
    department: str = Form("Engineering"),
    db: Session = Depends(get_db)
):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No audio file provided.")
    
    # Save audio file
    saved_filename = await AudioService.save_audio_file(file)
    
    # Create database record
    meeting = MeetingService.create_meeting(
        db=db,
        title=title,
        participants=participants,
        department=department,
        audio_filename=saved_filename
    )
    
    # Process through pipeline
    try:
        processed_meeting = MeetingService.process_meeting(db, meeting.id)
        base_url = str(request.base_url).rstrip('/')
        audio_url = f"{base_url}/uploads/{saved_filename}"
        
        resp_dict = MeetingResponse.model_validate(processed_meeting).model_dump()
        resp_dict["audio_url"] = audio_url
        return resp_dict
    except Exception as e:
        base_url = str(request.base_url).rstrip('/')
        resp_dict = MeetingResponse.model_validate(meeting).model_dump()
        resp_dict["audio_url"] = f"{base_url}/uploads/{saved_filename}"
        return resp_dict
