from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime

class TranscriptItem(BaseModel):
    start: str
    end: str
    speaker: Optional[str] = "Speaker"
    text: str

class ActionItem(BaseModel):
    id: Optional[str] = None
    owner: str = "Unassigned"
    task: str
    priority: str = "Medium"  # High, Medium, Low
    deadline: str = "Not Mentioned"
    status: str = "Pending"   # Pending, In Progress, Completed

class RiskItem(BaseModel):
    title: str
    severity: str = "Medium"
    description: Optional[str] = None

class MeetingBase(BaseModel):
    meeting_title: str
    participants: Optional[str] = ""
    department: Optional[str] = "Engineering"

class MeetingCreate(MeetingBase):
    audio_filename: str

class ProcessMeetingRequest(BaseModel):
    meeting_id: str

class MeetingResponse(MeetingBase):
    id: str
    audio_filename: str
    audio_duration: str
    language: Optional[str] = "en"
    transcript: Optional[List[Any]] = []
    summary: Optional[str] = ""
    action_items: Optional[List[Any]] = []
    decisions: Optional[List[Any]] = []
    risks: Optional[List[Any]] = []
    next_steps: Optional[List[Any]] = []
    keywords: Optional[List[str]] = []
    sentiment: Optional[str] = "Neutral"
    processing_time: Optional[str] = "0 sec"
    provider_used: Optional[str] = "Ollama (Local)"
    model_used: Optional[str] = "qwen2.5-coder:3b"
    statistics: Optional[Dict[str, Any]] = {}
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
