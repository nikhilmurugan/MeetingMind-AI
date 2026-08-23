from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from app.services.meeting_service import MeetingService
from app.services.pdf_service import PDFService
from app.schemas.meeting import MeetingResponse, ProcessMeetingRequest

router = APIRouter(tags=["Meetings"])

@router.get("/meeting/{meeting_id}", response_model=MeetingResponse)
def get_meeting_by_id(meeting_id: str, db: Session = Depends(get_db)):
    meeting = MeetingService.get_meeting_by_id(db, meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with ID '{meeting_id}' not found."
        )
    return meeting

@router.get("/meeting/{meeting_id}/pdf")
def export_meeting_pdf(meeting_id: str, db: Session = Depends(get_db)):
    meeting = MeetingService.get_meeting_by_id(db, meeting_id)
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with ID '{meeting_id}' not found."
        )
    
    meeting_dict = MeetingResponse.model_validate(meeting).model_dump()
    pdf_buffer = PDFService.generate_meeting_pdf(meeting_dict)
    
    filename = f"{meeting.meeting_title.replace(' ', '_')}_Report.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.delete("/meeting/{meeting_id}")
def delete_meeting(meeting_id: str, db: Session = Depends(get_db)):
    deleted = MeetingService.delete_meeting(db, meeting_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with ID '{meeting_id}' not found."
        )
    return {"message": "Meeting deleted successfully", "id": meeting_id}

@router.post("/process-meeting", response_model=MeetingResponse)
def process_meeting(request: ProcessMeetingRequest, db: Session = Depends(get_db)):
    try:
        meeting = MeetingService.process_meeting(db, request.meeting_id)
        return meeting
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
