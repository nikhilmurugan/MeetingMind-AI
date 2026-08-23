import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON
from database import Base

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(String, primary_key=True, index=True)
    meeting_title = Column(String, nullable=False)
    participants = Column(String, nullable=True)  # Comma-separated or string
    department = Column(String, nullable=True)
    audio_filename = Column(String, nullable=False)
    audio_duration = Column(String, default="00:00")
    language = Column(String, default="en")
    
    # AI Output fields stored as JSON or Text
    transcript = Column(JSON, nullable=True)  # List of objects: [{start, end, speaker, text}]
    summary = Column(Text, nullable=True)
    action_items = Column(JSON, nullable=True)  # List of objects: [{owner, task, priority, deadline, status}]
    decisions = Column(JSON, nullable=True)  # List of strings or objects
    risks = Column(JSON, nullable=True)  # List of objects/strings: [{title, severity, description}]
    next_steps = Column(JSON, nullable=True)  # List of checklist items
    keywords = Column(JSON, nullable=True)  # List of strings
    sentiment = Column(String, default="Neutral")  # Positive | Neutral | Negative
    processing_time = Column(String, default="0 sec")
    provider_used = Column(String, default="Ollama (Local)")
    model_used = Column(String, default="qwen2.5-coder:3b")
    statistics = Column(JSON, nullable=True)  # Detailed metrics dict
    
    status = Column(String, default="completed")  # uploaded, processing, completed, error
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
