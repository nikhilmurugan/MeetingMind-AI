from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.services.meeting_service import MeetingService
from app.schemas.meeting import MeetingResponse

router = APIRouter(tags=["History"])

@router.get("/history", response_model=List[MeetingResponse])
def get_meeting_history(db: Session = Depends(get_db)):
    return MeetingService.get_all_meetings(db)
